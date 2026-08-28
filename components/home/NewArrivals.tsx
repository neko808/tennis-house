import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types/medusa";

export function NewArrivals({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section aria-labelledby="new-heading" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="mb-8 flex items-end justify-between">
        <h2 id="new-heading" className="text-display">
          New in
        </h2>
        <Link href="/shop?tags=new" className="min-h-11 text-body underline-offset-4 hover:underline">
          View all →
        </Link>
      </div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} sizes="(min-width: 1024px) 25vw, 50vw" />
          </li>
        ))}
      </ul>
    </section>
  );
}
