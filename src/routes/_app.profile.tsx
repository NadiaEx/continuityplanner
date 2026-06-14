import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { PageShell, PageHeader, Card, Chip, Button } from "@/components/page-shell";
import { Plus, Camera, Upload, X, Trash2, FileText, Download } from "lucide-react";
import { useProfile } from "@/lib/use-profile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Child Profile — Continuity" }] }),
  component: Profile,
});

const sectionTitles = [
  "Diagnoses",
  "Communication Style",
  "Medical Needs",
  "Allergies",
  "Medications",
  "Safety Risks",
  "Sensory Needs",
  "Favorite Comforts",
  "Trigger Behaviors",
  "Calming Supports",
];

const relationships = ["Son", "Daughter", "Parent", "Partner", "Sibling", "Other"];

const complexityTags = [
  "Medical conditions",
  "Medications",
  "Mobility needs",
  "Cognitive support",
  "Behavioral support",
  "Communication differences",
];

type Note = {
  id: string;
  section: string;
  content: string;
  created_at: string;
};

type Document = {
  id: string;
  file_path: string;
  file_name: string;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
};

export default function Profile() {
  const {
    caregiverName,
    dependents,
    activeIdx,
    setActiveIdx,
    activeDependent,
    addDependent,
    updateDependent,
  } = useProfile();

  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPersona, setNewPersona] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPersona, setEditPersona] = useState<string | null>(null);
  const [editComplexity, setEditComplexity] = useState<string[]>([]);

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const depId = activeDependent?.id;
  const lovedOneName = activeDependent?.name?.trim() || "your loved one";
  const persona = activeDependent?.persona;
  const caredBy =
    caregiverName !== "there" ? `Cared for by ${caregiverName}` : "Add caregiver details";

  // Load notes + documents whenever the active dependent changes
  const refresh = useCallback(async () => {
    if (!depId) {
      setNotes([]);
      setDocuments([]);
      return;
    }
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) return;
    const [{ data: noteRows }, { data: docRows }] = await Promise.all([
      (supabase.from("profile_notes") as any)
        .select("id, section, content, created_at")
        .eq("dependent_id", depId)
        .order("created_at", { ascending: false }),
      (supabase.from("profile_documents") as any)
        .select("id, file_path, file_name, mime_type, size_bytes, created_at")
        .eq("dependent_id", depId)
        .order("created_at", { ascending: false }),
    ]);
    setNotes((noteRows ?? []) as Note[]);
    setDocuments((docRows ?? []) as Document[]);
  }, [depId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const openEdit = () => {
    if (!activeDependent) return;
    setEditName(activeDependent.name);
    setEditPersona(activeDependent.persona);
    setEditComplexity(activeDependent.complexity ?? []);
    setEditing(true);
  };

  const saveEdit = async () => {
    if (!activeDependent) return;
    setSaving(true);
    await updateDependent(activeDependent.id, {
      name: editName.trim(),
      persona: editPersona,
      complexity: editComplexity,
    });
    setSaving(false);
    setEditing(false);
  };

  const submitNew = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    await addDependent({ name: newName.trim(), persona: newPersona });
    setSaving(false);
    setAdding(false);
    setNewName("");
    setNewPersona(null);
  };

  const addNote = async (section: string) => {
    if (!draft.trim() || !depId) return;
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;
    if (!userId) {
      toast.error("Sign in to save notes");
      return;
    }
    const { error } = await (supabase.from("profile_notes") as any).insert({
      user_id: userId,
      dependent_id: depId,
      section,
      content: draft.trim(),
    });
    if (error) {
      toast.error("Couldn't save note");
      return;
    }
    setDraft("");
    setActiveSection(null);
    refresh();
  };

  const deleteNote = async (id: string) => {
    const { error } = await (supabase.from("profile_notes") as any).delete().eq("id", id);
    if (error) {
      toast.error("Couldn't remove note");
      return;
    }
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !depId) return;
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;
    if (!userId) {
      toast.error("Sign in to upload");
      return;
    }
    const path = `${userId}/${depId}/${Date.now()}-${file.name}`;
    const { error: upErr } = await supabase.storage
      .from("profile-documents")
      .upload(path, file, { upsert: false });
    if (upErr) {
      toast.error(upErr.message);
      return;
    }
    const { error: dbErr } = await (supabase.from("profile_documents") as any).insert({
      user_id: userId,
      dependent_id: depId,
      file_path: path,
      file_name: file.name,
      mime_type: file.type || null,
      size_bytes: file.size,
    });
    if (dbErr) {
      toast.error("Uploaded but couldn't save metadata");
      return;
    }
    toast.success("Document uploaded");
    refresh();
  };

  const openDoc = async (doc: Document) => {
    const { data, error } = await supabase.storage
      .from("profile-documents")
      .createSignedUrl(doc.file_path, 60);
    if (error || !data?.signedUrl) {
      toast.error("Couldn't open file");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener");
  };

  const deleteDoc = async (doc: Document) => {
    await supabase.storage.from("profile-documents").remove([doc.file_path]);
    await (supabase.from("profile_documents") as any).delete().eq("id", doc.id);
    setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
  };

  const notesBySection = notes.reduce<Record<string, Note[]>>((acc, n) => {
    (acc[n.section] ??= []).push(n);
    return acc;
  }, {});

  return (
    <PageShell>
      <PageHeader
        eyebrow="Child Profile"
        title={lovedOneName}
        description={`A living portrait of who ${lovedOneName} is, what they need, and what brings them comfort.`}
        actions={
          <>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleUpload}
            />
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={!activeDependent}
            >
              <Upload className="size-4" /> Upload document
            </Button>
            <Button onClick={() => setAdding(true)}>
              <Plus className="size-4" /> Add loved one
            </Button>
          </>
        }
      />

      {dependents.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {dependents.map((d, i) => (
            <button
              key={d.id}
              onClick={() => setActiveIdx(i)}
              className={`rounded-full border px-3 py-1.5 text-xs transition ${
                i === activeIdx
                  ? "border-sage-600/40 bg-sage-50 text-sage-700"
                  : "border-border bg-card text-muted-foreground hover:border-sage-600/20"
              }`}
            >
              {d.name || `Loved one ${i + 1}`}
            </button>
          ))}
        </div>
      )}

      {adding && (
        <Card className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold">Add another loved one</h3>
            <button
              onClick={() => setAdding(false)}
              className="rounded-full p-1 text-muted-foreground hover:bg-muted"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>
          <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Their name or nickname
          </label>
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Roggie"
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-sage-600/40"
          />
          <p className="mt-4 mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            They are my…
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {relationships.map((p) => {
              const isActive = newPersona === p;
              return (
                <button
                  key={p}
                  onClick={() => setNewPersona(p)}
                  className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                    isActive
                      ? "border-sage-600/40 bg-sage-50 text-sage-700"
                      : "border-border bg-card hover:border-sage-600/20"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setAdding(false)}>
              Cancel
            </Button>
            <Button onClick={submitNew} disabled={!newName.trim() || saving}>
              {saving ? "Adding…" : "Add loved one"}
            </Button>
          </div>
        </Card>
      )}

      {editing && activeDependent && (
        <Card className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold">Edit details</h3>
            <button
              onClick={() => setEditing(false)}
              className="rounded-full p-1 text-muted-foreground hover:bg-muted"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>
          <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Name or nickname
          </label>
          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-sage-600/40"
          />
          <p className="mt-4 mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            They are my…
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {relationships.map((p) => {
              const isActive = editPersona === p;
              return (
                <button
                  key={p}
                  onClick={() => setEditPersona(p)}
                  className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                    isActive
                      ? "border-sage-600/40 bg-sage-50 text-sage-700"
                      : "border-border bg-card hover:border-sage-600/20"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
          <p className="mt-4 mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Complexity
          </p>
          <div className="flex flex-wrap gap-2">
            {complexityTags.map((tag) => {
              const isActive = editComplexity.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() =>
                    setEditComplexity((prev) =>
                      prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag],
                    )
                  }
                  className={`rounded-full border px-3 py-1.5 text-xs transition ${
                    isActive
                      ? "border-sage-600/40 bg-sage-50 text-sage-700"
                      : "border-border bg-card text-muted-foreground hover:border-sage-600/20"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button onClick={saveEdit} disabled={!editName.trim() || saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </Card>
      )}

      {activeDependent ? (
        <Card className="mb-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="grid size-20 place-items-center rounded-2xl bg-sage-100 text-sage-700">
            <Camera className="size-7" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-2xl font-medium">{lovedOneName}</h2>
            <p className="text-sm text-muted-foreground">
              {persona ? `${persona} · ` : ""}{caredBy}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(activeDependent.complexity ?? []).map((c) => (
                <Chip key={c} tone="sage">{c}</Chip>
              ))}
            </div>
          </div>
          <Button variant="secondary" onClick={openEdit}>Edit details</Button>
        </Card>
      ) : (
        <Card className="mb-8">
          <p className="text-sm text-muted-foreground">
            No loved ones added yet — tap "Add loved one" to start a profile.
          </p>
        </Card>
      )}

      {documents.length > 0 && (
        <Card className="mb-8">
          <h3 className="mb-3 font-display text-base font-semibold">Uploaded documents</h3>
          <ul className="divide-y divide-border">
            {documents.map((doc) => (
              <li key={doc.id} className="flex items-center gap-3 py-2.5">
                <FileText className="size-4 shrink-0 text-muted-foreground" />
                <button
                  onClick={() => openDoc(doc)}
                  className="flex-1 truncate text-left text-sm hover:underline"
                >
                  {doc.file_name}
                </button>
                <button
                  onClick={() => openDoc(doc)}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Open"
                >
                  <Download className="size-4" />
                </button>
                <button
                  onClick={() => deleteDoc(doc)}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Delete"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sectionTitles.map((title) => {
          const sectionNotes = notesBySection[title] ?? [];
          const isAdding = activeSection === title;
          return (
            <Card key={title}>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-base font-semibold">{title}</h3>
                <span className="text-xs text-muted-foreground">
                  {sectionNotes.length || ""}
                </span>
              </div>
              {sectionNotes.length === 0 && !isAdding && (
                <p className="text-xs text-muted-foreground">
                  Nothing here yet — add a note when you're ready.
                </p>
              )}
              {sectionNotes.length > 0 && (
                <ul className="space-y-2">
                  {sectionNotes.map((n) => (
                    <li
                      key={n.id}
                      className="group flex items-start gap-2 rounded-lg bg-muted/40 px-3 py-2 text-sm"
                    >
                      <span className="flex-1 whitespace-pre-wrap">{n.content}</span>
                      <button
                        onClick={() => deleteNote(n.id)}
                        className="rounded-full p-1 text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:bg-background"
                        aria-label="Delete note"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {isAdding ? (
                <div className="mt-3">
                  <textarea
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={`Add a note about ${title.toLowerCase()}…`}
                    rows={3}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-sage-600/40"
                  />
                  <div className="mt-2 flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setActiveSection(null);
                        setDraft("");
                      }}
                      className="rounded-full px-3 py-1 text-xs text-muted-foreground hover:bg-muted"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => addNote(title)}
                      disabled={!draft.trim()}
                      className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground disabled:opacity-50"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (!activeDependent) {
                      toast.error("Add a loved one first");
                      return;
                    }
                    setActiveSection(title);
                    setDraft("");
                  }}
                  className="mt-4 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <Plus className="size-3" /> Add note
                </button>
              )}
            </Card>
          );
        })}
      </div>
    </PageShell>
  );
}
