"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { searchProductsAction, type SearchHit } from "@/app/actions/search";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
import { Spinner } from "@/components/ui/Spinner";
import { formatPrice } from "@/lib/utils";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

const SUGGESTED = [
  { label: "Tennis", href: "/shop?category=tennis" },
  { label: "T-Shirts", href: "/shop?category=t-shirts" },
  { label: "Pants", href: "/shop?category=pants" },
  { label: "Caps", href: "/shop?category=caps" },
  { label: "Accessories", href: "/shop?category=accessories" },
];

/**
 * Full-screen search overlay (§5.5): debounced query against the product
 * search helper, Esc to close, arrow keys move through results.
 */
export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [searching, setSearching] = useState(false);
  const [touched, setTouched] = useState(false);

  useFocusTrap(containerRef, open, onClose);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setHits([]);
      setTouched(false);
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setHits([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    const timer = setTimeout(async () => {
      const results = await searchProductsAction(query);
      setHits(results);
      setSearching(false);
      setTouched(true);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  const onListKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const links = resultsRef.current?.querySelectorAll<HTMLAnchorElement>("a");
    if (!links || links.length === 0) return;
    const current = Array.from(links).indexOf(document.activeElement as HTMLAnchorElement);
    const next =
      event.key === "ArrowDown"
        ? Math.min(current + 1, links.length - 1)
        : Math.max(current - 1, 0);
    links[next].focus();
  }, []);

  if (!open) return null;

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Search products"
      tabIndex={-1}
      className="fixed inset-0 z-50 flex flex-col bg-surface"
      onKeyDown={onListKeyDown}
    >
      <div className="mx-auto w-full max-w-3xl px-4 pt-8 sm:px-6">
        <div className="flex items-center gap-4 border-b-2 border-ink pb-4">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <circle cx="9.5" cy="9.5" r="6.75" stroke="currentColor" strokeWidth="1.5" />
            <path d="M14.5 14.5L20 20" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <label htmlFor="site-search" className="sr-only">
            Search products
          </label>
          <input
            id="site-search"
            data-autofocus
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the sample catalog…"
            autoComplete="off"
            className="w-full bg-transparent text-heading outline-none placeholder:text-ink-muted"
          />
          {searching && <Spinner />}
          <button
            onClick={onClose}
            aria-label="Close search"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-btn hover:bg-line"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>

        <div className="max-h-[70dvh] overflow-y-auto py-6">
          {hits.length > 0 && (
            <ul ref={resultsRef} className="grid grid-cols-2 gap-4 sm:grid-cols-4" aria-label="Search results">
              {hits.map((hit) => (
                <li key={hit.id}>
                  <Link
                    href={`/products/${hit.handle}`}
                    onClick={onClose}
                    className="group block"
                  >
                    <div className="relative aspect-product overflow-hidden rounded-card bg-line">
                      <Image
                        src={hit.thumbnail.url}
                        alt={hit.thumbnail.alt}
                        fill
                        sizes="(min-width: 640px) 25vw, 50vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-2 text-small font-medium text-ink group-hover:underline">{hit.title}</p>
                    <p className="price text-small text-ink-muted">{formatPrice(hit.price)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {touched && !searching && query.trim() && hits.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-heading">No results for “{query}”</p>
              <p className="mt-2 text-body text-ink-muted">Try one of these instead:</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {SUGGESTED.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    onClick={onClose}
                    className="rounded-full border border-line px-4 py-2 text-small hover:border-ink"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!query.trim() && (
            <div className="flex flex-wrap gap-2 pt-2">
              {SUGGESTED.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  onClick={onClose}
                  className="rounded-full border border-line px-4 py-2 text-small hover:border-ink"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
