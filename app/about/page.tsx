import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About The Tennis House.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-32 text-center sm:px-6">
      <p className="text-small uppercase tracking-[0.35em] text-ink-muted">About</p>
      <h1 className="text-display mt-4">Our story is coming soon.</h1>
      <p className="mt-6 text-body text-ink-muted">
        The Tennis House is being built point by point. Check back shortly.
      </p>
    </div>
  );
}
