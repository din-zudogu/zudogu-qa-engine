import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const adminState = path.join(process.cwd(), "storage", "adminStorageState.json");

/**
 * Traceability: UI-E2E-06
 */
test.describe("UI-E2E-06 admin platform-config page", () => {
  test.beforeEach(() => {
    if (!fs.existsSync(adminState)) {
      test.skip(true, "Run npm run auth:setup with ADMIN_* credentials");
    }
  });

  test("loads /admin/platform-config", async ({ page }) => {
    const res = await page.goto("/admin/platform-config");
    expect(res?.ok()).toBeTruthy();
    await expect(page.locator("body")).toBeVisible();
  });
});
