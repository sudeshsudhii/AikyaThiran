from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class GoogleLoginIn(BaseModel):
    credential: str = Field(min_length=10, description="Google ID token from Google Identity Services")


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    name: str
    picture: str | None
    college: str | None
    course: str | None
    year_of_study: int | None
    interests: list[str]
    created_at: datetime
    profile_complete: bool = False


class ProfileUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)
    college: str | None = Field(default=None, max_length=200)
    course: str | None = Field(default=None, max_length=120)
    year_of_study: int | None = Field(default=None, ge=1, le=10)
    interests: list[str] | None = Field(default=None, max_length=20)


class ConfigOut(BaseModel):
    google_client_id: str
