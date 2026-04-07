# Traceability matrix — Test Case ID → Page / Endpoint → Spec file

แหล่งอ้างอิง: DivesSpace / ZUDOGU — ทดสอบ **black-box** ผ่าน `BASE_URL` / `TENANT_BASE_URL`  
ไฟล์ spec อยู่ใต้ `zudogu-qa-engine/tests/` (ไม่ใช่ในแพลตฟอร์ม)

**คีย์สถานะ:** `impl` = มีไฟล์ + เคสเริ่มต้น, `partial` = มีไฟล์แต่ต้องตั้งค่า env, `planned` = ยังไม่มีไฟล์ / ต้องเติม

| Test Case ID | Type | Primary page(s) | Primary API | Spec file | Status |
|--------------|------|-----------------|-------------|-----------|--------|
| BP-E2E-01 | E2E+ | `/`, `/product/*`, `/checkout` | `POST /api/order/new` | `tests/e2e/checkout-placeholder.spec.ts` | partial (skipped — ต้อง seed + ข้อมูล) |
| BP-E2E-02 | E2E+ | `/checkout` | `POST /api/order/coupon` | `tests/e2e/checkout-placeholder.spec.ts` | planned |
| BP-E2E-03 | E2E+ | `/dashboard/*` | `GET /api/dashboard/*` | `tests/ui/tenant/dashboard-smoke.spec.ts` | impl (ต้อง tenant storage) |
| BP-E2E-04 | E2E+ | `/admin/*` | `GET /api/admin/*` | `tests/ui/platform-admin/platform-config.spec.ts` | impl (ต้อง admin storage) |
| BP-E2E-05 | E2E+ | order / profile | `POST /api/return-request` | — | planned |
| BP-E2E-06 | E2E+ | partner pages | `GET /api/partners/marketplace` | — | planned |
| BP-E2E-07 | E2E+ | `/dashboard/billing*` | billing APIs | — | planned |
| BP-E2E-08 | E2E+ | storefront AI | `POST /api/storefront/ai-chat` | — | planned |
| BP-E2E-N01..E05 | E2E-/E2E~ | ตาม matrix เดิม | ตาม matrix | — | planned |
| UI-E2E-01 | UI+ | `/` | `GET /api/home/*` | `tests/ui/storefront-smoke.spec.ts` | impl |
| UI-E2E-02..05 | UI+ | checkout, settings | — | — | planned |
| UI-E2E-06 | UI+ | `/admin/platform-config` | `GET/PUT /api/admin/platform-config` | `tests/ui/platform-admin/platform-config.spec.ts` | impl |
| UI-E2E-07 | UI+ | `/admin/ai-packages` | admin ai-packages | — | planned |
| UI-E2E-08 | UI+ | responsive | — | — | planned |
| UI-E2E-N01..E04 | UI-/UI~ | — | — | — | planned |
| API-01 | API+ | — | `GET /api/home/index`, categories | `tests/api/home-public.spec.ts` | impl |
| API-02 | API+ | — | `GET /api/tenant/shipping-config` | `tests/api-tenant/api-02-shipping-config-mask.spec.ts` | impl (tenant auth) |
| API-03..10 | API+ | — | ตาม matrix เดิม | — | planned |
| API-N01 | API- | — | tenant unauth | `tests/api/tenant-shipping-unauth.spec.ts` | impl |
| API-N03 | API- | — | admin unauth | `tests/api/admin-platform-unauth.spec.ts` | impl |
| API-N02,N04..E06 | API-/API~ | — | — | — | planned |
| SEC-02 | SEC+ | — | `GET /api/tenant/shipping-config` | `tests/security/sec-02-shipping-mask.spec.ts` | impl (tenant auth; ซ้ำกับ API-02) |
| SEC-01,03..E04 | SEC+/SEC-/SEC~ | — | — | — | planned |

## Auth / storageState (ไม่ใช่ test case แต่เป็นพรีรีควิซิต)

| Artifact | สร้างโดย | ใช้ใน project |
|----------|-----------|----------------|
| `storage/adminStorageState.json` | `npm run auth:setup` (`ADMIN_*`) | `ui-platform-admin`, (optional) |
| `storage/tenantStorageState.json` | `npm run auth:setup` (`TENANT_*`) | `ui-tenant`, `api-tenant`, `security` |

## หมายเหตุ

- รายการ **planned** สามารถเพิ่มไฟล์ใหม่ใต้ `tests/api/`, `tests/e2e/`, `tests/ui/` โดยไม่แตะ repo แพลตฟอร์ม
- กลยุทธ์ seed/teardown: `docs/SEED_DATA_STRATEGY.md`
