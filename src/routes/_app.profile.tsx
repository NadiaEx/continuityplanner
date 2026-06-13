import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, PageHeader, Card, Chip, Button } from "@/components/page-shell";
import { Plus, Camera, Upload, X } from "lucide-react";
import { useProfile } from "@/lib/use-profile";

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

export default function Profile() {
  const {
    caregiverName,
    dependents,
    activeIdx,
    setActiveIdx,
    activeDependent,
    addDependent,
  } = useProfile();

  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPersona, setNewPersona] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const lovedOneName = activeDependent?.name?.trim() || "your loved one";
  const persona = activeDependent?.persona;
  const caredBy =
    caregiverName !== "there" ? `Cared for by ${caregiverName}` : "Add caregiver details";

  const submitNew = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    await addDependent({ name: newName.trim(), persona: newPersona });
    setSaving(false);
    setAdding(false);
    setNewName("");
    setNewPersona(null);
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="Child Profile"
        title={lovedOneName}
        description={`A living portrait of who ${lovedOneName} is, what they need, and what brings them comfort.`}
        actions={
          <>
            <Button variant="secondary"><Upload className="size-4" /> Upload document</Button>
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
          <Button variant="secondary">Edit details</Button>
        </Card>
      ) : (
        <Card className="mb-8">
          <p className="text-sm text-muted-foreground">
            No loved ones added yet — tap "Add loved one" to start a profile.
          </p>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sectionTitles.map((title) => (
          <Card key={title}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-base font-semibold">{title}</h3>
              <button className="text-xs text-muted-foreground hover:text-foreground">Edit</button>
            </div>
            <p className="text-xs text-muted-foreground">
              Nothing here yet — add a note when you're ready.
            </p>
            <button className="mt-4 inline-flex items-center gap-1 text-xs text-primary hover:underline">
              <Plus className="size-3" /> Add note
            </button>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
