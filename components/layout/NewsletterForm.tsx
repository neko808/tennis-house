"use client";

import { useState } from "react";

/** Newsletter UI only — no backend in Phase 1 (§4.2). */
export function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="mt-4"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <label htmlFor="newsletter-email" className="text-small font-medium text-ink">
        Email address
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id="newsletter-email"
          type="email"
          required
          placeholder="you@example.com"
          className="w-full min-w-0 rounded-btn border border-line bg-surface px-4 py-3 text-body placeholder:text-ink-muted"
        />
        <button
          type="submit"
          className="min-h-11 shrink-0 rounded-btn bg-ink px-5 font-medium text-surface transition-colors hover:bg-ink/80"
        >
          Join
        </button>
      </div>
      <p aria-live="polite" className="mt-2 min-h-5 text-small text-ink-muted">
        {submitted ? "Thanks! Sign-up will activate when the newsletter launches." : ""}
      </p>
    </form>
  );
}
