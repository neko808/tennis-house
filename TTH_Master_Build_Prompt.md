Claude must read this document at the start of each session.

# THE TENNIS HOUSE — MASTER BUILD PROMPT
**Version:** 1.1  
**Status:** Active  
**Last updated:** 2026-08-27  
**Changelog v1.1:** Typography confirmed (Neue Haas Display). Asset inventory added (§15) from Google Drive audit.

---

> **How to use this document**  
> This is the single source of truth for every build, design, review, and extension session. Claude must read this document at the start of each session. Requirements here take precedence unless a later session instruction explicitly overrides a specific item and notes the change inline.

---

## 0. TL;DR — What We Are Building

A custom eCommerce storefront for **The Tennis House**: a sport-lifestyle brand targeting adults 20–40. The store combines editorial aesthetics with strong commerce UX. The backend is **Medusa.js**. Payment/checkout is intentionally deferred to a later phase. Everything built now must make adding a payment provider later a clean, non-destructive integration.

---

## 1. Project Identity

| Field | Value |
|---|---|
| Project name | The Tennis House |
| Audience | Adults 20–40, digital-first, sport-lifestyle minded |
| Brand tone | Premium but approachable · Modern · Editorial · Energetic without clutter |
| Commerce platform | Medusa.js (non-negotiable backend) |
| Checkout phase | **Deferred** — placeholder only in Phase 1 |
| Payment data | **Never collected or stored in Phase 1** |

---

## 2. Tech Stack

### Backend — Commerce
| Layer | Choice | Notes |
|---|---|---|
| Commerce platform | **Medusa.js** | Source of truth for all commerce data |
| Database | PostgreSQL | Medusa default; credentials in server-side env only |
| Admin panel | Medusa Admin | Catalog managed here, not in source code |

### Frontend
| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js (App Router)** | SSR/SSG for SEO, performance, Medusa JS SDK compatibility |
| Language | TypeScript | Strict mode on |
| Styling | Tailwind CSS + CSS custom properties | Design tokens live in CSS vars |
| State / cart | Medusa JS SDK + React Context | Cart state through Medusa patterns, not localStorage for sensitive data |
| Image optimization | Next.js `<Image>` | Responsive srcset, modern formats (WebP/AVIF), lazy loading |
| Component library | Custom only | No third-party UI kits — bespoke design system |

### Why Next.js + Medusa
- Next.js Server Components keep Medusa API calls and secrets server-side by default.
- The Medusa JS SDK is maintained for this combination.
- Strong SEO via SSG/SSR for product and category pages.
- App Router enables route-level data fetching with no client-side secret exposure.

### What to Avoid
- Do **not** introduce Shopify or any other commerce platform.
- Do **not** scatter product/catalog data in static JSON files or page components — Medusa owns it.
- Do **not** store cart, pricing, or inventory in client-side files.
- Do **not** move to microservices architecture prematurely.

---

## 3. Design System

### 3.1 Design Principles
1. **Commerce first, decoration second** — every visual choice must serve product discovery or purchase confidence.
2. **Editorial restraint** — generous whitespace, strong typographic hierarchy, minimal decoration.
3. **One signature element** — identify the single most memorable visual detail per view and let everything else be quiet.
4. **Mobile is the primary canvas** — design mobile first, scale up.
5. **Photography leads** — UI frames and presents imagery; it does not compete with it.

### 3.2 Color Palette — *To Be Finalized*
> **Status:** Awaiting brand identity delivery. The following is a working system; replace hex values when final brand colors are provided.

| Token | Name | Hex (placeholder) | Usage |
|---|---|---|---|
| `--color-surface` | Off-white | `#F7F6F4` | Page background |
| `--color-ink` | Near-black | `#111110` | Body text, icons |
| `--color-ink-muted` | Medium grey | `#6B6B65` | Secondary text, labels |
| `--color-accent` | *TBD* | `#—` | Primary CTA, badges, active states |
| `--color-accent-hover` | *TBD* | `#—` | CTA hover |
| `--color-border` | Light grey | `#E4E3DF` | Dividers, card outlines |
| `--color-error` | Red | `#C8322A` | Errors, out-of-stock |
| `--color-success` | Green | `#2A7A4B` | Confirmation states |

> **Instruction:** When the brand palette is delivered, replace placeholder values and audit every component against the updated tokens. Do not hard-code hex values inside components — use CSS custom properties only.

### 3.3 Typography — ✅ Confirmed

