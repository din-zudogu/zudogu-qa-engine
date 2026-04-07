# Seed helpers (optional extensions)

โฟลเดอร์นี้เก็บ **แนวทางและ stub** สำหรับ seed/teardown โดยไม่แตะแพลตฟอร์ม

- **ไม่ติดตั้ง `mongoose` ใน QA engine โดย default** — ถ้าต้องการ script ตรง MongoDB ให้เพิ่ม dependency ใน `zudogu-qa-engine/package.json` แยกต่างหากและรันเฉพาะเครื่องที่มีสิทธิ์เข้า DB

## ตัวแปรที่แนะนำ (`.env`)

| Variable | คำอธิบาย |
|----------|-----------|
| `E2E_PRODUCT_SLUG` | slug สินค้าสำหรับทดสอบบน staging |
| `E2E_COUPON_CODE` | รหัสคูปอง (ถ้ามี) |
| `E2E_RUN_ID` | id รอบทดสอบ สำหรับ prefix ข้อมูลที่สร้าง |

## ไฟล์

- `teardown-by-prefix.example.mjs` — ตัวอย่างรูปแบบลบ (ไม่รันได้จนกว่าจะต่อ MongoDB driver)
