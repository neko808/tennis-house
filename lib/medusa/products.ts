import { SAMPLE_PRODUCTS } from "@/lib/catalog/seed-data";
import type {
  Product,
  ProductFacets,
  ProductListParams,
  ProductListResult,
  ProductTag,
} from "@/types/medusa";

/**
 * Product fetch helpers. Phase 2 swaps the internals for Medusa Store API
 * calls (GET /store/products, GET /store/products?handle=...) — see client.ts.
 */

export function productMinPrice(product: Product): number {
  return Math.min(...product.variants.map((v) => v.price));
}

export function productCompareAt(product: Product): number | null {
  const withOriginal = product.variants.find((v) => v.original_price !== null);
  return withOriginal?.original_price ?? null;
}

export function productInStock(product: Product): boolean {
  return product.variants.some((v) => v.inventory_quantity > 0);
}

function sizeValues(product: Product): string[] {
  const opt = product.options.find((o) => o.title !== "Color");
  return opt?.values ?? [];
}

function colorValues(product: Product): string[] {
  const opt = product.options.find((o) => o.title === "Color");
  return opt?.values ?? [];
}

function matchesQuery(product: Product, q: string): boolean {
  const haystack = `${product.title} ${product.brand} ${product.category} ${product.description}`.toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

function buildFacets(products: Product[]): ProductFacets {
  const brands = new Set<string>();
  const sizes = new Set<string>();
  const colors = new Set<string>();
  let priceMin = Infinity;
  let priceMax = 0;
  for (const p of products) {
    brands.add(p.brand);
    sizeValues(p).forEach((s) => sizes.add(s));
    colorValues(p).forEach((c) => colors.add(c));
    const price = productMinPrice(p);
    priceMin = Math.min(priceMin, price);
    priceMax = Math.max(priceMax, price);
  }
  return {
    brands: [...brands].sort(),
    sizes: [...sizes],
    colors: [...colors].sort(),
    priceMin: priceMin === Infinity ? 0 : priceMin,
    priceMax,
  };
}

const sorters: Record<string, (a: Product, b: Product) => number> = {
  "price-asc": (a, b) => productMinPrice(a) - productMinPrice(b),
  "price-desc": (a, b) => productMinPrice(b) - productMinPrice(a),
  newest: (a, b) => b.created_at.localeCompare(a.created_at),
  featured: (a, b) =>
    Number(b.tags.includes("featured")) - Number(a.tags.includes("featured")),
};

export async function listProducts(params: ProductListParams = {}): Promise<ProductListResult> {
  let results = SAMPLE_PRODUCTS.slice();

  if (params.category) results = results.filter((p) => p.category === params.category);
  if (params.q) results = results.filter((p) => matchesQuery(p, params.q!));

  // Facets reflect the category/search scope so, e.g., the brand list only
  // shows brands present in the current results (§5.2).
  const facets = buildFacets(results);

  if (params.brands?.length) results = results.filter((p) => params.brands!.includes(p.brand));
  if (params.sizes?.length)
    results = results.filter((p) => sizeValues(p).some((s) => params.sizes!.includes(s)));
  if (params.colors?.length)
    results = results.filter((p) => colorValues(p).some((c) => params.colors!.includes(c)));
  if (params.minPrice !== undefined)
    results = results.filter((p) => productMinPrice(p) >= params.minPrice! * 100);
  if (params.maxPrice !== undefined)
    results = results.filter((p) => productMinPrice(p) <= params.maxPrice! * 100);
  if (params.inStock) results = results.filter(productInStock);
  if (params.tags?.length)
    results = results.filter((p) => params.tags!.some((t) => p.tags.includes(t)));

  results.sort(sorters[params.sort ?? "featured"]);

  const count = results.length;
  const offset = params.offset ?? 0;
  const limit = params.limit ?? count;
  return { products: results.slice(offset, offset + limit), count, facets };
}

export async function getProduct(handle: string): Promise<Product | null> {
  return SAMPLE_PRODUCTS.find((p) => p.handle === handle) ?? null;
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  return SAMPLE_PRODUCTS.filter((p) => p.tags.includes("featured")).slice(0, limit);
}

export async function getProductsByTag(tag: ProductTag, limit = 4): Promise<Product[]> {
  return SAMPLE_PRODUCTS.filter((p) => p.tags.includes(tag)).slice(0, limit);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const sameCategory = SAMPLE_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id,
  );
  const fill = SAMPLE_PRODUCTS.filter(
    (p) => p.category !== product.category && p.id !== product.id && p.tags.includes("featured"),
  );
  return [...sameCategory, ...fill].slice(0, limit);
}

/** Lightweight search used by the header overlay (§5.5). */
export async function searchProducts(q: string, limit = 8): Promise<Product[]> {
  if (!q.trim()) return [];
  return SAMPLE_PRODUCTS.filter((p) => matchesQuery(p, q)).slice(0, limit);
}
