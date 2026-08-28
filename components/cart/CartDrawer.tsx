"use client";

import Link from "next/link";
import { Drawer } from "@/components/ui/Drawer";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCart } from "@/components/cart/CartProvider";
import { Spinner } from "@/components/ui/Spinner";

/**
 * Cart drawer (§5.4) — opened by the header cart icon, slides in from the
 * right edge as a narrow panel, and never navigates away from the page.
 *
 * All contents come from the cart context (CartProvider → server actions →
 * lib/medusa/cart.ts). No line-item state is held locally.
 */
export function CartDrawer() {
  const { cart, isOpen, closeCart, error, loading } = useCart();
  const hasItems = (cart?.items.length ?? 0) > 0;

  return (
    <Drawer open={isOpen} onClose={closeCart} title="Shopping cart" side="right">
      <div className="flex items-center justify-between border-b border-line px-6 py-4">
        <h2 className="text-heading">
          Cart{cart && cart.item_count > 0 ? ` (${cart.item_count})` : ""}
        </h2>
        <button
          onClick={closeCart}
          aria-label="Close cart"
          className="flex h-11 w-11 items-center justify-center rounded-btn hover:bg-line"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>

      {error && (
        <p role="alert" className="border-b border-line bg-error/10 px-6 py-3 text-small text-error">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <Spinner className="h-6 w-6 text-ink-muted" />
        </div>
      ) : hasItems ? (
        <>
          <ul className="flex-1 overflow-y-auto px-6">
            {cart!.items.map((item) => (
              <CartLineItem key={item.id} item={item} />
            ))}
          </ul>
          <CartSummary cart={cart!} />
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-heading">Your cart is empty</p>
          <p className="text-body text-ink-muted">
            Nothing here yet — the court is waiting.
          </p>
          <Link
            href="/shop"
            onClick={closeCart}
            className="inline-flex min-h-11 items-center rounded-btn bg-accent px-6 py-3 font-medium text-surface transition-colors hover:bg-accent-hover"
          >
            Start shopping
          </Link>
        </div>
      )}
    </Drawer>
  );
}
