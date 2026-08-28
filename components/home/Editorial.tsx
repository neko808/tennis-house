import Image from "next/image";
import Link from "next/link";

/** Editorial feature (§5.1, optional section) — image-led brand moment. */
export function Editorial() {
  return (
    <section aria-labelledby="editorial-heading" className="border-y border-line bg-ink text-surface">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:py-24">
        <div>
          <p className="text-small uppercase tracking-[0.35em] text-surface/70">The Tennis House</p>
          <h2 id="editorial-heading" className="text-display mt-4 max-w-md">
            Movement is the brand.
          </h2>
          <p className="mt-6 max-w-md text-body text-surface/80">
            Editorial lines, competition-grade materials, and nothing that gets in the way.
            Built for people who treat every day like match day.
          </p>
          <Link
            href="/about"
            className="mt-8 inline-flex min-h-11 items-center rounded-btn border border-surface px-8 py-3 font-medium transition-colors hover:bg-surface hover:text-ink"
          >
            Our story
          </Link>
        </div>
        <div className="relative aspect-[3/4] overflow-hidden rounded-card md:aspect-[4/5]">
          <Image
            src="/images/lifestyle/premium_photo-1674605368189-1f60b9740ffe.webp"
            alt="Runner in a navy training set on a coastal road at sunrise"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
