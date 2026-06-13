import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Leaf, Heart, Sparkles, Check } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pay what you can — Continuity" },
      {
        name: "description",
        content:
          "Continuity is pay-what-you-can. Pay once and your plan is safely stored for 2 years. We'll email you 60 days before it ends to renew at-cost or download everything. Nothing is deleted without warning.",
      },
      { property: "og:title", content: "Pay what you can — Continuity" },
      {
        property: "og:description",
        content:
          "Pay-what-you-can. 2 years of secure storage included. Nobody turned away. Cover another caregiver if you can.",
      },
    ],
  }),
  component: PayWhatYouCan,
});

// Anchor amounts the caregiver can tap. Custom amount overrides these.
// $1 minimum is symbolic — keeps the relationship real and filters abuse,
// but the "I can't right now" path lets anyone through at $0.
const ANCHORS = [
  {
    amount: 15,
    label: "I can chip in",
    note: "Covers your account and a sliver of someone else's.",
  },
  {
    amount: 40,
    label: "Fair price",
    note: "What this would cost if I priced it like a normal SaaS.",
  },
  {
    amount: 100,
    label: "Sustaining",
    note: "Covers you and a few caregivers who can't pay a thing.",
  },
] as const;

// Honest unit-economics figure shown in the framing block.
// Update this when real infra costs change.
const COST_PER_FAMILY_MONTHLY = 3.2;

