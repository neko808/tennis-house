import type { Metadata } from "next";
import { ContactForm } from "@/components/layout/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with The Tennis House.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-4 pb-24 pt-32 sm:px-6">
      <p className="text-small uppercase tracking-[0.35em] text-ink-muted">Contact</p>
      <h1 className="text-display mt-4">Talk to us</h1>
      <p className="mt-4 text-body text-ink-muted">
        This form is UI-only for now — message delivery connects in a later phase.
      </p>
      <ContactForm />
    </div>
  );
}
