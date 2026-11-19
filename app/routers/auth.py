from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel
from ..logger import logger

router = APIRouter(prefix="/auth", tags=["Autentifikatsiya"])


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    token: str
    username: str
    role: str
    name: str
    can_edit: bool = True


def verify_write_permission(request: Request):
    """
    O'quvchi qo'shish, tahrirlash, o'chirish va to'lovni o'zgartirish huquqini tekshirish.
    Agar foydalanuvchi faqat ko'rish rejimida (viewer) bo'lsa, 403 Forbidden qaytaradi.
    """
    auth_header = request.headers.get("authorization", "")
    if "token_admin_viewer_session" in auth_header:
        logger.warning(f"AUDIT | Ruxsatsiz o'zgartirish urinishi (Read-Only foydalanuvchi) | IP={request.client.host if request.client else 'unknown'}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Siz faqat ko'rish rejimidasiz. Ma'lumotlarni o'zgartirish huquqi yo'q!",
        )


@router.post("/login", response_model=LoginResponse)
def login(creds: LoginRequest, request: Request):
    username = creds.username.strip()
    password = creds.password
    client_ip = request.client.host if request.client else "unknown"

    # 1. Bosh Administrator (To'liq huquqli boshqaruvchi): dalikuziev / Dyrbk41Aiuie)
    if username.lower() == "dalikuziev" and password == "Dyrbk41Aiuie)":
        logger.info(f"AUDIT | Bosh Administrator tizimga kirdi | user='{username}' | IP={client_ip}")
        return {
            "token": "token_dalikuziev_secure_session",
            "username": "dalikuziev",
            "role": "admin",
            "can_edit": True,
            "name": "Diyorbek Aliqo'ziyev",
        }

    # 2. Nazoratchi Administrator (Faqat ko'rish huquqi): admin / Aa909090
    if username.lower() == "admin" and password == "Aa909090":
        logger.info(f"AUDIT | Nazoratchi Administrator (Read-Only) tizimga kirdi | user='{username}' | IP={client_ip}")
        return {
            "token": "token_admin_viewer_session",
            "username": "admin",
            "role": "viewer",
            "can_edit": False,
            "name": "Administrator",
        }

    logger.warning(f"AUDIT | Muvaffaqiyatsiz kirish urinishi | user='{username}' | IP={client_ip}")
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Login yoki parol noto'g'ri!",
    )