function PayWhatYouCan() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState<number>(40);
  const [tip, setTip] = useState<number>(0);
  const [zeroMode, setZeroMode] = useState(false);
  const [customRaw, setCustomRaw] = useState<string>("40");

  const total = useMemo(() => {
    if (zeroMode) return 0;
    return Math.max(1, Math.round(amount + tip));
  }, [amount, tip, zeroMode]);

  const setCustom = (v: string) => {
    setCustomRaw(v);
    const n = Number(v.replace(/[^0-9.]/g, ""));
    if (Number.isFinite(n) && n > 0) {
      setAmount(Math.max(1, Math.round(n)));
      setZeroMode(false);
    }
  };

  const pickAnchor = (n: number) => {
    setAmount(n);
    setCustomRaw(String(n));
    setZeroMode(false);
  };

  // For now this just routes to /welcome with the right search params.
  // When real Stripe checkout is wired, this will create a Checkout Session
  // whose success_url points at /welcome with the same shape.
  const submit = () => {
    if (zeroMode) {
      navigate({ to: "/welcome", search: { free: true } });
      return;
    }
    navigate({
      to: "/welcome",
      search: { amount: Math.max(1, Math.round(amount)), tip: tip || undefined },
    });
  };

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 lg:px-8">
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
            Back to your plan →
          </Link>
        </div>
      </header>

      {/* Hero / framing */}
      <section className="px-6 pb-10 pt-16 lg:px-8 lg:pt-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            Pay what you can · 2 years included
          </div>
          <h1 className="text-balance font-display text-4xl font-medium leading-[1.1] tracking-tight lg:text-5xl">
            Pay what you can.
          </h1>
          <div className="mx-auto mt-6 max-w-xl space-y-4 text-pretty text-base leading-relaxed text-muted-foreground">
            <p>
              Continuity costs me about{" "}
              <span className="text-foreground">${COST_PER_FAMILY_MONTHLY.toFixed(2)}/month, per family</span>{" "}
              to run — storage, AI, infrastructure, the usual.
            </p>
            <p>
              But caregivers are the brokest people I know. So nobody gets
              turned away. Pay <span className="text-foreground">$0</span> if
              that's what you can afford. Pay more if you can — you'll be
              covering someone who can't.
            </p>
            <p className="text-sm">
              Pay once today. Your plan is safely stored for 2 years. About
              60 days before that's up, we'll email you — renew at-cost
              (roughly $4/year) or download everything to keep. Nothing is
              ever deleted without a heads-up.
            </p>
          </div>
        </div>
      </section>

      {/* The bit: three identical SaaS tiers. Same price, same features.
          The joke lands when the eye scans left-to-right and finds nothing
          actually different. It's the entire pricing philosophy in one image. */}
      <section className="px-6 pb-12 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              { name: "Basic", tag: "For individuals" },
              { name: "Pro", tag: "Most popular", featured: true },
              { name: "Enterprise", tag: "For teams" },
            ].map((t) => (
              <div
                key={t.name}
                className={`relative flex flex-col rounded-3xl border p-7 transition ${
                  t.featured
                    ? "border-sage-600/30 bg-gradient-to-b from-sage-50/80 to-card shadow-sm"
                    : "border-border bg-card"
                }`}
              >
                {t.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                    {t.tag}
                  </span>
                )}
                <p
                  className={`text-xs font-semibold uppercase tracking-widest ${
                    t.featured ? "text-sage-700" : "text-muted-foreground"
                  }`}
                >
                  {t.name}
                </p>
                {!t.featured && (
                  <p className="mt-1 text-xs text-muted-foreground">{t.tag}</p>
                )}
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-medium tracking-tight">
                    Pay what you can
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  One time. Lifetime access. Nobody turned away.
                </p>
                <ul className="mt-6 space-y-2.5 text-sm">
                  {[
                    "Unlimited loved ones",
                    "Every document & export",
                    "AI-guided care conversations",
                    "Care team sharing",
                    "Lifetime access",
                    "Future updates included",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-sage-700" />
                      <span className="text-foreground/90">{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#choose"
                  className={`mt-7 inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium transition ${
                    t.featured
                      ? "bg-primary text-primary-foreground hover:bg-sage-700"
                      : "border border-border bg-card text-foreground hover:bg-muted"
                  }`}
                >
                  Choose {t.name} <ArrowRight className="size-3.5" />
                </a>
              </div>
            ))}
          </div>

          {/* The punchline. Small, dry, in italics. */}
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm italic text-muted-foreground">
            Same product. Same price. Same bullet points. Pick whichever tier
            makes you feel best — they're all the same one.
          </p>
        </div>
      </section>

      {/* Amount picker */}
      <section id="choose" className="px-6 pb-10 lg:px-8 scroll-mt-20">

        <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-10">
          <p className="font-display text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Choose your amount
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {ANCHORS.map((a) => {
              const active = !zeroMode && amount === a.amount;
              return (
                <button
                  key={a.amount}
                  onClick={() => pickAnchor(a.amount)}
                  className={`group flex flex-col items-start rounded-2xl border p-4 text-left transition ${
                    active
                      ? "border-sage-600/50 bg-sage-50 shadow-sm"
                      : "border-border bg-card hover:border-sage-600/30 hover:bg-sage-50/40"
                  }`}
                >
                  <span className="font-display text-2xl font-medium tracking-tight">
                    ${a.amount}
                  </span>
                  <span className="mt-1 text-xs font-semibold uppercase tracking-wider text-sage-700">
                    {a.label}
                  </span>
                  <span className="mt-2 text-xs leading-snug text-muted-foreground">
                    {a.note}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-6">
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Or enter your own amount
              </span>
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 focus-within:border-sage-600/40 focus-within:ring-2 focus-within:ring-sage-600/10">
                <span className="text-lg text-muted-foreground">$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={zeroMode ? "0" : customRaw}
                  onChange={(e) => setCustom(e.target.value)}
                  onFocus={() => setZeroMode(false)}
                  className="w-full bg-transparent text-lg outline-none"
                  aria-label="Custom amount in dollars"
                />
                <span className="text-xs text-muted-foreground">
                  $1 minimum · one-time
                </span>
              </div>
            </label>
          </div>

          {/* Tip line — only shown if they're paying something */}
          {!zeroMode && (
            <div className="mt-6 rounded-2xl border border-dashed border-border bg-surface-soft p-4">
              <div className="flex items-start gap-3">
                <div className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <Heart className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    Want to cover another caregiver?
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Every $5 you add here gets a family in who couldn't pay.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[0, 5, 15, 40].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTip(t)}
                        className={`rounded-full border px-3 py-1.5 text-xs transition ${
                          tip === t
                            ? "border-sage-600/40 bg-sage-50 text-sage-700"
                            : "border-border bg-card text-muted-foreground hover:border-sage-600/20"
                        }`}
                      >
                        {t === 0 ? "No tip" : `+ $${t}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Total + CTA */}
          <div className="mt-7 flex flex-wrap items-end justify-between gap-4 border-t border-border pt-6">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {zeroMode ? "Your contribution" : "Total today"}
              </p>
              <p className="mt-1 font-display text-3xl font-medium tracking-tight">
                ${total}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  one time
                </span>
              </p>
            </div>
            <button
              onClick={submit}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:bg-sage-700"
            >
              {zeroMode ? (
                <>
                  Continue free <ArrowRight className="size-4" />
                </>
              ) : (
                <>
                  Continue · ${total} <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* $0 escape hatch — visible, not hidden, no form to fill */}
        <div className="mx-auto mt-5 max-w-2xl text-center">
          {!zeroMode ? (
            <button
              onClick={() => {
                setZeroMode(true);
                setTip(0);
              }}
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              I can't pay anything right now → continue at $0
            </button>
          ) : (
            <div className="inline-flex flex-col items-center gap-2 rounded-2xl border border-sage-600/30 bg-sage-50 px-5 py-4">
              <p className="text-sm text-foreground">
                You're set. Continuity is yours at $0. Nobody is checking, and
                nobody is keeping score.
              </p>
              <button
                onClick={() => setZeroMode(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Actually, I'd like to contribute
              </button>
            </div>
          )}
        </div>
      </section>

      {/* What you get */}
      <section className="px-6 pb-24 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-surface-soft p-8 lg:p-10">
          <div className="flex items-start gap-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </div>
            <div>
              <p className="font-display text-lg">Same product for everyone.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                The person who pays $0 and the person who pays $100 get the
                exact same Continuity. No locked features, no "premium" tier,
                no nag screens.
              </p>
            </div>
          </div>
          <ul className="mt-6 grid grid-cols-1 gap-2 text-sm text-foreground sm:grid-cols-2">
            <li>· Unlimited loved ones</li>
            <li>· Every document & export</li>
            <li>· AI-guided care conversations</li>
            <li>· Care team sharing</li>
            <li>· Lifetime access</li>
            <li>· Future updates included</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
