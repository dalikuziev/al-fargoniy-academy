import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from .database import engine, Base, SessionLocal
from .seed import seed_database
from .routers import departments, students, payments, auth


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Dastur ishga tushganda ma'lumotlar bazasi jadvallarini yaratish va Oktyabr ma'lumotlarini yuklash
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Al-Farg'oniy Academy REST API",
    description="""
    ## Al-Farg'oniy Academy Backend REST API
    
    O'quvchilar va Oylik To'lovlarni Boshqarish Tizimi API.
    Professional Frontend (React / Next.js) uchun to'liq RESTful servis.
    """,
    version="1.0.0",
    lifespan=lifespan,
)

# CORS sozlamalari (Frontend istalgan domen yoki portdan to'siqsiz ulanishi uchun)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routerlarni ulash
app.include_router(departments.router, prefix="/api")
app.include_router(students.router, prefix="/api")
app.include_router(payments.router, prefix="/api")
app.include_router(auth.router, prefix="/api")


@app.get("/api/health", tags=["Tizim"])
def health_check():
    """Tizim faolligini tekshirish (Health Check)"""
    return {
        "service": "Al-Farg'oniy Academy REST API",
        "status": "online",
        "version": "1.0.0",
    }


# Frontend statik fayllari (React Build)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIST = os.path.join(BASE_DIR, "frontend", "dist")

if os.path.exists(FRONTEND_DIST):
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/")
    def serve_frontend_root():
        index_file = os.path.join(FRONTEND_DIST, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"status": "online", "docs": "/docs"}

    @app.exception_handler(StarletteHTTPException)
    async def custom_http_exception_handler(request: Request, exc: StarletteHTTPException):
        path = request.url.path
        if exc.status_code == 404:
            # Agar bu API so'rovi yoki Swagger bo'lsa, oddiy 404 JSON qaytaramiz
            if path.startswith("/api") or path.startswith("/docs") or path.startswith("/openapi.json"):
                return JSONResponse(status_code=404, content={"detail": exc.detail or "Not Found"})
            # Agar frontend/dist ichidagi fayl bo'lsa (masalan: /logo.png, /favicon.ico)
            rel_path = path.lstrip("/")
            target_file = os.path.join(FRONTEND_DIST, rel_path)
            if rel_path and os.path.isfile(target_file):
                return FileResponse(target_file)
            # Aks holda React SPA uchun index.html qaytariladi
            index_file = os.path.join(FRONTEND_DIST, "index.html")
            if os.path.exists(index_file):
                return FileResponse(index_file)
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})
else:
    @app.get("/", tags=["Tizim"])
    def root():
        """Sof Backend REST API xizmati"""
        return {
            "service": "Al-Farg'oniy Academy Backend REST API",
            "status": "online",
            "version": "1.0.0",
            "swagger_docs": "/docs",
            "openapi_json": "/openapi.json",
        }
