# app/tests/test_doctors_endpoints.py
import os
import types
import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from app.api import doctors


@pytest.fixture(scope="session", autouse=True)
def prisma_connection():
    os.environ.setdefault(
        "DATABASE_URL", "postgresql://root:secret@localhost:5432/phototours_db"
    )
    yield


class Obj:
    def __init__(self, **kw):
        for k, v in kw.items():
            setattr(self, k, v)


def make_app():
    app = FastAPI()
    app.include_router(doctors.router)
    return app


@pytest.fixture
def client(monkeypatch):
    fake_user_actions = types.SimpleNamespace(
        find_many=lambda **kwargs: None,
        update_many=lambda **kwargs: None,
    )
    fake_db = types.SimpleNamespace(user=fake_user_actions)
    monkeypatch.setattr(doctors, "db", fake_db, raising=True)
    return TestClient(make_app())


def test_is_some_online_empty(client, monkeypatch):
    async def _find_many(**kwargs):
        return []

    monkeypatch.setattr(doctors.db.user, "find_many", _find_many, raising=True)

    path = client.app.url_path_for("is_some_online")
    resp = client.get(path)
    assert resp.status_code == 200
    assert resp.json() == {"online": False, "doctors": []}


def test_is_some_online_with_doctors(client, monkeypatch):
    async def _find_many(**kwargs):
        return [
            Obj(
                id="d1",
                name="Alice",
                city="Dresden",
                language="Deutsch",
                role="DOCTOR",
                is_online=True,
            ),
            Obj(
                id="d2",
                name="Bob",
                city=None,
                language=None,
                role="DOCTOR",
                is_online=True,
            ),
        ]

    monkeypatch.setattr(doctors.db.user, "find_many", _find_many, raising=True)

    path = client.app.url_path_for("is_some_online")
    resp = client.get(path)
    assert resp.status_code == 200
    data = resp.json()
    assert data["online"] is True
    assert data["doctors"][0] == {
        "id": "d1",
        "name": "Alice",
        "city": "Dresden",
        "language": "Deutsch",
    }
    assert data["doctors"][1] == {
        "id": "d2",
        "name": "Bob",
        "city": None,
        "language": None,
    }


def test_sweep_stale_ok(client, monkeypatch):
    class Res:
        count = 2

    async def _update_many(**kwargs):
        where = kwargs.get("where", {})
        assert where.get("is_online") is True
        assert "last_seen_at" in where and "lt" in where["last_seen_at"]
        return Res()

    monkeypatch.setattr(doctors.db.user, "update_many", _update_many, raising=True)

    path = client.app.url_path_for("sweep_stale_doctors")
    resp = client.post(path)
    assert resp.status_code == 200
    assert resp.json() == {"ok": True, "reset": 2}
