# Seed scripts

- **`setup-mock-data.ts`** — `npm run seed:mock`  
  ใช้ **Playwright `APIRequestContext` + `storage/admin|tenant|shopper` state** (หลัง `npm run auth:setup`) เรียก API จริงของแพลตฟอร์ม: `PUT /api/admin/platform-config`, `PUT /api/tenant/shipping-config`, `POST /api/product/create` (multipart), `POST /api/coupons`, และสร้างที่อยู่ shopper ผ่าน `POST /api/profile/address` ถ้าจำเป็น  

  ผลลัพธ์: `storage/e2e-seed-manifest.json` (ถูก `.gitignore` อยู่แล้ว) — เก็บ `slug` จริงของสินค้า seed สำหรับ E2E

- **`build-product-multipart.ts`** — สร้างฟิลด์ multipart สำหรับ simple product ให้ตรง `pages/api/product/create.js`

- **`teardown-by-prefix.example.mjs`** — stub ลบข้อมูลตาม prefix (ต่อ Mongo ได้ภายหลัง)

## ลำดับที่แนะนำ (local)

1. รันแอป (`ecommerce_nextjs-main`) ที่ `BASE_URL` / `TENANT_BASE_URL`
2. `npm run auth:setup`
3. `npm run seed:mock`
4. `npx playwright test --project=e2e-journeys`
