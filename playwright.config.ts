import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

const envBase = process.env.BASE_URL?.trim();
const baseURL =
  envBase && envBase.length > 0 ? envBase : "http://127.0.0.1:3000";
const tenantEnv = process.env.TENANT_BASE_URL?.trim();
const tenantBaseURL =
  tenantEnv && tenantEnv.length > 0 ? tenantEnv : baseURL;
const storageDir = path.join(__dirname, "storage");
const adminStorageState = path.join(storageDir, "adminStorageState.json");
const tenantStorageState = path.join(storageDir, "tenantStorageState.json");

const adminStateOpt = fs.existsSync(adminStorageState)
  ? { storageState: adminStorageState }
  : {};
const tenantStateOpt = fs.existsSync(tenantStorageState)
  ? { storageState: tenantStorageState }
  : {};

export default defineConfig({
  testDir: "./tests",
  globalSetup: path.resolve(__dirname, "global-setup.ts"),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "api",
      testMatch: /api\/.*\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "api-tenant",
      testMatch: /api-tenant\/.*\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: tenantBaseURL,
        ...tenantStateOpt,
      },
    },
    {
      name: "ui",
      testMatch: /ui\/[^/]+\.spec\.ts$/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "ui-platform-admin",
      testMatch: /ui\/platform-admin\/.*\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], ...adminStateOpt },
    },
    {
      name: "ui-tenant",
      testMatch: /ui\/tenant\/.*\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: tenantBaseURL,
        ...tenantStateOpt,
      },
    },
    {
      name: "e2e",
      testMatch: /e2e\/.*\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: tenantBaseURL,
      },
    },
    {
      name: "security",
      testMatch: /security\/.*\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: tenantBaseURL,
        ...tenantStateOpt,
      },
    },
  ],
});
