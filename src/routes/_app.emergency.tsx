import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader, Card, Button } from "@/components/page-shell";
import { Phone, Hospital, ShieldAlert, MapPin, Pill, Download, QrCode } from "lucide-react";
import { useProfile } from "@/lib/use-profile";

export const Route = createFileRoute("/_app/emergency")({
  head: () => ({ meta: [{ title: "Emergency Plan — Continuity" }] }),
  component: Emergency,
});


export default function Emergency() {
  const { lovedOneName, caregiverName } = useProfile();
  const contacts =
    caregiverName !== "there"
      ? [{ name: caregiverName, role: "Primary caregiver", phone: "—", priority: 1 }]
      : [];
  return (
    <PageShell>
      <PageHeader
        eyebrow="Emergency Plan"
        title="Ready, just in case."
        description={`If you cannot be there, this is what others need to know to support ${lovedOneName} safely.`}
        actions={
          <>
            <Button variant="secondary"><QrCode className="size-4" /> Generate QR tag</Button>
            <Button><Download className="size-4" /> Generate Emergency Packet</Button>
          </>
        }
      />

      <Card className="mb-8 bg-ink p-8 text-background">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-background/60">
              Quick reference summary
            </p>
            <h3 className="mt-2 font-display text-2xl font-medium">{lovedOneName}</h3>
            <p className="mt-2 max-w-xl text-sm text-background/70">
              Add the most important things a stranger would need to know — allergies,
              communication style, what calms {lovedOneName} down, and any safety risks.
            </p>
          </div>
          <div className="rounded-2xl bg-background p-4">
            <div className="grid size-32 place-items-center rounded-lg bg-muted text-muted-foreground">
              <QrCode className="size-20" strokeWidth={1.25} />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Phone className="size-4 text-primary" />
            <h3 className="font-display text-lg font-semibold">Emergency contacts</h3>
          </div>
          {contacts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No contacts yet. Add the people who should be called first in a crisis.
            </p>
          ) : (
            <ul className="space-y-2">
              {contacts.map((c) => (
                <li
                  key={c.name}
                  className="flex items-center justify-between rounded-xl border border-border bg-surface-soft p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-7 place-items-center rounded-full bg-sage-100 text-xs font-semibold text-sage-700">
                      {c.priority}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.role}</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">{c.phone}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>


        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Hospital className="size-4 text-primary" />
            <h3 className="font-display text-lg font-semibold">Hospital instructions</h3>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Add a preferred hospital, transport notes, and anything a first responder should know.</li>
          </ul>
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Pill className="size-4 text-primary" />
            <h3 className="font-display text-lg font-semibold">Medication summary</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            List current medications, doses, timing, and where they're kept.
          </p>
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-2">
            <ShieldAlert className="size-4 text-primary" />
            <h3 className="font-display text-lg font-semibold">De-escalation strategies</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            What works to help {lovedOneName} feel safe when overwhelmed — voice,
            touch, space, and what to avoid.
          </p>
        </Card>


        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="size-4 text-primary" />
            <h3 className="font-display text-lg font-semibold">Wandering response</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Note where {lovedOneName} might go if overwhelmed, what draws them, and
            how a stranger should approach. Add details as you go — there's no rush.
          </p>
        </Card>
      </div>
    </PageShell>
  );
}
