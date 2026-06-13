import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader, Card, Chip, Button } from "@/components/page-shell";
import { Plus, Camera, Upload } from "lucide-react";
import { useProfile } from "@/lib/use-profile";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Child Profile — Continuity" }] }),
  component: Profile,
});


const sections = [
  {
    title: "Diagnoses",
    items: ["Autism Spectrum Disorder", "Sensory Processing Disorder", "Anxiety"],
  },
  {
    title: "Communication Style",
    items: ["Uses 2–3 word phrases", "Prefers visual schedules", "Echolalia common"],
  },
  {
    title: "Medical Needs",
    items: ["Daily melatonin (bedtime)", "Quarterly therapy reviews"],
  },
  {
    title: "Allergies",
    items: ["Peanuts (severe)", "Penicillin"],
  },
  {
    title: "Medications",
    items: ["Melatonin 3mg — 8:30 PM", "Children's Zyrtec — seasonal"],
  },
  {
    title: "Safety Risks",
    items: ["Wandering when overstimulated", "Doesn't recognize traffic danger"],
  },
  {
    title: "Sensory Needs",
    items: ["Noise-canceling headphones", "Weighted blanket", "Soft lighting"],
  },
  {
    title: "Favorite Comforts",
    items: ["Blue blanket", "\"Wake Up\" song", "Pretzel sticks"],
  },
  {
    title: "Trigger Behaviors",
    items: ["Unexpected loud noises", "Surprise schedule changes"],
  },
  {
    title: "Calming Supports",
    items: ["Deep pressure squeezes", "Headphones + dim lights", "Counting to 10 together"],
  },
];

export default function Profile() {
  const { lovedOneName, caregiverName, profile } = useProfile();
  const persona = profile.dependents[0]?.persona;
  const caredBy = caregiverName !== "there" ? `Cared for by ${caregiverName}` : "Add caregiver details";
  return (
    <PageShell>
      <PageHeader
        eyebrow="Child Profile"
        title={lovedOneName}
        description={`A living portrait of who ${lovedOneName} is, what they need, and what brings them comfort.`}
        actions={
          <>
            <Button variant="secondary"><Upload className="size-4" /> Upload document</Button>
            <Button><Plus className="size-4" /> Add section</Button>
          </>
        }
      />

      <Card className="mb-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <div className="grid size-20 place-items-center rounded-2xl bg-sage-100 text-sage-700">
          <Camera className="size-7" strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <h2 className="font-display text-2xl font-medium">{lovedOneName}</h2>
          <p className="text-sm text-muted-foreground">
            {persona ? `${persona} · ` : ""}{caredBy}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(profile.dependents[0]?.complexity ?? []).map((c) => (
              <Chip key={c} tone="sage">{c}</Chip>
            ))}

          </div>
        </div>
        <Button variant="secondary">Edit details</Button>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <Card key={s.title}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-base font-semibold">{s.title}</h3>
              <button className="text-xs text-muted-foreground hover:text-foreground">Edit</button>
            </div>
            <ul className="space-y-1.5 text-sm text-foreground">
              {s.items.map((i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
                  {i}
                </li>
              ))}
            </ul>
            <button className="mt-4 inline-flex items-center gap-1 text-xs text-primary hover:underline">
              <Plus className="size-3" /> Add note
            </button>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
