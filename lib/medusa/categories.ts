import { SAMPLE_CATEGORIES } from "@/lib/catalog/seed-data";
import type { Category, CategoryHandle } from "@/types/medusa";

/** Phase 2: GET /store/product-categories via the SDK (see client.ts). */
export async function listCategories(): Promise<Category[]> {
  return SAMPLE_CATEGORIES;
}

export async function getCategory(handle: string): Promise<Category | null> {
  return SAMPLE_CATEGORIES.find((c) => c.handle === handle) ?? null;
}

export function isCategoryHandle(value: string): value is CategoryHandle {
  return SAMPLE_CATEGORIES.some((c) => c.handle === value);
}
