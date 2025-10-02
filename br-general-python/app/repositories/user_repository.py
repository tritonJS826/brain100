class UserRepository:
    async def get_by_email(self, db, email: str):
        return await db.user.find_unique(where={"email": email})

    async def create_user(self, db, email: str, hashed_password: str):
        return await db.user.create(
            data={
                "email": email,
                "hashed_password": hashed_password,
            }
        )
