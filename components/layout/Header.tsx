"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MobileNav } from "@/components/layout/MobileNav";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { useCart } from "@/components/cart/CartProvider";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "New / Featured", href: "/shop?tags=featured" },
  { label: "Tennis", href: "/shop?category=tennis" },
  { label: "T-Shirts", href: "/shop?category=t-shirts" },
  { label: "Pants", href: "/shop?category=pants" },
  { label: "Caps", href: "/shop?category=caps" },
  { label: "Accessories", href: "/shop?category=accessories" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { itemCount, openCart } = useCart();

  const overHero = pathname === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-btn focus:bg-surface focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-colors duration-300",
          overHero
            ? "bg-ink/50 text-surface backdrop-blur"
            : "border-b border-line bg-surface/90 text-ink backdrop-blur",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="flex h-11 w-11 items-center justify-center rounded-btn"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>

          <Link
            href="/"
            className="text-subheading font-medium uppercase tracking-[0.2em]"
            aria-label="The Tennis House — home"
          >
            The Tennis House
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-small font-normal uppercase tracking-wide underline-offset-8 hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              className="flex h-11 w-11 items-center justify-center rounded-btn"
            >
              <svg width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                <circle cx="9.5" cy="9.5" r="6.75" stroke="currentColor" strokeWidth="1.5" />
                <path d="M14.5 14.5L20 20" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
            <button
              onClick={openCart}
              aria-label={`Open cart${itemCount > 0 ? `, ${itemCount} item${itemCount === 1 ? "" : "s"}` : ""}`}
              className="relative flex h-11 w-11 items-center justify-center rounded-btn"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M4 6h12l-1 11H5L4 6zM7 6V5a3 3 0 016 0v1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
              {itemCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-ball px-1 text-[0.6875rem] font-medium text-ink"
                >
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} links={NAV_LINKS} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
