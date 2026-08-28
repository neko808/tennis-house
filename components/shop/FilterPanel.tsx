"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { COLOR_SWATCHES } from "@/lib/catalog/seed-data";
import { cn, formatPrice } from "@/lib/utils";
import type { Category, ProductFacets, ProductListParams } from "@/types/medusa";

interface FilterPanelProps {
  categories: Category[];
  facets: ProductFacets;
  params: ProductListParams;
  onNavigate?: () => void;
}

/**
 * Shared filter controls (§5.2) — rendered in the desktop sidebar and the
 * mobile drawer. Every change is written to URL query params so filtered
 * views are shareable and back-button friendly.
 */
export function FilterPanel({ categories, facets, params, onNavigate }: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const update = useCallback(
    (mutate: (next: URLSearchParams) => void) => {
      const next = new URLSearchParams(searchParams.toString());
      mutate(next);
      next.delete("limit"); // filter changes reset pagination
      router.replace(`/shop${next.size ? `?${next}` : ""}`, { scroll: false });
      onNavigate?.();
    },
    [router, searchParams, onNavigate],
  );

  const toggleListParam = (key: string, value: string) =>
    update((next) => {
      const current = next.get(key)?.split(",").filter(Boolean) ?? [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      if (updated.length) next.set(key, updated.join(","));
      else next.delete(key);
    });

  const hasActiveFilters =
    Boolean(params.category) ||
    Boolean(params.brands?.length) ||
    Boolean(params.sizes?.length) ||
    Boolean(params.colors?.length) ||
    Boolean(params.tags?.length) ||
    params.minPrice !== undefined ||
    params.maxPrice !== undefined ||
    params.inStock;

  return (
    <div className="flex flex-col gap-8">
      {hasActiveFilters && (
        <button
          type="button"
          onClick={() =>
            update((next) => {
              ["category", "brands", "sizes", "colors", "tags", "min", "max", "stock"].forEach((k) =>
                next.delete(k),
              );
            })
          }
          className="self-start text-small text-ink underline underline-offset-4 hover:text-ink-muted"
        >
          Clear all filters
        </button>
      )}

      <FilterSection title="Category">
        <ul className="flex flex-col gap-2">
          {categories.map((category) => {
            const checked = params.category === category.handle;
            return (
              <li key={category.id}>
                <label className="flex min-h-11 cursor-pointer items-center gap-3 text-body">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      update((next) => {
                        if (checked) next.delete("category");
                        else next.set("category", category.handle);
                      })
                    }
                    className="h-4 w-4 accent-[rgb(var(--color-accent))]"
                  />
                  {category.name}
                </label>
              </li>
            );
          })}
        </ul>
      </FilterSection>

      {facets.brands.length > 0 && (
        <FilterSection title="Brand">
          <ul className="flex flex-col gap-2">
            {facets.brands.map((brand) => (
              <li key={brand}>
                <label className="flex min-h-11 cursor-pointer items-center gap-3 text-body">
                  <input
                    type="checkbox"
                    checked={params.brands?.includes(brand) ?? false}
                    onChange={() => toggleListParam("brands", brand)}
                    className="h-4 w-4 accent-[rgb(var(--color-accent))]"
                  />
                  {brand}
                </label>
              </li>
            ))}
          </ul>
        </FilterSection>
      )}

      <FilterSection title="Price">
        <form
          className="flex items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            update((next) => {
              const min = String(data.get("min") ?? "");
              const max = String(data.get("max") ?? "");
              if (min) next.set("min", min);
              else next.delete("min");
              if (max) next.set("max", max);
              else next.delete("max");
            });
          }}
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="filter-min" className="text-small text-ink-muted">Min</label>
            <input
              id="filter-min"
              name="min"
              type="number"
              min={0}
              inputMode="numeric"
              defaultValue={params.minPrice ?? ""}
              placeholder={String(Math.floor(facets.priceMin / 100))}
              className="w-20 rounded-btn border border-line bg-surface px-2 py-2 text-body"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="filter-max" className="text-small text-ink-muted">Max</label>
            <input
              id="filter-max"
              name="max"
              type="number"
              min={0}
              inputMode="numeric"
              defaultValue={params.maxPrice ?? ""}
              placeholder={String(Math.ceil(facets.priceMax / 100))}
              className="w-20 rounded-btn border border-line bg-surface px-2 py-2 text-body"
            />
          </div>
          <button
            type="submit"
            className="min-h-11 rounded-btn border border-ink px-4 text-small font-medium hover:bg-ink hover:text-surface"
          >
            Apply
          </button>
        </form>
        <p className="mt-2 text-small text-ink-muted">
          Range: {formatPrice(facets.priceMin)}–{formatPrice(facets.priceMax)}
        </p>
      </FilterSection>

      {facets.sizes.length > 1 && (
        <FilterSection title="Size">
          <div className="flex flex-wrap gap-2">
            {facets.sizes.map((size) => {
              const active = params.sizes?.includes(size) ?? false;
              return (
                <button
                  key={size}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleListParam("sizes", size)}
                  className={cn(
                    "min-h-11 rounded-full border px-4 text-small transition-colors",
                    active ? "border-ink bg-ink text-surface" : "border-line hover:border-ink",
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </FilterSection>
      )}

      {facets.colors.length > 1 && (
        <FilterSection title="Color">
          <div className="flex flex-wrap gap-3">
            {facets.colors.map((color) => {
              const active = params.colors?.includes(color) ?? false;
              return (
                <button
                  key={color}
                  type="button"
                  aria-pressed={active}
                  aria-label={color}
                  title={color}
                  onClick={() => toggleListParam("colors", color)}
                  className={cn(
                    "h-7 w-7 rounded-full border transition-shadow",
                    active
                      ? "border-ink ring-2 ring-ink ring-offset-2 ring-offset-surface"
                      : "border-line hover:border-ink",
                  )}
                  style={{ backgroundColor: COLOR_SWATCHES[color] ?? "#CCC" }}
                />
              );
            })}
          </div>
        </FilterSection>
      )}

      <FilterSection title="Availability">
        <label className="flex min-h-11 cursor-pointer items-center gap-3 text-body">
          <input
            type="checkbox"
            checked={params.inStock ?? false}
            onChange={() =>
              update((next) => {
                if (params.inStock) next.delete("stock");
                else next.set("stock", "1");
              })
            }
            className="h-4 w-4 accent-[rgb(var(--color-accent))]"
          />
          In stock only
        </label>
      </FilterSection>

      <FilterSection title="Tags">
        <div className="flex flex-wrap gap-2">
          {(["new", "featured", "sale"] as const).map((tag) => {
            const active = params.tags?.includes(tag) ?? false;
            return (
              <button
                key={tag}
                type="button"
                aria-pressed={active}
                onClick={() => toggleListParam("tags", tag)}
                className={cn(
                  "min-h-11 rounded-full border px-4 text-small capitalize transition-colors",
                  active ? "border-ink bg-ink text-surface" : "border-line hover:border-ink",
                )}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </FilterSection>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section aria-label={title}>
      <h3 className="mb-3 text-small font-medium uppercase tracking-widest text-ink-muted">
        {title}
      </h3>
      {children}
    </section>
  );
}
