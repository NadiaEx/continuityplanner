import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check, Leaf, HelpCircle } from "lucide-react";
import { WaitlistModal } from "@/components/waitlist-modal";
import { HandsIllustration } from "@/components/soft-illustration";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Choose What Feels Sustainable — Continuity" },
      {
        name: "description",
        content:
          "During the Founding Family pilot, families contribute at a level that feels sustainable. No family is turned away for cost.",
      },
      { property: "og:title", content: "Choose What Feels Sustainable — Continuity" },
      {
        property: "og:description",
        content: "Pay-what-you-can access during our pilot phase.",
      },
    ],
  }),
  component: PricingPage,
});

const tiers = [
  {
    name: "Supporter",
    price: 25,
    body: "Help support development and accessibility.",
    accent: "mist" as const,
  },
  {
    name: "Family Plan",
    price: 75,
    body: "Recommended contribution for most families.",
    accent: "sage" as const,
    featured: true,
  },
  {
    name: "Founding Family",
    price: 150,
    body: "Support the platform and sponsor future development.",
    accent: "sage" as const,
  },
  {
    name: "Sponsor Another Family",
    price: 250,
    body: "Help another caregiver access Continuity at no cost.",
    accent: "mist" as const,
  },
];

const included = [
  "Full access to the planning platform",
  "AI-guided care conversations",
  "Emergency packet exports",
  "Founding Family status — lifetime",
  "Direct line to the product team",
];

function PricingPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-md bg-primary">
              <Leaf className="size-3.5 text-primary-foreground" />
            </span>
            <span className="font-display text-base font-semibold tracking-tight">
              Continuity
            </span>
          </Link>
          <Link
            to="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Open app →
          </Link>
        </div>
      </header>

      <section className="px-6 pb-12 pt-20 lg:px-8 lg:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            Founding Family pilot
          </div>
          <h1 className="text-balance font-display text-4xl font-medium leading-[1.1] tracking-tight lg:text-5xl">
            Choose what feels sustainable.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            We believe future care planning should be accessible. During the
            pilot phase, families can contribute at a level that works for them.
          </p>
        </div>
      </section>

      <section className="px-6 pb-12 lg:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative flex flex-col rounded-3xl border p-7 transition ${
                t.featured
                  ? "border-sage-600/30 bg-gradient-to-b from-sage-50/80 to-card shadow-sm"
                  : "border-border bg-card hover:-translate-y-0.5 hover:shadow-sm"
              }`}
            >
              {t.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                  Most chosen
                </span>
              )}
              <p
                className={`text-xs font-semibold uppercase tracking-widest ${
                  t.accent === "sage" ? "text-sage-700" : "text-mist-600"
                }`}
              >
                {t.name}
              </p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-4xl font-medium tracking-tight">
                  ${t.price}
                </span>
                <span className="text-xs text-muted-foreground">/ year</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t.body}
              </p>
              <button
                onClick={() => setOpen(true)}
                className={`mt-6 inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium transition ${
                  t.featured
                    ? "bg-primary text-primary-foreground hover:bg-sage-700"
                    : "border border-border bg-card text-foreground hover:bg-muted"
                }`}
              >
                Choose this <ArrowRight className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-border bg-surface-soft p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <HandsIllustration className="w-full max-w-sm rounded-2xl" />
            <div>
              <p className="font-display text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Every contribution includes
              </p>
              <h2 className="mt-3 font-display text-2xl font-medium tracking-tight lg:text-3xl">
                The same complete platform, regardless of tier.
              </h2>
              <ul className="mt-6 space-y-3">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-sage-700" />
                    <span className="text-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-dashed border-border bg-card p-8 text-center">
          <div className="mx-auto mb-4 grid size-10 place-items-center rounded-full bg-mist-50 text-mist-600">
            <HelpCircle className="size-4" />
          </div>
          <h3 className="font-display text-xl font-medium tracking-tight">
            Need free access?
          </h3>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
            We never want cost to stop a family from preparing. Quietly request
            access — there's no form to justify or story to share.
          </p>
          <button
            onClick={() => setOpen(true)}
            className="mt-5 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Request access →
          </button>
        </div>
      </section>

      <WaitlistModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
