import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { request } from "playwright";
import { loadSeedManifest } from "../../../utils/seed-manifest";

/**
 * BP-E2E-01 full checkout (COD) + BP-E2E-N04/05 return with evidence (API).
 * Requires: npm run auth:setup, npm run seed:mock, running app.
 */
const shopperState = path.join(process.cwd(), "storage", "shopperStorageState.json");
const tenantState = path.join(process.cwd(), "storage", "tenantStorageState.json");

test.describe("Shopper checkout → return journey", () => {
  test.describe.configure({ mode: "serial" });
  let tenantBase = "";
  let tenantApi: Awaited<ReturnType<typeof request.newContext>> | undefined;
  let orderMongoId = "";
  let lineProductId = "";

  test.beforeAll(async () => {
    if (!fs.existsSync(shopperState)) {
      throw new Error("Missing storage/shopperStorageState.json — run npm run auth:setup");
    }
    if (!fs.existsSync(tenantState)) {
      throw new Error("Missing storage/tenantStorageState.json — run npm run auth:setup");
    }
    const m = loadSeedManifest();
    if (!m) {
      throw new Error("Missing storage/e2e-seed-manifest.json — run npm run seed:mock");
    }
    tenantBase =
      process.env.TENANT_BASE_URL?.replace(/\/$/, "") || m.tenantBaseUrl;

    tenantApi = await request.newContext({
      baseURL: tenantBase,
      storageState: tenantState,
    });
  });

  test.afterAll(async () => {
    await tenantApi?.dispose();
  });

  test("BP-E2E-01: add seeded product, checkout with COD, capture order", async ({
    page,
  }) => {
    test.setTimeout(180_000);
    const manifest = loadSeedManifest()!;
    const p1 = manifest.products.find((x) => x.key === "product1");
    test.skip(!p1?.slug, "manifest missing product1 slug");

    await page.goto(`/product/${p1!.slug}`, { waitUntil: "load" });
    await page.locator("button.cart_button").first().click({ timeout: 30_000 });

    await page.goto("/checkout", { waitUntil: "domcontentloaded" });
    await page.locator(".overlay").waitFor({ state: "hidden", timeout: 15_000 }).catch(() => {});

    const billingRadio = page.locator('input[name="billing_address"]').first();
    if (await billingRadio.isVisible().catch(() => false)) {
      await billingRadio.click();
    }

    const responsePromise = page.waitForResponse(
      (r) =>
        r.url().includes("/api/order/new") &&
        r.request().method() === "POST" &&
        r.ok(),
      { timeout: 120_000 }
    );

    await page.locator(".checkout_form button[type='submit']").first().click();

    await page.waitForSelector('input[name="payment_method"]', {
      timeout: 60_000,
    });
    await page.locator('input[name="payment_method"][value="cod"]').check();

    await page.getByRole("button", { name: /complete order/i }).click();

    const res = await responsePromise;
    const json = (await res.json()) as {
      success?: boolean;
      createdOrder?: {
        _id: string;
        products?: Array<{ _id: string }>;
      };
    };
    expect(json.success).toBeTruthy();
    expect(json.createdOrder?._id).toBeTruthy();
    orderMongoId = String(json.createdOrder!._id);
    const line = json.createdOrder!.products?.[0] as { _id?: string } | undefined;
    lineProductId = String(line?._id || "");
    expect(lineProductId.length).toBeGreaterThan(5);
  });

  test("BP-E2E-N: return blocked while order is Pending", async ({ page }) => {
    test.skip(!orderMongoId || !lineProductId);
    const res = await page.request.post("/api/return-request", {
      data: {
        orderMongoId,
        lineProductId,
        reasonType: "DEFECTIVE",
        evidence: {
          productImageKey: "qa-e2e-dummy",
          shippingLabelKey: "qa-e2e-dummy",
          unboxingVideoLink: "https://example.com/qa-e2e-video",
        },
      },
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(String(body.message || "")).toMatch(/delivered/i);
  });

  test("Tenant marks order Delivered", async () => {
    test.skip(!orderMongoId);
    const res = await tenantApi!.put(
      `/api/order/${orderMongoId}?order_status=Delivered&payment_status=Unpaid`
    );
    expect(res.ok()).toBeTruthy();
  });

  test("BP-E2E-N04/05: submit return request with evidence keys + video link", async ({
    page,
  }) => {
    test.skip(!orderMongoId || !lineProductId);
    const res = await page.request.post("/api/return-request", {
      data: {
        orderMongoId,
        lineProductId,
        reasonType: "DEFECTIVE",
        evidence: {
          productImageKey: "qa-e2e-evidence-product-img",
          shippingLabelKey: "qa-e2e-evidence-shipping-label",
          unboxingVideoLink: "https://example.com/qa-e2e-unboxing-proof",
        },
      },
      headers: { "Content-Type": "application/json" },
    });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.success).toBe(true);
  });
});
