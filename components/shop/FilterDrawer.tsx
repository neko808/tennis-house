"use client";

import { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { FilterPanel } from "@/components/shop/FilterPanel";
import type { Category, ProductFacets, ProductListParams } from "@/types/medusa";

interface FilterDrawerProps {
  categories: Category[];
  facets: ProductFacets;
  params: ProductListParams;
  activeCount: number;
}

/** Mobile filter entry point (§5.2): bottom sheet with the shared panel. */
export function FilterDrawer({ categories, facets, params, activeCount }: FilterDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex min-h-11 items-center gap-2 rounded-btn border border-ink px-4 text-body font-medium lg:hidden"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M1 4h14M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Filters
        {activeCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-ball px-1 text-[0.6875rem] font-medium text-ink">
            {activeCount}
          </span>
        )}
      </button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Filters" side="bottom">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="text-heading">Filters</h2>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close filters"
            className="flex h-11 w-11 items-center justify-center rounded-btn hover:bg-line"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <FilterPanel categories={categories} facets={facets} params={params} />
        </div>
        <div className="border-t border-line px-6 py-4">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full min-h-11 rounded-btn bg-accent px-6 py-3 font-medium text-surface hover:bg-accent-hover"
          >
            View results
          </button>
        </div>
      </Drawer>
    </>
  );
}
