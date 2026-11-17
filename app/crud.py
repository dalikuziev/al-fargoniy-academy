from datetime import datetime, timezone
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import or_, func

from . import models, schemas


def utc_now():
    return datetime.now(timezone.utc)


# ==========================================
# FILIALLAR (DEPARTMENTS)
# ==========================================
def get_departments(db: Session) -> List[models.Department]:
    return db.query(models.Department).order_by(models.Department.id.asc()).all()


def get_department(db: Session, department_id: int) -> Optional[models.Department]:
    return db.query(models.Department).filter(models.Department.id == department_id).first()


def get_department_by_code(db: Session, code: str) -> Optional[models.Department]:
    return db.query(models.Department).filter(models.Department.code == code).first()


def create_department(db: Session, dept: schemas.DepartmentCreate) -> models.Department:
    db_dept = models.Department(**dept.model_dump())
    db.add(db_dept)
    db.commit()
    db.refresh(db_dept)
    return db_dept


def get_department_groups(db: Session, department_id: int) -> List[str]:
    return ["Dasturlash asoslari", "Telegram bot", "Web site"]


# ==========================================
# O'QUVCHILAR (STUDENTS)
# ==========================================
def get_students(
    db: Session,
    department_id: Optional[int] = None,
    module: Optional[str] = None,
    group_time: Optional[str] = None,
    search: Optional[str] = None,
    is_active: Optional[bool] = None,
    skip: int = 0,
    limit: int = 200,
) -> List[models.Student]:
    query = db.query(models.Student)

    if department_id is not None:
        query = query.filter(models.Student.department_id == department_id)

    mod_filter = module or group_time
    if mod_filter:
        query = query.filter(models.Student.group_time == mod_filter)

    if is_active is not None:
        query = query.filter(models.Student.is_active == is_active)

    if search:
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            or_(
                models.Student.full_name.ilike(search_pattern),
                models.Student.phone.ilike(search_pattern),
            )
        )

    return query.order_by(models.Student.full_name.asc()).offset(skip).limit(limit).all()


def get_student(db: Session, student_id: int) -> Optional[models.Student]:
    return db.query(models.Student).filter(models.Student.id == student_id).first()


def create_student(db: Session, student_in: schemas.StudentCreate) -> models.Student:
    mod = student_in.module or student_in.group_time or "Dasturlash asoslari"
    db_student = models.Student(
        department_id=student_in.department_id,
        full_name=student_in.full_name,
        raw_name=None,
        phone=student_in.phone,
        group_time=mod,
        is_active=student_in.is_active,
    )
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student


def update_student(db: Session, student_id: int, student_in: schemas.StudentUpdate) -> Optional[models.Student]:
    db_student = get_student(db, student_id)
    if not db_student:
        return None

    if student_in.full_name is not None:
        db_student.full_name = student_in.full_name
    if student_in.phone is not None:
        db_student.phone = student_in.phone
    if student_in.department_id is not None:
        db_student.department_id = student_in.department_id
    if student_in.module is not None:
        db_student.group_time = student_in.module
    elif student_in.group_time is not None:
        db_student.group_time = student_in.group_time
    if student_in.is_active is not None:
        db_student.is_active = student_in.is_active

    db.commit()
    db.refresh(db_student)
    return db_student


def delete_student(db: Session, student_id: int) -> bool:
    db_student = get_student(db, student_id)
    if not db_student:
        return False
    db.delete(db_student)
    db.commit()
    return True


# ==========================================
# TO'LOVLAR (PAYMENTS)
# ==========================================
def get_student_payments(db: Session, student_id: int) -> List[models.Payment]:
    return (
        db.query(models.Payment)
        .filter(models.Payment.student_id == student_id)
        .order_by(models.Payment.month.desc())
        .all()
    )


def get_payment(db: Session, payment_id: int) -> Optional[models.Payment]:
    return db.query(models.Payment).filter(models.Payment.id == payment_id).first()


def get_payment_by_student_and_month(db: Session, student_id: int, month: str) -> Optional[models.Payment]:
    return (
        db.query(models.Payment)
        .filter(models.Payment.student_id == student_id, models.Payment.month == month)
        .first()
    )


