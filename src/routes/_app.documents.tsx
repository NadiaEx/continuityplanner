import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PageShell, PageHeader, Card, Button } from "@/components/page-shell";
import { Upload, Search, FileText, Trash2, Download } from "lucide-react";
import { useProfile } from "@/lib/use-profile";
import { DependentTabs } from "@/components/dependent-tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/documents")({
  head: () => ({ meta: [{ title: "Documents — Continuity" }] }),
  component: Documents,
});

type Doc = {
  id: string;
  file_path: string;
  file_name: string;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
};

const MAX_BYTES = 25 * 1024 * 1024; // 25MB

function formatSize(bytes: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function Documents() {
  const { activeDependent } = useProfile();
  const dependentId = activeDependent?.id ?? null;
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!dependentId) {
      setDocs([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      const { data, error } = await supabase
        .from("profile_documents")
        .select("id, file_path, file_name, mime_type, size_bytes, created_at")
        .eq("dependent_id", dependentId)
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (error) toast.error("Couldn't load documents.");
      else setDocs((data ?? []) as Doc[]);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [dependentId]);

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!dependentId) return toast.error("Add a loved one first.");
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return toast.error("Please sign in.");

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (file.size > MAX_BYTES) {
          toast.error(`${file.name} is over 25MB.`);
          continue;
        }
        const safeName = file.name.replace(/[^\w.\-]+/g, "_");
        const path = `${user.id}/${dependentId}/${Date.now()}-${safeName}`;
        const { error: upErr } = await supabase.storage
          .from("profile-documents")
          .upload(path, file, { contentType: file.type || undefined });
        if (upErr) {
          console.error(upErr);
          toast.error(`Couldn't upload ${file.name}.`);
          continue;
        }
        const { data: row, error: rowErr } = await supabase
          .from("profile_documents")
          .insert({
            user_id: user.id,
            dependent_id: dependentId,
            file_path: path,
            file_name: file.name,
            mime_type: file.type || null,
            size_bytes: file.size,
          })
          .select("id, file_path, file_name, mime_type, size_bytes, created_at")
          .single();
        if (rowErr || !row) {
          await supabase.storage.from("profile-documents").remove([path]);
          toast.error(`Couldn't save ${file.name}.`);
          continue;
        }
        setDocs((prev) => [row as Doc, ...prev]);
      }
      toast.success("Uploaded.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const open = async (doc: Doc) => {
    const { data, error } = await supabase.storage
      .from("profile-documents")
      .createSignedUrl(doc.file_path, 60);
    if (error || !data) return toast.error("Couldn't open file.");
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  const remove = async (doc: Doc) => {
    if (!confirm(`Delete ${doc.file_name}?`)) return;
    const prev = docs;
    setDocs((p) => p.filter((d) => d.id !== doc.id));
    const { error: stErr } = await supabase.storage
      .from("profile-documents")
      .remove([doc.file_path]);
    const { error: dbErr } = await supabase
      .from("profile_documents")
      .delete()
      .eq("id", doc.id);
    if (stErr || dbErr) {
      toast.error("Couldn't delete.");
      setDocs(prev);
    }
  };

  const filtered = docs.filter((d) =>
    d.file_name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <PageShell>
      <PageHeader
        eyebrow="Document Vault"
        title="Everything in one secure place."
        description="Private to you. Files are stored securely and only accessible with a signed link."
        actions={
          <>
            <input
              ref={fileRef}
              type="file"
              multiple
              hidden
              onChange={(e) => upload(e.target.files)}
            />
            <Button
              onClick={() => fileRef.current?.click()}
              disabled={!dependentId || uploading}
            >
              <Upload className="size-4" /> {uploading ? "Uploading…" : "Upload"}
            </Button>
          </>
        }
      />

      <DependentTabs />



      {!dependentId && (
        <Card className="mb-6">
          <p className="text-sm text-muted-foreground">
            Add a loved one in your <Link to="/profile" className="underline">profile</Link> to start uploading documents.
          </p>
        </Card>
      )}

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {loading ? (
        <Card><p className="text-sm text-muted-foreground">Loading…</p></Card>
      ) : filtered.length === 0 ? (
        <Card className="grid place-items-center py-16 text-center">
          <FileText className="mb-3 size-10 text-muted-foreground/40" strokeWidth={1.5} />
          <p className="font-display text-lg font-medium">
            {docs.length === 0 ? "No documents yet" : "No matches"}
          </p>
          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
            {docs.length === 0
              ? "Upload IEPs, medical records, legal paperwork, or family photos. Up to 25MB per file."
              : "Try a different search term."}
          </p>
          {docs.length === 0 && (
            <Button
              className="mt-5"
              onClick={() => fileRef.current?.click()}
              disabled={!dependentId || uploading}
            >
              <Upload className="size-4" /> Upload your first document
            </Button>
          )}
        </Card>
      ) : (
        <ul className="space-y-2">
          {filtered.map((d) => (
            <li
              key={d.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
            >
              <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-sage-50 text-sage-700">
                <FileText className="size-4" strokeWidth={1.75} />
              </div>
              <button
                type="button"
                onClick={() => open(d)}
                className="min-w-0 flex-1 text-left"
              >
                <p className="truncate text-sm font-medium hover:underline">
                  {d.file_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatSize(d.size_bytes)} · {new Date(d.created_at).toLocaleDateString()}
                </p>
              </button>
              <button
                type="button"
                onClick={() => open(d)}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Open"
              >
                <Download className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => remove(d)}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Delete"
              >
                <Trash2 className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
