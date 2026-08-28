"use client";

import Link from "next/link";
import { useId } from "react";
import { Button, buttonClasses } from "@/components/ui/Button";
import { useCart } from "@/components/cart/CartProvider";
import { cn, formatPrice } from "@/lib/utils";
import type { Cart } from "@/types/medusa";

interface CartSummaryProps {
  cart: Cart;
  /** Hidden on /cart itself — you're already there. */
  showViewCart?: boolean;
  className?: string;
}

/**
 * Totals + the two cart CTAs (§5.4).
 *
 * "View cart" routes to the full /cart page. "Check out" stays inert until
 * payment work is authorized — no checkout or payment logic exists yet.
 */
export function CartSummary({ cart, showViewCart = true, className }: CartSummaryProps) {
  const noteId = useId();
  const { closeCart } = useCart();

  return (
    <div className={cn("border-t border-line px-6 py-5", className)}>
      <div className="flex items-center justify-between">
        <span className="text-body font-medium">Subtotal</span>
        <span className="price text-[length:var(--text-price)]">{formatPrice(cart.subtotal)}</span>
      </div>
      <p className="mt-1 text-small text-ink-muted">
        Taxes and shipping calculated at checkout.
      </p>

      <div className="mt-4 flex flex-col gap-3">
        {showViewCart && (
          <Link
            href="/cart"
            onClick={closeCart}
            className={buttonClasses({ variant: "secondary", fullWidth: true })}
          >
            View cart
          </Link>
        )}
        <Button fullWidth disabled aria-describedby={noteId}>
          Check out
        </Button>
      </div>

      <p id={noteId} className="mt-2 text-center text-small text-ink-muted">
        Checkout is not available yet. No payment information is collected on this site.
      </p>
    </div>
  );
}
