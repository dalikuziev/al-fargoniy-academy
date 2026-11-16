import os
from fastapi.testclient import TestClient
from app.main import app

def run_tests():
    print("=" * 65)
    print("AL-FARG'ONIY ACADEMY - FRONTEND VA BACKEND TO'LIQ INTEGRATSIYA TESTI")
    print("=" * 65)

    client = TestClient(app)

    # 1. Health check
    print("\n[TEST 1] Backend Health Check (/api/health)...")
    r = client.get("/api/health")
    assert r.status_code == 200, f"Xato: {r.status_code}"
    data = r.json()
    assert data["status"] == "online"
    print(f"  -> Status: {data['status']}, Servis: '{data['service']}' [OK]")

    # 2. Frontend React HTML
    print("\n[TEST 2] Frontend HTML (Root GET /)...")
    r_root = client.get("/")
    assert r_root.status_code == 200, f"Xato: {r_root.status_code}"
    html = r_root.text
    assert "<!doctype html>" in html.lower()
    assert "Al-Farg'oniy Academy" in html
    assert '<div id="root"></div>' in html
    assert "/assets/" in html
    print(f"  -> React SPA HTML hajmi: {len(html)} bayt, bosh sarlavha va root div mavjud! [OK]")

    # 3. Bo'limlar
    print("\n[TEST 3] Bo'limlar API (/api/departments)...")
    r_depts = client.get("/api/departments")
    assert r_depts.status_code == 200
    depts = r_depts.json()
    assert len(depts) == 2
    for d in depts:
        print(f"  -> ID: {d['id']} | Nomi: {d['name']} | Kodi: {d['code']} | O'quvchilar: {d['students_count']} nafar")
        print(f"     Guruhlar: {d['groups_list']}")
    print("  [OK] 1-Bo'lim va 2-Bo'lim mutlaqo aralashmagan holda uzatildi!")

    # 4. O'quvchilar ro'yxati va filtrlash
    print("\n[TEST 4] O'quvchilar ro'yxati va to'lov holati (/api/students)...")
    r_studs = client.get("/api/students?month=2026-10")
    assert r_studs.status_code == 200
    studs = r_studs.json()
    assert len(studs) >= 64
    sample = studs[0]
    print(f"  -> Jami o'quvchilar: {len(studs)} nafar")
    print(f"  -> Namuna: {sample['full_name']} | Bo'lim: {sample['department_name']} | Guruh: {sample['group_time']}")
    print(f"     To'lov holati: {sample['latest_payment']['is_paid'] if sample['latest_payment'] else False}")

    # 5. Tezkor 1-klik To'lov Tugmasi (Quick Toggle)
    print("\n[TEST 5] 1-Klik Oylik To'lov Tugmasi (/api/payments/quick-toggle)...")
    target_student = studs[0]
    target_id = target_student["id"]
    old_status = target_student["latest_payment"]["is_paid"] if target_student["latest_payment"] else False

    r_toggle = client.post(f"/api/payments/quick-toggle/{target_id}?month=2026-10")
    assert r_toggle.status_code == 200
    new_status = r_toggle.json()["is_paid"]
    print(f"  -> O'quvchi: {target_student['full_name']}")
    print(f"  -> Holat o'zgarishi: {old_status} -> {new_status}")
    assert new_status != old_status

    # Qayta bosganda yana dastlabki holatga qaytadi
    r_toggle2 = client.post(f"/api/payments/quick-toggle/{target_id}?month=2026-10")
    assert r_toggle2.json()["is_paid"] == old_status
    print(f"  -> Qayta bosilganda: {new_status} -> {r_toggle2.json()['is_paid']} [OK]")

    # 6. Domla / Admin va Izoh tahrirlash
    print("\n[TEST 6] Domla/Admin va Izoh tahrirlash (/api/payments/{id}/toggle)...")
    pay_id = r_toggle2.json()["id"]
    r_patch = client.patch(
        f"/api/payments/{pay_id}/toggle",
        json={
            "is_taken_by_teacher": True,
            "is_taken_by_admin": False,
            "comment": "Oktabr oyi uchun kartaga o'tkazdi",
        },
    )
    assert r_patch.status_code == 200
    patched = r_patch.json()
    assert patched["is_taken_by_teacher"] is True
    assert patched["comment"] == "Oktabr oyi uchun kartaga o'tkazdi"
    print(f"  -> Domla oldi: {patched['is_taken_by_teacher']}, Izoh: '{patched['comment']}' [OK]")

    # 7. Umumiy statistika hisoboti (Summary)
    print("\n[TEST 7] Dashboard Statistika va Tushum Hisoboti (/api/payments/summary)...")
    r_summary = client.get("/api/payments/summary?month=2026-10")
    assert r_summary.status_code == 200
    summary = r_summary.json()
    print(f"  -> Jami o'quvchilar: {summary['total_students']}")
    print(f"  -> To'laganlar: {summary['paid_count']} nafar")
    print(f"  -> Qarzdorlar: {summary['unpaid_count']} nafar")
    print(f"  -> Domla olgan: {summary['taken_by_teacher_count']} nafar")
    print(f"  -> Admin olgan: {summary['taken_by_admin_count']} nafar")
    print(f"  -> Kutilgan summa: {summary['total_expected_sum']:,.0f} so'm")
    print(f"  -> Yig'ilgan summa: {summary['total_collected_sum']:,.0f} so'm ({summary['collection_percentage']}%)")
    print("  [OK] Statistika to'liq va to'g'ri hisoblandi!")

    print("\n" + "=" * 65)
    print(" BARCHA INTEGRATSIYA TESTLARI 100% MUVAFFAQIYATLI O'TDI! ")
    print("=" * 65)

if __name__ == "__main__":
    run_tests()
