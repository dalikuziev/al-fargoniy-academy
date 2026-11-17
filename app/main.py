import os
import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException

from .logger import logger, setup_logging
from .database import engine, Base, SessionLocal
from .seed import seed_database
from .routers import departments, students, payments, auth


# Loguru sozlamalarini faollashtirish
setup_logging()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Al-Farg'oniy Academy CRM tizimi ishga tushmoqda...")
    # Dastur ishga tushganda ma'lumotlar bazasi jadvallarini yaratish va ma'lumotlarni yuklash
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
        logger.info("Boshlang'ich ma'lumotlar (seed) tekshirildi.")
    except Exception as e:
        logger.exception(f"Seed ma'lumotlarini yuklashda xatolik: {e}")
    finally:
        db.close()

    yield

    logger.info("Al-Farg'oniy Academy CRM tizimi to'xtatildi.")


app = FastAPI(
    title="Al-Farg'oniy Academy REST API",
    version="1.0.0",
    docs_url=None,       # /docs butunlay o'chirildi va yashirildi
    redoc_url=None,      # /redoc butunlay o'chirildi
    openapi_url=None,    # /openapi.json butunlay o'chirildi
    lifespan=lifespan,
)


class HTTPLoggingMiddleware(BaseHTTPMiddleware):
    """
    Barcha HTTP so'rovlar va javoblarni Loguru orqali
    batafsil vaqt va holat kodi bilan log qilib boradi.
    """
    async def dispatch(self, request: Request, call_next):
        start_time = time.perf_counter()
        client_ip = request.client.host if request.client else "unknown"
        method = request.method
        path = request.url.path

        # Statik fayllar logni to'ldirib yubormasligi uchun filtrlash
        is_asset = path.startswith("/assets") or path.endswith((".js", ".css", ".ico", ".png", ".jpg", ".svg", ".woff2"))

        try:
            response = await call_next(request)
            duration_ms = (time.perf_counter() - start_time) * 1000

            if not is_asset:
                status_code = response.status_code
                log_msg = f"{method} {path} | {status_code} | {client_ip} | {duration_ms:.1f}ms"
                if status_code >= 500:
                    logger.error(log_msg)
                elif status_code >= 400:
                    logger.warning(log_msg)
                else:
                    logger.info(log_msg)

            return response
        except Exception as exc:
            duration_ms = (time.perf_counter() - start_time) * 1000
            logger.exception(f"HTTP 500 XATOLIK | {method} {path} | {client_ip} | {duration_ms:.1f}ms | {exc}")
            raise


# Middleware-larni ulash
app.add_middleware(HTTPLoggingMiddleware)
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


# SEO uchun robots.txt va sitemap.xml yo'nalishlari
@app.get("/robots.txt", include_in_schema=False)
def get_robots_txt():
    robots_file = os.path.join(FRONTEND_DIST, "robots.txt")
    if os.path.exists(robots_file):
        return FileResponse(robots_file, media_type="text/plain")
    return Response(
        "User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: https://al-farganiy.uz/sitemap.xml\n",
        media_type="text/plain",
    )


@app.get("/sitemap.xml", include_in_schema=False)
def get_sitemap_xml():
    sitemap_file = os.path.join(FRONTEND_DIST, "sitemap.xml")
    if os.path.exists(sitemap_file):
        return FileResponse(sitemap_file, media_type="application/xml")
    return Response(
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://al-farganiy.uz/</loc>\n    <lastmod>2026-11-17</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>',
        media_type="application/xml",
    )


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
        return {"status": "online"}

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
        }
