"""Plugiins backend API tests — iteration 2 (CMS + Auth).

Covers:
- Health route (GET /api/)
- Lead capture (POST /api/leads) success + validation
- Public content (GET /api/content)
- Auth (POST /api/auth/login, GET /api/auth/me)
- Admin protected routes (PUT /api/admin/content, GET/DELETE /api/admin/leads)
"""
import os
import uuid
import pytest
import requests
from datetime import datetime
from pathlib import Path

# Resolve backend URL from frontend/.env (single source of truth in this env)
BASE_URL = os.environ.get("REACT_APP_BACKEND_URL")
if not BASE_URL:
    env_path = Path("/app/frontend/.env")
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip()
                break
assert BASE_URL, "REACT_APP_BACKEND_URL must be set"
BASE_URL = BASE_URL.rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "webadmin@plugiins.com"
ADMIN_PASSWORD = "plugiins@2026"


# ----- fixtures -----------------------------------------------------------
@pytest.fixture(scope="session")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_token(client):
    r = client.post(
        f"{API}/auth/login",
        json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        timeout=15,
    )
    assert r.status_code == 200, f"admin login failed: {r.status_code} {r.text}"
    return r.json()["token"]


@pytest.fixture(scope="session")
def admin_client(client, admin_token):
    s = requests.Session()
    s.headers.update({
        "Content-Type": "application/json",
        "Authorization": f"Bearer {admin_token}",
    })
    return s


# ----- Health -------------------------------------------------------------
class TestHealth:
    def test_root_health(self, client):
        r = client.get(f"{API}/", timeout=15)
        assert r.status_code == 200, r.text
        assert r.json() == {"message": "Plugiins API is live"}


# ----- Public Content -----------------------------------------------------
class TestContent:
    def test_get_content_has_all_sections(self, client):
        r = client.get(f"{API}/content", timeout=15)
        assert r.status_code == 200, r.text
        doc = r.json()
        assert doc.get("id") == "main"
        for key in [
            "settings", "hero", "brand_logos", "process", "services",
            "industries", "testimonials", "faq", "cta", "footer",
        ]:
            assert key in doc, f"missing section: {key}"
        # Hero copy reflects agency framing
        hero = doc["hero"]
        assert "software" in (hero.get("headline_highlight", "") + hero.get("headline_a", "") +
                              hero.get("headline_b", "")).lower() or \
               "shipping software" in hero.get("headline_highlight", "").lower()
        # No 'Pay for outcomes' pricing copy anywhere in content
        import json
        as_text = json.dumps(doc).lower()
        assert "pay for outcomes" not in as_text
        assert "pricing-section" not in as_text


# ----- Leads (public create) ----------------------------------------------
class TestLeads:
    def test_create_lead_success(self, client):
        payload = {
            "email": f"TEST_{uuid.uuid4().hex[:8]}@example.com",
            "idea": "TEST lead idea - automated test",
            "source": "pytest_suite",
        }
        r = client.post(f"{API}/leads", json=payload, timeout=15)
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["email"] == payload["email"].lower()
        assert body["idea"] == payload["idea"]
        assert body["source"] == payload["source"]
        assert isinstance(body["id"], str) and body["id"]
        # ISO datetime parseable
        datetime.fromisoformat(body["created_at"].replace("Z", "+00:00"))

    def test_create_lead_invalid_email_returns_422(self, client):
        r = client.post(
            f"{API}/leads",
            json={"email": "not-an-email", "idea": "x"},
            timeout=15,
        )
        assert r.status_code == 422, r.text


