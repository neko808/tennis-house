import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-32 text-center sm:px-6">
      <p className="text-small uppercase tracking-[0.35em] text-ink-muted">404</p>
      <h1 className="text-display mt-4">Out of bounds.</h1>
      <p className="mt-6 text-body text-ink-muted">
        The page you're looking for isn't on this court.
      </p>
      <Link
        href="/shop"
        className="mt-8 inline-flex min-h-11 items-center rounded-btn bg-accent px-8 py-3 font-medium text-surface transition-colors hover:bg-accent-hover"
      >
        Back to the shop
      </Link>
    </div>
  );
}
