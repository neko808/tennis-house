"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PAGE_SIZE } from "@/components/shop/filter-params";

/** "Load more" pagination (§5.2 recommendation for Phase 1). */
export function LoadMore({ shown, total }: { shown: number; total: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  if (shown >= total) return null;

  return (
    <div className="mt-10 flex flex-col items-center gap-2">
      <p className="text-small text-ink-muted">
        Showing {shown} of {total}
      </p>
      <button
        type="button"
        onClick={() => {
          const next = new URLSearchParams(searchParams.toString());
          next.set("limit", String(shown + PAGE_SIZE));
          router.replace(`/shop?${next}`, { scroll: false });
        }}
        className="min-h-11 rounded-btn border border-ink px-8 py-3 font-medium transition-colors hover:bg-ink hover:text-surface"
      >
        Load more
      </button>
    </div>
  );
}
