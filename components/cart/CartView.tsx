"use client";

import Link from "next/link";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCart } from "@/components/cart/CartProvider";
import { Spinner } from "@/components/ui/Spinner";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * Full cart page contents (§5.4). Reads the same cart context as the drawer —
 * one source of truth, no duplicated state — so quantity and removal stay in
 * sync between the two views.
 */
export function CartView() {
  const { cart, loading, error, pending } = useCart();
  const items = cart?.items ?? [];

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner className="h-6 w-6 text-ink-muted" />
        <span className="sr-only">Loading your cart</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-heading">Your cart is empty</p>
        <p className="text-body text-ink-muted">Nothing here yet — the court is waiting.</p>
        <Link href="/shop" className={buttonClasses()}>
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <>
      {error && (
        <p role="alert" className="mb-6 rounded-card bg-error/10 px-4 py-3 text-small text-error">
          {error}
        </p>
      )}

      <div className="lg:grid lg:grid-cols-[1fr_380px] lg:items-start lg:gap-12">
        <section aria-label="Cart items">
          <ul
            aria-busy={pending}
            className={cn("border-t border-line transition-opacity", pending && "opacity-60")}
          >
            {items.map((item) => (
              <CartLineItem key={item.id} item={item} layout="page" />
            ))}
          </ul>
          <Link
            href="/shop"
            className="mt-6 inline-flex min-h-11 items-center text-body underline-offset-4 hover:underline"
          >
            ← Continue shopping
          </Link>
        </section>

        <aside aria-label="Order summary" className="mt-10 lg:sticky lg:top-24 lg:mt-0">
          <div className="rounded-card border border-line">
            <h2 className="border-b border-line px-6 py-4 text-subheading">Order summary</h2>
            <CartSummary cart={cart!} showViewCart={false} className="border-t-0" />
          </div>
        </aside>
      </div>
    </>
  );
}
