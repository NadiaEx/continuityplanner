import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell, PageHeader, Card, Button } from "@/components/page-shell";
import { Phone, Hospital, ShieldAlert, MapPin, Pill, Download, QrCode, Pencil, Check, X } from "lucide-react";
import { useProfile } from "@/lib/use-profile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/emergency")({
  head: () => ({ meta: [{ title: "Emergency Plan — Continuity" }] }),
  component: Emergency,
});

type Contact = {
  id: string;
  name: string;
  role: string | null;
  phone: string | null;
  priority: number;
};

type NoteKind = "summary" | "hospital" | "medication" | "deescalation" | "wandering";
type Notes = Record<NoteKind, string>;

const EMPTY_NOTES: Notes = {
  summary: "",
  hospital: "",
  medication: "",
  deescalation: "",
  wandering: "",
};

export default function Emergency() {
  const { lovedOneName } = useProfile();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [notes, setNotes] = useState<Notes>(EMPTY_NOTES);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [{ data: cs, error: cErr }, { data: ns, error: nErr }] = await Promise.all([
      supabase
        .from("care_team_members")
        .select("id,name,role,phone,priority")
        .eq("is_emergency_contact", true)
        .order("priority", { ascending: true }),
      supabase.from("emergency_plan_notes").select("kind,content"),
    ]);
    if (cErr || nErr) {
      console.error(cErr || nErr);
      toast.error("Couldn't load emergency plan.");
    }
    setContacts((cs ?? []) as Contact[]);
    const next = { ...EMPTY_NOTES };
    for (const row of ns ?? []) {
      const k = (row as { kind: string }).kind as NoteKind;
      if (k in next) next[k] = (row as { content: string }).content || "";
    }
    setNotes(next);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const saveNote = async (kind: NoteKind, content: string) => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) {
      toast.error("Please sign in.");
      return false;
    }
    const { error } = await supabase
      .from("emergency_plan_notes")
      .upsert(
        { user_id: user.id, kind, content },
        { onConflict: "user_id,kind" },
      );
    if (error) {
      console.error(error);
      toast.error("Couldn't save.");
      return false;
    }
    setNotes((n) => ({ ...n, [kind]: content }));
    return true;
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="Emergency Plan"
        title="Ready, just in case."
        description={`If you cannot be there, this is what others need to know to support ${lovedOneName} safely.`}
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => toast.info("QR tag generation is coming soon.")}
            >
              <QrCode className="size-4" /> Generate QR tag
            </Button>
            <Button onClick={() => toast.info("Emergency packet export is coming soon.")}>
              <Download className="size-4" /> Generate Emergency Packet
            </Button>
          </>
        }
      />

      <Card className="mb-8 bg-ink p-8 text-background">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-background/60">
              Quick reference summary
            </p>
            <h3 className="mt-2 font-display text-2xl font-medium">{lovedOneName}</h3>
            <p className="mt-2 max-w-xl text-sm text-background/70">
              Add the most important things a stranger would need to know — allergies,
              communication style, what calms {lovedOneName} down, and any safety risks.
            </p>
            <SummaryEditor value={notes.summary} onSave={(v) => saveNote("summary", v)} />
          </div>
          <div className="rounded-2xl bg-background p-4">
            <div className="grid size-32 place-items-center rounded-lg bg-muted text-muted-foreground">
              <QrCode className="size-20" strokeWidth={1.25} />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Phone className="size-4 text-primary" />
            <h3 className="font-display text-lg font-semibold">Emergency contacts</h3>
          </div>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : contacts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No emergency contacts yet. Mark people in your{" "}
              <a className="text-primary underline-offset-2 hover:underline" href="/care-team">
                Care Team
              </a>{" "}
              as "Emergency contact" and they'll appear here.
            </p>
          ) : (
            <ul className="space-y-2">
              {contacts.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-surface-soft p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-7 place-items-center rounded-full bg-sage-100 text-xs font-semibold text-sage-700">
                      {c.priority}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.role || "—"}</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    {c.phone || "—"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <NoteCard
          icon={<Hospital className="size-4 text-primary" />}
          title="Hospital instructions"
          placeholder="Preferred hospital, transport notes, anything a first responder should know."
          value={notes.hospital}
          onSave={(v) => saveNote("hospital", v)}
        />
        <NoteCard
          icon={<Pill className="size-4 text-primary" />}
          title="Medication summary"
          placeholder="Current medications, doses, timing, and where they're kept."
          value={notes.medication}
          onSave={(v) => saveNote("medication", v)}
        />
        <NoteCard
          icon={<ShieldAlert className="size-4 text-primary" />}
          title="De-escalation strategies"
          placeholder={`What helps ${lovedOneName} feel safe when overwhelmed — voice, touch, space, and what to avoid.`}
          value={notes.deescalation}
          onSave={(v) => saveNote("deescalation", v)}
        />
        <NoteCard
          className="lg:col-span-2"
          icon={<MapPin className="size-4 text-primary" />}
          title="Wandering response"
          placeholder={`Where ${lovedOneName} might go if overwhelmed, what draws them, and how a stranger should approach.`}
          value={notes.wandering}
          onSave={(v) => saveNote("wandering", v)}
        />
      </div>
    </PageShell>
  );
}

