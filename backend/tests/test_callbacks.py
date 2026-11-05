import os
import requests

API = os.environ["REACT_APP_BACKEND_URL"].rstrip("/") + "/api"


def test_callback_rejects_bad_phone():
    r = requests.post(f"{API}/callbacks", json={"first_name": "A", "last_name": "B", "phone": "abc"})
    assert r.status_code == 422


def test_callback_requires_names():
    r = requests.post(f"{API}/callbacks", json={"first_name": "", "last_name": "B", "phone": "0612345678"})
    assert r.status_code == 422


def test_callbacks_list_requires_admin():
    assert requests.get(f"{API}/callbacks").status_code == 401


def test_honeypot_is_silently_ignored():
    r = requests.post(f"{API}/callbacks", json={"first_name": "A", "last_name": "B", "phone": "0612345678", "website": "x"})
    assert r.status_code == 201 and r.json()["id"] is None
