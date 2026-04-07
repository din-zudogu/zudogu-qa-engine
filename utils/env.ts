/**
 * Read env for black-box tests. Platform source is never imported here.
 */
export function getBaseURL(): string {
  const u = process.env.BASE_URL;
  if (!u) throw new Error("BASE_URL is required (see .env.example)");
  return u.replace(/\/$/, "");
}

/** Tenant storefront origin (subdomain). Prefer TENANT_BASE_URL; TENANT_HOST is legacy. */
export function getTenantBaseURL(): string | null {
  const raw =
    process.env.TENANT_BASE_URL?.trim() || process.env.TENANT_HOST?.trim();
  if (!raw) return null;
  if (raw.startsWith("http")) return raw.replace(/\/$/, "");
  return `http://${raw}`.replace(/\/$/, "");
}

export function hasE2EProductSeed(): boolean {
  return Boolean(process.env.E2E_PRODUCT_SLUG?.trim());
}
