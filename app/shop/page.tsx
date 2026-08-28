import type { Metadata } from "next";
import { listProducts } from "@/lib/medusa/products";
import { getCategory, listCategories } from "@/lib/medusa/categories";
import { activeFilterCount, parseShopParams, type SearchParams } from "@/components/shop/filter-params";
import { FilterPanel } from "@/components/shop/FilterPanel";
import { FilterDrawer } from "@/components/shop/FilterDrawer";
import { SortControl } from "@/components/shop/SortControl";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { LoadMore } from "@/components/shop/LoadMore";

interface ShopPageProps {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata({ searchParams }: ShopPageProps): Promise<Metadata> {
  const params = parseShopParams(await searchParams);
  const category = params.category ? await getCategory(params.category) : null;
  return {
    title: category ? category.name : "Shop All",
    description: category
      ? `${category.name} — ${category.description}`
      : "Browse the full Tennis House collection: tennis gear, t-shirts, pants, caps and accessories.",
    // Filtered permutations canonicalize to the clean shop URL (§9).
    alternates: {
      canonical: params.category ? `/shop?category=${params.category}` : "/shop",
    },
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = parseShopParams(await searchParams);
  const [{ products, count, facets }, categories] = await Promise.all([
    listProducts(params),
    listCategories(),
  ]);
  const category = params.category
    ? categories.find((c) => c.handle === params.category)
    : null;
  const filterCount = activeFilterCount(params);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:pt-28">
      <header className="mb-8">
        <h1 className="text-display">{category?.name ?? "Shop All"}</h1>
        {category && <p className="mt-2 text-body text-ink-muted">{category.description}</p>}
      </header>

      <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-10">
        {/* Desktop filter sidebar (§5.2) */}
        <aside aria-label="Product filters" className="hidden lg:block">
          <FilterPanel categories={categories} facets={facets} params={params} />
        </aside>

        <div>
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="text-small text-ink-muted" aria-live="polite">
              {count} {count === 1 ? "product" : "products"}
            </p>
            <div className="flex items-center gap-3">
              <FilterDrawer
                categories={categories}
                facets={facets}
                params={params}
                activeCount={filterCount}
              />
              <SortControl value={params.sort ?? "featured"} />
            </div>
          </div>

          <ProductGrid products={products} />
          <LoadMore shown={products.length} total={count} />
        </div>
      </div>
    </div>
  );
}
