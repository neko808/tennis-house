"use client";

interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  label?: string;
  compact?: boolean;
  disabled?: boolean;
}

export function QuantityStepper({
  value,
  min = 1,
  max = 10,
  onChange,
  label = "Quantity",
  compact,
  disabled,
}: QuantityStepperProps) {
  const size = compact ? "h-9 w-9" : "h-11 w-11";
  return (
    <div
      className="inline-flex items-center rounded-btn border border-line"
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={disabled || value <= min}
        aria-label={`Decrease ${label.toLowerCase()}`}
        className={`${size} text-lg leading-none text-ink transition-colors hover:bg-line disabled:opacity-40`}
      >
        −
      </button>
      <span aria-live="polite" className={`price min-w-9 text-center ${compact ? "text-small" : "text-body"}`}>
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={disabled || value >= max}
        aria-label={`Increase ${label.toLowerCase()}`}
        className={`${size} text-lg leading-none text-ink transition-colors hover:bg-line disabled:opacity-40`}
      >
        +
      </button>
    </div>
  );
}
