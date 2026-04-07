/**
 * Optional: run before all tests when RUN_AUTH_BEFORE_TESTS=1.
 * Otherwise run `npm run auth:setup` manually after changing passwords.
 */
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

export default async function globalSetup(): Promise<void> {
  if (process.env.SKIP_GLOBAL_AUTH === "1") {
    console.log("[global-setup] SKIP_GLOBAL_AUTH=1");
    return;
  }
  if (process.env.RUN_AUTH_BEFORE_TESTS !== "1") {
    console.log(
      "[global-setup] Skipped (set RUN_AUTH_BEFORE_TESTS=1 to login here, or use npm run auth:setup)"
    );
    return;
  }
  const { runAuthSetup } = await import("./scripts/auth-setup");
  await runAuthSetup();
}
