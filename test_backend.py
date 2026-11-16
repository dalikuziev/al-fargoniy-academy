import sys
from app.database import SessionLocal, engine, Base
from app import crud, models, schemas
from app.seed import seed_database
from app.routers.departments import list_departments, list_department_students
from app.routers.students import list_students, get_student, create_student
from app.routers.payments import toggle_payment_status, quick_toggle_student_payment, get_payment_summary


def run_all_tests():
    print("=" * 60)
    print("AL-FARG'ONIY ACADEMY BACKEND TESTLARI")
    print("=" * 60)

    db = SessionLocal()
    seed_database(db)

    try:
        # 1. Seeder testi
        print("\n[TEST 1] Bo'limlar va o'quvchilar sonini tekshirish...")
        departments = crud.get_departments(db)
        assert len(departments) == 2, f"Kutilgan 2 ta bo'lim, topildi: {len(departments)}"
        dept1, dept2 = departments[0], departments[1]

        print(f"  -> Bo'lim 1: ID={dept1.id}, Nomi='{dept1.name}', Kodi='{dept1.code}'")
        print(f"  -> Bo'lim 2: ID={dept2.id}, Nomi='{dept2.name}', Kodi='{dept2.code}'")
        assert dept1.code == "section_1"
        assert dept2.code == "section_2"

        # 2. 1-Bo'lim o'quvchilari (1-fayl oktyabr oyi)
        students_dept1 = crud.get_students(db, department_id=dept1.id)
        assert len(students_dept1) == 38, f"1-Bo'limda 38 ta o'quvchi bo'lishi kerak edi, topildi: {len(students_dept1)}"
        groups_dept1 = crud.get_department_groups(db, dept1.id)
        print(f"  -> 1-Bo'lim o'quvchilar soni: {len(students_dept1)} nafar")
        print(f"  -> 1-Bo'lim dars vaqtlari: {groups_dept1}")
        assert set(groups_dept1) == {"08:30", "12:00", "14:00", "15:30"}

        # 3. 2-Bo'lim o'quvchilari (2-fayl oktyabr oyi)
        students_dept2 = crud.get_students(db, department_id=dept2.id)
        assert len(students_dept2) == 26, f"2-Bo'limda 26 ta o'quvchi bo'lishi kerak edi, topildi: {len(students_dept2)}"
        groups_dept2 = crud.get_department_groups(db, dept2.id)
        print(f"  -> 2-Bo'lim o'quvchilar soni: {len(students_dept2)} nafar")
        print(f"  -> 2-Bo'lim dars vaqtlari: {groups_dept2}")
        assert set(groups_dept2) == {"09:00", "13:00", "15:00"}

        print("  [OK] Ikkala fayl ma'lumotlari to'liq va alohida bo'limlarda, mutlaqo aralashmagan!")

        # 4. Ism va telefon raqamlarni tekshirish
        print("\n[TEST 2] Ism va telefon raqamlarning to'g'riligini tekshirish...")
        sample_s1 = students_dept1[0]
        assert sample_s1.full_name and sample_s1.phone, "O'quvchi ismi yoki telefoni bo'sh"
        print(f"  -> Namuna 1 (1-bo'lim): {sample_s1.full_name} | Tel: {sample_s1.phone} | Guruh: {sample_s1.group_time}")

        sample_s2 = students_dept2[0]
        assert sample_s2.full_name and sample_s2.phone, "O'quvchi ismi yoki telefoni bo'sh"
        print(f"  -> Namuna 2 (2-bo'lim): {sample_s2.full_name} | Tel: {sample_s2.phone} | Guruh: {sample_s2.group_time}")
        print("  [OK] O'quvchilarning ismi va telefonlari joyida!")

        # 5. Oylik to'lov tugmasi testi (Quick Toggle)
        print("\n[TEST 3] Oylik to'lov tugmasi (Quick Toggle) testi...")
        # Birinchi o'quvchini olamiz
        test_student = students_dept1[0]
        old_payment = crud.get_payment_by_student_and_month(db, test_student.id, "2026-10")
        initial_status = old_payment.is_paid if old_payment else False
        print(f"  -> {test_student.full_name} boshlang'ich to'lov holati: {initial_status}")

        # Tugmani bosish (quick_toggle)
        toggled = quick_toggle_student_payment(
            student_id=test_student.id,
            month="2026-10",
            is_taken_by_teacher=True,
            is_taken_by_admin=False,
            comment="Domlaga naqd berdi (test)",
            db=db,
        )
        print(f"  -> Tugma bosilgandan so'ng to'lov holati: {toggled.is_paid}")
        print(f"  -> Domla oldi: {toggled.is_taken_by_teacher}")
        print(f"  -> Admin oldi: {toggled.is_taken_by_admin}")
        print(f"  -> Izoh: '{toggled.comment}'")
        assert toggled.is_paid != initial_status
        assert toggled.is_taken_by_teacher is True
        assert toggled.comment == "Domlaga naqd berdi (test)"

        # 6. PATCH /payments/{id}/toggle testi (to'liq boshqarish)
        print("\n[TEST 4] To'lov holatini PATCH orqali o'zgartirish...")
        updated_payment = toggle_payment_status(
            payment_id=toggled.id,
            toggle_data=schemas.PaymentToggleStatus(
                is_paid=True,
                is_taken_by_teacher=False,
                is_taken_by_admin=True,
                comment="Admin hisob raqamiga o'tkazdi",
            ),
            db=db,
        )
        print(f"  -> Yangilangan to'lov: is_paid={updated_payment.is_paid}, is_taken_by_admin={updated_payment.is_taken_by_admin}, izoh='{updated_payment.comment}'")
        assert updated_payment.is_taken_by_admin is True
        assert updated_payment.is_taken_by_teacher is False
        assert updated_payment.comment == "Admin hisob raqamiga o'tkazdi"
        print("  [OK] To'lov tugmasi va maydonlar (izoh, domla oldi, admin oldi) a'lo darajada ishladi!")

        # 7. Oylik hisobot va statistika testi
        print("\n[TEST 5] Oylik hisobot (Summary) testi...")
        summary1 = get_payment_summary(month="2026-10", department_id=dept1.id, db=db)
        print(f"  -> 1-Bo'lim hisoboti:")
        print(f"     Jami o'quvchilar: {summary1.total_students}")
        print(f"     To'laganlar: {summary1.paid_count}")
        print(f"     Qarzdorlar: {summary1.unpaid_count}")
        print(f"     Admin olgan: {summary1.taken_by_admin_count}")
        print(f"     Domla olgan: {summary1.taken_by_teacher_count}")
        print(f"     Kutilgan summa: {summary1.total_expected_sum:,.0f} so'm")
        print(f"     Tushgan summa: {summary1.total_collected_sum:,.0f} so'm ({summary1.collection_percentage}%)")
        assert summary1.total_students == 38

        # 8. Qidiruv va filtrlash testi
        print("\n[TEST 6] O'quvchilarni guruh va qidiruv bo'yicha filtrlash...")
        filtered_by_group = crud.get_students(db, department_id=dept1.id, group_time="08:30")
        print(f"  -> 1-Bo'lim 08:30 guruhidagi o'quvchilar: {len(filtered_by_group)} ta")
        assert len(filtered_by_group) == 12

        search_result = crud.get_students(db, search="Omadbek")
        print(f"  -> 'Omadbek' bo'yicha qidiruv natijasi: {len(search_result)} ta ({search_result[0].full_name})")
        assert len(search_result) >= 1
        assert "Omadbek" in search_result[0].full_name

        print("\n" + "=" * 60)
        print(" BARCHA TESTLAR 100% MUVAFFAQIYATLI O'TDI! ")
        print("=" * 60)

    finally:
        db.close()


if __name__ == "__main__":
    run_all_tests()
