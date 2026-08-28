import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types/medusa";

/**
 * Shop-by-category (§5.1): one hero tile (Tennis) + a 2×2 grid.
 * Each tile links to the pre-filtered shop view.
 */
export function CategoryTiles({ categories }: { categories: Category[] }) {
  const [lead, ...rest] = categories;
  if (!lead) return null;

  return (
    <section aria-labelledby="categories-heading" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:pb-24">
      <h2 id="categories-heading" className="text-display mb-8">
        Shop by category
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Tile category={lead} className="md:h-full" imageSizes="(min-width: 768px) 50vw, 100vw" priorityAspect="aspect-product md:aspect-auto md:min-h-[520px]" />
        <div className="grid grid-cols-2 gap-4">
          {rest.map((category) => (
            <Tile key={category.id} category={category} imageSizes="(min-width: 768px) 25vw, 50vw" priorityAspect="aspect-product" />
          ))}
        </div>
      </div>
    </section>
  );
}

function Tile({
  category,
  className = "",
  imageSizes,
  priorityAspect,
}: {
  category: Category;
  className?: string;
  imageSizes: string;
  priorityAspect: string;
}) {
  return (
    <Link
      href={`/shop?category=${category.handle}`}
      className={`group relative block overflow-hidden rounded-card bg-line ${priorityAspect} ${className}`}
    >
      <Image
        src={category.image.url}
        alt={category.image.alt}
        fill
        sizes={imageSizes}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
      <span className="absolute bottom-4 left-4 rounded-full bg-surface px-4 py-2 text-body font-medium text-ink transition-colors group-hover:bg-ball">
        {category.name}
      </span>
    </Link>
  );
}
