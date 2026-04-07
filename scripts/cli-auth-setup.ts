import { runAuthSetup } from "./auth-setup";

runAuthSetup().catch((e) => {
  console.error(e);
  process.exit(1);
});
