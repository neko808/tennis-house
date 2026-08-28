"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";

/** Contact form UI — no backend in Phase 1 (§5.6). */
export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="mt-8 flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <Input id="contact-name" name="name" label="Name" autoComplete="name" required />
      <Input id="contact-email" name="email" type="email" label="Email" autoComplete="email" required />
      <Textarea id="contact-message" name="message" label="Message" required />
      <Button type="submit">Send message</Button>
      <p aria-live="polite" className="min-h-5 text-small text-ink-muted">
        {submitted
          ? "Thanks! Delivery isn't connected yet — this form goes live in a later phase."
          : ""}
      </p>
    </form>
  );
}
