from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

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
def login(creds: LoginRequest):
    username = creds.username.strip()
    password = creds.password

    # Faqat bitta xavfsiz admin foydalanuvchi: dalikuziev / Dyrbk41Aiuie)
    if username.lower() == "dalikuziev" and password == "Dyrbk41Aiuie)":
        return {
            "token": "token_dalikuziev_secure_session",
            "username": "dalikuziev",
            "role": "admin",
            "name": "Diyorbek Aliqo'ziyev",
        }

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Login yoki parol noto'g'ri!",
    )
