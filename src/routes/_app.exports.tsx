import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader, Card, Chip, Button } from "@/components/page-shell";
import { Download, FileText, Cloud, ShieldCheck, Sun, Users, Stethoscope, Compass, Contact } from "lucide-react";

function PdfThumbnail({
  icon: Icon,
  label,
  pages,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  pages: string;
}) {
  return (
    <div className="flex aspect-[3/4] flex-col rounded-xl border border-border bg-[#f6f5f3] p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <div className="grid size-7 place-items-center rounded-md bg-sage-50 text-sage-700">
          <Icon className="size-3.5" strokeWidth={1.75} />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="flex-1 space-y-2 rounded-lg bg-white p-3 shadow-sm">
        <div className="h-1.5 w-1/2 rounded bg-sage-100" />
        <div className="h-1 w-full rounded bg-muted/60" />
        <div className="h-1 w-5/6 rounded bg-muted/60" />
        <div className="h-1 w-4/5 rounded bg-muted/60" />
        <div className="h-1 w-2/3 rounded bg-muted/60" />
        <div className="mt-2 h-16 w-full rounded bg-mist-50/60" />
        <div className="h-1 w-3/4 rounded bg-muted/60" />
        <div className="h-1 w-full rounded bg-muted/60" />
      </div>
      <div className="mt-3 flex items-center justify-between text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
        <span>{pages}</span>
        <span>PDF · DOCX</span>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_app/exports")({
  head: () => ({ meta: [{ title: "Exports — Continuity" }] }),
  component: Exports,
});

const packets = [
  { name: "Full Care Continuity Plan", desc: "Everything in one comprehensive document.", icon: FileText, pages: "84 pages" },
  { name: "Emergency Care Packet", desc: "Critical safety info for any caregiver.", icon: ShieldCheck, pages: "6 pages" },
  { name: "Daily Care Guide", desc: "Hour-by-hour routines and supports.", icon: Sun, pages: "18 pages" },
  { name: "Caregiver Handbook", desc: "Day-one guide for a new caregiver.", icon: Users, pages: "42 pages" },
  { name: "Medical Summary", desc: "Diagnoses, medications, providers.", icon: Stethoscope, pages: "8 pages" },
  { name: "Future Care Blueprint", desc: "Long-term wishes and guardianship.", icon: Compass, pages: "12 pages" },
  { name: "Trusted Contacts Sheet", desc: "Family, providers, responders.", icon: Contact, pages: "2 pages" },
] as const;

export default function Exports() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Exports"
        title="Ready to share, ready to print."
        description="Beautifully formatted documents you can hand to a caregiver, school, or doctor."
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {packets.map(({ name, desc, icon: Icon, pages }) => (
          <Card key={name}>
            <div className="mb-4 flex aspect-[3/4] flex-col rounded-xl border border-border bg-surface-soft p-5">
              <div className="mb-4 grid size-9 place-items-center rounded-lg bg-sage-50 text-sage-700">
                <Icon className="size-4" strokeWidth={1.75} />
              </div>
              <div className="space-y-1.5">
                <div className="h-1.5 w-3/4 rounded bg-muted" />
                <div className="h-1 w-full rounded bg-muted/70" />
                <div className="h-1 w-5/6 rounded bg-muted/70" />
                <div className="h-1 w-2/3 rounded bg-muted/70" />
              </div>
              <div className="mt-4 flex-1 rounded-lg bg-card" />
              <div className="mt-3 flex items-center justify-between text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                <span>{pages}</span>
                <span>PDF · DOCX</span>
              </div>
            </div>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h4 className="truncate font-medium">{name}</h4>
                <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
              </div>
              <Chip tone="sage">Ready</Chip>
            </div>
            <div className="mt-4 flex gap-2">
              <Button className="flex-1"><Download className="size-4" /> PDF</Button>
              <Button variant="secondary"><Cloud className="size-4" /> Drive</Button>
            </div>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
