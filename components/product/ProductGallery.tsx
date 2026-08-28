"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types/medusa";

interface ProductGalleryProps {
  images: ProductImage[];
  activeIndex: number;
  onSelect: (index: number) => void;
  title: string;
}

/**
 * PDP gallery (§5.3): swipeable scroll-snap strip on mobile,
 * main image + thumbnail rail on desktop.
 */
export function ProductGallery({ images, activeIndex, onSelect, title }: ProductGalleryProps) {
  return (
    <div>
      {/* Mobile: swipeable */}
      <div
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 md:hidden"
        aria-label={`${title} images`}
      >
        {images.map((image, i) => (
          <div
            key={image.url}
            className="relative aspect-product w-[85%] shrink-0 snap-center overflow-hidden rounded-card bg-line"
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="85vw"
              priority={i === 0}
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Desktop: main + thumbnails */}
      <div className="hidden gap-4 md:flex">
        {images.length > 1 && (
          <ul className="flex flex-col gap-3" aria-label="Image thumbnails">
            {images.map((image, i) => (
              <li key={image.url}>
                <button
                  type="button"
                  onClick={() => onSelect(i)}
                  aria-label={`Show image ${i + 1}: ${image.alt}`}
                  aria-current={i === activeIndex}
                  className={cn(
                    "relative block h-24 w-20 overflow-hidden rounded-card border-2 bg-line transition-colors",
                    i === activeIndex ? "border-ink" : "border-transparent hover:border-line",
                  )}
                >
                  <Image src={image.url} alt="" fill sizes="80px" className="object-cover" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="relative aspect-product flex-1 overflow-hidden rounded-card bg-line">
          <Image
            src={images[activeIndex]?.url ?? images[0].url}
            alt={images[activeIndex]?.alt ?? images[0].alt}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
