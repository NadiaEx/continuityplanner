import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHeader, Card, Chip, Button } from "@/components/page-shell";

import { FeedbackPrompt } from "@/components/feedback-prompt";
import {
  ArrowRight,
  ShieldCheck,
  Users,
  FileText,
  Compass,
  Sparkles,
  Bell,
  CheckCircle2,
  Circle,
  Save,
  BookmarkCheck,
} from "lucide-react";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Continuity" }] }),
  component: Dashboard,
});

const stats = [
  { label: "Emergency Preparedness", value: 82, tint: "sage" as const, icon: ShieldCheck },
  { label: "Caregiver Readiness", value: 64, tint: "mist" as const, icon: Users },
  { label: "Documentation Status", value: 71, tint: "sage" as const, icon: FileText },
  { label: "Future Planning Progress", value: 42, tint: "mist" as const, icon: Compass },
];

const recent = [
  { title: "Added Leo's calming song to bedtime routine", when: "2 hours ago" },
  { title: "Updated Dr. Patel's contact information", when: "Yesterday" },
  { title: "Generated draft Emergency Care Packet", when: "3 days ago" },
];

const next = [
  { title: "Tell us about morning transitions", time: "~5 min" },
  { title: "Add an emergency contact", time: "~2 min" },
  { title: "Note one comfort support", time: "~3 min" },
];

export default function Dashboard() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Welcome back"
        title="Good morning, Maya."
        description="You're making progress. This does not need to be perfect — you can revisit anything, anytime."
        actions={
          <Link to="/assistant">
            <Button>
              Continue with AI <ArrowRight className="size-4" />
            </Button>
          </Link>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-50 px-2.5 py-1 text-sage-700">
          <Save className="size-3" /> Autosaved a moment ago
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-mist-50 px-2.5 py-1 text-mist-600">
          <BookmarkCheck className="size-3" /> Pick up right where you left off
        </span>
      </div>

      {/* Hero readiness */}
      <Card className="mb-8 overflow-hidden bg-gradient-to-br from-sage-50 to-card p-8">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-sage-700">
              Continuity Readiness
            </p>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="font-display text-6xl font-medium tracking-tight">
                68
              </span>
              <span className="text-muted-foreground">/ 100</span>
              <Chip tone="sage">+4 this week</Chip>
            </div>
            <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-background">
              <div className="h-full w-[68%] rounded-full bg-primary" />
            </div>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Two-thirds of the way there. Finish the next section and your emergency packet becomes export-ready.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Recommended next step
            </p>
            <h3 className="mt-2 font-display text-lg font-medium">
              Document Leo's sensory triggers
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              A short 5-minute conversation with the AI assistant.
            </p>
            <Link to="/assistant" className="mt-4 inline-block">
              <Button>
                Start now <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Section stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, tint, icon: Icon }) => (
          <Card key={label}>
            <div
              className={`mb-4 grid size-9 place-items-center rounded-lg ${
                tint === "sage" ? "bg-sage-50 text-sage-700" : "bg-mist-50 text-mist-600"
              }`}
            >
              <Icon className="size-4" strokeWidth={1.75} />
            </div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-display text-2xl font-medium">{value}</span>
              <span className="text-xs text-muted-foreground">%</span>
            </div>
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${value}%` }}
              />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-display text-lg font-medium">Recent updates</h3>
            <Chip tone="sage">Autosaved</Chip>
          </div>
          <ul className="space-y-3">
            {recent.map((r) => (
              <li
                key={r.title}
                className="flex items-start gap-3 rounded-xl border border-border bg-surface-soft p-4"
              >
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                <div className="flex-1">
                  <p className="text-sm text-foreground">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{r.when}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-xl bg-mist-50/60 p-4">
            <div className="flex items-start gap-3">
              <Bell className="mt-0.5 size-4 text-mist-600" />
              <div>
                <p className="text-sm font-medium">Upcoming reminder</p>
                <p className="text-xs text-muted-foreground">
                  Review Leo's medication list with Dr. Patel — Monday, 10:00 AM
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="mb-2 font-display text-lg font-medium">Next steps</h3>
          <p className="mb-5 text-sm text-muted-foreground">
            Each one closes a real gap in your plan.
          </p>
          <ul className="space-y-2">
            {next.map((n) => (
              <li
                key={n.title}
                className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-muted"
              >
                <Circle className="size-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.time}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link to="/assistant" className="mt-5 inline-flex">
            <Button variant="secondary">
              <Sparkles className="size-4" /> Open AI assistant
            </Button>
          </Link>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <FeedbackPrompt question="How did this section feel today?" />
        <Card className="bg-gradient-to-br from-mist-50/40 to-card">
          <p className="font-display text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Save for later
          </p>
          <h3 className="mt-2 font-display text-lg font-medium">
            You can revisit this anytime.
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Everything is saved as you go. Step away whenever you need — your
            plan will be here, exactly where you left it.
          </p>
          <Button variant="secondary" className="mt-5">
            <BookmarkCheck className="size-4" /> Continue later
          </Button>
        </Card>
      </div>
    </PageShell>
  );
}
