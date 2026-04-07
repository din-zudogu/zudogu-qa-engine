/**
 * Multipart field map for POST /api/product/create (formidable + parseFormMultiple).
 * Matches pages/api/product/create.js (simple product).
 */
export type ProductSeedSpec = {
  name: string;
  /** Target list price */
  price: number;
  /** Cost for P&L (stored as costPrice on product if supported by pipeline) */
  cost?: number;
  stock: number;
  sku: string;
  unit?: string;
  unitVal?: string;
};

const PLACEHOLDER_IMG = JSON.stringify([
  { name: "qa-seed-main.png", url: "/uploads/divesspace-logo.png" },
]);
const PLACEHOLDER_GALLERY = JSON.stringify([
  { name: "qa-seed-g1.png", url: "/uploads/divesspace-logo.png" },
]);

export function buildSimpleProductMultipart(params: {
  spec: ProductSeedSpec;
  categorySlug: string;
  subcategorySlug: string;
  childSlug: string;
  brandName: string;
}): Record<string, string> {
  const { spec, categorySlug, subcategorySlug, childSlug, brandName } =
    params;
  const seo = JSON.stringify({
    title: spec.name,
    description: "QA E2E seed product",
    image: [],
  });
  const shippingData = JSON.stringify({
    weight: { value: 1, unit: "kg" },
    dimensions: { length: 10, width: 10, height: 10, unit: "cm" },
    category: "standard",
  });
  const shippingFlags = JSON.stringify({
    isFragile: false,
    isFreshFood: false,
    isNonRefundable: false,
  });

  return {
    name: spec.name,
    unit: spec.unit ?? "kg",
    unit_val: spec.unitVal ?? "1",
    main_price: String(spec.price),
    sale_price: "0",
    description: "<p>QA E2E seed</p>",
    short_description: "QA E2E seed product",
    type: "simple",
    category: JSON.stringify([categorySlug]),
    subcategory: JSON.stringify([subcategorySlug]),
    childCategory: JSON.stringify([childSlug]),
    brand: brandName,
    qty: String(spec.stock),
    sku: spec.sku,
    trending: "",
    new_product: "",
    best_selling: "",
    displayImage: PLACEHOLDER_IMG,
    galleryImages: PLACEHOLDER_GALLERY,
    color: "[]",
    attribute: "[]",
    variant: "[]",
    selectedAttribute: "",
    seo,
    vat: "0",
    tax: "0",
    shippingData,
    shippingFlags,
  };
}
