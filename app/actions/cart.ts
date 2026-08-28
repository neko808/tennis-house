"use server";

import { addLine, getCart, removeLine, updateLine } from "@/lib/medusa/cart";
import type { Cart } from "@/types/medusa";

export interface CartActionResult {
  cart: Cart | null;
  error?: string;
}

export async function getCartAction(): Promise<CartActionResult> {
  try {
    return { cart: await getCart() };
  } catch {
    return { cart: null, error: "Could not load your cart." };
  }
}

export async function addToCartAction(
  productId: string,
  variantId: string,
  quantity: number,
): Promise<CartActionResult> {
  try {
    return { cart: await addLine(productId, variantId, quantity) };
  } catch (err) {
    const cart = await getCart();
    return { cart, error: err instanceof Error ? err.message : "Could not add to cart." };
  }
}

export async function updateLineItemAction(
  variantId: string,
  quantity: number,
): Promise<CartActionResult> {
  try {
    return { cart: await updateLine(variantId, quantity) };
  } catch (err) {
    const cart = await getCart();
    return { cart, error: err instanceof Error ? err.message : "Could not update the cart." };
  }
}

export async function removeLineItemAction(variantId: string): Promise<CartActionResult> {
  try {
    return { cart: await removeLine(variantId) };
  } catch (err) {
    const cart = await getCart();
    return { cart, error: err instanceof Error ? err.message : "Could not remove the item." };
  }
}
