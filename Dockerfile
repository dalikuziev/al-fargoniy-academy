# Python 3.12 asosidagi yengil konteyner
FROM python:3.12-slim

# Muhit o'zgaruvchilari
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Astral uv binarisini rasmiy konteynerdan ko'chirib olish (ultra tezkor paket o'rnatish uchun)
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# PostgreSQL drayveri va tizim utilitalari
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Bog'liqliklarni uv yordamida ultra tezkor o'rnatish
COPY requirements.txt pyproject.toml uv.lock* ./
RUN uv pip install --system -r requirements.txt

# Loyiha fayllarini ko'chirish
COPY . .

# Server porti
EXPOSE 8000

# Ishga tushirish buyrug'i
CMD ["python", "run.py"]
