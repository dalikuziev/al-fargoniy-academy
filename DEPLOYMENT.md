# Al-Farg'oniy Academy — Server va Domenga O'rnatish Qo'llanmasi (Production Deployment)

Ushbu qo'llanma orqali loyihani haqiqiy serverga (VPS/VDS) o'rnatish, domen ulash, **PostgreSQL 16** ma'lumotlar bazasi va bepul **SSL (HTTPS)** sertifikatini yoqishni bosqichma-bosqich amalga oshirasiz.

---

## 1-BOSQICH: Server va Domen Sotib Olish

### 1. Domen tanlash:
- O'zbekiston uchun `.uz` domeni tavsiya etiladi (masalan: `alfarganiy.uz`, `academy-crm.uz`).
- Sotib olish joylari: [cpanel.uz](https://cpanel.uz), [eskiz.uz](https://eskiz.uz), [webname.uz](https://webname.uz).

### 2. Server (VPS) tanlash:
- **Tavsiya etiladigan operatsion tizim**: `Ubuntu 22.04 LTS` yoki `Ubuntu 24.04 LTS`.
- **Minimal parametrlar**:
  - CPU: 1-2 vCPU
  - RAM: 2 GB
  - Disk: 20-30 GB NVMe/SSD
- **Xalqaro provayderlar**: Hetzner (oyiga ~4€), DigitalOcean ($6/oy), Timeweb.
- **O'zbekiston ichidagi provayderlar**: Eskiz, Uztelecom Cloud (Tas-IX ichida juda tez ishlaydi).

---

## 2-BOSQICH: Domenni Serverga Bog'lash (DNS Sozlash)

Domen sotib olgan provayderingizning DNS boshqaruv paneliga kiring va quyidagi `A-record` larni qo'shing:

| Turi (Type) | Nomi (Name/Host) | Qiymati (Points to / IP) |
| :--- | :--- | :--- |
| `A` | `@` | `SERVERINGIZ_IP_MANZILI` (masalan: 185.196.xxx.xxx) |
| `A` | `www` | `SERVERINGIZ_IP_MANZILI` |

*(DNS tarqalishi 10 daqiqadan 2 soatgacha vaqt olishi mumkin).*

---

## 3-BOSQICH: Serverga Ulanish va Dastlabki Sozlash

Kompyuteringiz terminali (PowerShell yoki Git Bash) orqali serveringizga kiring:
```bash
ssh root@SERVERINGIZ_IP_MANZILI
```

### Kerakli paketlarni o'rnatish:
```bash
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y docker.io docker-compose-v2 nginx certbot python3-certbot-nginx git
sudo systemctl enable docker
sudo systemctl start docker
```

---

## 4-BOSQICH: Loyihani Serverga Ko'chirish

Serveringizda loyihani yuklab oling yoki fayllarni ko'chiring:
```bash
cd /var/www
git clone <sizning-repo-link> al_farganiy_academy
cd al_farganiy_academy
```

### Muhit parametrlarini sozlash (`.env`):
```bash
cp .env.example .env
nano .env
```
Parollarni o'zgartiring:
```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=kuchli_va_maxfiy_parol_123!
POSTGRES_DB=al_farganiy_db
DATABASE_URL=postgresql://postgres:kuchli_va_maxfiy_parol_123!@db:5432/al_farganiy_db
```
*(Saqlash uchun: `Ctrl + O`, `Enter`, chiqish uchun: `Ctrl + X`)*.

---

## 5-BOSQICH: Docker Compose orqali PostgreSQL va FastAPI'ni Ishga Tushirish

Bitta buyruq orqali PostgreSQL 16 va FastAPI serveri to'liq ishga tushadi:
```bash
docker compose up -d --build
```

Konteynerlar holatini tekshirish:
```bash
docker compose ps
```
Natijada `al_farganiy_postgres` va `al_farganiy_api` ishlab turgan bo'lishi kerak.

---

## 6-BOSQICH: Nginx va Bepul SSL (HTTPS) O'rnatish

### 1. Nginx konfiguratsiyasini nusxalash:
```bash
sudo cp nginx/nginx.conf /etc/nginx/sites-available/al_farganiy.conf
sudo nano /etc/nginx/sites-available/al_farganiy.conf
```
`sizning-domeningiz.uz` o'rniga o'zingizning haqiqiy domeningizni yozing.

### 2. Saytni faollashtirish va Nginx'ni qayta yuklash:
```bash
sudo ln -s /etc/nginx/sites-available/al_farganiy.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 3. Bepul SSL (Let's Encrypt HTTPS) sertifikatini olish:
```bash
sudo certbot --nginx -d sizning-domeningiz.uz -d www.sizning-domeningiz.uz
```
Elektron pochtangizni kiritasiz va litsenziyani tasdiqlaysiz. Certbot avtomatik tarzda Nginx'ni xavfsiz HTTPS ga o'tkazadi!

---

## 7-BOSQICH: Tayyor! API dan Foydalanish

Brauzeringizda domeningizni oching:
- **Asosiy API**: `https://sizning-domeningiz.uz`
- **Interaktiv Swagger Hujjatlari**: `https://sizning-domeningiz.uz/docs`

---

## 💾 Qo'shimcha: PostgreSQL Ma'lumotlarini Zaxira (Backup) Qilish

Serverda har kecha avtomatik zaxira nusxa olish uchun buyruq:
```bash
docker exec -t al_farganiy_postgres pg_dump -U postgres al_farganiy_db > /backup/academy_$(date +\%Y\%m\%d).sql
```
