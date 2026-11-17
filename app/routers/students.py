from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from ..database import get_db
from .. import crud, schemas

router = APIRouter(prefix="/students", tags=["O'quvchilar (Students)"])


@router.get("", response_model=List[schemas.StudentDetailOut])
def list_students(
    department_id: Optional[int] = Query(None, description="Filial ID bo'yicha filter"),
    module: Optional[str] = Query(None, description="Modul bo'yicha filter (Dasturlash asoslari, Telegram bot, Web site)"),
    group_time: Optional[str] = Query(None, description="Eski moslik"),
    search: Optional[str] = Query(None, description="Ism yoki telefon qidirish"),
    month: str = Query("2026-11", description="Ko'rsatiladigan to'lov oyi"),
    skip: int = Query(0, ge=0),
    limit: int = Query(200, ge=1, le=500),
    db: Session = Depends(get_db),
):
    crud.ensure_monthly_payments_for_students(db, month)
    students = crud.get_students(
        db,
        department_id=department_id,
        module=module or group_time,
        search=search,
        skip=skip,
        limit=limit,
    )

    result = []
    for s in students:
        latest_payment = crud.get_payment_by_student_and_month(db, s.id, month)
        result.append(
            schemas.StudentDetailOut(
                id=s.id,
                full_name=s.full_name,
                raw_name=None,
                phone=s.phone,
                module=s.group_time or "Dasturlash asoslari",
                group_time=s.group_time or "Dasturlash asoslari",
                department_id=s.department_id,
                department_name=s.department.name if s.department else None,
                is_active=s.is_active,
                created_at=s.created_at,
                latest_payment=latest_payment,
                payments=s.payments,
            )
        )
    return result


@router.get("/{student_id}", response_model=schemas.StudentDetailOut)
def get_student(
    student_id: int,
    month: str = Query("2026-11", description="To'lov oyi"),
    db: Session = Depends(get_db),
):
    student = crud.get_student(db, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="O'quvchi topilmadi")

    latest_payment = crud.get_payment_by_student_and_month(db, student.id, month)
    return schemas.StudentDetailOut(
        id=student.id,
        full_name=student.full_name,
        raw_name=None,
        phone=student.phone,
        module=student.group_time or "Dasturlash asoslari",
        group_time=student.group_time or "Dasturlash asoslari",
        department_id=student.department_id,
        department_name=student.department.name if student.department else None,
        is_active=student.is_active,
        created_at=student.created_at,
        latest_payment=latest_payment,
        payments=student.payments,
    )


@router.post("", response_model=schemas.StudentDetailOut, status_code=status.HTTP_201_CREATED)
def create_student(
    student_in: schemas.StudentCreate,
    month: str = Query("2026-11", description="To'lov oyi"),
    db: Session = Depends(get_db),
):
    dept = crud.get_department(db, student_in.department_id)
    if not dept:
        raise HTTPException(status_code=400, detail="Bunday filial mavjud emas")

    student = crud.create_student(db, student_in)

    # To'lov summasi bilan joriy oy yozuvini kiritamiz (To'lanmagan, hech kimda emas)
    initial_payment = crud.create_or_update_payment(
        db,
        schemas.PaymentCreate(
            student_id=student.id,
            month=month,
            amount=student_in.amount or 300000.0,
            is_paid=False,
            is_taken_by_teacher=False,
            is_taken_by_admin=False,
            comment=None,
        ),
    )

    return schemas.StudentDetailOut(
        id=student.id,
        full_name=student.full_name,
        raw_name=None,
        phone=student.phone,
        module=student.group_time or "Dasturlash asoslari",
        group_time=student.group_time or "Dasturlash asoslari",
        department_id=student.department_id,
        department_name=dept.name,
        is_active=student.is_active,
        created_at=student.created_at,
        latest_payment=initial_payment,
        payments=[initial_payment],
    )


@router.put("/{student_id}", response_model=schemas.StudentOut)
def update_student(student_id: int, student_in: schemas.StudentUpdate, db: Session = Depends(get_db)):
    student = crud.update_student(db, student_id, student_in)
    if not student:
        raise HTTPException(status_code=404, detail="O'quvchi topilmadi")
    return student


@router.delete("/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_student(student_id: int, db: Session = Depends(get_db)):
    success = crud.delete_student(db, student_id)
    if not success:
        raise HTTPException(status_code=404, detail="O'quvchi topilmadi")
    return None
