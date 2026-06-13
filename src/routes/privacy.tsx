import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Continuity" },
      {
        name: "description",
        content:
          "Plain-language privacy policy for Continuity. What we collect, how we use it, and how to ask us to delete it.",
      },
      { property: "og:title", content: "Privacy Policy — Continuity" },
      {
        property: "og:description",
        content:
          "What Continuity collects, how it's used, and your rights over your information.",
      },
    ],
  }),
  component: PrivacyPage,
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

function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
        <p className="font-display text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Continuity
        </p>
        <h1 className="mt-4 font-display text-4xl font-medium text-foreground sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Last updated: June 13, 2026
        </p>

        <p className="mt-8 text-[15px] leading-relaxed text-foreground">
          The information you put into Continuity is some of the most personal
          information a family has. We take that seriously. Here, in plain
          language, is what we collect, why, and what you can ask us to do
          about it.
        </p>

        <Section title="A small, independent product">
          <p>
            Continuity is a small, independent product — not a big company with
            a marketing department. There's no ad business behind it, no
            investor pressure to monetize your data, and no quiet third party
            looking over your shoulder. We tell you that up front because it
            shapes everything below.
          </p>
        </Section>

        <Section title="What we collect">
          <p>The information in Continuity falls into a few simple buckets:</p>
          <ul className="ml-5 list-disc space-y-2">
            <li>
              <span className="font-medium text-foreground">Your name and email</span>{" "}
              — so you can sign in and so we can reach you about your account
              (renewal reminders, important changes, replies to your messages).
            </li>
            <li>
              <span className="font-medium text-foreground">Care information you enter</span>{" "}
              — the routines, medical details, people, notes, and quiet
              knowledge you choose to write down. This is yours. You decide
              what goes in.
            </li>
            <li>
              <span className="font-medium text-foreground">Basic technical info</span>{" "}
              — the kind of thing every website sees (a browser type, a rough
              region) to keep the service running and secure.
            </li>
          </ul>
        </Section>

        <Section title="How we use it">
          <p>
            We use your information to provide Continuity to you, and that's
            it. That means letting you sign in, saving what you've written so
            it's there when you come back, emailing you about your account,
            and replying when you contact us.
          </p>
          <p>
            We{" "}
            <span className="font-medium text-foreground">
              do not sell your data
            </span>
            , and we don't share it with third parties for advertising or
            marketing. We don't use what you write to train AI models for
            anyone else.
          </p>
        </Section>

        <Section title="Where it lives">
          <p>
            Your information is stored with{" "}
            <span className="font-medium text-foreground">Supabase</span>, a
            hosting service we use for our database and authentication. They
            store the data on our behalf under their own security practices.
            Payments, when you make one, are handled by our payment processor —
            we never see or store your card details.
          </p>
        </Section>

        <Section title="Cookies">
          <p>
            We use cookies for{" "}
            <span className="font-medium text-foreground">one thing only</span>
            : keeping you signed in. No advertising cookies, no third-party
            tracking pixels, no behavioral profiling. If you sign out or clear
            them, the sign-in cookie goes away.
          </p>
        </Section>

        <Section title="Asking us to delete your data">
          <p>
            You can ask us to delete your account and everything in it{" "}
            <span className="font-medium text-foreground">at any time</span>,
            for any reason, by emailing us. We'll confirm and then remove it.
            You don't need to explain why.
          </p>
          <p>
            You can also export everything you've written before deleting, so
            nothing is lost on your end. (See our{" "}
            <Link
              to="/terms"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Terms
            </Link>{" "}
            for how long we keep data by default.)
          </p>
        </Section>

        <Section title="Children's information">
          <p>
            Continuity is designed for caregivers to keep notes about the
            children and dependents they support. That information lives in
            your account — you are the one entering it, and you control it.
            Continuity is not intended to be used directly by children.
          </p>
        </Section>

        <Section title="Security">
          <p>
            We take reasonable steps to protect your information, including
            encryption in transit and access controls on our systems. No
            online service can promise perfect security, but we do our best,
            and if something ever went wrong in a way that affected you, we'd
            tell you.
          </p>
        </Section>

        <Section title="Governing law">
          <p>
            Continuity is operated from the State of{" "}
            <span className="font-medium text-foreground">North Carolina</span>
            , United States, and this policy is governed by North Carolina
            law.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            If we make meaningful changes — especially anything that affects
            how your data is collected, used, or shared — we'll update the
            date at the top of this page and email you a note. Small wording
            cleanups won't trigger a separate notice.
          </p>
        </Section>

        <Section title="Getting in touch">
          <p>
            Questions about privacy, or want to ask us to delete your data?
            Email{" "}
            <a
              href="mailto:[your email]"
              className="font-medium text-foreground underline underline-offset-4"
            >
              [your email]
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
