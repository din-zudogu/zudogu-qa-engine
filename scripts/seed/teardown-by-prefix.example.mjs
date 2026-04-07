#!/usr/bin/env node
/**
 * Example: delete test products by SKU prefix from MongoDB.
 * NOT RUNNABLE until you add mongodb driver and MONGO_URI in QA env.
 *
 * Usage (when implemented):
 *   node scripts/seed/teardown-by-prefix.example.mjs --prefix QA_E2E_20260408_
 */
const prefix = process.argv.find((a) => a.startsWith("--prefix="))?.split("=")[1] || "QA_E2E_";

console.log(
  `[teardown] Stub only. Implement deleteMany on products/coupons/orders with prefix: ${prefix}`
);
process.exit(0);
