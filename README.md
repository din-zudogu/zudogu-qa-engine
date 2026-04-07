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

## Traceability

- `docs/TRACEABILITY_MATRIX.md` — Test Case ID → page/API → **spec file**
- `docs/SEED_DATA_STRATEGY.md` — BP-E2E seed/teardown (ไม่แตะแพลตฟอร์ม)

## Auth (storageState)

สร้างไฟล์ cookie session สำหรับ Playwright (แยก admin / tenant):

```bash
cp .env.example .env
# ตั้ง ADMIN_EMAIL, ADMIN_PASSWORD, TENANT_BASE_URL, TENANT_EMAIL, TENANT_PASSWORD
npm run auth:setup
```

ผลลัพธ์:

- `storage/adminStorageState.json` — Platform admin (เช่น Din) ล็อกอินที่ `BASE_URL/signin`
- `storage/tenantStorageState.json` — ร้านค้า ล็อกอินที่ `TENANT_BASE_URL/signin`

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

### CI

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
| `RUN_AUTH_BEFORE_TESTS` | No | `1` = รัน login ใน global-setup ก่อนเทสต์ |
| `SKIP_GLOBAL_AUTH` | No | `1` = ข้าม global-setup |

# zudogu-qa-engine
