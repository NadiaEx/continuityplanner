import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader, Card, Button } from "@/components/page-shell";
import { Plus, Heart, Home, Sparkles, FileVideo } from "lucide-react";
import { useProfile } from "@/lib/use-profile";

export const Route = createFileRoute("/_app/future")({
  head: () => ({ meta: [{ title: "Future Planning — Continuity" }] }),
  component: Future,
});

const sections = [
  {
    title: "Guardian planning",
    icon: Heart,
    body: "Designated guardians, decision-making preferences, and the people we trust most to step in.",
    items: ["Primary: Aunt Rose", "Secondary: Uncle David", "Final letter prepared (May 2025)"],
  },
  {
    title: "Future living preferences",
    icon: Home,
    body: "Where and how Leo might live well into adulthood.",
    items: ["Small group home with sensory-friendly design", "Near family within 30 min", "Familiar caregivers prioritized"],
  },
  {
    title: "Adulthood transition notes",
    icon: Sparkles,
    body: "What kind of life we hope Leo can grow into.",
    items: ["Continue art classes — they bring him joy", "Daily walks near water", "Annual visits to the same vacation home"],
  },
  {
    title: "Things I hope never change",
    icon: Heart,
    body: "The small constants that make Leo, Leo.",
    items: ["Sunday pancakes", "Blue blanket always within reach", "His favorite song at bedtime"],
  },
];

export default function Future() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Future Planning"
        title="The long view."
        description="Where Leo is headed, who's responsible, and the decisions you want made when you're not in the room."
        actions={<Button><Plus className="size-4" /> Add section</Button>}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {sections.map(({ title, icon: Icon, body, items }) => (
          <Card key={title}>
            <div className="mb-4 flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-mist-50 text-mist-600">
                <Icon className="size-5" strokeWidth={1.75} />
              </div>
              <h3 className="font-display text-lg font-semibold">{title}</h3>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">{body}</p>
            <ul className="space-y-1.5 text-sm">
              {items.map((i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
                  {i}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <Card className="mt-6 bg-gradient-to-br from-sage-50 to-card">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid size-10 place-items-center rounded-xl bg-card text-primary">
              <FileVideo className="size-5" strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold">Letters &amp; videos</h3>
              <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                Record short notes or videos for future caregivers, guardians, or Leo
                himself. These can be played at any milestone.
              </p>
            </div>
          </div>
          <Button>Record a message</Button>
        </div>
      </Card>
    </PageShell>
  );
}
