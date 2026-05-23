import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader, Card, Chip, Button } from "@/components/page-shell";
import { Phone, Hospital, ShieldAlert, MapPin, Pill, Download, QrCode } from "lucide-react";

export const Route = createFileRoute("/_app/emergency")({
  head: () => ({ meta: [{ title: "Emergency Plan — Continuity" }] }),
  component: Emergency,
});

const contacts = [
  { name: "Maya Henderson", role: "Parent", phone: "(415) 555-0142", priority: 1 },
  { name: "Jordan Henderson", role: "Parent", phone: "(415) 555-0188", priority: 2 },
  { name: "Dr. Anjali Patel", role: "Primary Pediatrician", phone: "(415) 555-0231", priority: 3 },
  { name: "Aunt Rose", role: "Trusted family", phone: "(415) 555-0319", priority: 4 },
];

export default function Emergency() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Emergency Plan"
        title="Ready, just in case."
        description="If you cannot be there, this is what others need to know to support Leo safely."
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
            <h3 className="mt-2 font-display text-2xl font-medium">Leo Henderson, 8</h3>
            <p className="mt-2 max-w-xl text-sm text-background/70">
              Non-verbal. Communicates via AAC device. Severe peanut allergy.
              Sensitive to loud alarms — do not separate from headphones.
              Wandering risk if overstimulated.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Chip tone="warn">Peanut allergy</Chip>
              <Chip tone="warn">Wandering risk</Chip>
              <Chip tone="mist">AAC user</Chip>
            </div>
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
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Hospital className="size-4 text-primary" />
            <h3 className="font-display text-lg font-semibold">Hospital instructions</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li>• Preferred hospital: UCSF Benioff Children's</li>
            <li>• Always keep AAC device with him during transport</li>
            <li>• Dim ambulance lights if possible</li>
            <li>• Verbal narration before any touch helps</li>
          </ul>
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Pill className="size-4 text-primary" />
            <h3 className="font-display text-lg font-semibold">Medication summary</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li>• Melatonin 3mg — 8:30 PM nightly</li>
            <li>• EpiPen Jr — emergency only (in backpack &amp; kitchen)</li>
            <li>• Zyrtec 5mg — seasonal, as needed</li>
          </ul>
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-2">
            <ShieldAlert className="size-4 text-primary" />
            <h3 className="font-display text-lg font-semibold">De-escalation strategies</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li>• Lower your voice. Don't crowd him.</li>
            <li>• Offer headphones first, words second</li>
            <li>• Deep pressure on shoulders (with consent)</li>
            <li>• Never grab his arm — use AAC device to communicate</li>
          </ul>
        </Card>

        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="size-4 text-primary" />
            <h3 className="font-display text-lg font-semibold">Wandering response</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Leo is drawn to water and quiet, dim spaces. If missing, check bathrooms,
            closets, and any nearby fountains or ponds first. He responds to his name
            but may not approach strangers. Carry the laminated communication card
            (in his backpack) to introduce yourself silently.
          </p>
        </Card>
      </div>
    </PageShell>
  );
}
