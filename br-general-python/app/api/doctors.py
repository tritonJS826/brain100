from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException
from app.db import db  # Prisma client
from app.schemas.user import IsSomeDoctorOnlineOut, OnlineDoctor

router = APIRouter()


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
        order={"name": "asc"},
    )
    return IsSomeDoctorOnlineOut(
        online=bool(doctors),
        doctors=[
            OnlineDoctor(
                id=d.id,
                name=d.name,
                city=d.city,
                language=d.language,
            )
            for d in doctors
        ],
    )


@router.post("/sweep-stale")
async def sweep_stale_doctors():
    """Mark doctors offline if last_seen_at is older than 4 hours. Minimal endpoint, no auth, no extra output."""
    cutoff = datetime.now(timezone.utc) - timedelta(hours=4)
    res = await db.user.update_many(
        where={
            "role": "DOCTOR",
            "is_online": True,
            "last_seen_at": {"lt": cutoff},
        },
        data={"is_online": False},
    )
    return {"ok": True, "reset": getattr(res, "count", 0)}
