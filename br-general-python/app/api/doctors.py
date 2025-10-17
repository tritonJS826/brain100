from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from app.db import db  # Prisma client
from app.schemas.user import IsSomeDoctorOnlineOut, OnlineDoctor

router = APIRouter(prefix="/br-general/doctors", tags=["doctors"])


async def get_current_user():
    raise NotImplementedError


async def require_doctor(user=Depends(get_current_user)):
    if getattr(user, "role", None) != "DOCTOR":
        raise HTTPException(status_code=403, detail="Doctors only")
    return user


@router.post("/online")
async def doctor_go_online(user=Depends(require_doctor)):
    await db.user.update(
        where={"id": user.id},
        data={
            "is_online": True,
            "last_seen_at": datetime.now(timezone.utc),
        },
    )
    return {"ok": True}


@router.get("/is-some-online", response_model=IsSomeDoctorOnlineOut)
async def is_some_online() -> IsSomeDoctorOnlineOut:
    doctors = await db.user.find_many(
        where={"role": "DOCTOR", "is_online": True},
        select={"id": True, "name": True, "city": True, "language": True},
        order={"name": "asc"},
    )
    return IsSomeDoctorOnlineOut(
        online=len(doctors) > 0,
        doctors=[OnlineDoctor(**d) for d in doctors],
    )
