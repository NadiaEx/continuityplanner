import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell, PageHeader, Card } from "@/components/page-shell";
import { Plus, Stethoscope, Pill, Syringe, Users, Trash2 } from "lucide-react";
import { useProfile } from "@/lib/use-profile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/medical")({
  head: () => ({ meta: [{ title: "Medical Information — Continuity" }] }),
  component: Medical,
});

type Note = { id: string; section: string; content: string; created_at: string };
const MAX_NOTE = 2000;

function Medical() {
  const { lovedOneName, activeDependent } = useProfile();
  const dependentId = activeDependent?.id ?? null;

  const sections = [
    {
      key: "medical_conditions",
      title: "Conditions & diagnoses",
      icon: Stethoscope,
      body: `Diagnoses, sensitivities, and the medical picture for ${lovedOneName}.`,
      placeholder: "e.g. Type 1 diabetes — diagnosed 2019, well managed",
    },
    {
      key: "medical_medications",
      title: "Medications",
      icon: Pill,
      body: "One per note: name, dose, schedule, and any notes.",
      placeholder: "e.g. Lamotrigine 50mg — twice daily with food",
    },
    {
      key: "medical_allergies",
      title: "Allergies & reactions",
      icon: Syringe,
      body: "Anything to avoid and what happens when exposed.",
      placeholder: "e.g. Peanuts — anaphylaxis, EpiPen in backpack",
    },
    {
      key: "medical_providers",
      title: "Care providers",
      icon: Users,
      body: "Doctors, therapists, specialists, and how to reach them.",
      placeholder: "e.g. Dr. Patel, neurologist — (555) 123-4567",
    },
  ];

  const [notes, setNotes] = useState<Note[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [addingFor, setAddingFor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!dependentId) {
      setNotes([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      const { data, error } = await supabase
        .from("profile_notes")
        .select("id, section, content, created_at")
        .eq("dependent_id", dependentId)
        .in("section", sections.map((s) => s.key))
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (error) toast.error("Couldn't load medical info.");
      else setNotes((data ?? []) as Note[]);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [dependentId]);

  const addNote = async (section: string) => {
    const content = (drafts[section] ?? "").trim();
    if (!content) return;
    if (!dependentId) {
      toast.error("Add a loved one first.");
      return;
    }
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return toast.error("Please sign in.");
    const { data, error } = await supabase
      .from("profile_notes")
      .insert({
        user_id: userData.user.id,
        dependent_id: dependentId,
        section,
        content: content.slice(0, MAX_NOTE),
      })
      .select("id, section, content, created_at")
      .single();
    if (error || !data) return toast.error("Couldn't save.");
    setNotes((prev) => [data as Note, ...prev]);
    setDrafts((prev) => ({ ...prev, [section]: "" }));
    setAddingFor(null);
  };

  const deleteNote = async (id: string) => {
    const prev = notes;
    setNotes((p) => p.filter((n) => n.id !== id));
    const { error } = await supabase.from("profile_notes").delete().eq("id", id);
    if (error) {
      toast.error("Couldn't delete.");
      setNotes(prev);
    }
  };

  const countFor = (key: string) => notes.filter((n) => n.section === key).length;

  return (
    <PageShell>
      <PageHeader
        eyebrow="Medical Information"
        title="Quietly organized."
        description={`A clear, current picture of ${lovedOneName}'s health — kept in one calm place.`}
      />

      <DependentTabs />



      {!dependentId && (
        <Card className="mb-6">
          <p className="text-sm text-muted-foreground">
            Add a loved one in your <Link to="/profile" className="underline">profile</Link> to start adding medical info.
          </p>
        </Card>
      )}

      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card>
          <Stethoscope className="mb-3 size-5 text-primary" strokeWidth={1.75} />
          <p className="text-sm text-muted-foreground">Conditions</p>
          <p className="mt-1 font-display text-2xl font-medium">
            {loading ? "—" : countFor("medical_conditions")}
          </p>
        </Card>
        <Card>
          <Pill className="mb-3 size-5 text-primary" strokeWidth={1.75} />
          <p className="text-sm text-muted-foreground">Medications</p>
          <p className="mt-1 font-display text-2xl font-medium">
            {loading ? "—" : countFor("medical_medications")}
          </p>
        </Card>
        <Card>
          <Syringe className="mb-3 size-5 text-primary" strokeWidth={1.75} />
          <p className="text-sm text-muted-foreground">Allergies</p>
          <p className="mt-1 font-display text-2xl font-medium">
            {loading ? "—" : countFor("medical_allergies")}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {sections.map(({ key, title, icon: Icon, body, placeholder }) => {
          const items = notes.filter((n) => n.section === key);
          const isAdding = addingFor === key;
          return (
            <Card key={key}>
              <div className="mb-3 flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-sage-50 text-sage-700">
                  <Icon className="size-5" strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-lg font-semibold">{title}</h3>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">{body}</p>

              {loading ? (
                <p className="text-xs text-muted-foreground">Loading…</p>
              ) : items.length === 0 && !isAdding ? (
                <p className="text-xs text-muted-foreground">
                  Nothing here yet — add when you're ready.
                </p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {items.map((n) => (
                    <li
                      key={n.id}
                      className="group flex items-start justify-between gap-3 rounded-xl border border-border bg-surface-soft px-3 py-2"
                    >
                      <span className="whitespace-pre-wrap">{n.content}</span>
                      <button
                        type="button"
                        onClick={() => deleteNote(n.id)}
                        className="opacity-0 transition group-hover:opacity-100"
                        aria-label="Delete"
                      >
                        <Trash2 className="size-3.5 text-muted-foreground hover:text-foreground" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {isAdding ? (
                <div className="mt-3">
                  <textarea
                    rows={3}
                    maxLength={MAX_NOTE}
                    value={drafts[key] ?? ""}
                    onChange={(e) =>
                      setDrafts((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    placeholder={placeholder}
                    className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-sage-600/40 focus:outline-none"
                    autoFocus
                  />
                  <div className="mt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAddingFor(null);
                        setDrafts((prev) => ({ ...prev, [key]: "" }));
                      }}
                      className="rounded-full px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => addNote(key)}
                      disabled={!(drafts[key] ?? "").trim()}
                      className="rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setAddingFor(key)}
                  disabled={!dependentId}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-50"
                >
                  <Plus className="size-3.5" /> Add
                </button>
              )}
            </Card>
          );
        })}
      </div>
    </PageShell>
  );
}
