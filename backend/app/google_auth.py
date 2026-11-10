"""Verify Google ID tokens sent by the frontend (Sign in with Google)."""
from dataclasses import dataclass

from google.auth.transport import requests as google_requests
from google.oauth2 import id_token

from .config import get_settings

_request = google_requests.Request()


@dataclass
class GoogleIdentity:
    sub: str
    email: str
    name: str
    picture: str | None


class GoogleAuthError(Exception):
    pass


def verify_google_credential(credential: str) -> GoogleIdentity:
    settings = get_settings()
    if not settings.google_client_id:
        raise GoogleAuthError("GOOGLE_CLIENT_ID is not set on the server")
    try:
        info = id_token.verify_oauth2_token(credential, _request, settings.google_client_id)
    except ValueError as exc:  # bad signature, expired, wrong audience
        raise GoogleAuthError(str(exc)) from exc

    if info.get("iss") not in ("accounts.google.com", "https://accounts.google.com"):
        raise GoogleAuthError("Wrong token issuer")
    if not info.get("email_verified"):
        raise GoogleAuthError("Google email is not verified")

    return GoogleIdentity(
        sub=info["sub"],
        email=info["email"].lower(),
        name=info.get("name") or info["email"].split("@")[0],
        picture=info.get("picture"),
    )
