import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [
      { title: "Refund Policy — Continuity" },
      {
        name: "description",
        content:
          "Continuity is pay-what-you-can. If you didn't get value, email us and we'll make it right.",
      },
      { property: "og:title", content: "Refund Policy — Continuity" },
      {
        property: "og:description",
        content:
          "Pay-what-you-can, including $0. If you didn't get value, we'll make it right — no questions asked.",
      },
    ],
  }),
  component: RefundPage,
});

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl font-medium text-foreground">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

function RefundPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
        <p className="font-display text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Continuity
        </p>
        <h1 className="mt-4 font-display text-4xl font-medium text-foreground sm:text-5xl">
          Refund Policy
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Last updated: June 13, 2026
        </p>

        <p className="mt-8 text-[15px] leading-relaxed text-foreground">
          Short version: if Continuity didn't give you what you needed, write
          to us and we'll make it right.
        </p>

        <Section title="Pay what you can">
          <p>
            Continuity is{" "}
            <span className="font-medium text-foreground">
              pay-what-you-can
            </span>
            , and that includes{" "}
            <span className="font-medium text-foreground">$0</span>. You can
            use the full service without paying a cent. If you do contribute,
            you choose the amount — there's no hidden "real" price behind it.
          </p>
        </Section>

        <Section title="Why we don't usually offer refunds">
          <p>
            Because you set your own price (including nothing), we generally
            don't process refunds. Whatever you gave was the amount that felt
            right to you at the time, and we've already put it toward keeping
            the service running for the next family.
          </p>
        </Section>

        <Section title="But — if you didn't get value">
          <p>
            We mean this. If you contributed and Continuity didn't end up
            being useful to you, or something went wrong, or you just feel off
            about it,{" "}
            <a
              href="mailto:hello@continuityplanner.app"
              className="font-medium text-foreground underline underline-offset-4"
            >
              email us
            </a>{" "}
            and we'll refund you.{" "}
            <span className="font-medium text-foreground">
              No questions asked.
            </span>{" "}
            You don't have to justify it or send screenshots or explain your
            reasons. One sentence is plenty.
          </p>
          <p>
            We'd rather you walk away whole than feel like you got stuck
            paying for something that didn't help.
          </p>
        </Section>

        <Section title="Getting in touch">
          <p>
            Email{" "}
            <a
              href="mailto:hello@continuityplanner.app"
              className="font-medium text-foreground underline underline-offset-4"
            >
              hello@continuityplanner.app
            </a>
            . A real person reads every message, usually within a couple of
            days.
          </p>
        </Section>

        <div className="mt-16 border-t border-border pt-8 text-sm text-muted-foreground">
          <Link
            to="/"
            className="inline-flex items-center font-medium text-foreground underline underline-offset-4"
          >
            ← Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
