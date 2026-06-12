import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Leaf, Heart, Sparkles } from "lucide-react";

type WelcomeSearch = {
  amount?: number;
  tip?: number;
  free?: boolean;
};

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Welcome to Continuity" },
      {
        name: "description",
        content:
          "You're in. Continuity is yours. Lifetime access, no subscription, no renewal.",
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): WelcomeSearch => {
    const amount = Number(search.amount);
    const tip = Number(search.tip);
    return {
      amount: Number.isFinite(amount) && amount > 0 ? amount : undefined,
      tip: Number.isFinite(tip) && tip > 0 ? tip : undefined,
      free: search.free === "1" || search.free === true || search.free === "true",
    };
  },
  component: Welcome,
});

function Welcome() {
  const { amount, tip, free } = Route.useSearch();
  const isFree = free === true;
  const total = (amount ?? 0) + (tip ?? 0);
  const today = new Date().toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-dvh bg-background text-foreground">
      {/* Quiet header — destination, not a page-in-the-app */}
      <header className="px-6 pt-8 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-md bg-primary">
            <Leaf className="size-3.5 text-primary-foreground" />
          </span>
          <span className="font-display text-base font-semibold tracking-tight">
            Continuity
          </span>
        </Link>
      </header>

      {/* Hero — one line, big, calm. No confetti. */}
      <section className="px-6 pb-10 pt-20 lg:px-8 lg:pt-28">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            {isFree ? "You're in" : "Received"}
          </div>
          <h1 className="text-balance font-display text-5xl font-medium leading-[1.05] tracking-tight lg:text-6xl">
            {isFree ? "You're in." : "Thank you."}
          </h1>
          <div className="mx-auto mt-6 max-w-xl space-y-4 text-pretty text-base leading-relaxed text-muted-foreground">
            {isFree ? (
              <p>
                Continuity is yours. Nothing to confirm, nothing to verify.
                Go build your plan.
              </p>
            ) : (
              <>
                <p>
                  <span className="text-foreground">${total} received.</span>{" "}
                  One time. Lifetime. That's it.
                </p>
                {tip && tip > 0 ? (
                  <p>
                    You also covered another caregiver who couldn't pay.
                    They'll never know it was you.
                  </p>
                ) : null}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Soft receipt — only shown when there was a real transaction */}
      {!isFree && (
        <section className="px-6 pb-10 lg:px-8">
          <div className="mx-auto max-w-md rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              <Sparkles className="size-3.5 text-sage-700" />
              What just happened
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Your contribution</dt>
                <dd className="font-medium text-foreground">${amount ?? total}</dd>
              </div>
              {tip && tip > 0 ? (
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1.5 text-muted-foreground">
                    <Heart className="size-3.5 text-primary" />
                    Covering another caregiver
                  </dt>
                  <dd className="font-medium text-foreground">${tip}</dd>
                </div>
              ) : null}
              <div className="flex items-center justify-between border-t border-border pt-3">
                <dt className="text-muted-foreground">Today</dt>
                <dd className="text-foreground">{today}</dd>
              </div>
            </dl>
            <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
              No subscription. No renewals. You will not get an upsell email
              later.
            </p>
          </div>
        </section>
      )}

      {/* Two equal CTAs — let them choose where to go next */}
      <section className="px-6 pb-8 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            to="/exports"
            className="group flex flex-col rounded-2xl border border-border bg-card p-5 text-left transition hover:border-sage-600/30 hover:bg-sage-50/40"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-sage-700">
              Finish the job
            </span>
            <span className="mt-2 font-display text-lg font-medium">
              Download what I came for
            </span>
            <span className="mt-1 text-sm text-muted-foreground">
              Your documents and exports are ready.
            </span>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground">
              Open exports{" "}
              <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
            </span>
          </Link>
          <Link
            to="/dashboard"
            className="group flex flex-col rounded-2xl border border-border bg-card p-5 text-left transition hover:border-sage-600/30 hover:bg-sage-50/40"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-sage-700">
              Your space
            </span>
            <span className="mt-2 font-display text-lg font-medium">
              Take me to my dashboard
            </span>
            <span className="mt-1 text-sm text-muted-foreground">
              Everything you're building, in one calm view.
            </span>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground">
              Open dashboard{" "}
              <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>

        <div className="mx-auto mt-6 max-w-2xl text-center">
          <Link
            to="/assistant"
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Or start a new conversation about someone you love →
          </Link>
        </div>
      </section>

      <div className="h-24" />
    </div>
  );
}
