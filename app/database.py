import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from .config import DATABASE_URL

logger = logging.getLogger("uvicorn")

Base = declarative_base()

# Ulanish parametrlarini belgilash
if DATABASE_URL.startswith("postgresql"):
    engine_args = {
        "pool_size": 10,
        "max_overflow": 20,
        "pool_pre_ping": True,
    }
else:
    engine_args = {
        "connect_args": {"check_same_thread": False}
    }

try:
    engine = create_engine(DATABASE_URL, **engine_args)
    # Sinov ulanishi
    with engine.connect() as conn:
        pass
    print(f"Ma'lumotlar bazasiga muvaffaqiyatli ulandi: {DATABASE_URL.split('@')[-1] if '@' in DATABASE_URL else DATABASE_URL}")
except Exception as e:
    # Agar PostgreSQL server lokalda ishlamayotgan bo'lsa (serverga deploy qilinganda Docker bilan ishlaydi)
    if DATABASE_URL.startswith("postgresql"):
        print(f"\n[OGOHLANTIRISH] PostgreSQL ga ulanib bo'lmadi ({e}).")
        print("Lokal sinov uchun avtomatik SQLite rejimiga o'tildi.")
        print("Haqiqiy serverga Docker Compose bilan deploy qilganda 100% PostgreSQL ishlatiladi!\n")
        FALLBACK_URL = "sqlite:///./data/academy.db"
        engine = create_engine(FALLBACK_URL, connect_args={"check_same_thread": False})
    else:
        raise e

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