# ----- Auth ---------------------------------------------------------------
class TestAuth:
    def test_login_success(self, client):
        r = client.post(
            f"{API}/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
            timeout=15,
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert "token" in data and isinstance(data["token"], str) and data["token"]
        assert data["user"]["email"] == ADMIN_EMAIL
        assert data["user"]["role"] == "admin"
        assert "id" in data["user"]

    def test_login_bad_password(self, client):
        r = client.post(
            f"{API}/auth/login",
            json={"email": ADMIN_EMAIL, "password": "wrong-password"},
            timeout=15,
        )
        assert r.status_code == 401
        body = r.json()
        # FastAPI uses {'detail': ...}
        assert "Invalid email or password" in (body.get("detail") or body.get("message") or "")

    def test_login_unknown_email(self, client):
        r = client.post(
            f"{API}/auth/login",
            json={"email": "nobody@example.com", "password": "whatever"},
            timeout=15,
        )
        assert r.status_code == 401

    def test_me_with_token(self, admin_client):
        r = admin_client.get(f"{API}/auth/me", timeout=15)
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["email"] == ADMIN_EMAIL
        assert body["role"] == "admin"

    def test_me_without_token_returns_401(self, client):
        r = client.get(f"{API}/auth/me", timeout=15)
        assert r.status_code == 401


# ----- Admin: content -----------------------------------------------------
class TestAdminContent:
    def test_put_content_without_token_returns_401(self, client):
        r = client.put(f"{API}/admin/content", json={"settings": {"company_name": "X"}}, timeout=15)
        assert r.status_code == 401

    def test_put_content_updates_and_persists(self, client, admin_client):
        # Backup current
        r = client.get(f"{API}/content", timeout=15)
        assert r.status_code == 200
        backup = r.json()
        backup.pop("_id", None)

        # Mutate company_name
        new_name = f"Plugiins X {uuid.uuid4().hex[:4]}"
        mutated = dict(backup)
        mutated["settings"] = dict(backup.get("settings", {}))
        mutated["settings"]["company_name"] = new_name

        try:
            r2 = admin_client.put(f"{API}/admin/content", json=mutated, timeout=15)
            assert r2.status_code == 200, r2.text

            # Read back via public endpoint
            r3 = client.get(f"{API}/content", timeout=15)
            assert r3.status_code == 200
            assert r3.json()["settings"]["company_name"] == new_name
        finally:
            # Restore original
            restore = dict(backup)
            restore.pop("updated_at", None)
            restore.pop("updated_by", None)
            rr = admin_client.put(f"{API}/admin/content", json=restore, timeout=15)
            assert rr.status_code == 200, rr.text


# ----- Admin: leads -------------------------------------------------------
class TestAdminLeads:
    def test_list_leads_without_token_returns_401(self, client):
        r = client.get(f"{API}/admin/leads", timeout=15)
        assert r.status_code == 401

    def test_list_leads_returns_list_recent_first(self, client, admin_client):
        # Create a fresh lead so we know it appears
        email = f"TEST_admin_{uuid.uuid4().hex[:6]}@example.com"
        r = client.post(f"{API}/leads", json={"email": email, "idea": "admin list test"}, timeout=15)
        assert r.status_code == 200
        created = r.json()

        r2 = admin_client.get(f"{API}/admin/leads", timeout=15)
        assert r2.status_code == 200, r2.text
        items = r2.json()
        assert isinstance(items, list)
        emails = [it["email"] for it in items]
        assert email.lower() in emails
        # Ordering: created_at desc
        ts = [it["created_at"] for it in items]
        assert ts == sorted(ts, reverse=True)

        # Cleanup
        admin_client.delete(f"{API}/admin/leads/{created['id']}", timeout=15)

    def test_delete_lead_then_404_on_missing(self, client, admin_client):
        # Create
        email = f"TEST_del_{uuid.uuid4().hex[:6]}@example.com"
        r = client.post(f"{API}/leads", json={"email": email}, timeout=15)
        assert r.status_code == 200
        lead_id = r.json()["id"]

        # Delete (auth)
        r2 = admin_client.delete(f"{API}/admin/leads/{lead_id}", timeout=15)
        assert r2.status_code == 200, r2.text
        assert r2.json() == {"ok": True}

        # 404 on missing
        r3 = admin_client.delete(f"{API}/admin/leads/{lead_id}", timeout=15)
        assert r3.status_code == 404

    def test_delete_lead_without_token_returns_401(self, client):
        r = client.delete(f"{API}/admin/leads/anything", timeout=15)
        assert r.status_code == 401