> **Status: CONFIRMED.** Typeface family selected. Font files are in Google Drive → `fonts/` folder. Self-host via `@font-face` in `globals.css` — do not use Google Fonts or any CDN for these files.

**Typeface: Neue Haas Display** — A premium grotesque sans-serif with editorial precision. Cold, confident, highly legible at large sizes. Perfect for a modern sport-lifestyle brand that wants to feel authoritative without being loud.

| Role | Typeface | Weights available | Usage |
|---|---|---|---|
| Display / Heading | Neue Haas Display | Roman (400), Medium (500) | Hero headlines, product names, category titles, feature titles |
| Body / UI | Neue Haas Display | Light (300), Roman (400) | Descriptions, nav labels, filters, metadata, body copy |
| Utility / Mono | System mono (`ui-monospace`) | — | Prices, SKU codes, data labels only where tabular figures are needed |

**Font file formats available (self-hosted):**
| Weight | .woff2 | .woff | .eot |
|---|---|---|---|
| Light (300) | ✅ | ✅ | — |
| Roman / Regular (400) | ✅ | ✅ | ✅ |
| Medium (500) | ✅ | ✅ | — |

**`@font-face` implementation (in `styles/globals.css`):**
```css
@font-face {
  font-family: 'NeueHaasDisplay';
  src: url('/fonts/NeueHaasDisplayLight.woff2') format('woff2'),
       url('/fonts/NeueHaasDisplayLight.woff') format('woff');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'NeueHaasDisplay';
  src: url('/fonts/NeueHaasDisplayRoman.woff2') format('woff2'),
       url('/fonts/NeueHaasDisplayRoman.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'NeueHaasDisplay';
  src: url('/fonts/NeueHaasDisplayMediu.woff2') format('woff2'),
       url('/fonts/NeueHaasDisplayMediu.woff') format('woff');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
```

Place all font files under `public/fonts/`. Add the directory to `.gitignore` if font licensing requires it; store files in Google Drive as the source of truth.

**Type scale (set in `design-tokens.css`):**

| Token | Size | Weight | Usage |
|---|---|---|---|
| `--text-hero` | `clamp(3rem, 8vw, 7rem)` | 400 (Roman) | Hero headlines |
| `--text-display` | `clamp(2rem, 5vw, 4rem)` | 400 (Roman) | Section titles, feature headings |
| `--text-heading` | `1.5rem / 2rem` | 500 (Medium) | Product names, page titles |
| `--text-subheading` | `1.125rem` | 500 (Medium) | Category labels, UI headings |
| `--text-body` | `1rem` | 400 (Roman) | Descriptions, filter labels, body copy |
| `--text-small` | `0.875rem` | 300 (Light) | Metadata, badges, legal, captions |
| `--text-price` | `1.25rem` | 500 (Medium) | Price display — use `font-variant-numeric: tabular-nums` |

Type scale follows a modular ratio. Document in `styles/design-tokens.css` before building components.

**Typography rules:**
- Never use more than two typefaces simultaneously.
- Headlines: set tight tracking, strong weight contrast against body.
- Body text: minimum 16px / 1rem on mobile; 1.5–1.6 line-height for readability.
- Price display: use tabular figures for clean column alignment.

### 3.4 Spacing System
Base unit: **4px (`0.25rem`)**. Use multiples: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.  
Document as Tailwind config extensions; derive spacing from the base unit — no magic numbers.

### 3.5 Border Radius
- Cards: `0.5rem` (8px)
- Buttons: `0.375rem` (6px) — slightly less rounded than cards
- Pills / badges: `9999px`
- Modals / drawers: `0.75rem` (12px) on top corners

### 3.6 Component Patterns (Required — Apply Consistently)
| Component | Spec |
|---|---|
| Product card | Fixed-ratio image (4:5 portrait), name, brand (when useful), price, optional badge |
| Button — Primary | Solid accent fill, full-width on mobile, min 44px tap target |
| Button — Secondary | Outlined or ghost; same tap target rule |
| Filter chip | Pill shape, toggleable, clearly selected vs unselected state |
| Size selector | Grid of labeled boxes; unavailable = strikethrough + muted, not hidden |
| Color swatch | Circular, 28px, border on selected, tooltip with name |
| Badge | Pill; "New", "Sale" — never invented unless data supports it |
| Cart icon | Numeric badge when items present |
| Input | 1px border, focus ring visible, label always above field |

