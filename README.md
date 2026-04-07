# ZUDOGU QA Engine

Standalone **black-box** automated tests for the DivesSpace / ZUDOGU platform.  
**This folder is not part of the production application source tree** — keep it in a separate repo or sibling directory and do not add test code to `ecommerce_nextjs-main`.

## Prerequisites

- Node.js 18+
- A running build of the app (`npm run dev` / `npm run start`) or a deployed URL

## Setup

```bash
cd zudogu-qa-engine
cp .env.example .env
# Edit .env — set BASE_URL to your app (e.g. http://127.0.0.1:3000)
npm install
npx playwright install --with-deps
```

## Traceability & coverage

- `docs/TRACEABILITY_MATRIX.md` — Test Case ID → page/API → **spec file** (fill **planned** rows next)
- `docs/SEED_DATA_STRATEGY.md` — BP-E2E seed/teardown (ไม่แตะแพลตฟอร์ม); use **`E2E_*`** in `.env` when implementing

**Team:** agree which URL is **official QA/staging** and whether seed/teardown is **API**, **Mongo script**, or **fixed data** (document in your runbook; not in this repo).

## Auth (storageState)

สร้างไฟล์ cookie session สำหรับ Playwright (admin / tenant / shopper):

```bash
cp .env.example .env
# ตั้ง ADMIN_*, TENANT_BASE_URL + TENANT_*, SHOPPER_* (ลูกค้า ล็อกอินที่ TENANT_BASE_URL/signin)
npm run auth:setup
```

ผลลัพธ์:

- `storage/adminStorageState.json` — Platform admin ล็อกอินที่ `BASE_URL/signin`
- `storage/tenantStorageState.json` — เจ้าของร้าน ล็อกอินที่ `TENANT_BASE_URL/signin`
- `storage/shopperStorageState.json` — ลูกค้า ล็อกอินที่ `TENANT_BASE_URL/signin`

### Seed mock data (local E2E)

หลังแอปรันอยู่และมีหมวดหมู่/แบรนด์ใน tenant แล้ว:

```bash
npm run seed:mock
```

สคริปต์ใช้ **Playwright + storageState** (ไม่ใช้ Bearer แยก) เรียก API จริง: platform config, tenant shipping,สินค้า 2 รายการ, คูปอง, ที่อยู่ shopper (ถ้ายังไม่มี) แล้วเขียน `storage/e2e-seed-manifest.json` (gitignored)

### Full journey tests (checkout + return)

```bash
npx playwright test --project=e2e-journeys
```

ถ้าต้องการให้ `playwright test` รันล็อกอินก่อนทุกครั้ง (ช้า): ตั้ง `RUN_AUTH_BEFORE_TESTS=1` ใน `.env`

## Run tests

```bash
npm run test              # all suites
npm run test:api          # tests/api only
npm run test:api-tenant   # tests/api-tenant (ต้องมี tenant storage)
npm run test:ui           # tests/ui only (ไม่รวม nested ui/platform-admin|tenant — ดู playwright.config)
npm run test:e2e          # tests/e2e only
npm run test:security     # tests/security only
npm run report            # open last HTML report (after a run)
```

### CI (GitHub Actions)

Workflow: `.github/workflows/ci.yml` — runs `npm ci`, Playwright install, `npm run test -- --list`, then `api` + `ui` projects.

In the repo **Settings → Secrets and variables → Actions**, add:

- **`BASE_URL`** — staging QA URL (same URL the team agrees is for QA; never commit secrets).

Optional: extend the workflow later with more secrets for `auth:setup` in CI if you need authenticated projects.

### Local CI-like run

```bash
CI=1 npm test
```

## Authenticated flows

1. Log in manually once (or use a helper script in this repo only) and save storage:

   ```bash
   npx playwright codegen http://127.0.0.1:3000
   ```

2. Export storage state to `storage/tenant.json` (gitignored), then:

   ```env
   TENANT_STORAGE_STATE=storage/tenant.json
   ```

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `BASE_URL` | Yes | Origin หลัก (main domain) เช่น `http://127.0.0.1:3000` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | For `auth:setup` | บัญชี platform admin |
| `TENANT_BASE_URL` | For tenant auth | ต้นทางร้าน เช่น `http://shop.localhost:3000` |
| `TENANT_EMAIL` / `TENANT_PASSWORD` | For `auth:setup` | บัญชีเจ้าของร้าน |
| `SHOPPER_EMAIL` / `SHOPPER_PASSWORD` | For `auth:setup` + `e2e-journeys` | บัญชีลูกค้า (โฮสต์เดียวกับร้าน) |
| `RUN_AUTH_BEFORE_TESTS` | No | `1` = รัน login ใน global-setup ก่อนเทสต์ |
| `SKIP_GLOBAL_AUTH` | No | `1` = ข้าม global-setup |
| `E2E_PRODUCT_1_SLUG` / `E2E_PRODUCT_2_SLUG` | No | ค่าอ้างอิง slug (ชื่อจริงใน URL มี suffix สุ่มจากแพลตฟอร์ม — ใช้ค่าจาก `e2e-seed-manifest.json` เวลารัน E2E) |
| `E2E_COUPON_CODE` | No | รหัสคูปอง seed + เทสต์ positive ใน `api-tenant-coupon` |

โปรเจกต์ `api-tenant`, `ui-tenant`, `security`, `e2e`, `e2e-journeys` ใช้ **`TENANT_BASE_URL`** เป็น `baseURL` (ถ้าไม่ตั้งจะใช้ `BASE_URL` แทน) เพื่อให้คุกกี้ session ตรงกับโฮสต์ร้าน
