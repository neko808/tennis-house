import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { productCompareAt, productInStock, productMinPrice } from "@/lib/medusa/products";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/medusa";

/**
 * Product card (§3.6): fixed 4:5 image, name, brand, price, data-driven badge.
 * Hover reveals the second image when the product has one.
 */
export function ProductCard({ product, sizes }: { product: Product; sizes?: string }) {
  const price = productMinPrice(product);
  const compareAt = productCompareAt(product);
  const inStock = productInStock(product);
  const hoverImage = product.images[1];

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className="relative aspect-product overflow-hidden rounded-card bg-line">
        <Image
          src={product.thumbnail.url}
          alt={product.thumbnail.alt}
          fill
          sizes={sizes ?? "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {hoverImage && (
          <Image
            src={hoverImage.url}
            alt=""
            aria-hidden="true"
            fill
            sizes={sizes ?? "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"}
            className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          {product.tags.includes("new") && <Badge tone="new">New</Badge>}
          {product.tags.includes("sale") && <Badge tone="sale">Sale</Badge>}
        </div>
        {!inStock && (
          <span className="absolute bottom-3 left-3 rounded-full bg-surface/90 px-3 py-1 text-small text-ink-muted">
            Out of stock
          </span>
        )}
      </div>
      <div className="mt-3 flex flex-col gap-0.5">
        <p className="text-small text-ink-muted">{product.brand}</p>
        <h3 className="text-body font-medium text-ink group-hover:underline">{product.title}</h3>
        <p className="flex items-baseline gap-2">
          <span className="price text-body text-ink">{formatPrice(price)}</span>
          {compareAt && (
            <s className="price text-small text-ink-muted">{formatPrice(compareAt)}</s>
          )}
        </p>
      </div>
    </Link>
  );
}
