# Al-Farg'oniy Academy — O'quvchilar va To'lovlar Tizimi (React Frontend + FastAPI + PostgreSQL)

Ushbu loyiha o'quv markazi (**Al-Farg'oniy Academy**) uchun ishlab chiqilgan zamonaviy, toza arxitekturaga ega Fullstack tizim bo'lib, **React 18 + Tailwind CSS** frontend va **FastAPI + PostgreSQL** backenddan iborat.

Loyiha o'quvchilarni guruhlar va bo'limlar kesimida tartiblaydi, 1-klik orqali oylik to'lovlarni boshqarish, izoh qoldirish, ustoz/admin qabul qilganini belgilash hamda moliyaviy statistikani kuzatish imkonini beradi.

---

## 🎯 Asosiy Imkoniyatlar

1. **Alohida Bo'limlar (Hech qachon aralashmaydi)**:
   - **1-Bo'lim (`section_1`)**: 1-Excel faylning eng so'nggi Oktyabr oyi o'quvchilari (jami **38 nafar**, dars vaqtlari: `08:30`, `12:00`, `14:00`, `15:30`).
   - **2-Bo'lim (`section_2`)**: 2-Excel faylning eng so'nggi Oktyabr oyi o'quvchilari (jami **26 nafar**, dars vaqtlari: `09:00`, `13:00`, `15:00`).

2. **1-Klik Tezkor Oylik To'lov Tugmasi (Quick Toggle)**:
   - Har bir o'quvchi yonidagi yagona tugma orqali to'lov holatini `True` / `False` ga almashtirish (`POST /api/payments/quick-toggle/{student_id}`).
   - Optimistik interfeys — tugma bosilishi bilan 0ms da rang va status o'zgaradi.

3. **Domla va Admin Belgilari**:
   - `Domla oldi` va `Admin oldi` tugmalari bilan to'lovni kim qabul qilganini bitta bosishda belgilash.

4. **Izohlar Tizimi**:
   - Har bir to'lovga tezkor izoh qo'shish (masalan: *"kartaga o'tkazdi"*, *"yarmini berdi"*, *"oyoq singan"*, *"naqd berdi"*).

5. **Statistika va Tushum Dashbodi**:
   - Jami o'quvchilar, To'laganlar, Qarzdorlar, Domla olganlar, Admin olganlar soni.
   - Jami kutilgan va haqiqiy yig'ilgan tushum (so'mda) va foiz ko'rsatkichi.

6. **Guruh va Soatlar Bo'yicha Filtrlash**:
   - Bo'limlar, dars vaqtlari, to'langan/qarzdorlar filtri hamda ism va telefon bo'yicha tezkor qidiruv.

---

## 📂 Loyiha Tuzilmasi

```text
al_farganiy_academy/
├── frontend/                   # React 18 + Tailwind CSS SPA
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js        # Backend bilan bog'lovchi to'liq API mijozi (Axios)
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Yuqori panel, oy tanlagich, server holati
│   │   │   ├── StatsCards.jsx  # Tushum, foiz va to'lov hisoboti kartalari
│   │   │   ├── DepartmentTabs.jsx # Bo'lim va guruh filtrlari, qidiruv
│   │   │   ├── StudentTable.jsx   # O'quvchilar jadvali, 1-klik to'lov tugmasi
│   │   │   ├── AddStudentModal.jsx# Yangi o'quvchi qo'shish modali
│   │   │   ├── EditStudentModal.jsx# O'quvchi tahrirlash modali
│   │   │   ├── CommentModal.jsx   # Izoh qoldirish modali
│   │   │   ├── PaymentHistoryModal.jsx # O'quvchining to'lovlar tarixi
│   │   │   └── Toast.jsx       # Bildirishnoma xabarlari
│   │   ├── App.jsx             # Asosiy boshqaruvchi komponent
│   │   ├── main.jsx            # React root kirish nuqtasi
│   │   └── index.css           # Tailwind CSS va shriftlar
│   ├── dist/                   # Production uchun kompilyatsiya qilingan fayllar
│   ├── package.json
│   ├── vite.config.js          # API proxy (/api -> 8000)
│   └── tailwind.config.js
├── app/
│   ├── config.py               # .env konfiguratsiyasi
│   ├── database.py             # DB ulanishi (PostgreSQL / SQLite fallback)
│   ├── models.py               # Department, Student, Payment modellari
│   ├── schemas.py              # Pydantic v2 sxemalari
│   ├── crud.py                 # DB amallari
│   ├── seed.py                 # Oktyabr oyi ma'lumotlarini yuklovchi seeder
│   ├── main.py                 # FastAPI ilovasi + React dist statik fayllari
│   └── routers/
│       ├── departments.py      # Bo'limlar endpointlari
│       ├── students.py         # O'quvchilar CRUD endpointlari
│       └── payments.py         # To'lovlar, quick-toggle, izohlar
├── run.py                      # Serverni ishga tushirish (Frontend + Backend)
├── run_all.bat                 # Windows uchun 1-klik bilan ishga tushirish
├── test_backend.py             # To'liq avtomatlashtirilgan backend testlari
└── requirements.txt            # Python kutubxonalari
```

---

## 🚀 Ishga Tushirish

### 1-usul: Bitta buyruq bilan (Backend + Frontend birgalikda)

FastAPI backend o'zida `frontend/dist` ni avtomatik ulagan:

```bash
# Backend serverni ishga tushirish (port 8000)
python run.py
```

Brauzerda oching:
- 🌐 **Frontend**: **http://127.0.0.1:8000**
- 📄 **Swagger API Docs**: **http://127.0.0.1:8000/docs**

### 2-usul: Frontend Dev Server (Hot-Reload bilan)

Frontend kodlarini o'zgartirganda darhol ko'rish uchun:

```bash
# 1. Backendni ishga tushiring:
python run.py

# 2. Alohida terminalda Frontendni ishga tushiring:
cd frontend
npm run dev
```

Brauzerda oching:
- 🌐 **Frontend (Dev)**: **http://localhost:3000**

---

## 🧪 Testlarni Ishga Tushirish

```bash
python test_backend.py
```
Natija:
```text
============================================================
AL-FARG'ONIY ACADEMY BACKEND TESTLARI
============================================================
[TEST 1] Bo'limlar va o'quvchilar sonini tekshirish... [OK]
[TEST 2] Ism va telefon raqamlarning to'g'riligi... [OK]
[TEST 3] Oylik to'lov tugmasi (Quick Toggle)... [OK]
[TEST 4] To'lov holati, izoh va admin/domla belgisi... [OK]
[TEST 5] Oylik hisobot (Summary)... [OK]
[TEST 6] Guruh va qidiruv filtrlari... [OK]
============================================================
 BARCHA TESTLAR 100% MUVAFFAQIYATLI O'TDI!
============================================================
```
