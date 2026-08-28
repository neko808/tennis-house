import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

const fieldClasses =
  "w-full rounded-btn border border-line bg-surface px-4 py-3 text-body text-ink placeholder:text-ink-muted focus-visible:outline-2 focus-visible:outline-ink";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

/** §3.6 — label always above the field, explicitly associated (§10). */
export function Input({ label, id, className, ...props }: InputProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-small font-medium text-ink">
        {label}
      </label>
      <input id={id} className={fieldClasses} {...props} />
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
}

export function Textarea({ label, id, className, ...props }: TextareaProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-small font-medium text-ink">
        {label}
      </label>
      <textarea id={id} rows={5} className={fieldClasses} {...props} />
    </div>
  );
}
