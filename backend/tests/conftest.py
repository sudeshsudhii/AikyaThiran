import os
import sys
from pathlib import Path

import pytest

# Test settings must be set before the app is imported.
os.environ["DATABASE_URL"] = "sqlite:///./test.db"
os.environ["GOOGLE_CLIENT_ID"] = "test-client-id"
os.environ["JWT_SECRET"] = "test-secret"
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from fastapi.testclient import TestClient  # noqa: E402

from app.database import Base, engine  # noqa: E402
from app.google_auth import GoogleAuthError, GoogleIdentity  # noqa: E402
from app.main import app  # noqa: E402
from app.routers import auth as auth_router  # noqa: E402


@pytest.fixture()
def client(monkeypatch):
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    def fake_verify(credential: str) -> GoogleIdentity:
        if credential == "bad-token-value":
            raise GoogleAuthError("Token expired")
        n = credential.split("-")[-1]
        return GoogleIdentity(sub=f"sub-{n}", email=f"student{n}@example.com", name=f"Student {n}", picture=None)

    monkeypatch.setattr(auth_router, "verify_google_credential", fake_verify)
    with TestClient(app) as c:
        yield c
    Base.metadata.drop_all(bind=engine)
