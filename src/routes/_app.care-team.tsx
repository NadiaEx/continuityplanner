import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader, Card, Chip, Button } from "@/components/page-shell";
import { Plus, Mail, Phone } from "lucide-react";
import { useProfile } from "@/lib/use-profile";

export const Route = createFileRoute("/_app/care-team")({
  head: () => ({ meta: [{ title: "Care Team — Continuity" }] }),
  component: CareTeam,
});

const categories = ["All", "Family", "Medical", "Therapist", "School", "Legal", "Respite"];

export default function CareTeam() {
  const { lovedOneName, caregiverName, caregiverEmail } = useProfile();
  const team =
    caregiverName !== "there"
      ? [
          {
            name: caregiverName,
            role: "Primary caregiver",
            category: "Family",
            priority: 1,
            email: caregiverEmail || "—",
            phone: "—",
          },
        ]
      : [];
  return (
    <PageShell>
      <PageHeader
        eyebrow="Care Team"
        title={`The people in ${lovedOneName}'s circle.`}
        description={`Everyone who helps care for ${lovedOneName}, ordered by who to call first.`}
        actions={<Button><Plus className="size-4" /> Add person</Button>}
      />


      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((c, i) => (
          <button
            key={c}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              i === 0
                ? "border-primary bg-sage-50 text-sage-700"
                : "border-border bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {team.map((p) => (
          <Card key={p.name}>
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-full bg-sage-100 font-display text-sm font-semibold text-sage-700">
                  {p.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.role}</p>
                </div>
              </div>
              <Chip tone="sage">#{p.priority}</Chip>
            </div>
            <Chip tone="mist">{p.category}</Chip>
            <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
              <p className="flex items-center gap-2"><Mail className="size-3" /> {p.email}</p>
              <p className="flex items-center gap-2"><Phone className="size-3" /> {p.phone}</p>
            </div>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
