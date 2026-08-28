"use client";

import Image from "next/image";
import Link from "next/link";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { useCart } from "@/components/cart/CartProvider";
import { cn, formatPrice } from "@/lib/utils";
import type { CartLineItem as LineItem } from "@/types/medusa";

interface CartLineItemProps {
  item: LineItem;
  /** "drawer" is the compact panel row; "page" is the roomier /cart row. */
  layout?: "drawer" | "page";
}

/**
 * One cart line. Quantity and removal go through the cart context → server
 * actions → lib/medusa/cart.ts, so the server stays authoritative on price
 * and stock (§5.4, §8).
 */
export function CartLineItem({ item, layout = "drawer" }: CartLineItemProps) {
  const { updateItem, removeItem, pending, closeCart } = useCart();
  const isPage = layout === "page";

  return (
    <li className={cn("flex gap-4 border-b border-line", isPage ? "py-6" : "py-4")}>
      <Link
        href={`/products/${item.handle}`}
        onClick={closeCart}
        className={cn(
          "relative block shrink-0 overflow-hidden rounded-card bg-line",
          isPage ? "h-36 w-28 sm:h-44 sm:w-36" : "h-24 w-20",
        )}
      >
        <Image
          src={item.thumbnail.url}
          alt={item.thumbnail.alt}
          fill
          sizes={isPage ? "144px" : "80px"}
          className="object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/products/${item.handle}`}
              onClick={closeCart}
              className={cn("font-medium hover:underline", isPage ? "text-subheading" : "text-body")}
            >
              {item.title}
            </Link>
            <p className="mt-1 text-small text-ink-muted">{item.variant_title}</p>
            {isPage && (
              <p className="price mt-1 text-small text-ink-muted">
                {formatPrice(item.unit_price)} each
              </p>
            )}
          </div>
          <span className={cn("price shrink-0", isPage ? "text-[length:var(--text-price)]" : "text-body")}>
            {formatPrice(item.unit_price * item.quantity)}
          </span>
        </div>

        <div className={cn("flex items-center justify-between gap-3", isPage ? "mt-4" : "mt-auto pt-2")}>
          <QuantityStepper
            compact={!isPage}
            value={item.quantity}
            onChange={(qty) => updateItem(item.variant_id, qty)}
            disabled={pending}
            label={`Quantity for ${item.title}`}
          />
          <button
            type="button"
            onClick={() => removeItem(item.variant_id)}
            disabled={pending}
            className="min-h-11 px-2 text-small text-ink-muted underline-offset-4 hover:text-ink hover:underline disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
