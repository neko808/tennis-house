"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
import { cn } from "@/lib/utils";

type Side = "left" | "right" | "bottom";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  side?: Side;
  children: ReactNode;
}

const panelBySide: Record<Side, string> = {
  right: "inset-y-0 right-0 h-full w-full max-w-md rounded-l-modal",
  left: "inset-y-0 left-0 h-full w-full max-w-sm rounded-r-modal",
  bottom: "inset-x-0 bottom-0 max-h-[85dvh] w-full rounded-t-modal",
};

/**
 * Open/closed transforms are mutually exclusive: emitting both
 * `translate-x-full` and `translate-x-0` lets CSS source order decide the
 * winner (it picks `-full`), which parks the panel off-screen permanently.
 */
const closedBySide: Record<Side, string> = {
  right: "translate-x-full",
  left: "-translate-x-full",
  bottom: "translate-y-full",
};

const openBySide: Record<Side, string> = {
  right: "translate-x-0",
  left: "translate-x-0",
  bottom: "translate-y-0",
};

/**
 * Drawer shell (§3.6): focus-trapped, Esc to close, focus returned on close,
 * body scroll locked while open (§10).
 */
export function Drawer({ open, onClose, title, side = "right", children }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, open, onClose);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <div className={cn("fixed inset-0 z-50", !open && "pointer-events-none")} aria-hidden={!open}>
      <div
        className={cn(
          "absolute inset-0 bg-ink/40 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          "absolute flex flex-col bg-surface shadow-2xl transition-transform duration-300 ease-out",
          panelBySide[side],
          open ? openBySide[side] : closedBySide[side],
        )}
      >
        {children}
      </div>
    </div>
  );
}
