import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types/medusa";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-card border border-line p-10 text-center">
        <p className="text-heading">No products match these filters</p>
        <p className="mt-2 text-body text-ink-muted">
          Try removing a filter or clearing them all.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
