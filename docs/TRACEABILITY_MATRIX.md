# Traceability matrix — Test Case ID → Page / Endpoint → Spec file

แหล่งอ้างอิง: DivesSpace / ZUDOGU — ทดสอบ **black-box** ผ่าน `BASE_URL` / `TENANT_BASE_URL`  
ไฟล์ spec อยู่ใต้ `zudogu-qa-engine/tests/` (ไม่ใช่ในแพลตฟอร์ม)

**คีย์สถานะ:** `impl` = มีไฟล์ + เคสหลัก, `partial` = ต้องตั้ง env / seed, `planned` = ยังไม่ครอบคลุมทั้งหมด

| Test Case ID | Type | Primary page(s) | Primary API | Spec file | Status |
|--------------|------|-----------------|-------------|-----------|--------|
| BP-E2E-01 | E2E+ | `/product/*`, `/checkout` | — | `tests/e2e/bp-e2e-scenarios.spec.ts` | partial (`E2E_PRODUCT_SLUG`, `TENANT_BASE_URL`) |
| BP-E2E-02 | E2E+ / API+ | `/checkout` | `POST /api/order/coupon` | `tests/api-tenant/api-tenant-coupon.spec.ts` | impl (+ optional `E2E_COUPON_CODE`) |
| BP-E2E-03 | E2E+ / API+ | `/dashboard/*` | `GET /api/dashboard/sales` | `tests/api-tenant/api-tenant-dashboard.spec.ts`, `tests/ui/tenant/dashboard-smoke.spec.ts` | impl (tenant storage) |
| BP-E2E-04 | E2E+ | `/admin/*` | `GET /api/admin/*` | `tests/ui/platform-admin/platform-config.spec.ts` | impl (admin storage) |
| BP-E2E-05 | API- | return flow | `POST /api/return-request` | `tests/api/api-return-request-unauth.spec.ts` | impl (negative unauth) |
| BP-E2E-06 | API+ / UI+ | `/partner-services` | `GET /api/partners/marketplace` | `tests/api/api-partners-marketplace.spec.ts`, `tests/ui/partner-services-smoke.spec.ts` | impl |
| BP-E2E-07 | API- | billing | `GET /api/platform/billing-invoices` | `tests/api/api-platform-billing-unauth.spec.ts`, `tests/api-tenant/api-tenant-platform-billing-forbidden.spec.ts` | impl |
| BP-E2E-08 | API+ | storefront AI | `POST /api/storefront/ai-chat` | `tests/api/api-storefront-ai-negative.spec.ts`, `tests/api-tenant/api-tenant-storefront-ai.spec.ts` | impl (negative + body validation) |
| BP-E2E-N01..E05 | E2E-/E2E~ | — | — | — | planned (deep edge flows) |
| UI-E2E-01 | UI+ | `/` | `GET /api/home/*` | `tests/ui/storefront-smoke.spec.ts` | impl |
| UI-E2E-02..05 | UI+ | checkout, settings | — | — | planned |
| UI-E2E-06 | UI+ | `/admin/platform-config` | `GET/PUT /api/admin/platform-config` | `tests/ui/platform-admin/platform-config.spec.ts` | impl |
| UI-E2E-07 | API- | — | `GET/POST /api/admin/ai-packages` | `tests/api/api-admin-ai-packages-unauth.spec.ts` | impl (unauth negative) |
| UI-E2E-08 | UI+ | responsive | — | `tests/ui/ui-responsive-viewport.spec.ts` | impl (smoke) |
| UI-E2E-N01..E04 | UI-/UI~ | — | — | — | planned |
| API-01 | API+ | — | `GET /api/home/index`, categories | `tests/api/home-public.spec.ts` | impl |
| API-02 | API+ | — | `GET /api/tenant/shipping-config` | `tests/api-tenant/api-02-shipping-config-mask.spec.ts` | impl (tenant auth) |
| API-03..10 | API+ | — | — | — | partial / planned |
| API-N01 | API- | — | tenant unauth | `tests/api/tenant-shipping-unauth.spec.ts` | impl |
| API-N02 | API- | — | wrong method home | `tests/api/api-home-negative.spec.ts` | impl |
| API-N03 | API- | — | admin unauth | `tests/api/admin-platform-unauth.spec.ts` | impl |
| API-N04 | API- | — | return unauth | `tests/api/api-return-request-unauth.spec.ts` | impl |
| API-N05 | API- | — | admin ai-packages unauth | `tests/api/api-admin-ai-packages-unauth.spec.ts` | impl |
| API-N06 | API- | — | dashboard unauth (tenant host) | `tests/api/api-dashboard-unauth-tenant-host.spec.ts` | impl (`TENANT_BASE_URL`) |
| API~ | API~ | — | coupon GET-only | `tests/api/api-order-coupon-get-method.spec.ts` | impl |
| SEC-01 | SEC+ | — | partners listing | `tests/security/sec-partners-public.spec.ts` | impl |
| SEC-02 | SEC+ | — | `GET /api/tenant/shipping-config` | `tests/security/sec-02-shipping-mask.spec.ts` | impl (tenant auth) |
| SEC-03..E04 | SEC+/SEC-/SEC~ | — | — | — | planned |

## Auth / storageState (ไม่ใช่ test case แต่เป็นพรีรีควิซิต)

| Artifact | สร้างโดย | ใช้ใน project |
|----------|-----------|---------------|
| `storage/adminStorageState.json` | `npm run auth:setup` (`ADMIN_*`) | `ui-platform-admin` |
| `storage/tenantStorageState.json` | `npm run auth:setup` (`TENANT_*`) | `ui-tenant`, `api-tenant`, `security` |

`playwright.config.ts` ใช้ **`TENANT_BASE_URL`** เป็น `baseURL` ของโปรเจกต์ `api-tenant`, `ui-tenant`, `security`, `e2e` (ถ้าไม่ตั้งจะ fallback เป็น `BASE_URL`)

## หมายเหตุ

- รายการ **planned** สามารถเพิ่มไฟล์ใหม่ใต้ `tests/api/`, `tests/e2e/`, `tests/ui/` โดยไม่แตะ repo แพลตฟอร์ม
- กลยุทธ์ seed/teardown: `docs/SEED_DATA_STRATEGY.md`
