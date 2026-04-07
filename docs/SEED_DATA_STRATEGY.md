# Seed / teardown strategy for BP-E2E (black-box, no code in platform repo)

เป้าหมาย: สร้างข้อมูลทดสอบ (สินค้า, คูปอง, order ฯลฯ) **ก่อน** รัน UI E2E และ **ล้าง** หลังจบเพื่อลด pollution

## หลักการ

1. **ไม่เพิ่มสคริปต์ seed ใน `ecommerce_nextjs-main`** — โค้ด seed อยู่ใน `zudogu-qa-engine` หรือ job CI แยก
2. **ควรใช้ชุดข้อมูลบน staging / dedicated QA database** — ไม่รันทำลายข้อมูล production โดยไม่ตั้งใจ
3. **Naming convention:** ใช้ prefix สำหรับ entity ที่สร้าง (เช่น `QA_E2E_<runId>_` ใน SKU / ชื่อสินค้า) เพื่อค้นหาและลบได้

## ทางเลือก A — API-only (แนะนำถ้าทำได้)

- ใช้ **cookie session** จาก `storage/tenantStorageState.json` (หลัง `npm run auth:setup`) เรียก API ที่มีอยู่แล้ว
- **ข้อจำกัด:** หลาย endpoint ของแพลตฟอร์มใช้ **multipart/form-data** (เช่น `POST /api/product/create`) ต้องยิงด้วย `multipart` หรือใช้ Playwright `request` + `FormData` ไม่ใช่ JSON ธรรมดา
- **คูปอง / order:** ต้องอ่าน payload จริงจาก network tab หรือจากเอกสาร API ต่อกรณี

ขั้นตอนคร่าวๆ:

1. `npm run auth:setup` ให้ได้ `tenantStorageState.json`
2. รัน `scripts/seed/teardown-by-prefix.mjs` (ต่อยอด) — ลบตาม prefix ของรอบนั้น
3. รัน `npm run test:e2e`

## ทางเลือก B — MongoDB script ภายนอก (ทีม DevOps)

- รันสคริปต์ **แยก repo** ที่เชื่อม `MONGO_URI` ของ **staging** เท่านั้น
- insert product/coupon/order ด้วย schema ตรงกับ Mongoose models
- teardown: `deleteMany({ sku: /^QA_E2E_/ })` ฯลฯ

**ความเสี่ยง:** ต้องอัปเดตสคริปต์เมื่อ schema เปลี่ยน

## ทางเลือก C — ใช้ข้อมูลคงที่ใน staging

- สร้างสินค้า/คูปองคู่เดียวบน staging ด้วยมือ **ครั้งเดียว**
- E2E อ่านเฉพาะ **ID/slug จาก `.env`** (ไม่ seed ทุกรัน)
- teardown: ไม่ลบ — ยอมรับว่า data คงอยู่ (เหมาะกับ smoke เล็ก)

## Teardown / anti-pollution

- เก็บ `RUN_ID` (timestamp + random) ต่อ pipeline
- หลังรัน E2E: เรียกลบเฉพาะเอกสารที่มี `tag: runId` หรือ `sku` prefix match
- ถ้าใช้ order จริง: พิจารณา **cancel/refund** ตาม flow ที่มีในระบบ (ถ้ามี API)

## สคริปต์ตัวอย่างในโฟลเดอร์นี้

- `scripts/seed/README.md` — ขั้นตอนและตัวแปร environment
- `scripts/seed/teardown-by-prefix.example.mjs` — stub สำหรับต่อยอด (ไม่มี Mongo driver ใน engine โดย default)

## คำแนะนำสำหรับ BP-E2E ที่ยัง skipped

1. กำหนด **staging URL** + **บัญชี tenant** ที่มีสินค้าอย่างน้อย 1 รายการ
2. ใส่ slug หรือ product id ใน `.env` ของ QA engine (`E2E_PRODUCT_SLUG`, `E2E_COUPON_CODE`)
3. เปิดเทสต์ใน `tests/e2e/*.spec.ts` ให้ `goto` ไป product → cart → checkout ตามข้อมูลจริง
