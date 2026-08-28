# The Tennis House — Storefront

Custom eCommerce storefront for **The Tennis House**, a sport-lifestyle brand.
Editorial design, commerce-first UX. Built per `TTH_Master_Build_Prompt.md`
(the session source of truth).

**Phase 1 status:** full storefront UI running on a clearly-labeled **sample
catalog**. Checkout and payments are intentionally deferred — no payment data
is collected or stored anywhere in this codebase.

## Stack

- **Next.js (App Router) + TypeScript (strict)** — server components keep data
  access and future secrets server-side
- **Tailwind CSS + CSS custom properties** — design tokens in `styles/globals.css`
- **Medusa.js** — the committed commerce backend. Phase 1 ships a
  Medusa-shaped data layer (`lib/medusa/*`) backed by local seed data; the
  `@medusajs/js-sdk` is already installed and wired in `lib/medusa/client.ts`
- **Neue Haas Display** — self-hosted from `public/fonts` via `@font-face`

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

No environment variables are required in Phase 1. To prepare for the real
backend, copy `.env.example` → `.env.local`.

## Switching to a live Medusa backend (Phase 2)

1. Stand up Medusa (PostgreSQL + Medusa server + Admin) and seed the catalog.
2. Set `MEDUSA_BACKEND_URL` and `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` in `.env.local`.
3. Replace the internals of `lib/medusa/{products,categories,cart}.ts` with SDK
   calls — the function signatures and `types/medusa.ts` shapes already mirror
   the Medusa Store API, so pages and components don't change.

`MEDUSA_ADMIN_API_KEY` and `DATABASE_URL` are server-side only. Never prefix
them with `NEXT_PUBLIC_`.

## Key paths

| Path | What it is |
|---|---|
| `app/` | Routes: home, `/shop`, `/products/[handle]`, cart drawer everywhere, utility pages |
| `components/` | `ui/` primitives · `layout/` · `product/` · `shop/` · `cart/` · `search/` · `home/` |
| `lib/medusa/` | Data layer (Medusa-shaped). Cart id lives in an httpOnly cookie; totals always computed server-side |
| `lib/catalog/seed-data.ts` | The clearly-labeled sample catalog (replaced by Medusa Admin in Phase 2) |
| `styles/` | `globals.css` (tokens, fonts, reset) · `typography.css` (type scale) |
| `public/fonts`, `public/images`, `public/video` | Self-hosted assets from the project Drive |

## Notes

- Cart state persists in `.data/carts.json` (gitignored, dev-only store that
  stands in for Medusa's cart endpoints).
- Sample product imagery mixes project assets with Unsplash placeholders;
  the footer carries the sample-data disclosure.
- See `ARCHITECTURE.md` for decisions and tradeoffs.
