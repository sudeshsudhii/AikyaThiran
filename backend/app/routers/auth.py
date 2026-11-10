from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..config import get_settings
from ..database import get_db
from ..google_auth import GoogleAuthError, verify_google_credential
from ..models import User, utcnow
from ..schemas import ConfigOut, GoogleLoginIn, UserOut
from ..security import create_session_token, get_current_user
from .users import to_user_out

router = APIRouter(prefix="/api/auth", tags=["auth"])
settings = get_settings()


@router.get("/config", response_model=ConfigOut)
def auth_config() -> ConfigOut:
    """Public settings the frontend needs to show the Google button."""
    return ConfigOut(google_client_id=settings.google_client_id)


@router.post("/google", response_model=UserOut)
def login_with_google(body: GoogleLoginIn, response: Response, db: Session = Depends(get_db)) -> UserOut:
    try:
        identity = verify_google_credential(body.credential)
    except GoogleAuthError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Google sign-in failed: {exc}")

    user = db.scalar(select(User).where(User.google_sub == identity.sub))
    if user is None:
        # Same email signed in before with a different Google account id? Link it.
        user = db.scalar(select(User).where(User.email == identity.email))
    if user is None:
        user = User(google_sub=identity.sub, email=identity.email, name=identity.name, interests=[])
        db.add(user)

    user.google_sub = identity.sub
    user.email = identity.email
    user.picture = identity.picture
    if not user.name:
        user.name = identity.name
    user.last_login_at = utcnow()
    db.commit()
    db.refresh(user)

    response.set_cookie(
        key=settings.session_cookie,
        value=create_session_token(user.id),
        max_age=settings.session_days * 24 * 3600,
        httponly=True,
        secure=settings.cookie_secure,
        samesite="lax",
        path="/",
    )
    return to_user_out(user)


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)) -> UserOut:
    return to_user_out(user)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(response: Response) -> Response:
    response.delete_cookie(settings.session_cookie, path="/")
    response.status_code = status.HTTP_204_NO_CONTENT
    return response
