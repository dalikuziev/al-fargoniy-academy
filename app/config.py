import os
from dotenv import load_dotenv

# .env faylini yuklash
load_dotenv()

# PostgreSQL sozlamalari
POSTGRES_USER = os.getenv("POSTGRES_USER", "postgres")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "postgres")
POSTGRES_HOST = os.getenv("POSTGRES_HOST", "localhost")
POSTGRES_PORT = os.getenv("POSTGRES_PORT", "5432")
POSTGRES_DB = os.getenv("POSTGRES_DB", "al_farganiy_db")

DEFAULT_PG_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"

# Asosiy DATABASE_URL (agar berilgan bo'lsa uni oladi, bo'lmasa postgresql URL yasaydi)
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_PG_URL)

APP_HOST = os.getenv("APP_HOST", "0.0.0.0")
APP_PORT = int(os.getenv("APP_PORT", 8000))
