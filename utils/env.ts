/**
 * Read env for black-box tests. Platform source is never imported here.
 */
export function getBaseURL(): string {
  const u = process.env.BASE_URL;
  if (!u) throw new Error("BASE_URL is required (see .env.example)");
  return u.replace(/\/$/, "");
}

export function getTenantBaseURL(): string | null {
  const h = process.env.TENANT_HOST;
  if (!h) return null;
  const protocol = h.startsWith("http") ? "" : "http://";
  return `${protocol}${h}`.replace(/\/$/, "");
}
