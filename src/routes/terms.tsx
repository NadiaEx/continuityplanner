import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Continuity" },
      {
        name: "description",
        content:
          "Plain-language terms for using Continuity, a care planning tool for families supporting disabled and neurodivergent children.",
      },
      { property: "og:title", content: "Terms of Service — Continuity" },
      {
        property: "og:description",
        content:
          "Plain-language terms for using Continuity. What we are, what we're not, and how we treat your data.",
      },
    ],
  }),
  component: TermsPage,
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

function TermsPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
        <p className="font-display text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Continuity
        </p>
        <h1 className="mt-4 font-display text-4xl font-medium text-foreground sm:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Last updated: June 13, 2026
        </p>

        <p className="mt-8 text-[15px] leading-relaxed text-foreground">
          Welcome. These are the terms for using Continuity. We've written them
          in plain language because you have enough complicated paperwork in
          your life already. By using Continuity, you're agreeing to what's
          below.
        </p>

        <Section title="What Continuity is">
          <p>
            Continuity is a care planning tool for families who support
            disabled, autistic, or otherwise neurodivergent children and
            dependents. It helps you gather the routines, medical details,
            people, and quiet knowledge that keep your loved one safe — and
            keep that information in one place you can return to.
          </p>
        </Section>

        <Section title="We're in a pilot period">
          <p>
            Continuity is being built alongside the families using it. Things
            will change, features will move, and occasionally something will
            break. We do our best, but the service is provided{" "}
            <span className="font-medium text-foreground">as-is</span>, without
            warranties of any kind. You use it at your own discretion.
          </p>
          <p>
            We may add, change, or remove features during the pilot. If
            something significant changes about how your data is handled, we
            will tell you.
          </p>
        </Section>

        <Section title="What we're not">
          <p>
            Continuity is not a medical service, a legal service, or a
            replacement for professional advice. Nothing in the app is medical,
            legal, financial, or therapeutic guidance. For real decisions about
            care, treatment, guardianship, benefits, or anything else that
            matters, please talk to a qualified professional.
          </p>
          <p>
            In an emergency, call your local emergency number. Continuity is
            not designed to alert anyone or summon help.
          </p>
        </Section>

        <Section title="Your account and your responsibilities">
          <p>
            You're responsible for keeping your login credentials safe and for
            the information you put into Continuity. Please don't share other
            people's private information without their permission, and please
            don't use the service for anything unlawful or harmful.
          </p>
          <p>
            The information you write about your loved one belongs to you. We
            don't sell it, and we don't use it to train AI models for anyone
            else.
          </p>
        </Section>

        <Section title="How long we keep your data">
          <p>
            Continuity stores your information for{" "}
            <span className="font-medium text-foreground">one year</span> from
            the date you start your plan (or from your most recent
            contribution). Before that year ends, we'll email you — more than
            once — to let you know what's coming and how to renew or export.
          </p>
          <p>
            If you don't renew and don't respond, we will delete your data
            after the notice period. We'd rather over-warn you than quietly
            lose something that matters.
          </p>
        </Section>

        <Section title="Exporting your data">
          <p>
            You can export everything you've entered into Continuity{" "}
            <span className="font-medium text-foreground">at any time</span>,
            for any reason — to print it, hand it to a caregiver, back it up,
            or take it elsewhere. It's your plan. You should be able to walk
            out the door with it.
          </p>
        </Section>

        <Section title="Ending your use of Continuity">
          <p>
            You can stop using Continuity whenever you want. You can also ask
            us to delete your account and information, and we'll do that.
            Contributions you've already made are non-refundable except where
            required by law — we're a tiny operation and we've already used
            the funds to keep things running.
          </p>
          <p>
            We may suspend or end an account if it's being used to harm others
            or to break the law. We'll try to give notice when we reasonably
            can.
          </p>
        </Section>

        <Section title="Limits on liability">
          <p>
            To the fullest extent allowed by law, Continuity and the people
            who run it are not liable for indirect, incidental, or
            consequential damages that come from using (or not being able to
            use) the service. Our total liability to you is limited to what
            you've paid us in the past twelve months, or twenty US dollars,
            whichever is greater.
          </p>
          <p>
            This isn't us being cold — it's us being honest about what a small
            pilot can promise. If something goes wrong, please write to us and
            we'll do what we can to make it right.
          </p>
        </Section>

        <Section title="Governing law">
          <p>
            These terms are governed by the laws of the State of{" "}
            <span className="font-medium text-foreground">North Carolina</span>
            , United States, without regard to its conflict-of-laws rules. Any
            dispute will be brought in the state or federal courts located in
            North Carolina, and you and we both agree to that.
          </p>
        </Section>

        <Section title="Changes to these terms">
          <p>
            If we make meaningful changes to these terms, we'll update the date
            at the top of this page and, when the change affects how your data
            is used, we'll send you a note. Continuing to use Continuity after
            a change means you're okay with the updated terms.
          </p>
        </Section>

        <Section title="Getting in touch">
          <p>
            Questions, concerns, or just want to tell us what's working? Email{" "}
            <a
              href="mailto:hello@continuityplanner.app"
              className="font-medium text-foreground underline underline-offset-4"
            >
              hello@continuityplanner.app
            </a>
            . A real person reads every message.
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