def create_or_update_payment(db: Session, payment_in: schemas.PaymentCreate) -> models.Payment:
    existing = get_payment_by_student_and_month(db, payment_in.student_id, payment_in.month)
    if existing:
        for field, val in payment_in.model_dump(exclude_unset=True).items():
            setattr(existing, field, val)

        # To'lov qilinmagan bo'lsa hech kimda emas!
        if not existing.is_paid:
            existing.is_taken_by_teacher = False
            existing.is_taken_by_admin = False
            existing.paid_at = None
        else:
            if existing.is_taken_by_teacher:
                existing.is_taken_by_admin = False
            else:
                existing.is_taken_by_admin = True
                existing.is_taken_by_teacher = False
            if not existing.paid_at:
                existing.paid_at = utc_now()

        db.commit()
        db.refresh(existing)
        return existing

    new_payment = models.Payment(**payment_in.model_dump())
    if not new_payment.is_paid:
        new_payment.is_taken_by_teacher = False
        new_payment.is_taken_by_admin = False
        new_payment.paid_at = None
    else:
        if new_payment.is_taken_by_teacher:
            new_payment.is_taken_by_admin = False
        else:
            new_payment.is_taken_by_admin = True
            new_payment.is_taken_by_teacher = False
        if not new_payment.paid_at:
            new_payment.paid_at = utc_now()

    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)
    return new_payment


def toggle_payment_status(
    db: Session,
    payment_id: int,
    toggle_data: schemas.PaymentToggleStatus
) -> Optional[models.Payment]:
    """
    To'lov holatini o'zgartirish.
    To'lov qilmagan bo'lsa adminda ham domlada ham bo'lmaydi!
    To'lov qilsa kimdaligini ko'rsatish majburiy (default: admin).
    """
    payment = get_payment(db, payment_id)
    if not payment:
        return None

    if toggle_data.amount is not None:
        payment.amount = toggle_data.amount

    if toggle_data.is_paid is not None:
        payment.is_paid = toggle_data.is_paid
        payment.paid_at = utc_now() if payment.is_paid else None

    if not payment.is_paid:
        # To'lov qilinmagan bo'lsa hech kimda emas!
        payment.is_taken_by_teacher = False
        payment.is_taken_by_admin = False
    else:
        # To'lov qilingan bo'lsa, kimdaligi majburiy (default: admin)
        if toggle_data.recipient is not None:
            if toggle_data.recipient == "domla":
                payment.is_taken_by_teacher = True
                payment.is_taken_by_admin = False
            else:
                payment.is_taken_by_teacher = False
                payment.is_taken_by_admin = True
        elif toggle_data.is_taken_by_teacher is not None:
            payment.is_taken_by_teacher = toggle_data.is_taken_by_teacher
            payment.is_taken_by_admin = not toggle_data.is_taken_by_teacher
        elif toggle_data.is_taken_by_admin is not None:
            payment.is_taken_by_admin = toggle_data.is_taken_by_admin
            payment.is_taken_by_teacher = not toggle_data.is_taken_by_admin
        else:
            if not payment.is_taken_by_teacher and not payment.is_taken_by_admin:
                payment.is_taken_by_admin = True

    if toggle_data.comment is not None:
        payment.comment = toggle_data.comment

    db.commit()
    db.refresh(payment)
    return payment


def update_payment(db: Session, payment_id: int, payment_in: schemas.PaymentUpdate) -> Optional[models.Payment]:
    payment = get_payment(db, payment_id)
    if not payment:
        return None

    update_data = payment_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(payment, field, val)

    if not payment.is_paid:
        payment.is_taken_by_teacher = False
        payment.is_taken_by_admin = False
        payment.paid_at = None
    else:
        if payment_in.recipient:
            if payment_in.recipient == "domla":
                payment.is_taken_by_teacher = True
                payment.is_taken_by_admin = False
            else:
                payment.is_taken_by_teacher = False
                payment.is_taken_by_admin = True
        elif not payment.is_taken_by_teacher and not payment.is_taken_by_admin:
            payment.is_taken_by_admin = True

        if not payment.paid_at:
            payment.paid_at = utc_now()

    db.commit()
    db.refresh(payment)
    return payment


