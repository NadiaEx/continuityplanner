import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader, Card, Chip, Button } from "@/components/page-shell";
import { Plus, Mail, Phone } from "lucide-react";

export const Route = createFileRoute("/_app/care-team")({
  head: () => ({ meta: [{ title: "Care Team — Continuity" }] }),
  component: CareTeam,
});

const team = [
  { name: "Maya Henderson", role: "Parent", category: "Family", priority: 1, email: "maya@example.com", phone: "(415) 555-0142" },
  { name: "Jordan Henderson", role: "Parent", category: "Family", priority: 2, email: "jordan@example.com", phone: "(415) 555-0188" },
  { name: "Aunt Rose", role: "Trusted family", category: "Family", priority: 3, email: "rose@example.com", phone: "(415) 555-0319" },
  { name: "Dr. Anjali Patel", role: "Pediatrician", category: "Medical", priority: 4, email: "patel@clinic.com", phone: "(415) 555-0231" },
  { name: "Sarah Kim", role: "Occupational Therapist", category: "Therapist", priority: 5, email: "skim@therapy.com", phone: "(415) 555-0144" },
  { name: "Ms. Carter", role: "Lead Teacher", category: "School", priority: 6, email: "carter@school.org", phone: "(415) 555-0410" },
  { name: "Robert Lin", role: "Estate Attorney", category: "Legal", priority: 7, email: "rlin@law.com", phone: "(415) 555-0509" },
  { name: "Maria Alvarez", role: "Respite Caregiver", category: "Respite", priority: 8, email: "maria@care.com", phone: "(415) 555-0612" },
];

const categories = ["All", "Family", "Medical", "Therapist", "School", "Legal", "Respite"];

export default function CareTeam() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Care Team"
        title="The people in Leo's circle."
        description="Everyone who helps care for Leo, ordered by who to call first."
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
