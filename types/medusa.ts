/**
 * Typed wrappers for the Medusa response shapes this storefront consumes (§6).
 *
 * Phase 1 serves these from the local sample catalog (lib/catalog/seed-data.ts).
 * Phase 2 maps real Medusa Store API responses into these same shapes inside
 * lib/medusa/* — pages and components never change.
 */

export type CategoryHandle = "tennis" | "t-shirts" | "pants" | "caps" | "accessories";

export type ProductTag = "featured" | "new" | "sale";

export interface ProductImage {
  url: string;
  alt: string;
}

export interface ProductOption {
  id: string;
  title: string; // "Size" | "Color" | "Grip"
  values: string[];
}

export interface ProductVariant {
  id: string;
  title: string; // "Cloud White / M"
  options: Record<string, string>;
  /** Minor units (cents). Authoritative price always comes from the server. */
  price: number;
  /** Compare-at price in minor units, present only when on sale. */
  original_price: number | null;
  inventory_quantity: number;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  /** Every Phase 1 product carries the sample-data label here. */
  subtitle: string;
  description: string;
  brand: string;
  category: CategoryHandle;
  tags: ProductTag[];
  thumbnail: ProductImage;
  images: ProductImage[];
  options: ProductOption[];
  variants: ProductVariant[];
  details: {
    materials: string;
    fit: string;
    care: string;
  };
  /** Optional map of color value → index in `images`, drives gallery sync. */
  colorImages?: Record<string, number>;
  created_at: string;
}

export interface Category {
  id: string;
  handle: CategoryHandle;
  name: string;
  description: string;
  image: ProductImage;
}

export interface CartLineItem {
  id: string;
  product_id: string;
  handle: string;
  title: string;
  variant_id: string;
  variant_title: string;
  thumbnail: ProductImage;
  unit_price: number;
  quantity: number;
}

export interface Cart {
  id: string;
  items: CartLineItem[];
  /** Minor units. Always recomputed server-side from the catalog. */
  subtotal: number;
  item_count: number;
  updated_at: string;
}

export type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

export interface ProductListParams {
  category?: CategoryHandle;
  q?: string;
  brands?: string[];
  sizes?: string[];
  colors?: string[];
  /** Whole currency units, from user input — validated server-side. */
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  tags?: ProductTag[];
  sort?: SortOption;
  limit?: number;
  offset?: number;
}

export interface ProductFacets {
  brands: string[];
  sizes: string[];
  colors: string[];
  priceMin: number; // minor units
  priceMax: number; // minor units
}

export interface ProductListResult {
  products: Product[];
  count: number;
  facets: ProductFacets;
}
