"""Plugiins backend API tests.

Covers:
- Health route (GET /api/)
- Lead capture (POST /api/leads) success + validation
- Lead list (GET /api/leads) ordering and limit
"""
import os
import uuid
import pytest
import requests
from datetime import datetime

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL")
if not BASE_URL:
    # fallback to frontend .env so the tests are runnable from CI shell
    from pathlib import Path
    env_path = Path("/app/frontend/.env")
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip()
                break
assert BASE_URL, "REACT_APP_BACKEND_URL must be set"
BASE_URL = BASE_URL.rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="session")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Health ----------
class TestHealth:
    def test_root_health(self, client):
        r = client.get(f"{API}/", timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data == {"message": "Plugiins API is live"}


# ---------- Lead capture ----------
class TestLeads:
    def test_create_lead_success_and_persist(self, client):
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
        assert isinstance(body["id"], str) and len(body["id"]) > 0
        assert "created_at" in body
        # ISO datetime parseable
        datetime.fromisoformat(body["created_at"].replace("Z", "+00:00"))

        # GET /api/leads should include this email
        r2 = client.get(f"{API}/leads?limit=200", timeout=15)
        assert r2.status_code == 200
        emails = [item["email"] for item in r2.json()]
        assert payload["email"].lower() in emails

    def test_create_lead_invalid_email_returns_422(self, client):
        r = client.post(
            f"{API}/leads",
            json={"email": "not-an-email", "idea": "x", "source": "pytest"},
            timeout=15,
        )
        assert r.status_code == 422, r.text

    def test_create_lead_missing_email_returns_422(self, client):
        r = client.post(f"{API}/leads", json={"idea": "x"}, timeout=15)
        assert r.status_code == 422

    def test_create_lead_defaults(self, client):
        # Only email supplied
        email = f"TEST_{uuid.uuid4().hex[:8]}@example.com"
        r = client.post(f"{API}/leads", json={"email": email}, timeout=15)
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["email"] == email.lower()
        assert body["source"] == "homepage_cta"
        assert body["idea"] == ""


# ---------- Listing ----------
class TestLeadsListing:
    def test_list_limits_and_ordering(self, client):
        # Insert 3 fresh leads with small wait to ensure ordering by created_at
        created_emails = []
        for i in range(3):
            email = f"TEST_order_{uuid.uuid4().hex[:6]}@example.com"
            r = client.post(
                f"{API}/leads",
                json={"email": email, "idea": f"order test {i}", "source": "order_test"},
                timeout=15,
            )
            assert r.status_code == 200
            created_emails.append(email.lower())

        # Limit honoured
        r = client.get(f"{API}/leads?limit=2", timeout=15)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        assert len(items) <= 2

        # Default limit returns the latest. The most recently created should be present.
        r_all = client.get(f"{API}/leads?limit=50", timeout=15)
        assert r_all.status_code == 200
        all_items = r_all.json()
        # created_at descending check
        ts = [it["created_at"] for it in all_items]
        assert ts == sorted(ts, reverse=True), "leads must be sorted by created_at desc"
        # last inserted email should be present in fetched list
        assert created_emails[-1] in [it["email"] for it in all_items]

    def test_list_limit_out_of_range_returns_400(self, client):
        r = client.get(f"{API}/leads?limit=0", timeout=15)
        assert r.status_code == 400
        r2 = client.get(f"{API}/leads?limit=10000", timeout=15)
        assert r2.status_code == 400