---

## 4. Information Architecture

### 4.1 Primary Navigation
| Label | Destination | Notes |
|---|---|---|
| New / Featured | Featured products view | Optional drop for launches |
| Tennis | `/shop?category=tennis` | |
| T-Shirts | `/shop?category=t-shirts` | |
| Pants | `/shop?category=pants` | |
| Caps | `/shop?category=caps` | |
| Accessories | `/shop?category=accessories` | |
| 🔍 Search | Search overlay / page | Icon in header |
| 🛒 Cart | Cart drawer | Item count badge |

### 4.2 Footer Navigation
- Shop links (all categories)
- About, Contact placeholders
- Policy placeholders: Shipping, Returns, Privacy, Terms
- Newsletter signup (UI only — no backend in Phase 1)
- Social links (placeholder icons)
- Legal line

### 4.3 URL Structure
| Page | Pattern |
|---|---|
| Homepage | `/` |
| Shop all | `/shop` |
| Category | `/shop?category=[slug]` |
| Product | `/products/[handle]` |
| About | `/about` |
| Contact | `/contact` |
| Policy pages | `/policies/[slug]` |

---

## 5. Page-by-Page Requirements

### 5.1 Homepage

**Goal:** Communicate brand immediately, funnel shoppers into the catalog.

| Section | Required? | Spec |
|---|---|---|
| Header | Required | Logo · Nav · Search icon · Cart icon (with count) · Mobile hamburger |
| Hero | Required | Full-width visual · Headline · 1–2 CTAs (e.g. "Shop New Arrivals", "Explore Tennis") |
| Featured Products | Required | 4–6 product cards · Data from Medusa "featured" flag |
| Shop by Category | Required | Visual tiles for Tennis, T-Shirts, Pants, Caps, Accessories |
| Editorial / Collection Feature | Optional | Image-led section · seasonal or campaign content |
| New Arrivals / Popular | Optional | Secondary product grid to drive discovery |
| Trust Strip | Optional | Shipping · Returns · Support · Secure checkout (placeholder text only) |
| Footer | Required | Full secondary nav + policies + newsletter UI + legal |

**Medusa data sources:** Featured product list via Medusa product list API with `tags=featured` or collection; categories via Medusa collections/categories endpoint.

---

### 5.2 Shop / Products Page (`/shop`)

**Goal:** Browsable product grid with filtering and sorting, no friction.

#### Desktop Layout
```
┌─────────────────────────────────────────────────────────┐
│  Header (full-width)                                    │
├───────────────┬─────────────────────────────────────────┤
│               │  [Result count] [Sort dropdown]         │
│  Filter       │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│  Sidebar      │  │Card  │ │Card  │ │Card  │ │Card  │  │
│  (left, ~240px│  └──────┘ └──────┘ └──────┘ └──────┘  │
│  fixed width) │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│               │  │Card  │ │Card  │ │Card  │ │Card  │  │
│               │  └──────┘ └──────┘ └──────┘ └──────┘  │
└───────────────┴─────────────────────────────────────────┘
```

#### Mobile Layout
```
┌─────────────────────────────┐
│  Header                     │
│  [Filter button] [Sort]     │
│  ┌───────────┐ ┌───────────┐│
│  │  Card     │ │  Card     ││
│  └───────────┘ └───────────┘│
│  ┌───────────┐ ┌───────────┐│
│  │  Card     │ │  Card     ││
│  └───────────┘ └───────────┘│
└─────────────────────────────┘
  ↓ Filter button → bottom drawer/sheet
```

#### Filters (Sidebar / Drawer)
| Filter | Behavior |
|---|---|
| Category | Checkboxes; active category pre-selected |
| Brand | Checkboxes; show only brands present in results |
| Price range | Dual-handle slider or min/max inputs |
| Size | Toggle pills |
| Color | Color swatches |
| Availability | Toggle: In stock only |
| Tags | Optional pills: New, Featured, Sale |

- Filters update results; preserve state in URL query params for shareability/back-button.
- "Clear all filters" always visible when any filter is active.
- Selected filter count shown on mobile filter button.

#### Sort Options
- Featured (default)
- Price: Low to High
- Price: High to Low
- Newest

#### Pagination
- Infinite scroll **or** "Load more" button — decide before build, document here.
- Recommend: "Load more" for simplicity in Phase 1; infinite scroll as an enhancement.

**Medusa data sources:** Product list API with filter and sort params; category/collection filtering; price range from query.

