import * as fs from "fs";
import * as path from "path";

export type SeedManifestProduct = {
  key: string;
  name: string;
  slug: string;
  mongoId: string;
};

export type SeedManifest = {
  generatedAt: string;
  baseUrl: string;
  tenantBaseUrl: string;
  couponCode: string;
  products: SeedManifestProduct[];
};

export function loadSeedManifest(): SeedManifest | null {
  const p = path.join(process.cwd(), "storage", "e2e-seed-manifest.json");
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, "utf8")) as SeedManifest;
}
