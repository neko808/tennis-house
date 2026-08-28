import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

/** §3.6 — 44px minimum tap target on every variant. */
const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-btn px-6 py-3 text-body font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-surface hover:bg-accent-hover",
  secondary: "border border-ink bg-transparent text-ink hover:bg-ink hover:text-surface",
  ghost: "bg-transparent text-ink underline-offset-4 hover:underline",
};

/**
 * Shared button classes so non-<button> elements (e.g. a Next <Link> acting as
 * a CTA) render identically to <Button> without duplicating the spec.
 */
export function buttonClasses({
  variant = "primary",
  fullWidth,
  className,
}: {
  variant?: Variant;
  fullWidth?: boolean;
  className?: string;
} = {}): string {
  return cn(base, variants[variant], fullWidth && "w-full", className);
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

export function Button({ variant = "primary", fullWidth, className, ...props }: ButtonProps) {
  return <button className={buttonClasses({ variant, fullWidth, className })} {...props} />;
}
