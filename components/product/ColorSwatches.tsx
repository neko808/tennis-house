"use client";

import { COLOR_SWATCHES } from "@/lib/catalog/seed-data";
import { cn } from "@/lib/utils";

interface ColorSwatchesProps {
  colors: string[];
  selected: string;
  onSelect: (color: string) => void;
}

/** Color swatches (§3.6): 28px circles, border on selected, name as tooltip. */
export function ColorSwatches({ colors, selected, onSelect }: ColorSwatchesProps) {
  return (
    <fieldset>
      <legend className="text-small font-medium uppercase tracking-wide text-ink">
        Color: <span className="font-normal normal-case text-ink-muted">{selected}</span>
      </legend>
      <div role="radiogroup" aria-label="Color" className="mt-3 flex gap-3">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            role="radio"
            aria-checked={selected === color}
            aria-label={color}
            title={color}
            onClick={() => onSelect(color)}
            className={cn(
              "h-7 w-7 rounded-full border transition-shadow",
              selected === color
                ? "border-ink ring-2 ring-ink ring-offset-2 ring-offset-surface"
                : "border-line hover:border-ink",
            )}
            style={{ backgroundColor: COLOR_SWATCHES[color] ?? "#CCC" }}
          />
        ))}
      </div>
    </fieldset>
  );
}
