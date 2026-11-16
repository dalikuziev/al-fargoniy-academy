from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..database import get_db
from .. import crud, models, schemas

router = APIRouter(prefix="/departments", tags=["Filiallar (Branches)"])


@router.get("", response_model=List[schemas.DepartmentOut])
def list_departments(db: Session = Depends(get_db)):
    """
    Barcha filiallar ro'yxati (Yangiqo'rg'on va Uchko'prik).
    """
    departments = crud.get_departments(db)
    result = []
    for d in departments:
        dept_dict = schemas.DepartmentOut(
            id=d.id,
            name=d.name,
            code=d.code,
            description=d.description,
            created_at=d.created_at,
            students_count=len(d.students),
            modules_list=["Dasturlash asoslari", "Telegram bot", "Web site"],
            groups_list=["Dasturlash asoslari", "Telegram bot", "Web site"],
        )
        result.append(dept_dict)
    return result


@router.get("/{department_id}", response_model=schemas.DepartmentOut)
def get_department_detail(department_id: int, db: Session = Depends(get_db)):
    """Filial tafsilotlari"""
    dept = crud.get_department(db, department_id)
    if not dept:
        raise HTTPException(status_code=404, detail="Filial topilmadi")
    return schemas.DepartmentOut(
        id=dept.id,
        name=dept.name,
        code=dept.code,
        description=dept.description,
        created_at=dept.created_at,
        students_count=len(dept.students),
        modules_list=["Dasturlash asoslari", "Telegram bot", "Web site"],
        groups_list=["Dasturlash asoslari", "Telegram bot", "Web site"],
    )


@router.get("/{department_id}/students", response_model=List[schemas.StudentDetailOut])
def list_department_students(
    department_id: int,
    module: Optional[str] = Query(None, description="Modul bo'yicha filter (Dasturlash asoslari, Telegram bot, Web site)"),
    group_time: Optional[str] = Query(None, description="Eski moslik"),
    search: Optional[str] = Query(None, description="Ism yoki telefon qidirish"),
    month: str = Query("2026-10", description="To'lov oyi"),
    db: Session = Depends(get_db),
):
    """
    Aynan shu filialga tegishli o'quvchilar ro'yxati.
    """
    dept = crud.get_department(db, department_id)
    if not dept:
        raise HTTPException(status_code=404, detail="Filial topilmadi")

    students = crud.get_students(
        db,
        department_id=department_id,
        module=module or group_time,
        search=search,
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
                department_name=dept.name,
                is_active=s.is_active,
                created_at=s.created_at,
                latest_payment=latest_payment,
                payments=s.payments,
            )
        )
    return result


@router.get("/{department_id}/groups", response_model=List[str])
def list_department_groups(department_id: int, db: Session = Depends(get_db)):
    """Filialdagi 3 ta modul"""
    return ["Dasturlash asoslari", "Telegram bot", "Web site"]
