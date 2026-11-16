from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship

from .database import Base


def utc_now():
    return datetime.now(timezone.utc)


class Department(Base):
    """Filial (Branch) modeli: Yangiqo'rg'on va Uchko'prik"""
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False) # Yangiqo'rg'on / Uchko'prik
    code = Column(String(50), unique=True, index=True, nullable=False) # yangiqorgon / uchkoprik
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    students = relationship("Student", back_populates="department", cascade="all, delete-orphan")


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False, index=True)
    full_name = Column(String(150), nullable=False, index=True)
    raw_name = Column(String(150), nullable=True)
    phone = Column(String(50), nullable=False, index=True)
    group_time = Column(String(50), nullable=False, default="Dasturlash asoslari", index=True) # Modul nomi saqlanadi
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)

    department = relationship("Department", back_populates="students")
    payments = relationship("Payment", back_populates="student", cascade="all, delete-orphan")

    @property
    def module(self) -> str:
        return self.group_time or "Dasturlash asoslari"

    @module.setter
    def module(self, value: str):
        self.group_time = value


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False, index=True)
    month = Column(String(20), nullable=False, default="2026-10", index=True)
    amount = Column(Float, default=250000.0)
    is_paid = Column(Boolean, default=False, index=True)
    is_taken_by_teacher = Column(Boolean, default=False)
    is_taken_by_admin = Column(Boolean, default=False)
    comment = Column(Text, nullable=True)
    paid_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    student = relationship("Student", back_populates="payments")

    @property
    def recipient(self) -> Optional[str]:
        if not self.is_paid:
            return None
        if self.is_taken_by_teacher:
            return "domla"
        return "admin"
