import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell, PageHeader, Card, Chip, Button } from "@/components/page-shell";
import { Plus, Sunrise, Trash2, Pencil, X, Check } from "lucide-react";
import { useProfile } from "@/lib/use-profile";
import { DependentTabs } from "@/components/dependent-tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/routines")({
  head: () => ({ meta: [{ title: "Daily Routines — Continuity" }] }),
  component: Routines,
});

type Block = {
  id: string;
  title: string;
  time_label: string | null;
  tip: string | null;
  steps: string[];
  position: number;
};

type Draft = {
  title: string;
  time_label: string;
  tip: string;
  steps: string[];
};

const EMPTY_DRAFT: Draft = { title: "", time_label: "", tip: "", steps: [""] };

function Routines() {
  const { lovedOneName, activeDependent } = useProfile();
  const dependentId = activeDependent?.id ?? null;
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!dependentId) {
      setBlocks([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      const { data, error } = await supabase
        .from("routine_blocks")
        .select("id, title, time_label, tip, steps, position")
        .eq("dependent_id", dependentId)
        .order("position", { ascending: true })
        .order("created_at", { ascending: true });
      if (cancelled) return;
      if (error) toast.error("Couldn't load routines.");
      else setBlocks((data ?? []) as Block[]);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [dependentId]);

  const startAdd = () => {
    setDraft(EMPTY_DRAFT);
    setEditingId(null);
    setAdding(true);
  };

  const startEdit = (b: Block) => {
    setDraft({
      title: b.title,
      time_label: b.time_label ?? "",
      tip: b.tip ?? "",
      steps: b.steps.length ? b.steps : [""],
    });
    setEditingId(b.id);
    setAdding(false);
  };

  const cancel = () => {
    setAdding(false);
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
  };

  const save = async () => {
    if (!dependentId) return toast.error("Add a loved one first.");
    const title = draft.title.trim();
    if (!title) return toast.error("Give the block a title.");
    const steps = draft.steps.map((s) => s.trim()).filter(Boolean);
    const payload = {
      title: title.slice(0, 120),
      time_label: draft.time_label.trim().slice(0, 80) || null,
      tip: draft.tip.trim().slice(0, 500) || null,
      steps,
    };

    if (editingId) {
      const prev = blocks;
      setBlocks((p) =>
        p.map((b) => (b.id === editingId ? { ...b, ...payload } : b)),
      );
      const { error } = await supabase
        .from("routine_blocks")
        .update(payload)
        .eq("id", editingId);
      if (error) {
        toast.error("Couldn't save.");
        setBlocks(prev);
        return;
      }
    } else {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return toast.error("Please sign in.");
      const position =
        blocks.length > 0 ? Math.max(...blocks.map((b) => b.position)) + 1 : 0;
      const { data, error } = await supabase
        .from("routine_blocks")
        .insert({
          ...payload,
          user_id: userData.user.id,
          dependent_id: dependentId,
          position,
        })
        .select("id, title, time_label, tip, steps, position")
        .single();
      if (error || !data) return toast.error("Couldn't add block.");
      setBlocks((p) => [...p, data as Block]);
    }
    cancel();
  };

  const remove = async (id: string) => {
    const prev = blocks;
    setBlocks((p) => p.filter((b) => b.id !== id));
    const { error } = await supabase.from("routine_blocks").delete().eq("id", id);
    if (error) {
      toast.error("Couldn't delete.");
      setBlocks(prev);
    }
  };

  const setStep = (i: number, value: string) =>
    setDraft((d) => {
      const next = [...d.steps];
      next[i] = value;
      return { ...d, steps: next };
    });
  const addStep = () => setDraft((d) => ({ ...d, steps: [...d.steps, ""] }));
  const removeStep = (i: number) =>
    setDraft((d) => ({ ...d, steps: d.steps.filter((_, idx) => idx !== i) }));

  return (
    <PageShell>
      <PageHeader
        eyebrow="Daily Routines"
        title={`The rhythm of ${lovedOneName}'s day.`}
        description={`The small habits and predictable moments that help ${lovedOneName} feel safe and successful.`}
        actions={
          <Button onClick={startAdd} disabled={!dependentId || adding}>
            <Plus className="size-4" /> Add block
          </Button>
        }
      />

      {!dependentId && (
        <Card className="mb-6">
          <p className="text-sm text-muted-foreground">
            Add a loved one in your <Link to="/profile" className="underline">profile</Link> to start building routines.
          </p>
        </Card>
      )}

      <div className="space-y-5">
        {adding && (
          <BlockEditor
            draft={draft}
            setDraft={setDraft}
            setStep={setStep}
            addStep={addStep}
            removeStep={removeStep}
            onSave={save}
            onCancel={cancel}
            isNew
          />
        )}

        {loading ? (
          <Card><p className="text-sm text-muted-foreground">Loading…</p></Card>
        ) : blocks.length === 0 && !adding ? (
          <Card>
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <div className="grid size-10 place-items-center rounded-xl bg-sage-50 text-sage-700">
                <Sunrise className="size-5" strokeWidth={1.75} />
              </div>
              <p className="text-sm text-muted-foreground">
                No routine blocks yet. Add a morning, mealtime, or bedtime block to get started.
              </p>
              {dependentId && (
                <button
                  type="button"
                  onClick={startAdd}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-sage-700"
                >
                  <Plus className="size-3.5" /> Add your first block
                </button>
              )}
            </div>
          </Card>
        ) : (
          blocks.map((b) =>
            editingId === b.id ? (
              <BlockEditor
                key={b.id}
                draft={draft}
                setDraft={setDraft}
                setStep={setStep}
                addStep={addStep}
                removeStep={removeStep}
                onSave={save}
                onCancel={cancel}
              />
            ) : (
              <Card key={b.id}>
                <div className="flex flex-col gap-6 md:flex-row">
                  <div className="flex shrink-0 items-start gap-3 md:w-56">
                    <div className="grid size-10 place-items-center rounded-xl bg-sage-50 text-sage-700">
                      <Sunrise className="size-5" strokeWidth={1.75} />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold">{b.title}</h3>
                      {b.time_label && (
                        <p className="text-xs text-muted-foreground">{b.time_label}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    {b.steps.length > 0 ? (
                      <ol className="space-y-2.5">
                        {b.steps.map((s, i) => (
                          <li key={i} className="flex gap-3 text-sm">
                            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
                              {i + 1}
                            </span>
                            <span className="whitespace-pre-wrap">{s}</span>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="text-xs text-muted-foreground">No steps yet.</p>
                    )}
                    {b.tip && (
                      <div className="mt-4 rounded-xl bg-mist-50/60 p-3 text-sm text-mist-600">
                        <Chip tone="mist">Caregiver tip</Chip>
                        <p className="mt-2 whitespace-pre-wrap text-foreground/80">{b.tip}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex shrink-0 items-start gap-1">
                    <button
                      type="button"
                      onClick={() => startEdit(b)}
                      className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                      aria-label="Edit block"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(b.id)}
                      className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                      aria-label="Delete block"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            ),
          )
        )}
      </div>
    </PageShell>
  );
}

function BlockEditor({
  draft,
  setDraft,
  setStep,
  addStep,
  removeStep,
  onSave,
  onCancel,
  isNew = false,
}: {
  draft: Draft;
  setDraft: React.Dispatch<React.SetStateAction<Draft>>;
  setStep: (i: number, value: string) => void;
  addStep: () => void;
  removeStep: (i: number) => void;
  onSave: () => void;
  onCancel: () => void;
  isNew?: boolean;
}) {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">
          {isNew ? "New routine block" : "Edit block"}
        </h3>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <input
          value={draft.title}
          onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
          placeholder="Title (e.g. Morning)"
          maxLength={120}
          className="rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-sage-600/40 focus:outline-none"
        />
        <input
          value={draft.time_label}
          onChange={(e) => setDraft((d) => ({ ...d, time_label: e.target.value }))}
          placeholder="When (e.g. 6:30–8:00 AM)"
          maxLength={80}
          className="rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-sage-600/40 focus:outline-none"
        />
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Steps
        </p>
        <ul className="space-y-2">
          {draft.steps.map((s, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
                {i + 1}
              </span>
              <input
                value={s}
                onChange={(e) => setStep(i, e.target.value)}
                placeholder="Describe a step…"
                maxLength={500}
                className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-sage-600/40 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => removeStep(i)}
                disabled={draft.steps.length === 1}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"
                aria-label="Remove step"
              >
                <Trash2 className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={addStep}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-muted"
        >
          <Plus className="size-3.5" /> Add step
        </button>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Caregiver tip (optional)
        </p>
        <textarea
          rows={2}
          value={draft.tip}
          onChange={(e) => setDraft((d) => ({ ...d, tip: e.target.value }))}
          placeholder="Anything a substitute caregiver should know?"
          maxLength={500}
          className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-sage-600/40 focus:outline-none"
        />
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <X className="size-3.5" /> Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground hover:bg-sage-700"
        >
          <Check className="size-3.5" /> Save
        </button>
      </div>
    </Card>
  );
}
