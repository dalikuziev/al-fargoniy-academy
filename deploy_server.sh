#!/bin/bash
# ==========================================
# Al-Farg'oniy Academy Serverga O'rnatish Skripti
# Ubuntu 22.04 / 24.04 uchun
# ==========================================

echo "1. Tizim paketlarini yangilash..."
sudo apt-get update && sudo apt-get upgrade -y

echo "2. Docker va Docker Compose o'rnatish..."
sudo apt-get install -y docker.io docker-compose-v2 nginx certbot python3-certbot-nginx
sudo systemctl enable docker
sudo systemctl start docker

echo "3. Loyihani Docker orqali ishga tushirish..."
docker compose down
docker compose up -d --build

echo "4. Konteynerlar holati:"
docker compose ps

echo "=========================================="
echo " Muvaffaqiyatli ishga tushdi!"
echo " Swagger UI: http://server-ip-yoki-domen:8000/docs"
echo "=========================================="
