import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const tenantState = path.join(process.cwd(), "storage", "tenantStorageState.json");

/**
 * Traceability: BP-E2E-03 / UI tenant smoke
 */
test.describe("Tenant dashboard smoke", () => {
  test.beforeEach(() => {
    if (!fs.existsSync(tenantState)) {
      test.skip(true, "Run npm run auth:setup with TENANT_* credentials");
    }
  });

  test("loads /dashboard", async ({ page }) => {
    const res = await page.goto("/dashboard");
    expect(res?.ok()).toBeTruthy();
    await expect(page.locator("body")).toBeVisible();
  });
});
