import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHeader, Card, Button } from "@/components/page-shell";

import { FeedbackPrompt } from "@/components/feedback-prompt";
import { useProfile } from "@/lib/use-profile";
import {
  ArrowRight,
  Sparkles,
  Circle,
  BookmarkCheck,
} from "lucide-react";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Continuity" }] }),
  component: Dashboard,
});

const next = [
  { title: "Tell us about morning transitions", time: "~5 min" },
  { title: "Add an emergency contact", time: "~2 min" },
  { title: "Note one comfort support", time: "~3 min" },
];

export default function Dashboard() {
  const { caregiverFirstName, lovedOneName, hasOnboarded } = useProfile();
  return (
    <PageShell>
      <PageHeader
        eyebrow="Welcome back"
        title={`Good to see you, ${caregiverFirstName}.`}
        description="Your plan is just getting started. Add what you can, when you can — nothing here needs to be perfect."
        actions={
          <Link to="/assistant">
            <Button>
              Continue with AI <ArrowRight className="size-4" />
            </Button>
          </Link>
        }
      />

      <Card className="mb-8 bg-gradient-to-br from-sage-50 to-card p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-sage-700">
          Getting started
        </p>
        <h3 className="mt-3 font-display text-2xl font-medium tracking-tight">
          {hasOnboarded
            ? `Let's keep building ${lovedOneName}'s plan.`
            : "Let's begin with a short conversation."}
        </h3>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          We'll only show what you've shared with us. As you add routines,
          contacts, documents and notes, your plan will grow here — at your pace.
        </p>
        <Link to="/assistant" className="mt-5 inline-block">
          <Button>
            Start a section <ArrowRight className="size-4" />
          </Button>
        </Link>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="mb-2 font-display text-lg font-medium">Recent updates</h3>
          <p className="text-sm text-muted-foreground">
            Nothing here yet. As you add information, your most recent updates will appear in this space.
          </p>
        </Card>

        <Card>
          <h3 className="mb-2 font-display text-lg font-medium">Suggested next steps</h3>
          <p className="mb-5 text-sm text-muted-foreground">
            A few gentle places to begin.
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
