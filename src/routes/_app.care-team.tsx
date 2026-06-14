import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell, PageHeader, Card, Chip, Button } from "@/components/page-shell";
import { Plus, Mail, Phone, X, Trash2 } from "lucide-react";
import { useProfile } from "@/lib/use-profile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/care-team")({
  head: () => ({ meta: [{ title: "Care Team — Continuity" }] }),
  component: CareTeam,
});

const CATEGORIES = ["Family", "Medical", "Therapist", "School", "Legal", "Respite"] as const;
const FILTERS = ["All", ...CATEGORIES] as const;
type Category = (typeof CATEGORIES)[number];

type Member = {
  id: string;
  name: string;
  role: string | null;
  category: string;
  email: string | null;
  phone: string | null;
  priority: number;
  is_emergency_contact: boolean;
  notes: string | null;
};

export default function CareTeam() {
  const { lovedOneName } = useProfile();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [adding, setAdding] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("care_team_members")
      .select("*")
      .order("priority", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) {
      console.error(error);
      toast.error("Couldn't load care team.");
    } else {
      setMembers((data ?? []) as Member[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    const prev = members;
    setMembers((m) => m.filter((x) => x.id !== id));
    const { error } = await supabase.from("care_team_members").delete().eq("id", id);
    if (error) {
      setMembers(prev);
      toast.error("Couldn't remove person.");
    }
  };

  const visible = filter === "All" ? members : members.filter((m) => m.category === filter);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Care Team"
        title={`The people in ${lovedOneName}'s circle.`}
        description={`Everyone who helps care for ${lovedOneName}, ordered by who to call first.`}
        actions={
          <Button onClick={() => setAdding(true)}>
            <Plus className="size-4" /> Add person
          </Button>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((c) => {
          const active = c === filter;
          return (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                active
                  ? "border-primary bg-sage-50 text-sage-700"
                  : "border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      {adding && (
        <AddPersonModal
          onClose={() => setAdding(false)}
          onAdded={(m) => {
            setMembers((prev) => [...prev, m].sort((a, b) => a.priority - b.priority));
            setAdding(false);
          }}
        />
      )}

      {loading ? (
        <Card>
          <p className="text-sm text-muted-foreground">Loading…</p>
        </Card>
      ) : visible.length === 0 ? (
        <Card>
          <p className="text-sm text-muted-foreground">
            {members.length === 0
              ? "No one added yet. Start with the people who already help — family, doctors, therapists, teachers — and add more anytime."
              : `No one in the ${filter} category yet.`}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <Card key={p.id}>
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid size-11 place-items-center rounded-full bg-sage-100 font-display text-sm font-semibold text-sage-700">
                    {p.name
                      .split(" ")
                      .map((n) => n[0])
                      .filter(Boolean)
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.role || "—"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Chip tone="sage">#{p.priority}</Chip>
                  <button
                    onClick={() => remove(p.id)}
                    aria-label="Remove"
                    className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Chip tone="mist">{p.category}</Chip>
                {p.is_emergency_contact && <Chip tone="sage">Emergency contact</Chip>}
              </div>
              <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Mail className="size-3" /> {p.email || "—"}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="size-3" /> {p.phone || "—"}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  );
}

function AddPersonModal({
  onClose,
  onAdded,
}: {
  onClose: () => void;
  onAdded: (m: Member) => void;
}) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [category, setCategory] = useState<Category>("Family");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [priority, setPriority] = useState(5);
  const [isEmergency, setIsEmergency] = useState(false);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!name.trim()) return;
    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) {
      toast.error("Please sign in.");
      setSaving(false);
      return;
    }
    const { data, error } = await supabase
      .from("care_team_members")
      .insert({
        user_id: user.id,
        name: name.trim(),
        role: role.trim() || null,
        category,
        email: email.trim() || null,
        phone: phone.trim() || null,
        priority,
        is_emergency_contact: isEmergency,
      })
      .select()
      .single();
    setSaving(false);
    if (error || !data) {
      console.error(error);
      toast.error("Couldn't add person.");
      return;
    }
    toast.success(`${data.name} added to the care team.`);
    onAdded(data as Member);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Add a person</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-muted-foreground hover:bg-muted"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-4">
          <Field label="Name">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={120}
              placeholder="Full name"
              className="input"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Role">
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                maxLength={120}
                placeholder="e.g. Pediatrician"
                className="input"
              />
            </Field>
            <Field label="Category">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="input"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
                placeholder="name@example.com"
                className="input"
              />
            </Field>
            <Field label="Phone">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={40}
                placeholder="(555) 555-5555"
                className="input"
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Priority (1 = call first)">
              <input
                type="number"
                min={1}
                max={99}
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value) || 5)}
                className="input"
              />
            </Field>
            <label className="flex items-end gap-2 pb-2 text-sm">
              <input
                type="checkbox"
                checked={isEmergency}
                onChange={(e) => setIsEmergency(e.target.checked)}
                className="size-4 rounded"
              />
              Emergency contact
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!name.trim() || saving}>
            {saving ? "Adding…" : "Add person"}
          </Button>
        </div>

        <style>{`
          .input {
            width: 100%;
            border-radius: 0.75rem;
            border: 1px solid hsl(var(--border));
            background: hsl(var(--background));
            padding: 0.5rem 0.875rem;
            font-size: 0.875rem;
            outline: none;
          }
          .input:focus { border-color: rgb(var(--sage-600) / 0.4); }
        `}</style>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
