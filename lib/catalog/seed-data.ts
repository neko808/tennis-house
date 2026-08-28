import type { Category, Product, ProductVariant } from "@/types/medusa";

/**
 * ─── SAMPLE CATALOG — DEVELOPMENT SEED DATA ────────────────────────────────
 * Every product here is clearly-labeled sample content for Phase 1 UI
 * development (§7, §12.3). Names, brands, prices and inventory are fictional.
 * In Phase 2 this file is replaced by the Medusa Admin catalog; nothing else
 * in the app imports product data from anywhere but lib/medusa/*.
 * ──────────────────────────────────────────────────────────────────────────
 */

export const SAMPLE_LABEL = "Sample product — demo catalog";

/** Swatch hex values are presentational only (not design tokens). */
export const COLOR_SWATCHES: Record<string, string> = {
  "Cloud White": "#F2F1EC",
  Graphite: "#3A3A38",
  "Ice Blue": "#BFD5E2",
  Flame: "#E8622C",
  "Washed Charcoal": "#4A4A48",
  "Sun Yellow": "#F2C744",
  Navy: "#23304A",
  "Court Multi": "#7FC8A9",
};

const APPAREL_SIZES = ["XS", "S", "M", "L", "XL"];
const SHOE_SIZES = ["US 6", "US 7", "US 8", "US 9", "US 10", "US 11"];

interface VariantSpec {
  color: string;
  sizes: string[];
  price: number;
  original?: number;
  /** size → stock override; unlisted sizes default to `stock`. */
  stockBySize?: Record<string, number>;
  stock?: number;
}

