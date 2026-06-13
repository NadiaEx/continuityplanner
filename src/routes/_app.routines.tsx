import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader, Card, Chip, Button } from "@/components/page-shell";
import { Plus, Sunrise, UtensilsCrossed, School, Repeat, Bath, Moon } from "lucide-react";
import { useProfile } from "@/lib/use-profile";

export const Route = createFileRoute("/_app/routines")({
  head: () => ({ meta: [{ title: "Daily Routines — Continuity" }] }),
  component: Routines,
});

const blocks = [
  {
    title: "Morning",
    time: "6:30–8:00 AM",
    icon: Sunrise,
    steps: [
      "Hand over noise-canceling headphones immediately on waking",
      "Soft lamp on, overhead lights off",
      "Offer pretzel sticks and water before getting dressed",
    ],
    tip: "If he resists clothes, lay them out in the same order each day.",
  },
  {
    title: "Meals",
    time: "Throughout day",
    icon: UtensilsCrossed,
    steps: [
      "Foods always on blue plate, never touching",
      "Water in green cup with straw",
      "Avoid: anything sticky, peanut products",
    ],
    tip: "He needs 10–15 quiet minutes before transitioning away from the table.",
  },
  {
    title: "School / Day Program",
    time: "8:30 AM–2:30 PM",
    icon: School,
    steps: [
      "Goodbye phrase: \"See you after snack\"",
      "Backpack includes: AAC device, fidget, spare headphones",
      "Pickup at side door (less stimulating than main entrance)",
    ],
  },
  {
    title: "Transitions",
    time: "Anytime",
    icon: Repeat,
    steps: [
      "Give 5-minute warning, then 2-minute warning",
      "Use visual countdown timer",
      "Offer choice between two acceptable options",
    ],
  },
  {
    title: "Bathing / Hygiene",
    time: "Evening",
    icon: Bath,
    steps: [
      "Water temp: warm, not hot",
      "Lavender soap (familiar scent)",
      "Towel waiting on warmer before he gets out",
    ],
  },
  {
    title: "Bedtime",
    time: "8:00–9:00 PM",
    icon: Moon,
    steps: [
      "Calming music playlist begins at 8:00 PM",
      "Blue blanket on bed, never washed on Sundays",
      "Melatonin 3mg with water at 8:30 PM",
      "Reading: same 3 books on rotation",
    ],
    tip: "Skipping the music or blanket leads to a hard reset of the routine.",
  },
];

export default function Routines() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Daily Routines"
        title="The rhythm of Leo's day."
        description="The small habits and predictable moments that help Leo feel safe and successful."
        actions={<Button><Plus className="size-4" /> Add block</Button>}
      />

      <div className="space-y-5">
        {blocks.map(({ title, time, icon: Icon, steps, tip }) => (
          <Card key={title}>
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="flex shrink-0 items-start gap-3 md:w-56">
                <div className="grid size-10 place-items-center rounded-xl bg-sage-50 text-sage-700">
                  <Icon className="size-5" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold">{title}</h3>
                  <p className="text-xs text-muted-foreground">{time}</p>
                </div>
              </div>
              <div className="flex-1">
                <ol className="space-y-2.5">
                  {steps.map((s, i) => (
                    <li key={s} className="flex gap-3 text-sm">
                      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
                        {i + 1}
                      </span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
                {tip && (
                  <div className="mt-4 rounded-xl bg-mist-50/60 p-3 text-sm text-mist-600">
                    <Chip tone="mist">Caregiver tip</Chip>
                    <p className="mt-2 text-foreground/80">{tip}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
