import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import {
  ShieldCheck,
  Users,
  Sparkles,
  HeartPulse,
  Sun,
  Leaf,
  QrCode,
  ArrowRight,
  Mic,
  CheckCircle2,
  FileText,
  CalendarClock,
  Stethoscope,
  Compass,
  Contact,
  Sparkle,
  MessagesSquare,
  Infinity as InfinityIcon,
  Gift,
} from "lucide-react";
import heroImage from "@/assets/hero.jpg";

import { HearthIllustration } from "@/components/soft-illustration";
import { getRestoredSession } from "@/lib/auth-flow";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Continuity — A community-built future care planning platform" },
      {
        name: "description",
        content:
          "Continuity is being built alongside caregiving families. Organize routines, medical info, and emergency plans. Pay what you can — nobody turned away.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    getRestoredSession().then((session) => {
      if (!cancelled && session) {
        navigate({ to: "/dashboard", replace: true });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      <main>
        <Hero />
        <WhyFamilies />
        <PilotSection />
        <AiPreview />
        <Creates />
        <EmergencySection />
        <GentleProgress />
        <CtaBand />
      </main>
      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-md bg-primary ring-1 ring-sage-700/10">
            <Leaf className="size-3.5 text-primary-foreground" />
          </span>
          <span className="font-display text-base font-semibold tracking-tight">
            Continuity
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#why" className="hover:text-foreground">Why Continuity</a>
          <a href="#how" className="hover:text-foreground">How it works</a>
          <a href="#ai" className="hover:text-foreground">AI guidance</a>
          <Link to="/pricing" className="hover:text-foreground">Pricing</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard"
            className="hidden rounded-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground md:inline-flex"
          >
            Demo Account
          </Link>
          <Link
            to="/onboarding"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-2 ring-sage-600/15 transition hover:bg-sage-700"
          >
            Set up an account
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="px-6 pb-16 pt-20 lg:px-8 lg:pb-24 lg:pt-28">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          <div className="w-full lg:w-[55%]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              <Sparkle className="size-3 fill-sage-600/40 text-sage-700" strokeWidth={1.5} />
              For the people who do the hardest work
            </div>
            <h1 className="text-balance font-display text-4xl font-medium leading-[1.1] tracking-tight text-foreground lg:text-5xl xl:text-6xl">
              A calm place to plan for the people who depend on you.
            </h1>
            <p className="mt-6 max-w-[52ch] text-pretty text-lg leading-relaxed text-muted-foreground">
              Continuity is being built alongside caregiving families. Organize
              routines, medical info, emergency plans, and future care — at your
              own pace, with a community that's shaping the tool with you.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/onboarding"
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground ring-2 ring-sage-600/15 transition hover:bg-sage-700"
              >
                Set up an account
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/onboarding"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                Set up your plan
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-primary" /> Private &amp; encrypted
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-primary" /> Work at your own pace
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-primary" /> Export anytime
              </span>
            </div>
          </div>
          <div className="w-full lg:w-[45%]">
            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-sage-50" />
              <img
                src={heroImage}
                alt="A calm parent organizing care information beside their child"
                width={1024}
                height={768}
                className="w-full rounded-3xl bg-mist-50 outline outline-1 -outline-offset-1 outline-black/5"
              />
              <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-border bg-card p-4 shadow-sm sm:block">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Readiness
                </p>
                <p className="mt-1 font-display text-2xl font-medium">68%</p>
                <div className="mt-2 h-1.5 w-32 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-2/3 bg-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const reasons = [
  { icon: ShieldCheck, title: "Emergency Preparedness", body: "Instant access to critical care instructions when minutes matter most.", tint: "sage" },
  { icon: Users, title: "Caregiver Continuity", body: "Seamlessly transfer years of intuitive knowledge to new support team members.", tint: "mist" },
  { icon: Compass, title: "Future Planning", body: "Document long-term wishes and legal details in one secure, accessible place.", tint: "zinc" },
  { icon: Stethoscope, title: "Organized Medical Info", body: "Keep diagnoses, medications, and therapy history clear and up to date.", tint: "sage" },
  { icon: Sun, title: "Daily Routine Guidance", body: "Preserve the small habits and comfort supports that make each day successful.", tint: "mist" },
  { icon: HeartPulse, title: "Peace of Mind", body: "Rest easy knowing your loved one's needs are understood by others.", tint: "zinc" },
] as const;

function tintClasses(tint: "sage" | "mist" | "zinc") {
  if (tint === "sage") return "bg-sage-50 text-sage-700";
  if (tint === "mist") return "bg-mist-50 text-mist-600";
  return "bg-muted text-muted-foreground";
}

function WhyFamilies() {
  return (
    <section id="why" className="bg-surface-soft px-6 py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="font-display text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Why families need this
          </p>
          <h2 className="mt-3 text-balance font-display text-3xl font-medium tracking-tight text-foreground lg:text-4xl">
            Built for your family's lasting peace of mind.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map(({ icon: Icon, title, body, tint }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card p-7 transition hover:-translate-y-0.5 hover:shadow-sm"
            >
              <div className={`mb-6 grid size-10 place-items-center rounded-xl ${tintClasses(tint)}`}>
                <Icon className="size-5" strokeWidth={1.75} />
              </div>
              <h3 className="font-display text-lg font-medium text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AiPreview() {
  return (
    <section id="ai" className="px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="font-display text-xs uppercase tracking-[0.2em] text-muted-foreground">
            AI-guided planning
          </p>
          <h2 className="mt-3 text-balance font-display text-3xl font-medium tracking-tight lg:text-4xl">
            A conversation that becomes a plan.
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Talk the way you'd brief a trusted backup. Continuity listens, asks
            the right follow-ups, and files every detail into the right section.
          </p>
        </div>

        <div className="flex h-[520px] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="grid size-8 place-items-center rounded-full bg-primary">
                <Sparkles className="size-3.5 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium">Continuity Assistant</span>
            </div>
            <div className="rounded-full bg-sage-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-sage-700">
              Active session
            </div>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto p-6 lg:p-8">
            <ChatBubble role="ai">
              I'd like to help you document the morning routine. What are some
              of the first things that happen after your child wakes up?
            </ChatBubble>
            <ChatBubble role="me">
              He needs his noise-canceling headphones immediately. Then he usually
              wants his blue blanket while we prepare his breakfast.
            </ChatBubble>
            <ChatBubble role="ai">
              That's helpful. I've added "Noise-canceling headphones" to Sensory
              Supports and "Blue blanket" to Comfort Items. What happens if the
              blanket isn't available?
            </ChatBubble>
            <div className="flex flex-wrap gap-2 pl-12">
              <Suggestion>We have a soft backup blanket</Suggestion>
              <Suggestion>He gets very distressed</Suggestion>
              <Suggestion>Music helps him settle</Suggestion>
            </div>
          </div>

          <div className="border-t border-border bg-surface-soft p-4">
            <div className="flex items-center gap-3">
              <div className="flex flex-1 items-center gap-3 rounded-full border border-border bg-card px-4 py-2.5 text-sm text-muted-foreground">
                <Mic className="size-4" /> Speak or type your response…
              </div>
              <Link
                to="/assistant"
                className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground transition hover:bg-sage-700"
                aria-label="Open AI assistant"
              >
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChatBubble({ role, children }: { role: "ai" | "me"; children: React.ReactNode }) {
  const isMe = role === "me";
  return (
    <div className={`flex max-w-[85%] gap-3 ${isMe ? "ml-auto flex-row-reverse" : ""}`}>
      <div
        className={`grid size-8 shrink-0 place-items-center rounded-full text-[10px] font-semibold ${
          isMe ? "bg-mist-600 text-white" : "bg-sage-100 text-sage-700"
        }`}
      >
        {isMe ? "ME" : "AI"}
      </div>
      <div
        className={`rounded-2xl p-4 text-sm leading-relaxed ${
          isMe
            ? "rounded-tr-none bg-mist-600 text-white"
            : "rounded-tl-none bg-muted text-foreground"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function Suggestion({ children }: { children: React.ReactNode }) {
  return (
    <button className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary/30 hover:text-foreground">
      {children}
    </button>
  );
}

const packets = [
  { name: "Emergency Care Packet", desc: "Critical safety info, contacts, and de-escalation guidance.", icon: ShieldCheck },
  { name: "Daily Care Guide", desc: "Hour-by-hour routines, comforts, and transitions.", icon: Sun },
  { name: "Caregiver Handbook", desc: "Everything a new caregiver needs to know on day one.", icon: Users },
  { name: "Medical Summary", desc: "Diagnoses, medications, allergies, and providers.", icon: Stethoscope },
  { name: "Future Care Blueprint", desc: "Long-term wishes, guardianship, and quality-of-life notes.", icon: Compass },
  { name: "Trusted Contacts Sheet", desc: "Family, providers, and emergency responders in one place.", icon: Contact },
] as const;

function Creates() {
  return (
    <section id="creates" className="bg-sage-50 px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="font-display text-xs uppercase tracking-[0.2em] text-muted-foreground">
              What the app creates
            </p>
            <h2 className="mt-3 font-display text-3xl font-medium tracking-tight lg:text-4xl">
              Beautiful, exportable documentation.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Built as you go. Export polished PDFs or DOCX the moment you need them.
            </p>
          </div>
          <Link
            to="/exports"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            View all templates <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
          {packets.map(({ name, desc, icon: Icon }) => (
            <div key={name} className="group cursor-pointer">
              <div className="mb-4 flex aspect-[3/4] flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition group-hover:shadow-md">
                <div className="mb-4 grid size-9 place-items-center rounded-lg bg-sage-50 text-sage-700">
                  <Icon className="size-4" strokeWidth={1.75} />
                </div>
                <div className="space-y-2">
                  <div className="h-1.5 w-2/3 rounded bg-muted" />
                  <div className="h-1 w-full rounded bg-muted/70" />
                  <div className="h-1 w-5/6 rounded bg-muted/70" />
                </div>
                <div className="mt-6 flex-1 rounded-lg bg-muted/40" />
                <div className="mt-4 flex items-center justify-between text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  <span>PDF / DOCX</span>
                  <FileText className="size-3.5" />
                </div>
              </div>
              <h4 className="font-medium text-foreground">{name}</h4>
              <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EmergencySection() {
  return (
    <section id="emergency" className="px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink p-10 text-background lg:p-16">
          <div className="relative z-10 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div className="max-w-[52ch]">
              <p className="font-display text-xs uppercase tracking-[0.2em] text-background/60">
                Emergency readiness
              </p>
              <h2 className="mt-3 font-display text-3xl font-medium leading-tight lg:text-4xl">
                Safety when you aren't there.
              </h2>
              <p className="mt-5 text-background/70">
                If your loved one cannot explain their needs in an emergency,
                Continuity helps others understand how to support them safely —
                with a private QR key, a caregiver quick-view, and a printable
                summary for first responders.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/emergency"
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-sage-700"
                >
                  Build emergency packet
                </Link>
                <button className="rounded-full border border-background/20 px-5 py-2.5 text-sm font-medium text-background/90 transition hover:bg-background/10">
                  Privacy settings
                </button>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-3xl bg-background p-5">
                <div className="grid size-44 place-items-center rounded-xl bg-muted text-muted-foreground">
                  <QrCode className="size-24" strokeWidth={1.25} />
                </div>
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-background/60">
                Secure scan access
              </p>
            </div>
          </div>
          <div className="pointer-events-none absolute -right-32 top-0 h-full w-1/2 rounded-full bg-primary/20 blur-3xl" />
        </div>
      </div>
    </section>
  );
}

function GentleProgress() {
  const items = [
    { title: "Save any time", body: "Every message is saved instantly. Walk away and pick up exactly where you left off." },
    { title: "Editable forever", body: "Life changes. Update any section in seconds — the rest of your plan follows." },
    { title: "Work in any order", body: "Start with what you know best. Five minutes or two hours, your call." },
    { title: "Export on demand", body: "Generate ER-ready PDFs, school packets, and respite handoffs whenever you need them." },
  ];
  return (
    <section className="border-t border-border bg-surface-soft px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-sage-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-sage-700">
          How it fits your life
        </div>
        <h2 className="mt-6 text-balance font-display text-3xl font-medium tracking-tight lg:text-4xl">
          Built for the way you actually work.
        </h2>
        <p className="mt-4 text-muted-foreground">
          You're the one who knows. Continuity just makes sure everyone else can know it too.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-10 text-left md:grid-cols-2">
          {items.map((it) => (
            <div key={it.title} className="flex gap-4">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={1.75} />
              <div>
                <h4 className="font-medium text-foreground">{it.title}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{it.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBand() {
  return (
    <section className="px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl border border-border bg-gradient-to-br from-sage-50/70 via-card to-mist-50/40 p-10 text-center lg:p-14">
        <p className="font-display text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Built alongside caregiving families
        </p>
        <h3 className="mt-3 font-display text-2xl font-medium tracking-tight lg:text-3xl">
          Start with one small section today.
        </h3>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          You don't have to do it all tonight. Continuity will be here whenever
          you're ready — and shaped by every family who joins.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            to="/onboarding"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground ring-2 ring-sage-600/15 transition hover:bg-sage-700"
          >
            Set up an account <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

const pilotBenefits = [
  { icon: InfinityIcon, title: "2 years of storage included", body: "Pay once. Your plan is safely stored for 2 years. 60 days before it ends, we'll email you to renew at-cost (~$4/year) or download everything. Never deleted without warning." },
  { icon: MessagesSquare, title: "Help shape what comes next", body: "Your reflections directly inform what we build next, in plain conversation." },
  { icon: Sparkles, title: "New tools as they land", body: "Try new care templates and AI guidance as soon as they're ready." },
  { icon: Users, title: "Built with caregivers", body: "A small, considered group of caregivers building this together." },
  { icon: Gift, title: "Pay what you can", body: "Pay what feels sustainable. Free access is always available, no questions asked." },
  { icon: HeartPulse, title: "A direct line to the team", body: "We read every message personally and respond with care." },
];

function PilotSection() {
  return (
    <section id="how" className="px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div className="overflow-hidden rounded-3xl border border-border bg-surface-soft">
            <HearthIllustration className="h-full w-full" />
          </div>
          <div>
            <p className="font-display text-xs uppercase tracking-[0.18em] text-muted-foreground">
              How it works
            </p>
            <h2 className="mt-3 text-balance font-display text-3xl font-medium tracking-tight lg:text-4xl">
              We're building this alongside families like yours.
            </h2>
            <p className="mt-5 max-w-[52ch] text-pretty leading-relaxed text-muted-foreground">
              We're building Continuity alongside families caring for loved ones
              with lifelong support needs. Pay what you can. Nobody is turned
              away. Free access is always available, no questions asked.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/onboarding"
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground ring-2 ring-sage-600/15 transition hover:bg-sage-700"
              >
                Set up an account <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium hover:bg-muted"
              >
                Choose what feels sustainable
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pilotBenefits.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-sm"
            >
              <div className="mb-4 grid size-9 place-items-center rounded-lg bg-sage-50 text-sage-700">
                <Icon className="size-4" strokeWidth={1.75} />
              </div>
              <h3 className="font-display text-base font-medium">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border px-6 py-12 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-xs text-muted-foreground md:flex-row">
        <div className="flex items-center gap-2">
          <span className="grid size-5 place-items-center rounded bg-primary/15">
            <Leaf className="size-3 text-primary" />
          </span>
          <span className="font-display font-medium uppercase tracking-widest text-foreground/70">
            Continuity
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground">Terms</a>
          <a href="#" className="hover:text-foreground">Contact</a>
        </div>
        <p>© {new Date().getFullYear()} Continuity. Preserving care, together.</p>
      </div>
    </footer>
  );
}

// Side-effect to silence unused imports if calendar icon needed later
void CalendarClock;
