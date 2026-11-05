"""Backend tests for /api/callbacks (public create + admin list/delete).

Rate limit: 5 callbacks per IP per hour. We create at most 1 valid callback
and clean it up (plus any stale TEST_ callbacks) to stay under the limit.
Invalid-body tests (422) and honeypot submissions do NOT count against the rate limit.
"""
import os
import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
API = f"{BASE_URL}/api"
ADMIN_EMAIL = "admin@grindtek-automation.com"
ADMIN_PASSWORD = "OWgrind!2026"


@pytest.fixture(scope="module")
def admin_session():
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    return s


@pytest.fixture(scope="module", autouse=True)
def cleanup_test_callbacks(admin_session):
    """Before + after: delete any TEST_ callbacks that may linger in DB."""
    def purge():
        r = admin_session.get(f"{API}/callbacks")
        if r.status_code != 200:
            return
        for cb in r.json():
            if cb.get("first_name", "").startswith("TEST_") or cb.get("last_name", "").startswith("TEST_"):
                admin_session.delete(f"{API}/callbacks/{cb['id']}")
    purge()
    yield
    purge()


# ---- Validation (no rate-limit cost) ----

def test_callback_rejects_bad_phone():
    r = requests.post(f"{API}/callbacks", json={"first_name": "A", "last_name": "B", "phone": "abc"})
    assert r.status_code == 422


def test_callback_rejects_letters_in_phone():
    r = requests.post(f"{API}/callbacks", json={"first_name": "A", "last_name": "B", "phone": "061234ABCD"})
    assert r.status_code == 422


def test_callback_requires_first_name():
    r = requests.post(f"{API}/callbacks", json={"first_name": "", "last_name": "B", "phone": "0612345678"})
    assert r.status_code == 422


def test_callback_requires_last_name():
    r = requests.post(f"{API}/callbacks", json={"first_name": "A", "last_name": "", "phone": "0612345678"})
    assert r.status_code == 422


def test_honeypot_is_silently_ignored():
    r = requests.post(f"{API}/callbacks", json={
        "first_name": "A", "last_name": "B", "phone": "0612345678", "website": "x"
    })
    assert r.status_code == 201
    body = r.json()
    assert body["id"] is None and body["ok"] is True


# ---- Auth ----

def test_callbacks_list_requires_admin():
    assert requests.get(f"{API}/callbacks").status_code == 401


def test_callbacks_delete_requires_admin():
    # use a valid-looking ObjectId
    r = requests.delete(f"{API}/callbacks/507f1f77bcf86cd799439011")
    assert r.status_code == 401


# ---- Full admin flow (uses 1 rate-limit slot) ----

def test_create_list_and_delete_callback(admin_session):
    payload = {"first_name": "TEST_Marie", "last_name": "TEST_Curie", "phone": "+33 6 12 34 56 78", "lang": "fr"}
    cr = requests.post(f"{API}/callbacks", json=payload)
    assert cr.status_code == 201, cr.text
    cid = cr.json()["id"]
    assert cid

    # Admin list contains new callback with correct fields
    lr = admin_session.get(f"{API}/callbacks")
    assert lr.status_code == 200
    found = next((c for c in lr.json() if c["id"] == cid), None)
    assert found is not None
    assert found["first_name"] == "TEST_Marie"
    assert found["last_name"] == "TEST_Curie"
    assert found["phone"] == "+33 6 12 34 56 78"
    assert found["lang"] == "fr"
    assert "created_at" in found
    assert "_id" not in found  # ObjectId must be serialized as id

    # Delete + confirm removal
    dr = admin_session.delete(f"{API}/callbacks/{cid}")
    assert dr.status_code == 200

    lr2 = admin_session.get(f"{API}/callbacks")
    assert all(c["id"] != cid for c in lr2.json())


def test_delete_invalid_id_returns_404(admin_session):
    r = admin_session.delete(f"{API}/callbacks/not-an-objectid")
    assert r.status_code == 404