---

### 5.3 Product Detail Page (`/products/[handle]`)

**Goal:** Enough visual confidence and information to make a purchase decision.

#### Layout
```
Desktop:
┌─────────────────────────────────────────────────────────┐
│  ← Breadcrumb                                           │
├────────────────────────┬────────────────────────────────┤
│                        │  Brand · Product Name          │
│  Image Gallery         │  Price (+ compare-at if sale)  │
│  [Main image]          │                                │
│                        │  Color: ●●●●                   │
│  [thumb][thumb][thumb] │  Size: [S][M][L][XL]           │
│                        │  [Size guide link]             │
│                        │  Qty: [−][1][+]                │
│                        │  [Add to Cart ————————————]   │
│                        │  Availability state            │
│                        │  ──────────────────────────    │
│                        │  Description                   │
│                        │  Materials · Fit · Care        │
└────────────────────────┴────────────────────────────────┘
│  Related Products (full width)                          │
└─────────────────────────────────────────────────────────┘
```

#### Key Requirements
| Element | Spec |
|---|---|
| Gallery | Swipeable on mobile; thumbnail rail on desktop; multiple images |
| Product name | H1 for SEO |
| Price | Large, prominent; compare-at if `original_price` present in Medusa |
| Color swatches | Change gallery image on selection; tooltip with color name |
| Size selector | Box grid; OOS size = strikethrough + `aria-disabled`; never silently hidden |
| Quantity | Default 1; min 1, max reasonable; hide if product has no quantity concept |
| Add to Cart | Clear loading state · success state · error state · disabled when OOS |
| Availability | Show: "In stock" / "Only X left" / "Out of stock" — from Medusa inventory |
| Details accordion | Description · Materials · Fit & Care · Specs — collapsible sections |
| Delivery / Returns | Placeholder text only — do **not** invent shipping promises |
| Related products | 4 products from same category/collection via Medusa |

**Medusa data sources:** Single product by handle; variant selection updates price/availability from Medusa variant data; Add to Cart calls Medusa cart line-item endpoint.

---

### 5.4 Cart (Drawer)

**Goal:** Review and manage items; clear path toward a future checkout.

- Triggered by cart icon in header — slides in as a drawer from the right.
- Does **not** navigate away from the current page.

| Element | Spec |
|---|---|
| Line items | Product image · Name · Selected color + size · Unit price · Qty control · Remove |
| Qty control | +/− buttons; updates via Medusa cart update endpoint |
| Remove | Single tap/click; confirm not required for Phase 1 |
| Subtotal | Recalculates on every change; from Medusa cart total |
| Taxes / shipping | "Calculated at checkout" placeholder |
| Checkout CTA | Visible but **non-functional** in Phase 1; clearly labeled "Coming soon" or disabled |
| Empty state | Friendly message + "Start shopping" link |
| Persistence | Medusa cart_id stored in a secure, httpOnly cookie (server-managed); not in localStorage |

**Security note:** Cart ID is the only identifier stored client-side (as a cookie). No pricing, inventory, or product data is authoritative from the client — all totals come from Medusa.

---

### 5.5 Search

- Header search icon opens a full-screen overlay or top-mounted search bar.
- Accepts text input; queries Medusa product search endpoint.
- Shows product card results inline as the user types (debounced).
- "No results" state with suggested categories.
- Keyboard accessible: Esc to close, arrow keys to navigate results.
- Phase 1: use Medusa built-in search; advanced search provider (Algolia/MeiliSearch) is a later enhancement.

---

### 5.6 Utility / Static Pages (Placeholders)

Build shell pages with correct layout (header + footer) and placeholder content for:

| Page | Path | Placeholder message |
|---|---|---|
| About | `/about` | "Our story is coming soon." |
| Contact | `/contact` | Contact form UI (no backend in Phase 1) |
| Shipping | `/policies/shipping` | "Shipping policy coming soon." |
| Returns | `/policies/returns` | "Returns policy coming soon." |
| Privacy | `/policies/privacy` | "Privacy policy coming soon." |
| Terms | `/policies/terms` | "Terms of service coming soon." |

Do **not** invent policy content. These pages exist so navigation links work.

---

## 6. Medusa.js Integration Map

