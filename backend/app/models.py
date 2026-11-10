from datetime import datetime, timezone

from sqlalchemy import JSON, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from .database import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    google_sub: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(200), default="")
    picture: Mapped[str | None] = mapped_column(String(500), nullable=True)

    # Student profile (filled in by the student after first sign-in)
    college: Mapped[str | None] = mapped_column(String(200), nullable=True)
    course: Mapped[str | None] = mapped_column(String(120), nullable=True)
    year_of_study: Mapped[int | None] = mapped_column(Integer, nullable=True)
    interests: Mapped[list[str]] = mapped_column(JSON, default=list)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    last_login_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
