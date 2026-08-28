import Link from "next/link";
import { NewsletterForm } from "@/components/layout/NewsletterForm";

const SHOP_LINKS = [
  { label: "Shop All", href: "/shop" },
  { label: "Tennis", href: "/shop?category=tennis" },
  { label: "T-Shirts", href: "/shop?category=t-shirts" },
  { label: "Pants", href: "/shop?category=pants" },
  { label: "Caps", href: "/shop?category=caps" },
  { label: "Accessories", href: "/shop?category=accessories" },
];

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const POLICY_LINKS = [
  { label: "Shipping", href: "/policies/shipping" },
  { label: "Returns", href: "/policies/returns" },
  { label: "Privacy", href: "/policies/privacy" },
  { label: "Terms", href: "/policies/terms" },
];

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-small font-medium uppercase tracking-widest text-ink-muted">{title}</h3>
      <ul className="mt-4 flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-body text-ink underline-offset-4 hover:underline">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <FooterColumn title="Shop" links={SHOP_LINKS} />
          <FooterColumn title="Company" links={COMPANY_LINKS} />
          <FooterColumn title="Policies" links={POLICY_LINKS} />
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-small font-medium uppercase tracking-widest text-ink-muted">
              Newsletter
            </h3>
            <p className="mt-4 text-body text-ink-muted">
              Drops, stories and court notes. Sign-up goes live in a later phase.
            </p>
            <NewsletterForm />
            <div className="mt-6 flex gap-4" aria-label="Social media (placeholders)">
              {["Instagram", "X", "YouTube"].map((name) => (
                <a
                  key={name}
                  href="#"
                  aria-label={`${name} (link coming soon)`}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink"
                >
                  <SocialGlyph name={name} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-small text-ink-muted md:flex-row md:items-center md:justify-between">
          <p>© 2026 The Tennis House. All rights reserved.</p>
          <p>Demo storefront — the catalog shown is clearly-labeled sample data, not real offers.</p>
        </div>
      </div>
    </footer>
  );
}

function SocialGlyph({ name }: { name: string }) {
  if (name === "Instagram")
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <rect x="1.5" y="1.5" width="15" height="15" rx="4" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="9" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="13.5" cy="4.5" r="1" fill="currentColor" />
      </svg>
    );
  if (name === "X")
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="1.5" y="4" width="15" height="10" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7.5 7l4 2-4 2V7z" fill="currentColor" />
    </svg>
  );
}
