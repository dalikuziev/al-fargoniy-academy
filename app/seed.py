from datetime import datetime, timezone
from sqlalchemy.orm import Session
from . import models
from .database import engine, Base


def utc_now():
    return datetime.now(timezone.utc)


def seed_database(db: Session):
    """
    Filiallarni (Yangiqo'rg'on va Uchko'prik) yaratish.
    O'quvchilar ro'yxati toza va real ma'lumotlarni qabul qilishga tayyor.
    """
    dept1 = db.query(models.Department).filter_by(code="yangiqorgon").first()
    if not dept1:
        dept1 = models.Department(
            name="Yangiqo'rg'on",
            code="yangiqorgon",
            description="Al-Farg'oniy Academy Yangiqo'rg'on filiali",
        )
        db.add(dept1)

    dept2 = db.query(models.Department).filter_by(code="uchkoprik").first()
    if not dept2:
        dept2 = models.Department(
            name="Uchko'prik",
            code="uchkoprik",
            description="Al-Farg'oniy Academy Uchko'prik filiali",
        )
        db.add(dept2)

    db.commit()
