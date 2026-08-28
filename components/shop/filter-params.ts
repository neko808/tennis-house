import type { ProductListParams, ProductTag, SortOption } from "@/types/medusa";
import { isCategoryHandle } from "@/lib/medusa/categories";

export const PAGE_SIZE = 8;

const SORT_OPTIONS: SortOption[] = ["featured", "price-asc", "price-desc", "newest"];
const TAG_OPTIONS: ProductTag[] = ["new", "featured", "sale"];

export type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function list(value: string | string[] | undefined): string[] {
  const raw = first(value);
  return raw ? raw.split(",").filter(Boolean) : [];
}

function positiveNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

/** Parse + validate URL query params into typed list params (§5.2, §8). */
export function parseShopParams(searchParams: SearchParams): ProductListParams & { limit: number } {
  const category = first(searchParams.category);
  const sort = first(searchParams.sort);
  const limitRaw = positiveNumber(first(searchParams.limit));

  return {
    category: category && isCategoryHandle(category) ? category : undefined,
    q: first(searchParams.q)?.slice(0, 80),
    brands: list(searchParams.brands),
    sizes: list(searchParams.sizes),
    colors: list(searchParams.colors),
    minPrice: positiveNumber(first(searchParams.min)),
    maxPrice: positiveNumber(first(searchParams.max)),
    inStock: first(searchParams.stock) === "1",
    tags: list(searchParams.tags).filter((t): t is ProductTag => TAG_OPTIONS.includes(t as ProductTag)),
    sort: SORT_OPTIONS.includes(sort as SortOption) ? (sort as SortOption) : "featured",
    limit: Math.min(limitRaw ?? PAGE_SIZE, 96),
  };
}

/** Count of active filters (excludes sort/limit) for the mobile button badge. */
export function activeFilterCount(params: ProductListParams): number {
  let count = 0;
  if (params.category) count += 1;
  count += params.brands?.length ?? 0;
  count += params.sizes?.length ?? 0;
  count += params.colors?.length ?? 0;
  count += params.tags?.length ?? 0;
  if (params.minPrice !== undefined) count += 1;
  if (params.maxPrice !== undefined) count += 1;
  if (params.inStock) count += 1;
  return count;
}
