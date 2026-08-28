const ITEMS = [
  { title: "Shipping", copy: "Options and timelines announced at launch." },
  { title: "Returns", copy: "Full policy coming soon." },
  { title: "Support", copy: "Reach us any time via the contact page." },
  { title: "Secure checkout", copy: "Payments arrive in a later phase." },
];

/** Trust strip (§5.1) — placeholder copy only; no invented promises. */
export function TrustStrip() {
  return (
    <section aria-label="Store information" className="border-t border-line">
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-4">
        {ITEMS.map((item) => (
          <li key={item.title}>
            <h3 className="text-subheading">{item.title}</h3>
            <p className="mt-1 text-small text-ink-muted">{item.copy}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