| Feature | Medusa Endpoint / Concept | Phase |
|---|---|---|
| Product list (shop page) | `GET /store/products` | 1 |
| Product detail | `GET /store/products/:handle` | 1 |
| Categories | `GET /store/product-categories` | 1 |
| Collections | `GET /store/collections` | 1 |
| Create cart | `POST /store/carts` | 1 |
| Add line item | `POST /store/carts/:id/line-items` | 1 |
| Update line item | `POST /store/carts/:id/line-items/:id` | 1 |
| Delete line item | `DELETE /store/carts/:id/line-items/:id` | 1 |
| Get cart | `GET /store/carts/:id` | 1 |
| Search | `GET /store/products?q=` | 1 |
| Customer accounts | Customer endpoints | Later |
| Checkout / payment | Payment provider via Medusa | **Deferred** |
| Order creation | `POST /store/carts/:id/complete` | **Deferred** |

**Environment variables (server-side only — never in client bundles):**
```
MEDUSA_BACKEND_URL=
MEDUSA_PUBLISHABLE_KEY=      # safe for client; goes in .env.local NEXT_PUBLIC_
MEDUSA_ADMIN_API_KEY=        # NEVER exposed to client
DATABASE_URL=                # NEVER exposed to client
```

---

## 7. Build Phases

### Phase 1 — Current Scope
> **This is the active build phase.**

- [ ] Project scaffold: Next.js + TypeScript + Tailwind + Medusa SDK
- [ ] Design token system (CSS custom properties)
- [ ] Core component library: Button, Input, Card, Badge, Drawer, Modal shell
- [ ] Layout: Header, Footer, mobile nav
- [ ] Homepage: Hero, Featured Products, Category tiles, Footer
- [ ] Shop page: Grid + filters (desktop sidebar + mobile drawer) + sort + pagination
- [ ] Product Detail Page: Gallery, variants, size selection, Add to Cart
- [ ] Cart drawer: Line items, qty, remove, subtotal, checkout placeholder
- [ ] Search overlay: Basic Medusa search
- [ ] Utility placeholder pages
- [ ] Seed data: Clearly labeled sample products in Medusa Admin
- [ ] Setup documentation (`README.md` + `ARCHITECTURE.md`)

### Phase 2 — Future (Do Not Build Yet)
- Payment provider integration through Medusa
- Full checkout flow
- Customer accounts (login, order history)
- Advanced search (Algolia/MeiliSearch)
- Newsletter backend
- Analytics and marketing integrations
- Real product catalog, photography, and brand assets

---

## 8. Security Baseline (Non-Negotiable)

| Rule | Detail |
|---|---|
| No secrets in client | All Medusa admin keys, DB URLs, and privileged tokens stay in server-side env vars |
| NEXT_PUBLIC_ vars | Only use for values safe to expose: `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` |
| Cart persistence | Cart ID in a secure, httpOnly cookie — not localStorage |
| No payment data | Zero card or payment data collected, stored, or transmitted in Phase 1 |
| Input validation | All user input validated server-side; never trust client-submitted prices or stock |
| HTTPS | Required in all non-local environments |
| Dependencies | Use maintained packages; run `npm audit` before shipping |
| No custom crypto | Never build custom encryption, hashing, or payment processing |
| Logging | Never log secrets, tokens, or personal data |
| CSRF | Protect state-changing routes when sessions are introduced |

---

## 9. Performance & SEO Checklist

- [ ] Next.js `<Image>` for all product/campaign images (WebP/AVIF, responsive srcset)
- [ ] Lazy load below-fold images
- [ ] No layout shift (CLS): reserve image dimensions; avoid async-loaded content pushing layout
- [ ] Page titles: `[Product Name] — The Tennis House`
- [ ] Meta descriptions on product, category, and homepage
- [ ] Semantic headings: one `<h1>` per page, logical `h2/h3` hierarchy
- [ ] Product URLs: `/products/[human-readable-handle]` — indexed by Google
- [ ] Canonical tags where needed (filtered pages)
- [ ] Structured data (JSON-LD for products): planned for Phase 2 when real data exists
- [ ] Core Web Vitals: LCP < 2.5s target; no excessive client JS

---

## 10. Accessibility Baseline

