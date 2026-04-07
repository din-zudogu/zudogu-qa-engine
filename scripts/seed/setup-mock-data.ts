/**
 * Seed QA data via real platform APIs using Playwright cookie jars (storageState).
 *
 * Prerequisite: npm run auth:setup (admin, tenant, shopper storage files).
 *
 * Usage: npm run seed:mock
 */
import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import { chromium, type APIRequestContext } from "playwright";
import { buildSimpleProductMultipart, type ProductSeedSpec } from "./build-product-multipart";

const STORAGE_DIR = path.join(process.cwd(), "storage");
const ADMIN_STATE = path.join(STORAGE_DIR, "adminStorageState.json");
const TENANT_STATE = path.join(STORAGE_DIR, "tenantStorageState.json");
const SHOPPER_STATE = path.join(STORAGE_DIR, "shopperStorageState.json");
const MANIFEST = path.join(STORAGE_DIR, "e2e-seed-manifest.json");

function envUrl(key: string, fallback: string): string {
  const v = process.env[key]?.trim();
  return v && v.length > 0 ? v.replace(/\/$/, "") : fallback;
}

async function jsonPut(
  req: APIRequestContext,
  url: string,
  body: Record<string, unknown>
) {
  const res = await req.put(url, {
    data: body,
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok()) {
    const t = await res.text();
    throw new Error(`PUT ${url} -> ${res.status()} ${t}`);
  }
}

async function jsonPost(
  req: APIRequestContext,
  url: string,
  body: Record<string, unknown>
) {
  const res = await req.post(url, {
    data: body,
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok()) {
    const t = await res.text();
    throw new Error(`POST ${url} -> ${res.status()} ${t}`);
  }
  return res.json();
}

type MultipartJson = { success?: boolean; dup?: boolean; raw?: string };

async function multipartPost(
  req: APIRequestContext,
  url: string,
  fields: Record<string, string>
): Promise<MultipartJson> {
  const res = await req.post(url, { multipart: fields });
  const text = await res.text();
  if (!res.ok()) {
    throw new Error(`POST ${url} -> ${res.status()} ${text}`);
  }
  try {
    return JSON.parse(text) as MultipartJson;
  } catch {
    return { raw: text };
  }
}

async function ensureShopperAddress(
  shopperReq: APIRequestContext,
  tenantBase: string
) {
  const regRes = await shopperReq.get(`${tenantBase}/api/regions?active=true`);
  if (!regRes.ok()) {
    throw new Error(`GET regions failed: ${regRes.status()}`);
  }
  const regJson = (await regRes.json()) as {
    success?: boolean;
    regions?: Array<{
      regionCode: string;
      provinces: Array<{ provinceCode: string }>;
    }>;
  };
  const regions = regJson.regions || [];
  if (regions.length === 0 || !regions[0].provinces?.length) {
    console.warn(
      "[seed] No regions in DB — skip shopper address (checkout may need manual address)"
    );
    return;
  }
  const r0 = regions[0];
  const p0 = r0.provinces[0];
  const email = process.env.SHOPPER_EMAIL?.trim() || "shopper@example.com";
  await jsonPost(shopperReq, `${tenantBase}/api/profile/address`, {
    name: "QA E2E Shopper",
    email,
    phone: "0812345678",
    house: "123 QA Seed Street",
    city: "Bangkok",
    state: "Bangkok",
    zipCode: "10110",
    country: "Thailand",
    regionCode: r0.regionCode,
    provinceCode: p0.provinceCode,
    addressTitle: "QA E2E Main",
    addressType: "main address",
  });
  console.log("[seed] Shopper default address ensured");
}

async function main() {
  const baseUrl = envUrl("BASE_URL", "http://127.0.0.1:3000");
  const tenantBase = envUrl("TENANT_BASE_URL", baseUrl);

  for (const f of [ADMIN_STATE, TENANT_STATE, SHOPPER_STATE]) {
    if (!fs.existsSync(f)) {
      throw new Error(
        `Missing ${f}. Run: npm run auth:setup (with ADMIN_*, TENANT_*, SHOPPER_* in .env)`
      );
    }
  }

  fs.mkdirSync(STORAGE_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  try {
    const adminCtx = await browser.newContext({
      storageState: ADMIN_STATE,
    });
    const tenantCtx = await browser.newContext({
      storageState: TENANT_STATE,
    });
    const shopperCtx = await browser.newContext({
      storageState: SHOPPER_STATE,
    });

    const adminReq = adminCtx.request;
    const tenantReq = tenantCtx.request;
    const shopperReq = shopperCtx.request;

    console.log("[seed] Platform config (admin)…");
    await jsonPut(adminReq, `${baseUrl}/api/admin/platform-config`, {
      platformServiceFee: Number(process.env.E2E_PLATFORM_SERVICE_FEE ?? 35),
      platformServiceCost: Number(process.env.E2E_PLATFORM_SERVICE_COST ?? 20),
      baseShippingCost: Number(process.env.E2E_BASE_SHIPPING_COST ?? 50),
    });

    console.log("[seed] Tenant shipping config…");
    await jsonPut(tenantReq, `${tenantBase}/api/tenant/shipping-config`, {
      useFulfillment: false,
      customShippingRate: Number(process.env.E2E_CUSTOM_SHIPPING_RATE ?? 45),
      fulfillmentProvider: "NONE",
    });

    await ensureShopperAddress(shopperReq, tenantBase);

    console.log("[seed] Loading categories for product create…");
    const metaRes = await tenantReq.get(`${tenantBase}/api/product/create`);
    if (!metaRes.ok()) {
      throw new Error(`GET /api/product/create -> ${metaRes.status()}`);
    }
    const meta = (await metaRes.json()) as {
      success?: boolean;
      category?: Array<{
        slug: string;
        subCategories: Array<{ slug: string; child?: Array<{ slug: string }> }>;
      }>;
      brand?: Array<{ name: string }>;
    };
    const categories = meta.category || [];
    if (categories.length === 0) {
      throw new Error(
        "No categories in tenant — create at least one category in dashboard first"
      );
    }
    const cat = categories[0];
    const catSlug = cat.slug;
    const sub = cat.subCategories?.[0];
    const subSlug = sub?.slug || catSlug;
    const childSlug = sub?.child?.[0]?.slug || "";

    const brandName = meta.brand?.[0]?.name || "QA Brand";

    const products: ProductSeedSpec[] = [
      {
        name: "QA_E2E_Premium_Dog_Food_15kg",
        price: 1500,
        stock: 100,
        sku: "QA-E2E-DOG-SEED",
      },
      {
        name: "QA_E2E_Cat_Teaser_Wand",
        price: 150,
        stock: 50,
        sku: "QA-E2E-CAT-SEED",
      },
    ];

    const listRes = await tenantReq.get(`${tenantBase}/api/product`);
    if (!listRes.ok()) {
      throw new Error(`GET /api/product -> ${listRes.status()}`);
    }
    const listJson = (await listRes.json()) as {
      product?: Array<{ _id: string; name: string; slug: string; sku?: string }>;
    };
    let all = listJson.product || [];

    for (const spec of products) {
      const exists = all.some(
        (p) =>
          p.name?.includes(spec.name) ||
          (spec.sku && p.sku === spec.sku)
      );
      if (exists) {
        console.log(`[seed] Skip create (exists): ${spec.name}`);
        continue;
      }
      const fields = buildSimpleProductMultipart({
        spec,
        categorySlug: catSlug,
        subcategorySlug: subSlug,
        childSlug,
        brandName,
      });
      console.log(`[seed] Creating product: ${spec.name}…`);
      const created = await multipartPost(
        tenantReq,
        `${tenantBase}/api/product/create`,
        fields
      );
      if (!created?.success) {
        console.warn(`[seed] Product create response:`, created);
        throw new Error(`Product create failed for ${spec.name}`);
      }
    }

    const listRes2 = await tenantReq.get(`${tenantBase}/api/product`);
    if (!listRes2.ok()) {
      throw new Error(`GET /api/product -> ${listRes2.status()}`);
    }
    const listJson2 = (await listRes2.json()) as {
      product?: Array<{ _id: string; name: string; slug: string; sku?: string }>;
    };
    all = listJson2.product || [];

    const manifestProducts: Array<{
      key: string;
      name: string;
      slug: string;
      mongoId: string;
    }> = [];

    const dog = all.find((p) => p.name?.includes("QA_E2E_Premium_Dog_Food"));
    const catProduct = all.find((p) =>
      p.name?.includes("QA_E2E_Cat_Teaser_Wand")
    );
    if (dog) {
      manifestProducts.push({
        key: "product1",
        name: dog.name,
        slug: dog.slug,
        mongoId: dog._id,
      });
    }
    if (catProduct) {
      manifestProducts.push({
        key: "product2",
        name: catProduct.name,
        slug: catProduct.slug,
        mongoId: catProduct._id,
      });
    }

    const couponCode =
      process.env.E2E_COUPON_CODE?.trim() || "QA_E2E_DISCOUNT50";
    const today = new Date();
    const expire = new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000);
    const activeStr = today.toISOString().slice(0, 10);
    const expireStr = expire.toISOString().slice(0, 10);

    console.log(`[seed] Creating coupon ${couponCode}…`);
    const couponRes = await multipartPost(
      tenantReq,
      `${tenantBase}/api/coupons`,
      {
        name: `QA E2E ${couponCode}`,
        code: couponCode,
        discountType: "percentage",
        currency: "THB",
        amount: "50",
        active: activeStr,
        expire: expireStr,
      }
    );
    if (couponRes.dup) {
      console.warn("[seed] Coupon already exists — continuing");
    } else if (!couponRes.success) {
      throw new Error(`Coupon create failed: ${JSON.stringify(couponRes)}`);
    }

    const manifest = {
      generatedAt: new Date().toISOString(),
      baseUrl,
      tenantBaseUrl: tenantBase,
      couponCode,
      products: manifestProducts,
    };
    fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2), "utf8");
    console.log(`[seed] Wrote ${MANIFEST}`);
    console.log("[seed] Done.");
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
