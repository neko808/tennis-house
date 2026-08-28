import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Tone = "new" | "sale" | "neutral";

const tones: Record<Tone, string> = {
  new: "bg-ball text-ink",
  sale: "bg-error text-surface",
  neutral: "bg-ink text-surface",
};

/** Pill badge (§3.6) — only rendered when catalog data supports it. */
export function Badge({ tone = "neutral", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-small font-medium uppercase tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
