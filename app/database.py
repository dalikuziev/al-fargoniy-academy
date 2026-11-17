import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from .config import DATABASE_URL
from .logger import logger

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
    db_target = DATABASE_URL.split('@')[-1] if '@' in DATABASE_URL else DATABASE_URL
    logger.info(f"Ma'lumotlar bazasiga muvaffaqiyatli ulandi: {db_target}")
except Exception as e:
    # Agar PostgreSQL server lokalda ishlamayotgan bo'lsa (serverga deploy qilinganda Docker bilan ishlaydi)
    if DATABASE_URL.startswith("postgresql"):
        logger.warning(f"PostgreSQL ga ulanib bo'lmadi ({e}). Lokal sinov uchun SQLite rejimiga o'tildi.")
        FALLBACK_URL = "sqlite:///./data/academy.db"
        engine = create_engine(FALLBACK_URL, connect_args={"check_same_thread": False})
    else:
        logger.error(f"Ma'lumotlar bazasiga ulanishda xatolik: {e}")
        raise e

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