function makeVariants(productId: string, sizeOption: string, specs: VariantSpec[]): ProductVariant[] {
  const variants: ProductVariant[] = [];
  for (const spec of specs) {
    for (const size of spec.sizes) {
      const stock = spec.stockBySize?.[size] ?? spec.stock ?? 12;
      variants.push({
        id: `${productId}-${spec.color}-${size}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        title: `${spec.color} / ${size}`,
        options: { Color: spec.color, [sizeOption]: size },
        price: spec.price,
        original_price: spec.original ?? null,
        inventory_quantity: stock,
      });
    }
  }
  return variants;
}

const unsplash = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

export const SAMPLE_CATEGORIES: Category[] = [
  {
    id: "cat_tennis",
    handle: "tennis",
    name: "Tennis",
    description: "Footwear and gear built for the court.",
    image: { url: unsplash("1554068865-24cecd4e34b8"), alt: "Aerial view of a player serving on a clay tennis court" },
  },
  {
    id: "cat_tshirts",
    handle: "t-shirts",
    name: "T-Shirts",
    description: "Tops that move from warm-up to weekend.",
    image: { url: "/images/products/W-NK-ARSWFT-DFADV-CROP-TOP-PKT.webp", alt: "Athletic crop top on a neutral background" },
  },
  {
    id: "cat_pants",
    handle: "pants",
    name: "Pants",
    description: "Training pants and shorts with editorial lines.",
    image: { url: "/images/lifestyle/premium_photo-1664301350480-71604a7ba39c.webp", alt: "Runner in grey training set moving through an urban underpass" },
  },
  {
    id: "cat_caps",
    handle: "caps",
    name: "Caps",
    description: "Court-ready caps and visors.",
    image: { url: unsplash("1595435934249-5df7ed86e1c0"), alt: "Player seated on a blue court wearing a sun visor" },
  },
  {
    id: "cat_accessories",
    handle: "accessories",
    name: "Accessories",
    description: "Bags and extras for the everyday athlete.",
    image: { url: unsplash("1553062407-98eeb64c6a62"), alt: "Navy backpack standing against a white wall" },
  },
];

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "prod_court_runner",
    handle: "court-runner-knit",
    title: "Court Runner Knit",
    subtitle: SAMPLE_LABEL,
    description:
      "A cushioned everyday trainer with a breathable knit upper. Built for long baseline sessions and longer days after them.",
    brand: "Court Classics",
    category: "tennis",
    tags: ["featured", "new"],
    thumbnail: { url: "/images/products/W-NIKE-VOMERO-18.webp", alt: "White knit running sneaker, side profile" },
    images: [
      { url: "/images/products/W-NIKE-VOMERO-18.webp", alt: "White knit running sneaker, side profile" },
      { url: "/images/lifestyle/premium_photo-1664301350480-71604a7ba39c.webp", alt: "Runner wearing training gear in an urban underpass" },
    ],
    options: [
      { id: "opt_cr_color", title: "Color", values: ["Cloud White"] },
      { id: "opt_cr_size", title: "Size", values: SHOE_SIZES },
    ],
    variants: makeVariants("prod_court_runner", "Size", [
      {
        color: "Cloud White",
        sizes: SHOE_SIZES,
        price: 13800,
        stockBySize: { "US 8": 0, "US 11": 2 },
      },
    ]),
    details: {
      materials: "Engineered knit upper, EVA foam midsole, rubber outsole. (Sample copy.)",
      fit: "True to size with a roomy toe box. Between sizes? Size down.",
      care: "Spot clean with mild soap. Air dry away from direct heat.",
    },
    colorImages: { "Cloud White": 0 },
    created_at: "2026-08-20",
  },
  {
    id: "prod_volley_sneaker",
    handle: "volley-street-sneaker",
    title: "Volley Street Sneaker",
    subtitle: SAMPLE_LABEL,
    description:
      "A color-blocked court silhouette that was made for the street. Suede and mesh panels over a sculpted two-tone sole.",
    brand: "Court Classics",
    category: "tennis",
    tags: ["sale"],
    thumbnail: { url: unsplash("1560769629-975ec94e6a86"), alt: "Color-blocked sneakers balanced on a white pedestal" },
    images: [
      { url: unsplash("1560769629-975ec94e6a86"), alt: "Color-blocked sneakers balanced on a white pedestal" },
    ],
    options: [
      { id: "opt_vs_color", title: "Color", values: ["Court Multi"] },
      { id: "opt_vs_size", title: "Size", values: SHOE_SIZES },
    ],
    variants: makeVariants("prod_volley_sneaker", "Size", [
      {
        color: "Court Multi",
        sizes: SHOE_SIZES,
        price: 9800,
        original: 12400,
        stockBySize: { "US 6": 0, "US 7": 3 },
      },
    ]),
    details: {
      materials: "Suede and mesh upper, rubber cupsole. (Sample copy.)",
      fit: "Runs slightly large — most wearers size down half a size.",
      care: "Brush suede panels gently. Do not machine wash.",
    },
    created_at: "2026-07-02",
  },
  {
    id: "prod_graphite_racket",
    handle: "pro-graphite-racket",
    title: "Pro Graphite Racket",
    subtitle: SAMPLE_LABEL,
    description:
      "A control-oriented graphite frame with a 98in² head and a crisp, connected feel at contact. Strung and ready to play.",
    brand: "Baseline Supply",
    category: "tennis",
    tags: ["featured", "new"],
    thumbnail: { url: unsplash("1622163642998-1ea32b0bbc67"), alt: "Blue tennis racket and ball lying on a hard court" },
    images: [
      { url: unsplash("1622163642998-1ea32b0bbc67"), alt: "Blue tennis racket and ball lying on a hard court" },
      { url: unsplash("1554068865-24cecd4e34b8"), alt: "Aerial view of a player serving on a clay court" },
    ],
    options: [
      { id: "opt_gr_color", title: "Color", values: ["Navy"] },
      { id: "opt_gr_size", title: "Grip", values: ["L1", "L2", "L3"] },
    ],
    variants: makeVariants("prod_graphite_racket", "Grip", [
      { color: "Navy", sizes: ["L1", "L2", "L3"], price: 18900, stockBySize: { L3: 4 } },
    ]),
    details: {
      materials: "Graphite composite frame, synthetic gut strings. (Sample copy.)",
      fit: "98in² head · 305g unstrung · 16×19 pattern. (Sample spec.)",
      care: "Store away from heat. Restring seasonally with regular play.",
    },
    created_at: "2026-08-15",
  },
  {
    id: "prod_momentum_crop",
    handle: "momentum-crop-top",
    title: "Momentum Crop Top",
    subtitle: SAMPLE_LABEL,
    description:
      "A featherweight training crop with a secure pocket and sweat-wicking finish. Quiet seams, sharp lines.",
    brand: "TTH Performance",
    category: "t-shirts",
    tags: ["featured", "new"],
    thumbnail: { url: "/images/products/W-NK-ARSWFT-DFADV-CROP-TOP-PKT.webp", alt: "Ice blue athletic crop top, front view" },
    images: [
      { url: "/images/products/W-NK-ARSWFT-DFADV-CROP-TOP-PKT.webp", alt: "Ice blue athletic crop top, front view" },
      { url: "/images/lifestyle/premium_photo-1674605368189-1f60b9740ffe.webp", alt: "Runner in navy training set on a coastal road at sunrise" },
    ],
    options: [
      { id: "opt_mc_color", title: "Color", values: ["Ice Blue"] },
      { id: "opt_mc_size", title: "Size", values: APPAREL_SIZES },
    ],
    variants: makeVariants("prod_momentum_crop", "Size", [
      { color: "Ice Blue", sizes: APPAREL_SIZES, price: 4800, stockBySize: { XS: 0, XL: 5 } },
    ]),
    details: {
      materials: "75% recycled polyester, 25% elastane. (Sample copy.)",
      fit: "Cropped, close to body. Size up for a relaxed fit.",
      care: "Machine wash cold. Lay flat to dry.",
    },
    created_at: "2026-08-10",
  },
  {
    id: "prod_match_tee",
    handle: "match-point-tee",
    title: "Match Point Tee",
    subtitle: SAMPLE_LABEL,
    description:
      "A performance tee in signal orange with a soft matte hand-feel. Cut for full rotation on serve.",
    brand: "TTH Performance",
    category: "t-shirts",
    tags: [],
    thumbnail: { url: unsplash("1622279457486-62dcc4a431d6"), alt: "Player in an orange tee hitting a forehand on a grass court" },
    images: [
      { url: unsplash("1622279457486-62dcc4a431d6"), alt: "Player in an orange tee hitting a forehand on a grass court" },
    ],
    options: [
      { id: "opt_mt_color", title: "Color", values: ["Flame"] },
      { id: "opt_mt_size", title: "Size", values: APPAREL_SIZES },
    ],
    variants: makeVariants("prod_match_tee", "Size", [
      { color: "Flame", sizes: APPAREL_SIZES, price: 4200, stockBySize: { XXL: 0 } },
    ]),
    details: {
      materials: "100% recycled polyester interlock. (Sample copy.)",
      fit: "Regular fit, mid-length sleeve.",
      care: "Machine wash cold with like colors.",
    },
    created_at: "2026-06-18",
  },
  {
    id: "prod_form_pant",
    handle: "form-training-pant",
    title: "Form Training Pant",
    subtitle: SAMPLE_LABEL,
    description:
      "A tapered training pant with an articulated knee and tonal graphic hit. From warm-up laps to the studio.",
    brand: "TTH Performance",
    category: "pants",
    tags: ["featured"],
    thumbnail: { url: "/images/products/M-NK-DF-FORM-GFX-TPR-PANT.webp", alt: "Graphite training pant with tonal graphic, front view" },
    images: [
      { url: "/images/products/M-NK-DF-FORM-GFX-TPR-PANT.webp", alt: "Graphite training pant with tonal graphic, front view" },
      { url: "/images/lifestyle/premium_photo-1664301350480-71604a7ba39c.webp", alt: "Runner in grey training set in an urban underpass" },
    ],
    options: [
      { id: "opt_fp_color", title: "Color", values: ["Graphite"] },
      { id: "opt_fp_size", title: "Size", values: APPAREL_SIZES },
    ],
    variants: makeVariants("prod_form_pant", "Size", [
      { color: "Graphite", sizes: APPAREL_SIZES, price: 8800, stockBySize: { S: 2 } },
    ]),
    details: {
      materials: "88% polyester, 12% elastane double-knit. (Sample copy.)",
      fit: "Tapered leg, mid rise, ankle zips.",
      care: "Machine wash cold. Tumble dry low.",
    },
    created_at: "2026-07-28",
  },
  {
    id: "prod_bike_short",
    handle: "momentum-bike-short",
    title: "Momentum Bike Short",
    subtitle: SAMPLE_LABEL,
    description:
      "A high-rise 8in bike short in deep navy with bonded seams and a stay-put waistband. Built to disappear while you move.",
    brand: "TTH Performance",
    category: "pants",
    tags: ["new"],
    thumbnail: { url: "/images/lifestyle/premium_photo-1674605368189-1f60b9740ffe.webp", alt: "Runner wearing navy bike shorts on a coastal road at sunrise" },
    images: [
      { url: "/images/lifestyle/premium_photo-1674605368189-1f60b9740ffe.webp", alt: "Runner wearing navy bike shorts on a coastal road at sunrise" },
    ],
    options: [
      { id: "opt_bs_color", title: "Color", values: ["Navy"] },
      { id: "opt_bs_size", title: "Size", values: APPAREL_SIZES },
    ],
    variants: makeVariants("prod_bike_short", "Size", [
      { color: "Navy", sizes: APPAREL_SIZES, price: 5400, stockBySize: { L: 0 } },
    ]),
    details: {
      materials: "Nylon-elastane compression knit. (Sample copy.)",
      fit: "High rise, 8in inseam, compressive.",
      care: "Machine wash cold. Do not iron.",
    },
    created_at: "2026-08-05",
  },
  {
    id: "prod_heritage_cap",
    handle: "heritage-court-cap",
    title: "Heritage Court Cap",
    subtitle: SAMPLE_LABEL,
    description:
      "A garment-washed six-panel cap with a low crown and tonal embroidery. Broken-in from day one.",
    brand: "Baseline Supply",
    category: "caps",
    tags: ["featured"],
    thumbnail: { url: unsplash("1521369909029-2afed882baee"), alt: "Washed charcoal six-panel cap on a white surface" },
    images: [
      { url: unsplash("1521369909029-2afed882baee"), alt: "Washed charcoal six-panel cap on a white surface" },
    ],
    options: [
      { id: "opt_hc_color", title: "Color", values: ["Washed Charcoal"] },
      { id: "opt_hc_size", title: "Size", values: ["One Size"] },
    ],
    variants: makeVariants("prod_heritage_cap", "Size", [
      { color: "Washed Charcoal", sizes: ["One Size"], price: 3200, stock: 20 },
    ]),
    details: {
      materials: "Garment-washed cotton twill, brass clasp. (Sample copy.)",
      fit: "Low crown, curved brim, adjustable strap.",
      care: "Spot clean only.",
    },
    created_at: "2026-07-14",
  },
  {
    id: "prod_baseline_visor",
    handle: "baseline-visor",
    title: "Baseline Visor",
    subtitle: SAMPLE_LABEL,
    description:
      "A featherweight court visor in sun yellow with a moisture-wicking band. Shade without the heat.",
    brand: "Baseline Supply",
    category: "caps",
    tags: ["sale"],
    thumbnail: { url: unsplash("1595435934249-5df7ed86e1c0"), alt: "Player on a blue court wearing a yellow sun visor" },
    images: [
      { url: unsplash("1595435934249-5df7ed86e1c0"), alt: "Player on a blue court wearing a yellow sun visor" },
    ],
    options: [
      { id: "opt_bv_color", title: "Color", values: ["Sun Yellow"] },
      { id: "opt_bv_size", title: "Size", values: ["One Size"] },
    ],
    variants: makeVariants("prod_baseline_visor", "Size", [
      { color: "Sun Yellow", sizes: ["One Size"], price: 2800, original: 3600, stock: 9 },
    ]),
    details: {
      materials: "Recycled ripstop shell, terry sweatband. (Sample copy.)",
      fit: "One size, hook-and-loop closure.",
      care: "Hand wash. Air dry.",
    },
    created_at: "2026-06-30",
  },
  {
    id: "prod_club_backpack",
    handle: "club-backpack",
    title: "Club Backpack",
    subtitle: SAMPLE_LABEL,
    description:
      "A structured 22L backpack with a padded laptop sleeve and a dedicated shoe tunnel. Court to commute.",
    brand: "Baseline Supply",
    category: "accessories",
    tags: ["featured"],
    thumbnail: { url: unsplash("1553062407-98eeb64c6a62"), alt: "Navy backpack standing against a white wall" },
    images: [
      { url: unsplash("1553062407-98eeb64c6a62"), alt: "Navy backpack standing against a white wall" },
    ],
    options: [
      { id: "opt_cb_color", title: "Color", values: ["Navy"] },
      { id: "opt_cb_size", title: "Size", values: ["One Size"] },
    ],
    variants: makeVariants("prod_club_backpack", "Size", [
      { color: "Navy", sizes: ["One Size"], price: 7600, stock: 14 },
    ]),
    details: {
      materials: "Recycled 600D polyester, water-resistant coating. (Sample copy.)",
      fit: "22L · fits 15in laptop · shoe tunnel base. (Sample spec.)",
      care: "Wipe clean with a damp cloth.",
    },
    created_at: "2026-07-20",
  },
];
