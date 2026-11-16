import re
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict, field_validator


# ==========================================
# PAYMENT SCHEMAS
# ==========================================
class PaymentBase(BaseModel):
    month: str = Field(default="2026-10", description="To'lov oyi")
    amount: float = Field(default=250000.0, description="To'lov summasi")
    is_paid: bool = Field(default=False, description="To'langanlik holati")
    is_taken_by_teacher: bool = Field(default=False, description="Domla oldi")
    is_taken_by_admin: bool = Field(default=False, description="Admin oldi")
    comment: Optional[str] = Field(default=None, description="Izoh")


class PaymentCreate(PaymentBase):
    student_id: int


class PaymentUpdate(BaseModel):
    amount: Optional[float] = None
    is_paid: Optional[bool] = None
    is_taken_by_teacher: Optional[bool] = None
    is_taken_by_admin: Optional[bool] = None
    recipient: Optional[str] = None # "admin" yoki "domla"
    comment: Optional[str] = None
    paid_at: Optional[datetime] = None


class PaymentToggleStatus(BaseModel):
    """To'lov holatini o'zgartirish sxemasi"""
    is_paid: Optional[bool] = None
    recipient: Optional[str] = None # "admin" yoki "domla"
    amount: Optional[float] = None
    is_taken_by_teacher: Optional[bool] = None
    is_taken_by_admin: Optional[bool] = None
    comment: Optional[str] = None


class PaymentOut(PaymentBase):
    id: int
    student_id: int
    recipient: Optional[str] = None # To'lanmagan bo'lsa None, aks holda 'admin' yoki 'domla'
    paid_at: Optional[datetime] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# STUDENT SCHEMAS
# ==========================================
MODULES_LIST = ["Dasturlash asoslari", "Telegram bot", "Web site"]


class StudentBase(BaseModel):
    full_name: str = Field(..., description="Ism, Familya")
    phone: str = Field(..., description="Telefon raqami (majburiy, masalan: +998911530608)")
    module: str = Field(default="Dasturlash asoslari", description="Modul (Dasturlash asoslari, Telegram bot, Web site)")
    group_time: Optional[str] = Field(default=None, description="Eski moslik uchun")
    department_id: int = Field(..., description="Filial ID (1: Yangiqo'rg'on, 2: Uchko'prik)")

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        digits = re.sub(r"[^\d]", "", v)
        if digits.startswith("998") and len(digits) == 12:
            return f"+{digits}"
        if len(v) != 13 or not v.startswith("+998") or not re.match(r"^\+998\d{9}$", v):
            raise ValueError("Telefon raqami +998 bilan boshlanishi va roppa-rosa 13 ta belgidan iborat bo'lishi shart (+998911530608)")
        return v


class StudentCreate(StudentBase):
    raw_name: Optional[str] = None
    amount: Optional[float] = Field(default=250000.0, description="Oylik to'lov summasi")
    is_active: bool = True


class StudentUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    module: Optional[str] = None
    group_time: Optional[str] = None
    department_id: Optional[int] = None
    is_active: Optional[bool] = None

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        digits = re.sub(r"[^\d]", "", v)
        if digits.startswith("998") and len(digits) == 12:
            return f"+{digits}"
        if len(v) != 13 or not v.startswith("+998") or not re.match(r"^\+998\d{9}$", v):
            raise ValueError("Telefon raqami +998 bilan boshlanishi va roppa-rosa 13 ta belgidan iborat bo'lishi shart (+998911530608)")
        return v


class StudentOut(StudentBase):
    id: int
    raw_name: Optional[str] = None
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class StudentDetailOut(StudentOut):
    department_name: Optional[str] = None # Filial nomi: Yangiqo'rg'on yoki Uchko'prik
    latest_payment: Optional[PaymentOut] = None
    payments: List[PaymentOut] = []

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# FILIAL (DEPARTMENT) SCHEMAS
# ==========================================
class DepartmentBase(BaseModel):
    name: str = Field(..., description="Filial nomi (Yangiqo'rg'on yoki Uchko'prik)")
    code: str = Field(..., description="Filial kodi (yangiqorgon yoki uchkoprik)")
    description: Optional[str] = None


class DepartmentCreate(DepartmentBase):
    pass


class DepartmentOut(DepartmentBase):
    id: int
    created_at: datetime
    students_count: int = 0
    modules_list: List[str] = MODULES_LIST
    groups_list: List[str] = MODULES_LIST

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# SUMMARY / DASHBOARD STATS
# ==========================================
class PaymentSummaryOut(BaseModel):
    month: str
    department_id: Optional[int] = None
    total_students: int
    paid_count: int
    unpaid_count: int
    taken_by_teacher_count: int
    taken_by_admin_count: int
    total_expected_sum: float
    total_collected_sum: float
    collection_percentage: float
