import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types/medusa";

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section aria-labelledby="featured-heading" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="mb-8 flex items-end justify-between">
        <h2 id="featured-heading" className="text-display">
          Featured
        </h2>
        <Link
          href="/shop?tags=featured"
          className="min-h-11 text-body underline-offset-4 hover:underline"
        >
          Shop all →
        </Link>
      </div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} sizes="(min-width: 768px) 33vw, 50vw" />
          </li>
        ))}
      </ul>
    </section>
  );
}
