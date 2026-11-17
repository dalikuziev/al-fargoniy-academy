#!/bin/bash
# ==========================================================
# Al-Farg'oniy Academy - Avtomatik VPS O'rnatish Skripti
# Ubuntu 22.04 / 24.04 LTS uchun
# Server IP: 176.101.56.153 | Domen: al-farganiy.uz
# ==========================================================

set -e

echo "=========================================================="
echo " 🚀 Al-Farg'oniy Academy tizimini serverga o'rnatish boshlandi..."
echo "=========================================================="

# 1. Tizim paketlarini yangilash va kerakli dasturlarni o'rnatish
echo "📦 1/6: Kerakli paketlar o'rnatilmoqda..."
apt update -y
apt install -y python3 python3-pip python3-venv git nginx certbot python3-certbot-nginx curl ufw

# 1.1 uv paket boshqaruvchisini o'rnatish (Astral uv - 10-100x tezroq)
if ! command -v uv &> /dev/null; then
    echo "⚡ uv o'rnatilmoqda..."
    curl -LsSf https://astral.sh/uv/install.sh | sh
    ln -sf /root/.local/bin/uv /usr/local/bin/uv || true
fi

# 2. Loyihani GitHub'dan yuklash
echo "📥 2/6: Loyiha GitHub'dan ko'chirib olinmoqda..."
mkdir -p /var/www
cd /var/www
if [ -d "al-farganiy" ]; then
    echo "Mavjud papka yangilanmoqda..."
    cd al-farganiy
    git pull origin main
else
    git clone https://github.com/dalikuziev/al-fargoniy-academy.git al-farganiy
    cd al-farganiy
fi

# 3. uv yordamida Python muhiti va kutubxonalarni o'rnatish
echo "🐍 3/6: Python muhiti uv bilan sozlanmoqda..."
uv venv /var/www/al-farganiy/venv
/var/www/al-farganiy/venv/bin/python -m pip install --upgrade pip || true
uv pip install --python /var/www/al-farganiy/venv/bin/python -r requirements.txt

# 4. .env faylini sozlash
echo "⚙️  4/6: Konfiguratsiya fayli yaratilmoqda..."
cat << 'EOF' > .env
APP_HOST=127.0.0.1
APP_PORT=8000
DATABASE_URL=sqlite:///./data/academy.db
EOF

mkdir -p data logs

# 5. Systemd 24/7 xizmatini o'rnatish
echo "🔄 5/6: Systemd xizmati (24/7 avtomatik qayta yoqilish) sozlanmoqda..."
cat << 'EOF' > /etc/systemd/system/al-farganiy.service
[Unit]
Description=Al-Farg'oniy Academy CRM Backend & Frontend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/al-farganiy
ExecStart=/var/www/al-farganiy/venv/bin/python run.py
Restart=always
RestartSec=5
Environment=PYTHONUNBUFFERED=1

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable al-farganiy
systemctl restart al-farganiy

# 6. Nginx veb-serverini sozlash
echo "🌐 6/6: Nginx veb-serveri sozlanmoqda..."
cat << 'EOF' > /etc/nginx/sites-available/al-farganiy
server {
    listen 80;
    server_name al-farganiy.uz www.al-farganiy.uz 176.101.56.153;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

ln -sf /etc/nginx/sites-available/al-farganiy /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

# Firewall ruxsatlarini berish
ufw allow 22/tcp || true
ufw allow 80/tcp || true
ufw allow 443/tcp || true

echo "=========================================================="
echo " 🎉 TABRIKLAYMIZ! Tizim serverda muvaffaqiyatli ishga tushdi!"
echo " 🌐 Sayt manzili: http://176.101.56.153 yoki http://al-farganiy.uz"
echo "=========================================================="
echo "SSL (HTTPS yashil qulfcha) o'rnatish uchun DNS ulangandan keyin quyidagisini tering:"
echo "sudo certbot --nginx -d al-farganiy.uz -d www.al-farganiy.uz"
echo "=========================================================="
