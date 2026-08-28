import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review the items in your Tennis House cart.",
  robots: { index: false }, // personal, per-visitor page — keep it out of search
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-24 sm:px-6 lg:pt-28">
      <h1 className="text-display mb-8">Your cart</h1>
      <CartView />
    </div>
  );
}
