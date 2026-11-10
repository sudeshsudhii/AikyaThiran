from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User
from ..schemas import ProfileUpdate, UserOut
from ..security import get_current_user

router = APIRouter(prefix="/api/users", tags=["users"])


def to_user_out(user: User) -> UserOut:
    out = UserOut.model_validate(user)
    out.profile_complete = bool(user.college and user.course and user.year_of_study)
    return out


@router.patch("/me", response_model=UserOut)
def update_profile(
    body: ProfileUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> UserOut:
    data = body.model_dump(exclude_unset=True)
    if "interests" in data and data["interests"] is not None:
        # trim, drop empties and duplicates, keep order
        seen: list[str] = []
        for item in data["interests"]:
            item = item.strip()[:40]
            if item and item.lower() not in [s.lower() for s in seen]:
                seen.append(item)
        data["interests"] = seen
    for key, value in data.items():
        if isinstance(value, str):
            value = value.strip() or None
        setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return to_user_out(user)
