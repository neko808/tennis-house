"use client";

import { useRouter, useSearchParams } from "next/navigation";

const OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

export function SortControl({ value }: { value: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-small text-ink-muted">
        Sort
      </label>
      <select
        id="sort"
        value={value}
        onChange={(e) => {
          const next = new URLSearchParams(searchParams.toString());
          if (e.target.value === "featured") next.delete("sort");
          else next.set("sort", e.target.value);
          next.delete("limit");
          router.replace(`/shop${next.size ? `?${next}` : ""}`, { scroll: false });
        }}
        className="min-h-11 rounded-btn border border-line bg-surface px-3 text-body"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
