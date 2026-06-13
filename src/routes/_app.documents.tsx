import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader, Card, Chip, Button } from "@/components/page-shell";
import { Upload, Search, FileText, FileImage, FileLock } from "lucide-react";

function DocThumbnail({ name, category }: { name: string; category: string }) {
  const isPdf = name.endsWith(".pdf") || name.endsWith(".docx");
  return (
    <div className={`mb-4 flex aspect-[4/3] flex-col rounded-xl border border-border p-3 shadow-sm ${isPdf ? "bg-[#f6f5f3]" : "bg-surface-soft"}`}>
      {isPdf ? (
        <>
          <div className="mb-2 flex items-center gap-1.5">
            <div className="h-1.5 w-8 rounded bg-sage-100" />
            <div className="h-1 w-6 rounded bg-muted/40" />
          </div>
          <div className="flex-1 space-y-1.5 rounded-md bg-white p-2 shadow-sm">
            <div className="h-1 w-3/4 rounded bg-muted/50" />
            <div className="h-1 w-full rounded bg-muted/40" />
            <div className="h-1 w-5/6 rounded bg-muted/40" />
            <div className="h-1 w-2/3 rounded bg-muted/40" />
          </div>
        </>
      ) : (
        <div className="grid flex-1 place-items-center">
          <FileImage className="size-10 text-muted-foreground/40" strokeWidth={1.5} />
        </div>
      )}
      <div className="mt-2 flex items-center justify-between text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
        <span>{category}</span>
        <span>{isPdf ? "PDF" : "JPG"}</span>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_app/documents")({
  head: () => ({ meta: [{ title: "Documents — Continuity" }] }),
  component: Documents,
});

const docs = [
  { name: "IEP — Spring 2025.pdf", category: "Education", size: "1.2 MB", date: "Apr 12, 2025", icon: FileText },
  { name: "Allergy testing results.pdf", category: "Medical", size: "420 KB", date: "Mar 02, 2025", icon: FileText },
  { name: "Therapy report — April.pdf", category: "Medical", size: "880 KB", date: "Apr 30, 2025", icon: FileText },
  { name: "Guardianship draft.docx", category: "Legal", size: "75 KB", date: "May 10, 2025", icon: FileText },
  { name: "Family photo.jpg", category: "Family", size: "2.4 MB", date: "May 22, 2025", icon: FileImage },
  { name: "Insurance card.pdf", category: "Medical", size: "210 KB", date: "Jan 04, 2025", icon: FileText },
];

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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {docs.map(({ name, category, size, date }) => (
          <Card key={name}>
            <DocThumbnail name={name} category={category} />
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{name}</p>
                <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{size}</span>
                  <span>·</span>
                  <span>{date}</span>
                </div>
              </div>
              <FileLock className="size-3.5 shrink-0 text-muted-foreground" />
            </div>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
