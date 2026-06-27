from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import logging
import uuid
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Any, Dict

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ConfigDict, EmailStr

# --------------------------------------------------------------------------- #
# Config & DB
# --------------------------------------------------------------------------- #
MONGO_URL = os.environ['MONGO_URL']
DB_NAME = os.environ['DB_NAME']
JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGORITHM = "HS256"
JWT_EXPIRES_HOURS = int(os.environ.get('JWT_EXPIRES_HOURS', '12'))
ADMIN_EMAIL = os.environ['ADMIN_EMAIL'].lower().strip()
ADMIN_PASSWORD = os.environ['ADMIN_PASSWORD']

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# --------------------------------------------------------------------------- #
# Helpers
# --------------------------------------------------------------------------- #
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "role": "admin",
        "type": "access",
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRES_HOURS),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_admin(
    creds: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
) -> Dict[str, Any]:
    if not creds or not creds.credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(creds.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access" or payload.get("role") != "admin":
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


# --------------------------------------------------------------------------- #
# Models
# --------------------------------------------------------------------------- #
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class LeadCreate(BaseModel):
    email: EmailStr
    idea: Optional[str] = ""
    source: Optional[str] = "homepage_cta"


class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    idea: str = ""
    source: str = "homepage_cta"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class LoginInput(BaseModel):
    email: EmailStr
    password: str


class AdminMe(BaseModel):
    id: str
    email: str
    role: str
    name: Optional[str] = "Admin"


class LoginResponse(BaseModel):
    token: str
    user: AdminMe


# Generic content document (single record). Free-form JSON is fine for the CMS.
class SiteContent(BaseModel):
    model_config = ConfigDict(extra="allow")
    id: str = "main"


class SiteContentUpdate(BaseModel):
    model_config = ConfigDict(extra="allow")


# --------------------------------------------------------------------------- #
# Default site content (initial seed + fallback for frontend)
# --------------------------------------------------------------------------- #
DEFAULT_CONTENT: Dict[str, Any] = {
    "id": "main",
    "settings": {
        "logo_url": "https://customer-assets.emergentagent.com/job_ai-plugin-builder-1/artifacts/mermnicj_Plugiins%20.png",
        "hero_background_url": "https://images.unsplash.com/photo-1489648022186-8f49310909a0",
        "feature_background_url": "https://images.unsplash.com/photo-1708457753320-02e52a276a80",
        "company_name": "Plugiins",
        "tagline": "A software solutions studio for every kind of business.",
    },
    "hero": {
        "eyebrow": "/ Software Solutions Studio · Est. 2018",
        "headline_a": "We turn your",
        "headline_b": "business idea",
        "headline_highlight": "into shipping software",
        "headline_c": ".",
        "subtext": "Plugiins is a software solutions studio. We partner with founders and enterprises to design, engineer and operate the custom platforms their business actually needs — web, mobile, cloud and integrations.",
        "primary_cta": "Start a project",
        "secondary_cta": "See our process",
        "stats": [
            {"value": "240+", "label": "Projects delivered"},
            {"value": "8 yrs", "label": "Solving real problems"},
            {"value": "98%", "label": "Client retention"},
        ],
    },
    "brand_logos": [
        "STELLAR LABS", "NORDIC GO", "RAVENWORKS", "ARCWAVE",
        "HYDRA / OS", "PIVOTAL", "MERIDIAN", "FORGE & SONS",
        "OBLIQ", "VANTAGE",
    ],
    "process": {
        "eyebrow": "/ The process",
        "title": "Four phases between a sketch on a napkin and a product in production.",
        "subtext": "A senior team — product, design, engineering and ops — owns every release end to end. No handoffs, no agencies-of-agencies, no surprises.",
        "steps": [
            {
                "n": "01", "icon": "chat",
                "title": "Discover & scope",
                "desc": "We meet your team, document the problem, define success metrics and lock the scope of phase one — before a single line is written.",
            },
            {
                "n": "02", "icon": "brain",
                "title": "Architect & design",
                "desc": "Our solution architects map data models, services and screens. You sign off on a clickable prototype and a costed delivery plan.",
            },
            {
                "n": "03", "icon": "code",
                "title": "Engineer & integrate",
                "desc": "Senior full-stack engineers build the platform in weekly sprints with a live preview environment. You see progress every Friday.",
            },
            {
                "n": "04", "icon": "rocket",
                "title": "Launch & support",
                "desc": "We deploy to production, hand over the source, train your team and stay on as your operations partner with SLA-backed support.",
            },
        ],
    },
    "services": {
        "eyebrow": "/ What we build",
        "title": "A full engineering function — without the overhead.",
        "subtext": "Plugiins ships with every primitive a serious product needs — architecture, security, observability and a senior delivery team.",
        "spotlight": {
            "title": "Custom Software Engineering",
            "desc": "From a single feature to a multi-tenant SaaS platform — our senior engineers design and build the systems your business actually needs. Production code, on your stack, owned by you.",
            "tags": ["React · Next.js", "FastAPI · Node.js", "MongoDB · Postgres", "AWS · GCP · Azure"],
        },
        "cards": [
            {"icon": "shield", "title": "Security & compliance", "desc": "SOC-2 ready scaffolds, secret rotation, encrypted at rest and in transit. Zero-trust by default."},
            {"icon": "stack", "title": "Composable stacks", "desc": "React, Next, FastAPI, Node, MongoDB, Postgres — we choose the foundation that fits the problem."},
            {"icon": "plug", "title": "Integrations", "desc": "Stripe, Twilio, Resend, Slack, OAuth, custom enterprise APIs — we wire it all together."},
            {"icon": "chart", "title": "Built to scale", "desc": "Auto-scaling infra, observability dashboards, and SLAs that match enterprise workloads."},
            {"icon": "git", "title": "Own your source", "desc": "Every line of code we write is yours. Full handover to GitHub, no proprietary runtime."},
            {"icon": "lock", "title": "Role-based access", "desc": "Granular permissions across workspaces, environments and deployments out of the box."},
            {"icon": "globe", "title": "Global delivery", "desc": "Edge CDN, regional databases and low-latency rendering — for every product we ship."},
        ],
    },
    "industries": {
        "eyebrow": "/ Built for every business",
        "title": "From a single founder to a Fortune 500 — we ship the product you'd hire a team of 30 to build.",
        "subtext": "Eight years of vertical patterns let us deliver opinionated starting points — then bend them to your exact playbook.",
        "items": [
            {"icon": "shop", "title": "Commerce", "examples": "Storefronts · loyalty · inventory · pricing engines"},
            {"icon": "heart", "title": "Health & Wellness", "examples": "Telehealth · patient portals · scheduling · EHR"},
            {"icon": "bank", "title": "Financial Services", "examples": "Onboarding · KYC · ledgers · trading dashboards"},
            {"icon": "edu", "title": "Education", "examples": "LMS · cohort tools · tutoring tools · certifications"},
            {"icon": "building", "title": "Real Estate", "examples": "Listings · CRMs · virtual tours · valuation"},
            {"icon": "truck", "title": "Logistics", "examples": "Fleet ops · tracking · routing · freight booking"},
            {"icon": "plane", "title": "Travel & Hospitality", "examples": "Booking flows · concierge · loyalty · revenue ops"},
            {"icon": "film", "title": "Media & Creators", "examples": "Storefronts · paywalls · communities · analytics"},
        ],
    },
    "testimonials": {
        "eyebrow": "/ Field reports",
        "title": "Teams that swapped backlogs for shipping velocity.",
        "stats": [
            {"value": "94%", "label": "Faster time-to-market"},
            {"value": "11×", "label": "Reduction in engineering hours"},
            {"value": "62%", "label": "Lower total cost of ownership"},
        ],
        "items": [
            {
                "quote": "Plugiins replaced a six-month roadmap with a four-day sprint. They asked sharper product questions than half my PMs.",
                "author": "Mira Okafor",
                "role": "Head of Product · Stellar Labs",
            },
            {
                "quote": "Our underwriting tool was live in eleven days. Compliance review was easier because the team generated the audit trail by default.",
                "author": "Daniel Marchetti",
                "role": "CTO · Forge & Sons",
            },
            {
                "quote": "I'm a non-technical founder. The team shipped a B2B logistics dashboard that our largest customer pays six figures for. Unimaginable a year ago.",
                "author": "Anya Petrov",
                "role": "Founder · Hydra OS",
            },
        ],
    },
    "faq": {
        "eyebrow": "/ FAQ",
        "title": "Questions, answered.",
        "subtext": "Still curious? Drop us a note — a solutions engineer (not a chatbot) will reply within one business day.",
        "items": [
            {"q": "How does a project with Plugiins start?",
             "a": "Every engagement starts with a free discovery call. We document your problem, propose a scope, and share a fixed-price plan within 5 business days. No commitment until you sign off."},
            {"q": "Do you build from scratch or extend existing systems?",
             "a": "Both. About 60% of our work is greenfield product builds; the rest is modernising or extending existing platforms — anything from a legacy ERP to a SaaS that has outgrown its original architecture."},
            {"q": "Will I own the code you write?",
             "a": "Always. Every line of code, schema, and deployment artifact is handed over to your GitHub at the end of each milestone. No proprietary runtime, no lock-in."},
            {"q": "Are you safe for regulated industries?",
             "a": "Yes. We have shipped products under SOC-2, HIPAA and PCI workloads, with granular RBAC, audit logs, regional data residency and private deployments where required."},
            {"q": "How is pricing handled?",
             "a": "We provide fixed-price quotes per milestone after the discovery phase — so you know exactly what each phase costs before we start. Ongoing support is billed monthly."},
            {"q": "Do you offer ongoing maintenance and support?",
             "a": "Yes. After launch we offer SLA-backed support plans covering observability, bug fixes, security patches, and continuous improvement — sized to your traffic and risk profile."},
        ],
    },
    "cta": {
        "eyebrow": "/ Let's build together",
        "headline_a": "What will your business",
        "headline_highlight": "ship next",
        "headline_b": "?",
        "subtext": "Tell us about your idea. We'll come back with a written proposal — at zero cost, no commitment.",
        "form_idea_label": "/ Describe your idea (optional)",
        "form_idea_placeholder": "A platform for indie retailers to manage cross-channel inventory…",
        "form_email_placeholder": "you@company.com",
        "form_submit": "Request a proposal",
        "form_success": "Thanks — a Plugiins lead will be in touch within one business day.",
        "form_disclaimer": "/ No credit card · No spam · Free consultation",
    },
    "footer": {
        "tagline": "A software solutions studio for every kind of business. We turn your idea into a shipping product.",
        "columns": [
            {"title": "Studio", "links": ["Services", "Process", "Industries", "Work", "Careers"]},
            {"title": "Solutions", "links": ["Startups", "Enterprise", "Agencies", "Education", "Government"]},
            {"title": "Company", "links": ["About", "Customers", "Press", "Contact", "Blog"]},
            {"title": "Resources", "links": ["Case studies", "Tech notes", "Templates", "Security", "Status"]},
        ],
    },
}


# --------------------------------------------------------------------------- #
# Routers
# --------------------------------------------------------------------------- #
app = FastAPI(title="Plugiins API")
api_router = APIRouter(prefix="/api")
auth_router = APIRouter(prefix="/api/auth", tags=["auth"])
admin_router = APIRouter(prefix="/api/admin", tags=["admin"])


# Public ------------------------------------------------------------------ #
@api_router.get("/")
async def root():
    return {"message": "Plugiins API is live"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    obj = StatusCheck(**input.model_dump())
    doc = obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    items = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for it in items:
        if isinstance(it['timestamp'], str):
            it['timestamp'] = datetime.fromisoformat(it['timestamp'])
    return items


@api_router.post("/leads", response_model=Lead)
async def create_lead(payload: LeadCreate):
    lead = Lead(
        email=str(payload.email).lower().strip(),
        idea=(payload.idea or "").strip()[:2000],
        source=(payload.source or "homepage_cta")[:64],
    )
    doc = lead.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.leads.insert_one(doc)
    return lead


@api_router.get("/content")
async def get_content():
    """Public endpoint — returns the full site content document."""
    doc = await db.site_content.find_one({"id": "main"}, {"_id": 0})
    if not doc:
        # Edge case: seed missed; return defaults so frontend doesn't break.
        return DEFAULT_CONTENT
    return doc


# Auth -------------------------------------------------------------------- #
@auth_router.post("/login", response_model=LoginResponse)
async def login(payload: LoginInput):
    email = str(payload.email).lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user["id"], user["email"])
    return LoginResponse(
        token=token,
        user=AdminMe(
            id=user["id"], email=user["email"],
            role=user.get("role", "admin"), name=user.get("name", "Admin"),
        ),
    )


@auth_router.get("/me", response_model=AdminMe)
async def get_me(current=Depends(get_current_admin)):
    return AdminMe(
        id=current["id"], email=current["email"],
        role=current.get("role", "admin"), name=current.get("name", "Admin"),
    )


# Admin (protected) ------------------------------------------------------- #
@admin_router.put("/content")
async def update_content(payload: Dict[str, Any], current=Depends(get_current_admin)):
    """Replace the entire site content document (except id)."""
    payload["id"] = "main"
    payload["updated_at"] = datetime.now(timezone.utc).isoformat()
    payload["updated_by"] = current.get("email")
    await db.site_content.update_one(
        {"id": "main"}, {"$set": payload}, upsert=True
    )
    doc = await db.site_content.find_one({"id": "main"}, {"_id": 0})
    return doc


@admin_router.get("/leads", response_model=List[Lead])
async def admin_list_leads(limit: int = 200, _=Depends(get_current_admin)):
    if limit < 1 or limit > 1000:
        raise HTTPException(status_code=400, detail="limit must be 1..1000")
    items = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    for it in items:
        if isinstance(it.get('created_at'), str):
            it['created_at'] = datetime.fromisoformat(it['created_at'])
    return items


@admin_router.delete("/leads/{lead_id}")
async def admin_delete_lead(lead_id: str, _=Depends(get_current_admin)):
    res = await db.leads.delete_one({"id": lead_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"ok": True}


# --------------------------------------------------------------------------- #
# Wire-up
# --------------------------------------------------------------------------- #
app.include_router(api_router)
app.include_router(auth_router)
app.include_router(admin_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------------------------------- #
# Startup: seed admin + default content
# --------------------------------------------------------------------------- #
@app.on_event("startup")
async def on_startup():
    # Indexes
    try:
        await db.users.create_index("email", unique=True)
        await db.leads.create_index("created_at")
        await db.site_content.create_index("id", unique=True)
    except Exception as e:
        logger.warning(f"Index creation note: {e}")

    # Seed admin (idempotent)
    existing = await db.users.find_one({"email": ADMIN_EMAIL})
    if not existing:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": ADMIN_EMAIL,
            "password_hash": hash_password(ADMIN_PASSWORD),
            "role": "admin",
            "name": "Plugiins Admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info(f"Seeded admin user {ADMIN_EMAIL}")
    elif not verify_password(ADMIN_PASSWORD, existing.get("password_hash", "")):
        await db.users.update_one(
            {"email": ADMIN_EMAIL},
            {"$set": {"password_hash": hash_password(ADMIN_PASSWORD)}}
        )
        logger.info(f"Updated admin password for {ADMIN_EMAIL}")

    # Seed default content (idempotent)
    content = await db.site_content.find_one({"id": "main"})
    if not content:
        seed = dict(DEFAULT_CONTENT)
        seed["updated_at"] = datetime.now(timezone.utc).isoformat()
        await db.site_content.insert_one(seed)
        logger.info("Seeded default site content")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
