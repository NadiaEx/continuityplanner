import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader, Card, Chip } from "@/components/page-shell";
import { Heart, FileText, Sparkles, Users, Compass, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/_app/insights")({
  head: () => ({ meta: [{ title: "Insights — Continuity" }] }),
  component: Insights,
});

const metrics = [
  { label: "Active families", value: "127", trend: "+18 this month", icon: Users },
  { label: "Avg. plan progress", value: "54%", trend: "Quiet, steady", icon: Compass },
  { label: "Emergency packets generated", value: "412", trend: "Most-used export", icon: ShieldCheck },
  { label: "Reflections received", value: "1,284", trend: "We read every one", icon: Heart },
];

const sections = [
  { name: "Daily routines", completed: 88, skipped: 4 },
  { name: "Sensory & comfort", completed: 76, skipped: 9 },
  { name: "Medical information", completed: 71, skipped: 12 },
  { name: "Emergency plan", completed: 64, skipped: 7 },
  { name: "Care team", completed: 52, skipped: 14 },
  { name: "Future planning", completed: 28, skipped: 31 },
];

const difficulty = [
  { label: "Daily routines", score: 1.6 },
  { label: "Sensory & comfort", score: 1.9 },
  { label: "Medical information", score: 2.4 },
  { label: "Emergency plan", score: 3.1 },
  { label: "Future planning", score: 4.2 },
];

const requests = [
  "Shared editing with co-caregivers",
  "Printable wallet card for first responders",
  "Voice-only assistant mode",
  "School handoff template",
  "Spanish language support",
];

function Insights() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Insights"
        title="What we're learning together."
        description="A quiet, qualitative view into how families are using Continuity. No vanity metrics — just signals that help us care for what to build next."
      />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map(({ label, value, trend, icon: Icon }) => (
          <Card key={label}>
            <div className="mb-4 grid size-9 place-items-center rounded-lg bg-sage-50 text-sage-700">
              <Icon className="size-4" strokeWidth={1.75} />
            </div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 font-display text-2xl font-medium">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{trend}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-display text-lg font-medium">Section engagement</h3>
            <Chip tone="sage">Last 30 days</Chip>
          </div>
          <ul className="space-y-4">
            {sections.map((s) => (
              <li key={s.name}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-foreground">{s.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {s.completed}% completed · {s.skipped}% skipped
                  </span>
                </div>
                <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${s.completed}%` }}
                  />
                  <div
                    className="h-full bg-amber-300/70"
                    style={{ width: `${s.skipped}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-display text-lg font-medium">Emotional difficulty</h3>
            <Chip tone="mist">1–5 scale</Chip>
          </div>
          <ul className="space-y-3">
            {difficulty.map((d) => (
              <li key={d.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>{d.label}</span>
                  <span className="text-xs text-muted-foreground">{d.score.toFixed(1)}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-mist-600"
                    style={{ width: `${(d.score / 5) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
            Higher scores show where families need more reassurance and softer pacing.
          </p>
        </Card>

        <Card className="lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-display text-lg font-medium">Most requested features</h3>
            <Chip tone="sage">From the community</Chip>
          </div>
          <ul className="space-y-2">
            {requests.map((r, i) => (
              <li
                key={r}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface-soft p-4 text-sm"
              >
                <span className="grid size-7 place-items-center rounded-full bg-sage-50 text-xs font-medium text-sage-700">
                  {i + 1}
                </span>
                <span className="text-foreground/90">{r}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="size-4 text-sage-700" />
            <h3 className="font-display text-lg font-medium">Reflections</h3>
          </div>
          <blockquote className="rounded-xl bg-sage-50/60 p-4 text-sm italic leading-relaxed text-sage-700">
            "This is the first time I've sat with these questions and not felt afraid."
          </blockquote>
          <blockquote className="mt-3 rounded-xl bg-mist-50/60 p-4 text-sm italic leading-relaxed text-mist-600">
            "I came back to it three times. The pacing made it possible."
          </blockquote>
          <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <FileText className="size-3.5" /> 1,284 reflections, manually reviewed
          </p>
        </Card>
      </div>
    </PageShell>
  );
}
