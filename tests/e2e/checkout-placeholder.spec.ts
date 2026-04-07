import { test } from "@playwright/test";

/**
 * Traceability: BP-E2E-01 — full flow requires test data + credentials.
 * Mark skipped until STORAGE_STATE / seed data is configured in CI.
 */
test.describe("BP-E2E-01 full checkout", () => {
  test.skip(true, "Configure tenant URL, products, and auth; then implement full flow.");
});
