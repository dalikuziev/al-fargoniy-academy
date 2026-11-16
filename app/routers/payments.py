from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from ..database import get_db
from .. import crud, schemas

router = APIRouter(prefix="/payments", tags=["Oylik To'lovlar (Payments)"])


@router.patch("/{payment_id}/toggle", response_model=schemas.PaymentOut)
def toggle_payment_status(
    payment_id: int,
    toggle_data: schemas.PaymentToggleStatus,
    db: Session = Depends(get_db),
):
    payment = crud.toggle_payment_status(db, payment_id, toggle_data)
    if not payment:
        raise HTTPException(status_code=404, detail="To'lov yozuvi topilmadi")
    return payment


@router.post("/quick-toggle/{student_id}", response_model=schemas.PaymentOut)
def quick_toggle_student_payment(
    student_id: int,
    month: str = Query("2026-10", description="To'lov oyi"),
    recipient: Optional[str] = Query("admin", description="Kim oldi: 'admin' yoki 'domla'"),
    amount: Optional[float] = Query(None, description="To'lov summasi"),
    db: Session = Depends(get_db),
):
    """
    To'lov holatini almashtirish:
    - Agar to'langan bo'lsa -> to'lanmadi qilinadi, adminda ham domlada ham bo'lmaydi.
    - Agar to'lanmagan bo'lsa -> to'landi qilinadi, kimdaligi majburiy (default: admin).
    """
    student = crud.get_student(db, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="O'quvchi topilmadi")

    payment = crud.get_payment_by_student_and_month(db, student_id, month)

    if not payment:
        payment = crud.create_or_update_payment(
            db,
            schemas.PaymentCreate(
                student_id=student_id,
                month=month,
                amount=amount or 250000.0,
                is_paid=True,
                is_taken_by_teacher=recipient == "domla",
                is_taken_by_admin=recipient != "domla",
                comment=None,
            ),
        )
    else:
        new_paid_status = not payment.is_paid
        toggle_data = schemas.PaymentToggleStatus(
            is_paid=new_paid_status,
            recipient="domla" if recipient == "domla" else "admin",
            amount=amount if amount is not None else payment.amount,
        )
        payment = crud.toggle_payment_status(db, payment.id, toggle_data)

    return payment


@router.patch("/{payment_id}", response_model=schemas.PaymentOut)
def update_payment(
    payment_id: int,
    payment_in: schemas.PaymentUpdate,
    db: Session = Depends(get_db),
):
    payment = crud.update_payment(db, payment_id, payment_in)
    if not payment:
        raise HTTPException(status_code=404, detail="To'lov yozuvi topilmadi")
    return payment


@router.post("/record", response_model=schemas.PaymentOut, status_code=status.HTTP_201_CREATED)
def record_payment(payment_in: schemas.PaymentCreate, db: Session = Depends(get_db)):
    student = crud.get_student(db, payment_in.student_id)
    if not student:
        raise HTTPException(status_code=404, detail="O'quvchi topilmadi")
    return crud.create_or_update_payment(db, payment_in)


@router.get("/student/{student_id}", response_model=List[schemas.PaymentOut])
def list_student_payments(student_id: int, db: Session = Depends(get_db)):
    student = crud.get_student(db, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="O'quvchi topilmadi")
    return crud.get_student_payments(db, student_id)


@router.get("/summary", response_model=schemas.PaymentSummaryOut)
def get_payment_summary(
    month: str = Query("2026-10", description="To'lov oyi"),
    department_id: Optional[int] = Query(None, description="Filial ID bo'yicha filter"),
    db: Session = Depends(get_db),
):
    return crud.get_payment_summary(db, month=month, department_id=department_id)