- [ ] Color contrast: WCAG AA minimum (4.5:1 body, 3:1 large text)
- [ ] Keyboard navigation: all interactive elements reachable and operable via keyboard
- [ ] Visible focus styles: never `outline: none` without a custom focus ring
- [ ] Size/color selectors: accessible labels + `aria-disabled` for OOS options
- [ ] Cart drawer: focus trap while open; Esc to close; focus returns on close
- [ ] Search overlay: same focus trap rules as cart drawer
- [ ] Images: meaningful `alt` text on all product images; decorative images `alt=""`
- [ ] Forms: `<label>` always explicitly associated with its input
- [ ] Reduced motion: respect `prefers-reduced-motion` for all transitions/animations
- [ ] Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<footer>` on every page

---

## 11. Code & File Structure

```
/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout: header, footer, providers
│   ├── page.tsx                # Homepage
│   ├── shop/
│   │   └── page.tsx            # Shop / products listing
│   ├── products/
│   │   └── [handle]/
│   │       └── page.tsx        # Product detail
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   └── policies/[slug]/page.tsx
│
├── components/
│   ├── layout/                 # Header, Footer, MobileNav
│   ├── product/                # ProductCard, ProductGallery, VariantSelector, SizeSelector
│   ├── shop/                   # FilterSidebar, FilterDrawer, SortControl, ProductGrid
│   ├── cart/                   # CartDrawer, CartLineItem, CartSummary
│   ├── search/                 # SearchOverlay, SearchResults
│   └── ui/                     # Button, Input, Badge, Drawer, Modal, Spinner — primitives only
│
├── lib/
│   ├── medusa/
│   │   ├── client.ts           # Medusa SDK client (server-side)
│   │   ├── products.ts         # Product fetch helpers
│   │   ├── cart.ts             # Cart helpers
│   │   └── categories.ts       # Category fetch helpers
│   └── utils.ts                # Formatters, helpers
│
├── styles/
│   ├── globals.css             # CSS custom properties (design tokens), base reset
│   └── typography.css          # Type scale
│
├── types/
│   └── medusa.ts               # Typed wrappers for Medusa response shapes
│
├── public/                     # Static assets
├── .env.local                  # Never committed; listed in .gitignore
├── .env.example                # Committed; shows required vars with empty values
├── README.md                   # Setup instructions
└── ARCHITECTURE.md             # Decisions log
```

---

## 12. Claude Operating Rules

These rules apply to every session on this project:

1. **Read this document first** — treat it as the session source of truth.
2. **Medusa.js is the backend** — never introduce Shopify or replace Medusa without an explicit override instruction.
3. **No invented data** — no real product names, prices, brands, shipping promises, return promises, or policies unless sample data is explicitly requested and clearly labeled.
4. **No payment data in Phase 1** — no card fields, no payment processing, no payment storage.
5. **Secrets stay server-side** — no privileged keys in client bundles; only `NEXT_PUBLIC_` prefixed, safe-to-expose values may reach the browser.
6. **No silent scope expansion** — mark optional ideas separately; ask before expanding beyond the current phase.
7. **Design tokens, not hard-coded values** — every color, spacing, and typography decision references a CSS custom property or Tailwind config value.
8. **Accessibility is not optional** — every component meets the baseline in §10.
9. **Consistent patterns** — use the component specs in §3.6 across every page; no one-off markup.
10. **Document decisions** — significant architecture or stack choices go in `ARCHITECTURE.md`.
11. **Point out tradeoffs** — when a requested feature conflicts with security, performance, or maintainability, name the tradeoff and propose a safer alternative.
12. **Propose, then build** — for non-trivial components, briefly describe the approach before writing code.

---

## 13. Phase 1 Acceptance Checklist

### Structure & Navigation
- [ ] Functional navigation: all category links route correctly
- [ ] Mobile nav menu opens and closes, all links work
- [ ] Cart icon shows item count badge when items present
- [ ] Search accessible from header on all pages

### Homepage
- [ ] Hero displays with headline and working CTAs
- [ ] Featured products load from Medusa (or clearly-labeled seed data)
- [ ] Category tiles link to filtered shop page

### Shop Page
- [ ] Responsive product grid at mobile, tablet, and desktop widths
- [ ] Desktop: filter sidebar with Category, Brand, Price, Size, Color, Availability
- [ ] Mobile: filter button opens drawer with same filters
- [ ] Sort control works
- [ ] Filters update product list; selections persist in URL params
- [ ] "Clear all" resets filters

### Product Detail Page
- [ ] Images display; gallery works on mobile (swipeable) and desktop (thumbnails)
- [ ] Color and size selectors functional; OOS variants disabled, not hidden
- [ ] Add to Cart button adds item to Medusa cart
- [ ] Price, availability, and variant data come from Medusa

### Cart
- [ ] Cart drawer opens from any page
- [ ] Line items show image, name, variant, price, qty, remove
- [ ] Qty +/− updates Medusa cart
- [ ] Remove deletes line item from Medusa cart
- [ ] Subtotal reflects Medusa cart total
- [ ] Checkout CTA is non-functional and clearly labeled as deferred

### Quality
- [ ] Site is responsive at 320px, 768px, 1024px, 1440px
- [ ] All interactive elements keyboard-navigable
- [ ] No credentials or secrets in client-side code or browser devtools
- [ ] No console errors on page load
- [ ] `README.md` and `ARCHITECTURE.md` are complete

---

## 14. Pending Inputs — Add When Available

| Input | Status | Needed For |
|---|---|---|
| Final logo (SVG preferred) | ⏳ Pending | Header, favicon, OG image |
| Brand color palette (accent) | ⏳ Pending | Design token finalization |
| ~~Typeface decisions~~ | ✅ **Done — Neue Haas Display (§3.3)** | — |
| Product photography | ✅ Placeholder set available (§15) | Real product cards and PDPs |
| Real product catalog | ⏳ Pending | Medusa seed/import |
| Shipping & returns copy | ⏳ Pending | Policy pages |
| Social media handles | ⏳ Pending | Footer |
| Contact email/form destination | ⏳ Pending | Contact page backend |
| Analytics tag (GA4 / etc.) | ⏳ Pending | Integration — Phase 2 |
| Payment provider decision | ⏳ Pending | Checkout — Phase 2 |
| Medusa hosting environment | ⏳ Pending | Production deployment |

---

## 15. Asset Inventory — Google Drive

**Drive root:** [The Tennis House](https://drive.google.com/drive/folders/1ul_fh08tzsf2EhWNYUfDUAl4rJdbCSqA)

All project assets are organized into 5 folders. Claude should reference this inventory when building components so it uses real assets rather than placeholder URLs wherever possible.

---

### 15.1 `fonts/` — Self-Hosted Typeface
**Drive folder ID:** `1At3CBMEL86nSQ-nishj7AUI1XTqbUJvJ`

All files are for **Neue Haas Display** (see §3.3 for `@font-face` implementation). Copy files to `public/fonts/` in the project.

| File | Weight | Format | Drive ID |
|---|---|---|---|
| `NeueHaasDisplayLight.woff2` | 300 (Light) | woff2 | `1PLVuXwVkt3y0oHTvPzsUzv9tkmsFWfSi` |
| `NeueHaasDisplayLight.woff` | 300 (Light) | woff | `1nVSJBOi-3T42FXQ_jwmyY36xqkphDhPE` |
| `NeueHaasDisplayRoman.woff2` | 400 (Roman) | woff2 | `1mgEw0kzAFIwPkq5z13BN54cFCBUFJIkw` |
| `NeueHaasDisplayRoman.woff` | 400 (Roman) | woff | `1A_dMkCHlqtE0c-OMILiBIpPW6GES2WDM` |
| `NeueHaasDisplayRoman.eot` | 400 (Roman) | eot | `160kPd_ywtxsDfQU5-gHYliXj-Jf8nlO3` |
| `NeueHaasDisplayMediu.woff2` | 500 (Medium) | woff2 | `1FTwZ6qpjMsoy0u3MhhcM6eX86mKfMcDJ` |
| `NeueHaasDisplayMediu.woff` | 500 (Medium) | woff | `1_bknoT0cRKCQFXdIS5A8zljjAsHpCQY-` |

> **Note on `.eot`:** EOT is only needed for Internet Explorer 8 and below. The project targets modern browsers; woff2 + woff is sufficient. Include `.eot` only if IE legacy support becomes a requirement.

---

### 15.2 `imagesToUse/` — Product & Lifestyle Photography
**Drive folder ID:** `1lJTHgi64_7-Zet7uU-PkPSaVV2QK9SLn`

These are the placeholder product and editorial images for Phase 1 development. Clearly label all usage as "sample / placeholder content." Do **not** present these as real TTH product listings.

| File | Type | Description | Drive ID |
|---|---|---|---|
| `istockphoto-2212265090-1024x1024.webp` | Lifestyle | Woman jogging outdoors, fitness outfit, confident expression | `1mUwQgV4rnQ4qJoJvl-V7WwR8nKGd9V_H` |
| `W-NIKE-VOMERO-18.webp` | Product | Nike Vomero 18 women's running shoe | `1j2t-cDqZs3RvWgS_XItUa8AVh27-8Yb5` |
| `W-NK-ARSWFT-DFADV-CROP-TOP-PKT.webp` | Product | Nike women's crop top / athletic top | `10-3R-JiCC66_A2GaMLHRr9QsjtQAHANq` |
| `M-NK-DF-FORM-GFX-TPR-PANT.webp` | Product | Nike men's Dri-FIT graphic training pant | `1PaGqMuWgKIvRP2F_sE7lJPmrp9KB1gyQ` |
| `premium_photo-1664537975122-9c598d85816e.webp` | Lifestyle | Premium lifestyle/sport editorial photo | `1RTnGl8R9PUJz842dhW4sB1jtC_HZMniZ` |
| `premium_photo-1674605368189-1f60b9740ffe.webp` | Lifestyle | Premium lifestyle/sport editorial photo | `1DAl0eqJsoKCTW_Lzs7U-fSX0KZduITGt` |
| `premium_photo-1664301350480-71604a7ba39c.webp` | Lifestyle | Premium lifestyle/sport editorial photo | `1QI54CszZL22DUXyyKqU7oAIxklg5CxOm` |
| `sitio-web-oficial-de-nike.webp` | Reference | Nike website screenshot (UI reference only — not for production use) | `17vjomsAoh1546nOQfclgWsOPxxPJrSQn` |

**Suggested usage mapping:**
- Hero section → `premium_photo-1664537975122...` (large lifestyle)
- Featured products → Nike product images (Vomero, crop top, pants)
- Category tiles → lifestyle photos + product crops
- Editorial / collection feature → `premium_photo-1674605368...`

---

### 15.3 `interface/` — Design Reference Screenshots
**Drive folder ID:** `1z8Y_BJPZpGXsLA25_-7vT-8SYNyAaDex`

Reference images showing the intended design direction and layout patterns. **These are references only — not final designs.** Use them to guide component decisions during build.

| File | What it shows | Drive ID |
|---|---|---|
| `homepage.webp` | Homepage layout reference for TTH | `1lXAclWx-oYjU7KKsXoiT1rZTw_CCOFJs` |
| `homepage_reference.jpg` | Nike.com homepage layout (nav, hero, trending grid, footer) | `1BiFAr3lYftU5WeCvSJrTSgT85_n0ZB3h` |
| `homepage_reference_3.webp` | Additional homepage UI reference | `1KNWqtUth47lfQtFK_v46h3AFA3nMXbsW` |
| `homepage3.jpg` | Tennis brand site reference (TENISTA/Dekosta — featured collections, court booking, membership module) | `1HVEJdqlV8hp90M4R_IpPeKI9rTirZNKS` |
| `products.webp` | Products / shop page layout reference | `1yNp5sSDl8gxPZldgMmQIEfDb8P3ZfabD` |
| `detail.webp` | Product detail page layout reference | `1mscKf6yfPeqC_Az5N8wwvueNdpQaDhGB` |
| `detail2.jpg` | PDP reference (Trendo — Nike Air Force 1, size grid, clean sans UI, clear hierarchy) | `157YPdp7whkqKbzneaei1KFr_XzwOu2Qp` |

**Key design observations from the references:**
- Clean, whitespace-heavy layouts with strong typographic hierarchy.
- Product detail pages lead with large imagery left, controls right.
- Size selectors use a simple grid of labeled boxes.
- Navigation is minimal — logo left, categories center or right, utility icons (search, cart) far right.
- Sport-lifestyle brands use confident headlines at large scale, body copy restrained and short.

---

### 15.4 `Claude/` — Claude Session Files
**Drive folder ID:** `161_-Ri47EnOcBlkTOm_LYI2ejpNiIZsJ`

Stores documents generated during Claude sessions, including this master build prompt. Keep updated versions here.

| File | Drive ID |
|---|---|
| `TTH_Master_Build_Prompt.md` (v1.0) | `1b5-keRoOxF8E4emZQxfwdhKaeJksqNsN` |

---

### 15.5 `Video/` — Campaign / Hero Video
**Drive folder ID:** `1Iu-yfvtxMsQpI55Ah5180MJdUTg3m3fM`

Currently empty. Reserved for future hero or campaign video assets.

---

*End of Master Build Prompt — v1.1*  
*Any modifications should be versioned (increment minor for additions, major for structural changes) and noted with date and session context.*
