import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell, PageHeader, Card, Chip } from "@/components/page-shell";
import { Heart, FileText, Sparkles, Users, Compass, ShieldCheck, ArrowRight, MessageCircleHeart } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/lib/use-profile";

export const Route = createFileRoute("/_app/insights")({
  head: () => ({ meta: [{ title: "Insights — Continuity" }] }),
  component: Insights,
});

type Counts = {
  reflections: number;
  careTeam: number;
  documents: number;
  emergencyNotes: number;
  notes: number;
};

type RecentReflection = {
  id: string;
  note: string | null;
  score_label: string | null;
  question: string;
  created_at: string;
};

function Insights() {
  const { dependents } = useProfile();
  const [counts, setCounts] = useState<Counts>({
    reflections: 0,
    careTeam: 0,
    documents: 0,
    emergencyNotes: 0,
    notes: 0,
  });
  const [recent, setRecent] = useState<RecentReflection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const head = { count: "exact" as const, head: true };
      const [r, c, d, e, n, recentRes] = await Promise.all([
        supabase.from("reflections").select("*", head),
        supabase.from("care_team_members").select("*", head),
        supabase.from("profile_documents").select("*", head),
        supabase.from("emergency_plan_notes").select("*", head),
        supabase.from("profile_notes").select("*", head),
        supabase
          .from("reflections")
          .select("id, note, score_label, question, created_at")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);
      if (cancelled) return;
      setCounts({
        reflections: r.count ?? 0,
        careTeam: c.count ?? 0,
        documents: d.count ?? 0,
        emergencyNotes: e.count ?? 0,
        notes: n.count ?? 0,
      });
      setRecent((recentRes.data ?? []) as RecentReflection[]);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const metrics = [
    { label: "Loved ones", value: String(dependents.length), trend: "In your plan", icon: Users },
    { label: "Care team members", value: String(counts.careTeam), trend: "People you trust", icon: Compass },
    { label: "Emergency notes", value: String(counts.emergencyNotes), trend: "Ready when needed", icon: ShieldCheck },
    { label: "Reflections shared", value: String(counts.reflections), trend: "Thank you", icon: Heart },
  ];

  return (
    <PageShell>
      <PageHeader
        eyebrow="Insights"
        title="A quiet view of your plan."
        description="A gentle snapshot of what you've documented so far. Everything here is private to you."
      />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map(({ label, value, trend, icon: Icon }) => (
          <Card key={label}>
            <div className="mb-4 grid size-9 place-items-center rounded-lg bg-sage-50 text-sage-700">
              <Icon className="size-4" strokeWidth={1.75} />
            </div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 font-display text-2xl font-medium">{loading ? "—" : value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{trend}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-display text-lg font-medium">What you've captured</h3>
            <Chip tone="sage">Your plan</Chip>
          </div>
          <ul className="space-y-3 text-sm">
            <Row label="Profile notes" value={counts.notes} />
            <Row label="Documents uploaded" value={counts.documents} />
            <Row label="Emergency plan notes" value={counts.emergencyNotes} />
            <Row label="Care team members" value={counts.careTeam} />
            <Row label="Reflections shared" value={counts.reflections} />
          </ul>
        </Card>

        <Card>
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="size-4 text-sage-700" />
            <h3 className="font-display text-lg font-medium">Your reflections</h3>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm leading-relaxed text-muted-foreground">
              When you share a reflection from anywhere in Continuity, it'll show up here — only ever visible to you.
            </p>
          ) : (
            <ul className="space-y-3">
              {recent.map((r) => (
                <li
                  key={r.id}
                  className="rounded-xl bg-sage-50/60 p-3 text-sm leading-relaxed text-sage-700"
                >
                  {r.note ? (
                    <p className="italic">"{r.note}"</p>
                  ) : (
                    <p className="italic text-muted-foreground">{r.score_label ?? "Shared a reflection"}</p>
                  )}
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <FileText className="size-3.5" /> Private to you
          </p>
        </Card>
      </div>
    </PageShell>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <li className="flex items-center justify-between rounded-xl border border-border bg-surface-soft px-4 py-3">
      <span className="text-foreground/90">{label}</span>
      <span className="font-mono text-sm tabular-nums text-muted-foreground">{value}</span>
    </li>
  );
}
