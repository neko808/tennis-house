"use client";

import Link from "next/link";
import { Drawer } from "@/components/ui/Drawer";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  links: { label: string; href: string }[];
}

export function MobileNav({ open, onClose, links }: MobileNavProps) {
  return (
    <Drawer open={open} onClose={onClose} title="Menu" side="left">
      <div className="flex items-center justify-between border-b border-line px-6 py-4">
        <span className="text-subheading uppercase tracking-widest">Menu</span>
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="flex h-11 w-11 items-center justify-center rounded-btn hover:bg-line"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>
      <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto px-6 py-6">
        <ul className="flex flex-col">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onClose}
                className="block border-b border-line py-4 text-heading hover:text-ink-muted"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col gap-3 text-body text-ink-muted">
          <Link href="/about" onClick={onClose} className="hover:text-ink">About</Link>
          <Link href="/contact" onClick={onClose} className="hover:text-ink">Contact</Link>
        </div>
      </nav>
    </Drawer>
  );
}
