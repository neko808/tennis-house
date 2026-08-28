"use client";

import { cn } from "@/lib/utils";

interface SizeSelectorProps {
  label: string;
  sizes: string[];
  selected: string | null;
  availability: Record<string, boolean>;
  onSelect: (size: string) => void;
}

/**
 * Size selector (§3.6, §5.3): grid of labeled boxes. Out-of-stock sizes are
 * struck through + muted + aria-disabled — never hidden.
 */
export function SizeSelector({ label, sizes, selected, availability, onSelect }: SizeSelectorProps) {
  return (
    <fieldset>
      <legend className="text-small font-medium uppercase tracking-wide text-ink">
        {label}
      </legend>
      <div role="radiogroup" aria-label={label} className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
        {sizes.map((size) => {
          const available = availability[size];
          const isSelected = selected === size;
          return (
            <button
              key={size}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-disabled={!available}
              aria-label={available ? size : `${size} — out of stock`}
              onClick={() => available && onSelect(size)}
              className={cn(
                "flex min-h-11 items-center justify-center rounded-btn border text-body transition-colors",
                isSelected
                  ? "border-ink bg-ink text-surface"
                  : available
                    ? "border-line bg-surface text-ink hover:border-ink"
                    : "cursor-not-allowed border-line bg-surface text-ink-muted line-through",
              )}
            >
              {size}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
