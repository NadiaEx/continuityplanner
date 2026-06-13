import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader, Card, Button } from "@/components/page-shell";
import { Upload, Search, FileImage } from "lucide-react";


export const Route = createFileRoute("/_app/documents")({
  head: () => ({ meta: [{ title: "Documents — Continuity" }] }),
  component: Documents,
});

const cats = ["All", "Medical", "Education", "Legal", "Family"];

export default function Documents() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Document Vault"
        title="Everything in one secure place."
        description="Encrypted at rest, accessible only to you and the people you trust."
        actions={<Button><Upload className="size-4" /> Upload</Button>}
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5">
          <Search className="size-4 text-muted-foreground" />
          <input
            placeholder="Search documents…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {cats.map((c, i) => (
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
      </div>

      <Card className="grid place-items-center py-16 text-center">
        <FileImage className="mb-3 size-10 text-muted-foreground/40" strokeWidth={1.5} />
        <p className="font-display text-lg font-medium">No documents yet</p>
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
          Upload IEPs, medical records, legal paperwork, or family photos — everything stays
          encrypted and only visible to people you trust.
        </p>
        <Button className="mt-5"><Upload className="size-4" /> Upload your first document</Button>
      </Card>
    </PageShell>
  );
}
