"use server";

import { searchProducts, productMinPrice } from "@/lib/medusa/products";

export interface SearchHit {
  id: string;
  handle: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  thumbnail: { url: string; alt: string };
}

export async function searchProductsAction(q: string): Promise<SearchHit[]> {
  const query = q.slice(0, 80); // sanity cap on user input
  const products = await searchProducts(query);
  return products.map((p) => ({
    id: p.id,
    handle: p.handle,
    title: p.title,
    brand: p.brand,
    category: p.category,
    price: productMinPrice(p),
    thumbnail: p.thumbnail,
  }));
}
