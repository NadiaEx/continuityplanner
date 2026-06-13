import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader, Card, Chip, Button } from "@/components/page-shell";
import { Plus, Stethoscope, Pill, Syringe, FileText } from "lucide-react";
import { useProfile } from "@/lib/use-profile";

export const Route = createFileRoute("/_app/medical")({
  head: () => ({ meta: [{ title: "Medical Information — Continuity" }] }),
  component: Medical,
});

const meds: { name: string; dose: string; time: string; notes: string }[] = [];

const providers: { name: string; role: string; phone: string }[] = [];


export default function Medical() {
  const { lovedOneName } = useProfile();
  return (
    <PageShell>
      <PageHeader
        eyebrow="Medical Information"
        title="Quietly organized."
        description={`A clear, current picture of ${lovedOneName}'s health — kept in one calm place.`}
        actions={<Button><Plus className="size-4" /> Add record</Button>}
      />


      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <Stethoscope className="mb-3 size-5 text-primary" strokeWidth={1.75} />
          <p className="text-sm text-muted-foreground">Conditions</p>
          <p className="mt-1 font-display text-2xl font-medium">3</p>
          <p className="mt-1 text-xs text-muted-foreground">Last reviewed: April 2025</p>
        </Card>
        <Card>
          <Pill className="mb-3 size-5 text-primary" strokeWidth={1.75} />
          <p className="text-sm text-muted-foreground">Active medications</p>
          <p className="mt-1 font-display text-2xl font-medium">2</p>
          <p className="mt-1 text-xs text-muted-foreground">+ 1 seasonal</p>
        </Card>
        <Card>
          <Syringe className="mb-3 size-5 text-primary" strokeWidth={1.75} />
          <p className="text-sm text-muted-foreground">Allergies</p>
          <p className="mt-1 font-display text-2xl font-medium">2</p>
          <Chip tone="warn">1 severe</Chip>
        </Card>
      </div>

      <Card className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Medications</h3>
          <button className="text-xs text-muted-foreground hover:text-foreground">Edit</button>
        </div>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface-soft text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Medication</th>
                <th className="px-4 py-2 text-left font-medium">Dose</th>
                <th className="px-4 py-2 text-left font-medium">Schedule</th>
                <th className="px-4 py-2 text-left font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {meds.map((m) => (
                <tr key={m.name} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{m.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.dose}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.time}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 font-display text-lg font-semibold">Care providers</h3>
          <ul className="space-y-2">
            {providers.map((p) => (
              <li
                key={p.name}
                className="flex items-center justify-between rounded-xl border border-border bg-surface-soft p-3"
              >
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.role}</p>
                </div>
                <span className="font-mono text-xs text-muted-foreground">{p.phone}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h3 className="mb-4 font-display text-lg font-semibold">Recent documents</h3>
          <ul className="space-y-2">
            {["IEP — Spring 2025.pdf", "Allergy testing results.pdf", "Therapy report — April.pdf"].map(
              (f) => (
                <li key={f} className="flex items-center gap-3 rounded-xl border border-border bg-surface-soft p-3">
                  <FileText className="size-4 text-muted-foreground" />
                  <span className="flex-1 text-sm">{f}</span>
                  <span className="text-xs text-muted-foreground">PDF</span>
                </li>
              ),
            )}
          </ul>
        </Card>
      </div>
    </PageShell>
  );
}
