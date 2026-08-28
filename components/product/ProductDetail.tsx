"use client";

import { useMemo, useState } from "react";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ColorSwatches } from "@/components/product/ColorSwatches";
import { SizeSelector } from "@/components/product/SizeSelector";
import { SizeGuideModal } from "@/components/product/SizeGuideModal";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/medusa";

/**
 * PDP interactive column (§5.3). Variant selection resolves against server
 * catalog data; Add to Cart has loading / success / error / disabled states.
 */
export function ProductDetail({ product }: { product: Product }) {
  const colorOption = product.options.find((o) => o.title === "Color");
  const sizeOption = product.options.find((o) => o.title !== "Color");
  const colors = colorOption?.values ?? [];
  const sizes = sizeOption?.values ?? [];
  const singleSize = sizes.length === 1;

  const [color, setColor] = useState(colors[0] ?? "");
  const [size, setSize] = useState<string | null>(singleSize ? sizes[0] : null);
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [status, setStatus] = useState<"idle" | "adding" | "added" | "error">("idle");
  const { addItem } = useCart();

  const availability = useMemo(() => {
    const map: Record<string, boolean> = {};
    for (const s of sizes) {
      const variant = product.variants.find(
        (v) => v.options[sizeOption!.title] === s && (!colorOption || v.options.Color === color),
      );
      map[s] = (variant?.inventory_quantity ?? 0) > 0;
    }
    return map;
  }, [sizes, product.variants, sizeOption, colorOption, color]);

  const selectedVariant = useMemo(() => {
    if (!size) return null;
    return (
      product.variants.find(
        (v) =>
          v.options[sizeOption!.title] === size && (!colorOption || v.options.Color === color),
      ) ?? null
    );
  }, [product.variants, size, color, sizeOption, colorOption]);

  const anyStock = product.variants.some((v) => v.inventory_quantity > 0);
  const price = selectedVariant?.price ?? Math.min(...product.variants.map((v) => v.price));
  const compareAt =
    selectedVariant?.original_price ??
    product.variants.find((v) => v.original_price !== null)?.original_price ??
    null;

  const maxQty = Math.min(selectedVariant?.inventory_quantity ?? 10, 10);

  function handleColorSelect(next: string) {
    setColor(next);
    const mapped = product.colorImages?.[next];
    if (mapped !== undefined) setImageIndex(mapped);
  }

  async function handleAdd() {
    if (!selectedVariant || status === "adding") return;
    setStatus("adding");
    const ok = await addItem(product.id, selectedVariant.id, quantity);
    setStatus(ok ? "added" : "error");
    setTimeout(() => setStatus("idle"), 2500);
  }

  const buttonLabel = !anyStock
    ? "Out of stock"
    : status === "adding"
      ? "Adding…"
      : status === "added"
        ? "Added to cart ✓"
        : status === "error"
          ? "Something went wrong — try again"
          : !size
            ? `Select a ${sizeOption?.title.toLowerCase() ?? "size"}`
            : selectedVariant && selectedVariant.inventory_quantity < 1
              ? "Out of stock"
              : "Add to cart";

  const disabled =
    !anyStock || !selectedVariant || selectedVariant.inventory_quantity < 1 || status === "adding";

  return (
    <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
      <ProductGallery
        images={product.images}
        activeIndex={imageIndex}
        onSelect={setImageIndex}
        title={product.title}
      />

      <div className="flex flex-col gap-6">
        <div>
          <div className="flex items-center gap-3">
            <p className="text-small uppercase tracking-widest text-ink-muted">{product.brand}</p>
            <Badge tone="neutral" className="bg-line text-ink-muted">Sample</Badge>
          </div>
          <h1 className="mt-2 text-display">{product.title}</h1>
          <p className="mt-3 flex items-baseline gap-3">
            <span className="price text-[length:var(--text-price)]">{formatPrice(price)}</span>
            {compareAt && (
              <s className="price text-body text-ink-muted">{formatPrice(compareAt)}</s>
            )}
            {product.tags.includes("sale") && <Badge tone="sale">Sale</Badge>}
          </p>
        </div>

        {colors.length > 0 && (
          <ColorSwatches colors={colors} selected={color} onSelect={handleColorSelect} />
        )}

        {!singleSize && (
          <div>
            <SizeSelector
              label={sizeOption?.title ?? "Size"}
              sizes={sizes}
              selected={size}
              availability={availability}
              onSelect={setSize}
            />
            <div className="mt-2">
              <SizeGuideModal />
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <QuantityStepper value={quantity} max={maxQty} onChange={setQuantity} />
          <span className="text-small text-ink-muted">Qty</span>
        </div>

        <div>
          <Button
            fullWidth
            onClick={handleAdd}
            disabled={disabled}
            aria-live="polite"
            className="md:max-w-sm"
          >
            {status === "adding" && <Spinner />}
            {buttonLabel}
          </Button>
          <p aria-live="polite" className="mt-3 text-small">
            <AvailabilityText variant={selectedVariant} anyStock={anyStock} sizeChosen={Boolean(size)} />
          </p>
        </div>

        <div className="border-t border-line">
          <DetailsSection title="Description" defaultOpen>
            <p>{product.description}</p>
          </DetailsSection>
          <DetailsSection title="Materials">
            <p>{product.details.materials}</p>
          </DetailsSection>
          <DetailsSection title="Fit & Care">
            <p>{product.details.fit}</p>
            <p className="mt-2">{product.details.care}</p>
          </DetailsSection>
          <DetailsSection title="Shipping & Returns">
            <p>Shipping and returns policies are coming soon.</p>
          </DetailsSection>
        </div>
      </div>
    </div>
  );
}

function AvailabilityText({
  variant,
  anyStock,
  sizeChosen,
}: {
  variant: { inventory_quantity: number } | null;
  anyStock: boolean;
  sizeChosen: boolean;
}) {
  if (!anyStock) return <span className="text-error">Out of stock</span>;
  if (!sizeChosen || !variant)
    return <span className="text-ink-muted">Select options to see availability.</span>;
  if (variant.inventory_quantity < 1) return <span className="text-error">Out of stock</span>;
  if (variant.inventory_quantity <= 5)
    return <span className="text-error">Only {variant.inventory_quantity} left</span>;
  return <span className="text-success">In stock</span>;
}

function DetailsSection({
  title,
  children,
  defaultOpen,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details className="group border-b border-line py-4" open={defaultOpen}>
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-subheading [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <span aria-hidden="true" className="text-xl transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="pt-2 text-body text-ink-muted">{children}</div>
    </details>
  );
}
