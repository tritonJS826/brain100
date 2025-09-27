import asyncio
from prisma import Prisma


async def main():
    db = Prisma()
    await db.connect()

    # Демо-юзер
    user = await db.user.upsert(
        where={"email": "demo@example.com"},
        data={
            "create": {"email": "demo@example.com", "name": "Демо Пользователь"},
            "update": {},
        },
    )

    # Демо-тест (RADIO, CHECKBOX, TEXT)
    test = await db.test.create(
        data={
            "title": "Самочувствие: тревога и панические атаки",
            "description": "Небольшой опрос о признаках тревоги и опыте панических атак",
            "questions": {
                "create": [
                    {
                        "text": "Бывают ли у вас панические атаки?",
                        "type": "RADIO",
                        "options": {
                            "create": [
                                {"text": "Да"},
                                {"text": "Нет"},
                            ]
                        },
                    },
                    {
                        "text": "Какие симптомы вы чаще всего отмечаете? (можно выбрать несколько)",
                        "type": "CHECKBOX",
                        "options": {
                            "create": [
                                {"text": "Учащённое сердцебиение"},
                                {"text": "Одышка / ком в горле"},
                                {"text": "Головокружение"},
                                {"text": "Онемение / дрожь"},
                                {"text": "Ощущение потери контроля"},
                            ]
                        },
                    },
                    {
                        "text": "Что обычно помогает вам справиться в такие моменты?",
                        "type": "TEXT",
                    },
                ]
            },
        }
    )

    # Сессия прохождения (без ответов, для проверки связей)
    session = await db.testsession.create(data={"testId": test.id, "userId": user.id})

    print("Seed OK:", {"userId": user.id, "testId": test.id, "sessionId": session.id})
    await db.disconnect()


if __name__ == "__main__":
    asyncio.run(main())
