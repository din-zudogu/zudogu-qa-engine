/**
 * Saves Playwright storageState files for Platform Admin, Tenant Store Owner, and Shopper (customer).
 * Uses the same /signin form as production: input[name=username], input[name=password].
 *
 * Run: npm run auth:setup
 * Requires .env — see .env.example
 */
import { chromium, type Browser } from "playwright";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const STORAGE_DIR = path.join(process.cwd(), "storage");
const ADMIN_FILE = path.join(STORAGE_DIR, "adminStorageState.json");
const TENANT_FILE = path.join(STORAGE_DIR, "tenantStorageState.json");
const SHOPPER_FILE = path.join(STORAGE_DIR, "shopperStorageState.json");

function joinUrl(base: string, p: string): string {
  return `${base.replace(/\/$/, "")}${p.startsWith("/") ? p : `/${p}`}`;
}

async function signInAndSave(
  browser: Browser,
  signinUrl: string,
  email: string,
  password: string,
  outFile: string,
  label: string
): Promise<void> {
  const context = await browser.newContext();
  const page = await context.newPage();
  console.log(`[auth-setup] ${label}: navigating to ${signinUrl}`);
  await page.goto(signinUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.locator('input[name="username"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  const submitSignin = page
    .locator("form")
    .filter({ has: page.locator('input[name="username"]') })
    .locator('button[type="submit"]')
    .first();
  await Promise.all([
    page.waitForURL(/\/dashboard|\/signin/, { timeout: 90_000 }).catch(() => null),
    submitSignin.click(),
  ]);
  await page.waitForLoadState("networkidle", { timeout: 60_000 }).catch(() => {});
  const url = page.url();
  if (url.includes("/signin")) {
    await context.close();
    throw new Error(
      `[auth-setup] ${label}: still on /signin after login — check credentials / tenant host / email verification`
    );
  }
  await context.storageState({ path: outFile });
  await context.close();
  console.log(`[auth-setup] ${label}: saved ${outFile}`);
}

export async function runAuthSetup(): Promise<void> {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });

  const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";
  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  const adminPassword = process.env.ADMIN_PASSWORD;
  const tenantBase = process.env.TENANT_BASE_URL?.trim();
  const tenantEmail = process.env.TENANT_EMAIL?.trim();
  const tenantPassword = process.env.TENANT_PASSWORD;
  const shopperEmail = process.env.SHOPPER_EMAIL?.trim();
  const shopperPassword = process.env.SHOPPER_PASSWORD;

  const browser = await chromium.launch({ headless: process.env.HEADED !== "1" });

  try {
    if (adminEmail && adminPassword) {
      await signInAndSave(
        browser,
        joinUrl(baseUrl, "/signin"),
        adminEmail,
        adminPassword,
        ADMIN_FILE,
        "Platform admin"
      );
    } else {
      console.warn("[auth-setup] Skip admin: set ADMIN_EMAIL and ADMIN_PASSWORD");
    }

    if (tenantBase && tenantEmail && tenantPassword) {
      await signInAndSave(
        browser,
        joinUrl(tenantBase, "/signin"),
        tenantEmail,
        tenantPassword,
        TENANT_FILE,
        "Tenant store"
      );
    } else {
      console.warn(
        "[auth-setup] Skip tenant: set TENANT_BASE_URL, TENANT_EMAIL, TENANT_PASSWORD (e.g. http://yourstore.localhost:3000)"
      );
    }

    if (tenantBase && shopperEmail && shopperPassword) {
      await signInAndSave(
        browser,
        joinUrl(tenantBase, "/signin"),
        shopperEmail,
        shopperPassword,
        SHOPPER_FILE,
        "Shopper (customer)"
      );
    } else {
      console.warn(
        "[auth-setup] Skip shopper: set TENANT_BASE_URL, SHOPPER_EMAIL, SHOPPER_PASSWORD"
      );
    }
  } finally {
    await browser.close();
  }
}
