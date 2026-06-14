import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHeader, Card } from "@/components/page-shell";
import { FileText, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_app/exports")({
  head: () => ({ meta: [{ title: "Exports — Continuity" }] }),
  component: Exports,
});

function Exports() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Exports"
        title="Ready to share, ready to print."
        description="Beautifully formatted documents you can hand to a caregiver, school, or doctor."
      />

      <Card className="text-center">
        <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-sage-50 text-sage-700">
          <FileText className="size-5" strokeWidth={1.75} />
        </div>
        <h3 className="font-display text-lg font-medium">No exports yet</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          As you fill in your plan, we'll assemble shareable packets here —
          emergency care, daily routines, medical summaries, and more. Nothing
          to download until your details are in.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/profile"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:bg-sage-700"
          >
            Open your profile <ArrowRight className="size-3.5" />
          </Link>
          <Link
            to="/emergency"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-5 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
          >
            Build emergency plan
          </Link>
        </div>
      </Card>
    </PageShell>
  );
}
