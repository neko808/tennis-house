import type { Metadata } from "next";
import { notFound } from "next/navigation";

const POLICIES: Record<string, { title: string; message: string }> = {
  shipping: { title: "Shipping", message: "Shipping policy coming soon." },
  returns: { title: "Returns", message: "Returns policy coming soon." },
  privacy: { title: "Privacy", message: "Privacy policy coming soon." },
  terms: { title: "Terms of Service", message: "Terms of service coming soon." },
};

interface PolicyPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return Object.keys(POLICIES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PolicyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const policy = POLICIES[slug];
  return { title: policy ? policy.title : "Policy" };
}

export default async function PolicyPage({ params }: PolicyPageProps) {
  const { slug } = await params;
  const policy = POLICIES[slug];
  if (!policy) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-32 text-center sm:px-6">
      <p className="text-small uppercase tracking-[0.35em] text-ink-muted">Policies</p>
      <h1 className="text-display mt-4">{policy.title}</h1>
      <p className="mt-6 text-body text-ink-muted">{policy.message}</p>
    </div>
  );
}
