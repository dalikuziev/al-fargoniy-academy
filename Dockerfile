# Python 3.12/3.14 asosidagi yengil konteyner
FROM python:3.12-slim

# Muhit o'zgaruvchilari
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# PostgreSQL drayveri va tizim utilitalari
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Bog'liqliklarni o'rnatish
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Loyiha fayllarini ko'chirish
COPY . .

# Server porti
EXPOSE 8000

# Ishga tushirish buyrug'i
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
