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


@router.post("/login", response_model=LoginResponse)
def login(creds: LoginRequest, request: Request):
    username = creds.username.strip()
    password = creds.password
    client_ip = request.client.host if request.client else "unknown"

    # Faqat bitta xavfsiz admin foydalanuvchi: dalikuziev / Dyrbk41Aiuie)
    if username.lower() == "dalikuziev" and password == "Dyrbk41Aiuie)":
        logger.info(f"AUDIT | Administrator tizimga kirdi | user='{username}' | IP={client_ip}")
        return {
            "token": "token_dalikuziev_secure_session",
            "username": "dalikuziev",
            "role": "admin",
            "name": "Diyorbek Aliqo'ziyev",
        }

    logger.warning(f"AUDIT | Muvaffaqiyatsiz kirish urinishi | user='{username}' | IP={client_ip}")
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Login yoki parol noto'g'ri!",
    )
