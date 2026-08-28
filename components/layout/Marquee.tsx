const ITEMS = [
  "The Tennis House",
  "Court to Street",
  "Sport-Lifestyle Essentials",
  "Play All Day",
];

/**
 * Homepage signature element (§3.1.3): a single energetic strip in the
 * tennis-ball highlight. Animation pauses under prefers-reduced-motion.
 */
export function Marquee() {
  const row = (ariaHidden: boolean) => (
    <div aria-hidden={ariaHidden || undefined} className="flex shrink-0 items-center">
      {ITEMS.map((item) => (
        <span key={item} className="flex items-center whitespace-nowrap px-6 text-subheading uppercase tracking-widest">
          {item}
          <span aria-hidden="true" className="ml-12 inline-block h-2 w-2 rounded-full bg-ink" />
        </span>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden border-y border-ink bg-ball py-3 text-ink" role="presentation">
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
