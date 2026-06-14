import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell, PageHeader, Card, Button } from "@/components/page-shell";
import { Plus, Heart, Home, Sparkles, FileVideo, Trash2 } from "lucide-react";
import { useProfile } from "@/lib/use-profile";
import { DependentTabs } from "@/components/dependent-tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/future")({
  head: () => ({ meta: [{ title: "Future Planning — Continuity" }] }),
  component: Future,
});

type Note = { id: string; section: string; content: string; created_at: string };

const MAX_NOTE = 2000;

function Future() {
  const { lovedOneName, activeDependent } = useProfile();
  const dependentId = activeDependent?.id ?? null;

  const sections = [
    {
      key: "future_guardian",
      title: "Guardian planning",
      icon: Heart,
      body: "Designated guardians, decision-making preferences, and the people you trust most to step in.",
    },
    {
      key: "future_living",
      title: "Future living preferences",
      icon: Home,
      body: `Where and how ${lovedOneName} might live well into adulthood.`,
    },
    {
      key: "future_adulthood",
      title: "Adulthood transition notes",
      icon: Sparkles,
      body: `What kind of life you hope ${lovedOneName} can grow into.`,
    },
    {
      key: "future_constants",
      title: "Things I hope never change",
      icon: Heart,
      body: `The small constants that make ${lovedOneName}, ${lovedOneName}.`,
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
      if (error) {
        console.error(error);
        toast.error("Couldn't load your notes.");
      } else {
        setNotes((data ?? []) as Note[]);
      }
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
    if (!userData.user) {
      toast.error("Please sign in.");
      return;
    }
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
    if (error || !data) {
      toast.error("Couldn't save the note.");
      return;
    }
    setNotes((prev) => [data as Note, ...prev]);
    setDrafts((prev) => ({ ...prev, [section]: "" }));
    setAddingFor(null);
  };

  const deleteNote = async (id: string) => {
    const prev = notes;
    setNotes((p) => p.filter((n) => n.id !== id));
    const { error } = await supabase.from("profile_notes").delete().eq("id", id);
    if (error) {
      toast.error("Couldn't delete the note.");
      setNotes(prev);
    }
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="Future Planning"
        title="The long view."
        description={`Where ${lovedOneName} is headed, who's responsible, and the decisions you want made when you're not in the room.`}
      />

      {!dependentId && (
        <Card className="mb-6">
          <p className="text-sm text-muted-foreground">
            Add a loved one in your profile to start saving future-planning notes.
          </p>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {sections.map(({ key, title, icon: Icon, body }) => {
          const items = notes.filter((n) => n.section === key);
          const isAdding = addingFor === key;
          return (
            <Card key={key}>
              <div className="mb-4 flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-mist-50 text-mist-600">
                  <Icon className="size-5" strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-lg font-semibold">{title}</h3>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">{body}</p>

              {loading ? (
                <p className="text-xs text-muted-foreground">Loading…</p>
              ) : items.length === 0 && !isAdding ? (
                <p className="text-xs text-muted-foreground">
                  Nothing here yet — add a note when you're ready.
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
                        aria-label="Delete note"
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
                    placeholder="Write a note…"
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
                  <Plus className="size-3.5" /> Add a note
                </button>
              )}
            </Card>
          );
        })}
      </div>

      <Card className="mt-6 bg-gradient-to-br from-sage-50 to-card">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid size-10 place-items-center rounded-xl bg-card text-primary">
              <FileVideo className="size-5" strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold">Letters &amp; videos</h3>
              <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                Coming soon — record short notes or videos for future caregivers,
                guardians, or {lovedOneName} themselves.
              </p>
            </div>
          </div>
          <Button disabled>Coming soon</Button>
        </div>
      </Card>
    </PageShell>
  );
}