def ensure_monthly_payments_for_students(db: Session, month: str):
    """
    Barcha faol o'quvchilarni tanlangan oyga 100% avtomatik o'tkazish.
    Agar yangi oy (masalan Dekabr) kelsa, barcha o'quvchilar avtomatik o'tadi (is_paid=False),
    oldingi oy (Noyabr) esa tarixda o'zgarmasdan saqlanib qoladi!
    Dublikat to'lov yozuvlari bo'lsa, ularni tozalaydi.
    """
    active_students = db.query(models.Student).filter(models.Student.is_active == True).all()
    created_or_cleaned = False
    for s in active_students:
        existing_payments = (
            db.query(models.Payment)
            .filter(models.Payment.student_id == s.id, models.Payment.month == month)
            .order_by(models.Payment.id.desc())
            .all()
        )
        if len(existing_payments) > 1:
            # Agar bir nechta bo'lib qolgan bo'lsa, to'langanini (yoki eng oxirgisini) qoldirib qolganini o'chiramiz
            keep = next((p for p in existing_payments if p.is_paid), existing_payments[0])
            for p in existing_payments:
                if p.id != keep.id:
                    db.delete(p)
            created_or_cleaned = True
        elif len(existing_payments) == 0:
            # Oldingi to'lov summasini olamiz
            prev_payment = (
                db.query(models.Payment)
                .filter(models.Payment.student_id == s.id)
                .order_by(models.Payment.id.desc())
                .first()
            )
            carry_amount = prev_payment.amount if prev_payment else 300000.0
            new_p = models.Payment(
                student_id=s.id,
                month=month,
                amount=carry_amount,
                is_paid=False,
                is_taken_by_teacher=False,
                is_taken_by_admin=False,
                comment=None,
                paid_at=None,
            )
            db.add(new_p)
            created_or_cleaned = True

    if created_or_cleaned:
        db.commit()


def get_payment_summary(db: Session, month: str = "2026-11", department_id: Optional[int] = None) -> dict:
    ensure_monthly_payments_for_students(db, month)

    students_query = db.query(models.Student).filter(models.Student.is_active == True)
    if department_id is not None:
        students_query = students_query.filter(models.Student.department_id == department_id)

    active_students = students_query.all()
    total_students = len(active_students)

    if total_students == 0:
        return {
            "month": month,
            "department_id": department_id,
            "total_students": 0,
            "paid_count": 0,
            "unpaid_count": 0,
            "taken_by_teacher_count": 0,
            "taken_by_admin_count": 0,
            "total_expected_sum": 0.0,
            "total_collected_sum": 0.0,
            "collection_percentage": 0.0,
        }

    student_ids = [s.id for s in active_students]
    payments = (
        db.query(models.Payment)
        .filter(models.Payment.student_id.in_(student_ids), models.Payment.month == month)
        .all()
    )

    # 1 o'quvchiga 1 ta to'lov (deduplicate)
    student_payment_map = {}
    for p in payments:
        if p.student_id not in student_payment_map or p.is_paid:
            student_payment_map[p.student_id] = p

    unique_payments = list(student_payment_map.values())
    paid_count = sum(1 for p in unique_payments if p.is_paid)
    unpaid_count = total_students - paid_count
    taken_by_teacher_count = sum(1 for p in unique_payments if p.is_paid and p.is_taken_by_teacher)
    taken_by_admin_count = sum(1 for p in unique_payments if p.is_paid and p.is_taken_by_admin)

    total_expected_sum = sum(p.amount for p in unique_payments)
    total_collected_sum = sum(p.amount for p in unique_payments if p.is_paid)
    percentage = (total_collected_sum / total_expected_sum * 100) if total_expected_sum > 0 else 0.0

    return {
        "month": month,
        "department_id": department_id,
        "total_students": total_students,
        "paid_count": paid_count,
        "unpaid_count": unpaid_count,
        "taken_by_teacher_count": taken_by_teacher_count,
        "taken_by_admin_count": taken_by_admin_count,
        "total_expected_sum": total_expected_sum,
        "total_collected_sum": total_collected_sum,
        "collection_percentage": round(percentage, 1),
    }
