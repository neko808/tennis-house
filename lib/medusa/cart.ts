import { promises as fs } from "fs";
import path from "path";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { getProduct } from "@/lib/medusa/products";
import { SAMPLE_PRODUCTS } from "@/lib/catalog/seed-data";
import type { Cart, CartLineItem } from "@/types/medusa";

/**
 * Cart helpers — server-only (imported exclusively from server actions).
 *
 * Mirrors Medusa's cart endpoints (§5.4, §6): the browser holds ONLY an opaque
 * cart id in a secure httpOnly cookie; line contents, prices and totals live
 * server-side and are recomputed from the catalog on every read, so nothing
 * client-submitted is ever trusted for pricing or stock (§8).
 *
 * Storage is a dev-only JSON file (.data/carts.json — gitignored, single
 * process). Phase 2 replaces the internals with POST/GET /store/carts/*.
 */

const COOKIE_NAME = "_tth_cart_id";
const STORE_PATH = path.join(process.cwd(), ".data", "carts.json");
const MAX_QTY_PER_LINE = 10;

interface StoredLine {
  product_id: string;
  variant_id: string;
  quantity: number;
}

interface StoredCart {
  id: string;
  lines: StoredLine[];
  updated_at: string;
}

type CartFile = Record<string, StoredCart>;

async function readStore(): Promise<CartFile> {
  try {
    return JSON.parse(await fs.readFile(STORE_PATH, "utf8")) as CartFile;
  } catch {
    return {};
  }
}

async function writeStore(store: CartFile): Promise<void> {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

async function hydrate(stored: StoredCart): Promise<Cart> {
  const items: CartLineItem[] = [];
  for (const line of stored.lines) {
    const product = SAMPLE_PRODUCTS.find((p) => p.id === line.product_id);
    const variant = product?.variants.find((v) => v.id === line.variant_id);
    if (!product || !variant) continue; // drop lines whose product vanished
    const quantity = Math.min(line.quantity, Math.max(variant.inventory_quantity, 0));
    if (quantity < 1) continue;
    items.push({
      id: `line_${variant.id}`,
      product_id: product.id,
      handle: product.handle,
      title: product.title,
      variant_id: variant.id,
      variant_title: variant.title,
      thumbnail: product.thumbnail,
      unit_price: variant.price, // authoritative, from the server catalog
      quantity,
    });
  }
  return {
    id: stored.id,
    items,
    subtotal: items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0),
    item_count: items.reduce((sum, i) => sum + i.quantity, 0),
    updated_at: stored.updated_at,
  };
}

async function getStoredCart(): Promise<StoredCart | null> {
  const jar = await cookies();
  const id = jar.get(COOKIE_NAME)?.value;
  if (!id) return null;
  const store = await readStore();
  return store[id] ?? null;
}

export async function getCart(): Promise<Cart | null> {
  const stored = await getStoredCart();
  return stored ? hydrate(stored) : null;
}

async function getOrCreateStoredCart(): Promise<StoredCart> {
  const existing = await getStoredCart();
  if (existing) return existing;
  const cart: StoredCart = {
    id: `cart_${randomUUID()}`,
    lines: [],
    updated_at: new Date().toISOString(),
  };
  const jar = await cookies();
  jar.set(COOKIE_NAME, cart.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 60, // 60 days
  });
  return cart;
}

async function persist(cart: StoredCart): Promise<Cart> {
  cart.updated_at = new Date().toISOString();
  const store = await readStore();
  store[cart.id] = cart;
  await writeStore(store);
  return hydrate(cart);
}

export async function addLine(productId: string, variantId: string, quantity: number): Promise<Cart> {
  const product = SAMPLE_PRODUCTS.find((p) => p.id === productId);
  const variant = product?.variants.find((v) => v.id === variantId);
  if (!product || !variant) throw new Error("Unknown product or variant.");
  if (variant.inventory_quantity < 1) throw new Error("This variant is out of stock.");

  const cart = await getOrCreateStoredCart();
  const line = cart.lines.find((l) => l.variant_id === variantId);
  const requested = (line?.quantity ?? 0) + Math.max(1, Math.floor(quantity));
  const capped = Math.min(requested, variant.inventory_quantity, MAX_QTY_PER_LINE);
  if (line) line.quantity = capped;
  else cart.lines.push({ product_id: productId, variant_id: variantId, quantity: capped });
  return persist(cart);
}

export async function updateLine(variantId: string, quantity: number): Promise<Cart> {
  const cart = await getOrCreateStoredCart();
  const line = cart.lines.find((l) => l.variant_id === variantId);
  if (!line) throw new Error("Line item not found.");
  const product = SAMPLE_PRODUCTS.find((p) => p.id === line.product_id);
  const variant = product?.variants.find((v) => v.id === variantId);
  const max = Math.min(variant?.inventory_quantity ?? 0, MAX_QTY_PER_LINE);
  const next = Math.min(Math.max(1, Math.floor(quantity)), max);
  line.quantity = next;
  return persist(cart);
}

export async function removeLine(variantId: string): Promise<Cart> {
  const cart = await getOrCreateStoredCart();
  cart.lines = cart.lines.filter((l) => l.variant_id !== variantId);
  return persist(cart);
}

/** Re-export kept so callers resolve products without importing seed data. */
export { getProduct };