function NoteCard({
  icon,
  title,
  placeholder,
  value,
  onSave,
  className = "",
}: {
  icon: React.ReactNode;
  title: string;
  placeholder: string;
  value: string;
  onSave: (v: string) => Promise<boolean>;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editing) setDraft(value);
  }, [value, editing]);

  const commit = async () => {
    setSaving(true);
    const ok = await onSave(draft);
    setSaving(false);
    if (ok) setEditing(false);
  };

  return (
    <Card className={className}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-display text-lg font-semibold">{title}</h3>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <Pencil className="size-3.5" /> Edit
          </button>
        ) : (
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setEditing(false);
                setDraft(value);
              }}
              className="rounded-full p-1 text-muted-foreground hover:bg-muted"
              aria-label="Cancel"
            >
              <X className="size-3.5" />
            </button>
            <button
              onClick={commit}
              disabled={saving}
              className="rounded-full p-1 text-sage-700 hover:bg-sage-50 disabled:opacity-50"
              aria-label="Save"
            >
              <Check className="size-3.5" />
            </button>
          </div>
        )}
      </div>
      {editing ? (
        <textarea
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={5}
          maxLength={4000}
          placeholder={placeholder}
          className="w-full resize-y rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-sage-600/40"
        />
      ) : value.trim() ? (
        <p className="whitespace-pre-wrap text-sm text-foreground">{value}</p>
      ) : (
        <p className="text-sm text-muted-foreground">{placeholder}</p>
      )}
    </Card>
  );
}

function SummaryEditor({
  value,
  onSave,
}: {
  value: string;
  onSave: (v: string) => Promise<boolean>;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editing) setDraft(value);
  }, [value, editing]);

  const commit = async () => {
    setSaving(true);
    const ok = await onSave(draft);
    setSaving(false);
    if (ok) setEditing(false);
  };

  if (!editing) {
    return (
      <div className="mt-4">
        {value.trim() && (
          <p className="mb-3 whitespace-pre-wrap text-sm text-background/90">{value}</p>
        )}
        <button
          onClick={() => setEditing(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-background/30 px-3 py-1.5 text-xs text-background/80 transition hover:bg-background/10"
        >
          <Pencil className="size-3.5" /> {value.trim() ? "Edit summary" : "Add summary"}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-2">
      <textarea
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={4}
        maxLength={4000}
        placeholder="Allergies, communication style, what calms them, safety risks…"
        className="w-full resize-y rounded-xl bg-background/10 px-3 py-2 text-sm text-background placeholder:text-background/50 outline-none ring-1 ring-background/20 focus:ring-background/40"
      />
      <div className="flex gap-2">
        <button
          onClick={commit}
          disabled={saving}
          className="rounded-full bg-background px-3 py-1.5 text-xs font-medium text-ink hover:bg-background/90 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          onClick={() => {
            setEditing(false);
            setDraft(value);
          }}
          className="rounded-full border border-background/30 px-3 py-1.5 text-xs text-background/80 hover:bg-background/10"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
