import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getRelatedProducts, productMinPrice } from "@/lib/medusa/products";
import { getCategory } from "@/lib/medusa/categories";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ProductCard } from "@/components/product/ProductCard";
import { SAMPLE_PRODUCTS } from "@/lib/catalog/seed-data";
import { formatPrice } from "@/lib/utils";

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

export function generateStaticParams() {
  return SAMPLE_PRODUCTS.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return { title: "Product not found" };
  return {
    title: product.title,
    description: `${product.title} by ${product.brand} — ${formatPrice(productMinPrice(product))}. ${product.description.slice(0, 120)}`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  const [category, related] = await Promise.all([
    getCategory(product.category),
    getRelatedProducts(product, 4),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:pt-28">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-2 text-small text-ink-muted">
          <li>
            <Link href="/" className="hover:text-ink hover:underline">Home</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/shop?category=${product.category}`} className="hover:text-ink hover:underline">
              {category?.name ?? product.category}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink">{product.title}</li>
        </ol>
      </nav>

      <ProductDetail product={product} />

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="mt-20">
          <h2 id="related-heading" className="text-display mb-8">
            You might also like
          </h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {related.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} sizes="(min-width: 1024px) 25vw, 50vw" />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
