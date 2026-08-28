# Architecture Decisions — The Tennis House

Log of significant decisions (Master Build Prompt §12.10). Newest last.

## 2026-08-28 — Phase 1 scaffold

### Frontend-first with a Medusa-shaped data layer
**Decision:** Build the complete storefront now against `lib/medusa/*` helpers
backed by local seed data, instead of standing up Medusa + PostgreSQL first.
**Why:** The dev machine has no PostgreSQL/Docker yet; the user chose
frontend-first explicitly. **Contract:** everything commerce-shaped flows
through `lib/medusa/*` and `types/medusa.ts`, which mirror the Medusa Store
API (§6 endpoint map). Phase 2 swaps helper internals for
`@medusajs/js-sdk` calls (already installed, see `lib/medusa/client.ts`)
without touching pages or components. No product data lives in components.

### Cart: httpOnly cookie + server-side store
**Decision:** The browser holds only an opaque cart id in a secure httpOnly
cookie (`_tth_cart_id`). Lines are stored server-side (`.data/carts.json`,
dev-only) as `{product_id, variant_id, quantity}`; titles, prices and totals
are re-derived from the catalog on every read.
**Why:** §5.4/§8 — never trust client-submitted prices or stock; localStorage
is explicitly ruled out. The JSON file store is single-process and dev-only;
it is the stand-in for Medusa's `/store/carts` endpoints and is deleted in
Phase 2.

### Server actions instead of API routes
Cart and search mutations use Next server actions (`app/actions/*`), which
keeps all catalog access server-side with zero client-exposed endpoints and
CSRF protection provided by Next's action encryption/origin checks.

### Working accent color
Brand palette is still pending (§3.2). Working accent: **court green**
`#2F5233` (+ hover `#24402A`) with a tennis-ball highlight `#D9F24F`
(`--color-ball`) for badges, marquee, and the cart count. All via tokens in
`styles/globals.css` — swap the values there when the brand palette lands and
audit contrast again (accent-on-surface and ball-with-ink both pass WCAG AA
today).

### Typography
Neue Haas Display self-hosted per §3.3 with the exact `@font-face` block from
the master prompt (`styles/globals.css`), woff2+woff only (`.eot` skipped —
no IE8 target). Roman + Medium are preloaded in `app/layout.tsx`. Prices use
system mono with tabular figures.

### Pagination
"Load more" (recommended Phase 1 option in §5.2), implemented as a `limit`
query param so paginated state stays shareable. Infinite scroll remains a
possible Phase 2 enhancement.

### Sample data labeling (§12.3)
All products carry `subtitle: "Sample product — demo catalog"`, a "Sample"
badge renders on the PDP, and the footer discloses the demo catalog site-wide.
Product/lifestyle imagery combines project Drive assets with verified Unsplash
placeholders (allowed host pinned in `next.config.ts`). The provided
iStock comp image was excluded from the UI (visible watermark).

### Known tradeoffs
- **npm audit:** one advisory remains against `postcss` as bundled *inside*
  Next 15.5.x; the fix requires Next 16 (breaking). Build-time-only exposure,
  accepted for Phase 1; revisit at the Phase 2 dependency pass.
- The hero uses a `<video>` element (6.3 MB mp4) with a poster and
  reduced-motion fallback; consider a compressed/short loop before production.
- Category checkbox behaves single-select (URL scheme is `?category=slug`
  per §4.3); multi-category filtering would need a URL-shape decision first.

## 2026-08-28 — Cart drawer CTAs, /cart page, and two defects found in browser testing

### Drawer: `View cart` + `Check out`
The drawer's single deferred CTA became two: **View cart** (secondary, routes to
`/cart` and closes the drawer) and **Check out** (primary, `disabled`). No
checkout route, payment provider, or payment fields exist — enabling it later
means removing `disabled`, nothing else. `buttonClasses()` was extracted from
`Button` so the `View cart` `<Link>` matches the button spec exactly.

### `/cart` page
`app/cart/page.tsx` + `components/cart/CartView.tsx`. Reads the same cart
context as the drawer, so quantity/removal stay in sync between the two views;
no duplicated cart state. `CartLineItem` gained a `layout="drawer" | "page"`
prop rather than a second near-identical component. The page is `noindex`
(per-visitor content). `CartProvider` gained a `loading` flag so neither view
flashes an empty state before the first server fetch resolves.

### Defect: drawers never opened (conflicting Tailwind transform classes)
`Drawer` emitted BOTH the closed and open transform (`translate-x-full` **and**
`translate-x-0`). Tailwind orders `.translate-x-0` before `.translate-x-full`
in the generated CSS, so `-full` won the cascade and the panel stayed parked
off-screen — state toggled correctly, nothing ever appeared. Affected all three
drawers (cart, mobile nav, shop filters). Fixed by making the transforms
mutually exclusive: `open ? openBySide[side] : closedBySide[side]`.
**Rule:** never hand `cn()` two utilities from the same Tailwind group and
expect class order to decide the winner — it doesn't.

### Defect: every `/opacity` color modifier resolved to transparent
Tokens were stored as hex behind `var(--color-ink)`, so Tailwind could not
inject an alpha channel: `bg-ink/40` compiled to an invalid color and rendered
fully transparent. 14 usages were silently broken — both modal/drawer
backdrops, the hero gradient (headline contrast), the sticky header background,
the out-of-stock chip, and error banners. Fixed by storing tokens as
space-separated RGB channels (`--color-ink: 17 17 16`) and mapping them through
`rgb(var(--token) / <alpha-value>)` in `tailwind.config.ts`. Direct CSS reads
now use `rgb(var(--color-ink))`.
**Note:** editing `tailwind.config.ts` does not hot-reload — restart `next dev`
or the old CSS pairs with the new token values and all colors break.

### Known content issue — hero video is watermarked
`public/video/Running.mp4` has an "Unsplash+" watermark grid baked into the
file (verified: no DOM overlay, no background image other than the gradient).
It needs replacing with a licensed clean export before any public deployment.
