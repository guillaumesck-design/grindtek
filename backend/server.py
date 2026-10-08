from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import logging
from datetime import datetime, timezone, timedelta
from typing import Annotated, List, Literal, Optional

import bcrypt
import jwt
from bson import ObjectId
from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, BeforeValidator, ConfigDict, EmailStr, Field
from starlette.middleware.cors import CORSMiddleware

client = AsyncIOMotorClient(os.environ['MONGO_URL'])
db = client[os.environ['DB_NAME']]

app = FastAPI()
api = APIRouter(prefix="/api")
logger = logging.getLogger("ow")
logging.basicConfig(level=logging.INFO)

JWT_ALGORITHM = "HS256"
PyObjectId = Annotated[str, BeforeValidator(lambda v: str(v) if isinstance(v, ObjectId) else v)]
Status = Literal["nouveau", "en_etude", "devis_envoye", "gagne", "perdu"]


class BaseDocument(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    id: Optional[PyObjectId] = Field(default=None, alias="_id")

    @classmethod
    def from_mongo(cls, doc):
        return cls.model_validate(doc)

    def to_mongo(self):
        data = self.model_dump(by_alias=True, exclude={"id"})
        return data


class QuoteIn(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    company: str = Field(min_length=1, max_length=160)
    phone: str = Field(min_length=6, max_length=40)
    email: EmailStr
    material: Literal["fonte", "acier", "aluminium", "autre"]
    machine: Optional[str] = Field(default=None, max_length=40)
    message: Optional[str] = Field(default=None, max_length=2000)
    consent: bool


class Quote(BaseDocument):
    name: str
    company: str
    phone: str
    email: str
    material: str
    machine: Optional[str] = None
    message: Optional[str] = None
    status: Status = "nouveau"
    created_at: str


class StatusUpdate(BaseModel):
    status: Status


class LoginIn(BaseModel):
    email: EmailStr
    password: str


def hash_password(p: str) -> str:
    return bcrypt.hashpw(p.encode(), bcrypt.gensalt()).decode()


def verify_password(p: str, h: str) -> bool:
    return bcrypt.checkpw(p.encode(), h.encode())


def make_token(uid: str, email: str, kind: str, delta: timedelta) -> str:
    payload = {"sub": uid, "email": email, "type": kind, "exp": datetime.now(timezone.utc) + delta}
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


def set_auth_cookies(resp: Response, uid: str, email: str):
    resp.set_cookie("access_token", make_token(uid, email, "access", timedelta(hours=8)),
                    httponly=True, secure=True, samesite="none", max_age=28800, path="/")
    resp.set_cookie("refresh_token", make_token(uid, email, "refresh", timedelta(days=7)),
                    httponly=True, secure=True, samesite="none", max_age=604800, path="/")


async def current_admin(request: Request) -> dict:
    token = request.cookies.get("access_token")
    auth = request.headers.get("Authorization", "")
    if not token and auth.startswith("Bearer "):
        token = auth[7:]
    if not token:
        raise HTTPException(401, "Non authentifié")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Session expirée")
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Jeton invalide")
    if payload.get("type") != "access":
        raise HTTPException(401, "Jeton invalide")
    user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
    if not user or user.get("role") != "admin":
        raise HTTPException(403, "Accès refusé")
    return {"id": str(user["_id"]), "email": user["email"], "name": user.get("name"), "role": user["role"]}


@api.get("/")
async def root():
    return {"message": "OW Auto Grinding API"}


@api.post("/quotes", status_code=201)
async def create_quote(body: QuoteIn):
    if not body.consent:
        raise HTTPException(400, "Le consentement est requis")
    q = Quote(**body.model_dump(exclude={"consent"}), created_at=datetime.now(timezone.utc).isoformat())
    res = await db.quotes.insert_one(q.to_mongo())
    return {"id": str(res.inserted_id), "ok": True}


@api.get("/quotes", response_model=List[Quote])
async def list_quotes(_=Depends(current_admin)):
    docs = await db.quotes.find().sort("created_at", -1).to_list(2000)
    return [Quote.from_mongo(d) for d in docs]


@api.patch("/quotes/{qid}", response_model=Quote)
async def update_quote(qid: str, body: StatusUpdate, _=Depends(current_admin)):
    if not ObjectId.is_valid(qid):
        raise HTTPException(404, "Introuvable")
    doc = await db.quotes.find_one_and_update({"_id": ObjectId(qid)}, {"$set": {"status": body.status}}, return_document=True)
    if not doc:
        raise HTTPException(404, "Introuvable")
    return Quote.from_mongo(doc)


@api.delete("/quotes/{qid}")
async def delete_quote(qid: str, _=Depends(current_admin)):
    if not ObjectId.is_valid(qid):
        raise HTTPException(404, "Introuvable")
    res = await db.quotes.delete_one({"_id": ObjectId(qid)})
    if not res.deleted_count:
        raise HTTPException(404, "Introuvable")
    return {"ok": True}


@api.post("/auth/login")
async def login(body: LoginIn, request: Request, response: Response):
    email = body.email.lower()
    ident = f"{request.client.host if request.client else 'x'}:{email}"
    att = await db.login_attempts.find_one({"identifier": ident})
    now = datetime.now(timezone.utc)
    if att and att.get("count", 0) >= 5 and att.get("locked_until") and datetime.fromisoformat(att["locked_until"]) > now:
        raise HTTPException(429, "Trop de tentatives. Réessayez dans 15 minutes.")
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        count = (att.get("count", 0) if att else 0) + 1
        upd = {"count": count}
        if count >= 5:
            upd["locked_until"] = (now + timedelta(minutes=15)).isoformat()
        await db.login_attempts.update_one({"identifier": ident}, {"$set": upd}, upsert=True)
        raise HTTPException(401, "Identifiants incorrects")
    await db.login_attempts.delete_many({"identifier": ident})
    uid = str(user["_id"])
    set_auth_cookies(response, uid, email)
    return {"id": uid, "email": email, "name": user.get("name"), "role": user.get("role")}


@api.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/", secure=True, samesite="none")
    response.delete_cookie("refresh_token", path="/", secure=True, samesite="none")
    return {"ok": True}


@api.get("/auth/me")
async def me(user=Depends(current_admin)):
    return user


@api.post("/auth/refresh")
async def refresh(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(401, "Non authentifié")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Jeton invalide")
    if payload.get("type") != "refresh":
        raise HTTPException(401, "Jeton invalide")
    user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
    if not user:
        raise HTTPException(401, "Utilisateur introuvable")
    set_auth_cookies(response, str(user["_id"]), user["email"])
    return {"ok": True}


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    email = os.environ["ADMIN_EMAIL"].lower()
    pwd = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": email})
    if existing is None:
        await db.users.insert_one({"email": email, "password_hash": hash_password(pwd), "name": "Admin OW",
                                   "role": "admin", "created_at": datetime.now(timezone.utc).isoformat()})
    elif not verify_password(pwd, existing["password_hash"]):
        await db.users.update_one({"email": email}, {"$set": {"password_hash": hash_password(pwd)}})


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ['CORS_ORIGINS'].split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
