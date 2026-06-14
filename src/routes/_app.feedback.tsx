import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, PageHeader, Card } from "@/components/page-shell";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Heart, Check } from "lucide-react";

export const Route = createFileRoute("/_app/feedback")({
  head: () => ({ meta: [{ title: "Share your feedback — Continuity" }] }),
  component: FeedbackPage,
});

const faces = [
  { label: "Hard", emoji: "🌧" },
  { label: "Heavy", emoji: "🌥" },
  { label: "Okay", emoji: "🌤" },
  { label: "Calm", emoji: "🌿" },
  { label: "Hopeful", emoji: "🌞" },
];

const prompts = [
  {
    key: "site",
    question: "How is Continuity feeling to use so far?",
    placeholder: "Anything confusing, missing, or delightful about the site itself?",
  },
  {
    key: "process",
    question: "How is the planning process feeling?",
    placeholder: "Which parts felt easy, which felt heavy, and what would make it gentler?",
  },
  {
    key: "life",
    question: "How are you doing in caregiving life right now?",
    placeholder: "Share as much or as little as you'd like. We read every word.",
  },
];

const MAX_NOTE = 2000;

function FeedbackPage() {
  const navigate = useNavigate();
  const [scores, setScores] = useState<Record<string, number | null>>({
    site: null,
    process: null,
    life: null,
  });
  const [notes, setNotes] = useState<Record<string, string>>({
    site: "",
    process: "",
    life: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const hasAnything =
    Object.values(scores).some((s) => s !== null) ||
    Object.values(notes).some((n) => n.trim().length > 0);

  const handleSubmit = async () => {
    if (!hasAnything) {
      toast.error("Add at least one response so we know what to read.");
      return;
    }
    setSubmitting(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) {
        toast.error("Please sign in to share feedback.");
        setSubmitting(false);
        return;
      }
      const rows = prompts
        .map((p) => {
          const score = scores[p.key];
          const note = notes[p.key].trim().slice(0, MAX_NOTE);
          if (score === null && !note) return null;
          return {
            user_id: user.id,
            question: p.question,
            score: score ?? 2,
            score_label: score !== null ? faces[score].label : null,
            note: note || null,
            page_path: "/feedback",
          };
        })
        .filter(Boolean) as Array<{
          user_id: string;
          question: string;
          score: number;
          score_label: string | null;
          note: string | null;
          page_path: string;
        }>;

      const { error } = await supabase.from("reflections").insert(rows);
      if (error) throw error;
      setSent(true);
    } catch (err) {
      console.error("Failed to submit feedback", err);
      toast.error("Couldn't send your feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <PageShell>
        <PageHeader eyebrow="Feedback" title="Thank you." />
        <Card className="text-center">
          <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-sage-50 text-sage-700">
            <Check className="size-5" />
          </div>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
            We read every reflection personally. What you shared will shape what
            we build — and how gently we build it — next.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate({ to: "/insights" })}
              className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:bg-sage-700"
            >
              Back to insights
            </button>
          </div>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow="Feedback"
        title="Share what's on your mind."
        description="Tell us about the site, the planning process, or how caregiving life is feeling. Nothing is too small. We read all of it."
      />

      <div className="space-y-6">
        {prompts.map((p) => (
          <Card key={p.key}>
            <div className="mb-3 flex items-center gap-2">
              <Heart className="size-4 text-sage-700" />
              <h3 className="font-display text-base font-medium">{p.question}</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Optional — pick a feeling, write a note, or both.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {faces.map((f, i) => (
                <button
                  key={f.label}
                  type="button"
                  onClick={() =>
                    setScores((prev) => ({
                      ...prev,
                      [p.key]: prev[p.key] === i ? null : i,
                    }))
                  }
                  className={`flex flex-col items-center gap-1 rounded-xl border px-3 py-2 text-[11px] transition ${
                    scores[p.key] === i
                      ? "border-sage-600/40 bg-sage-50 text-sage-700"
                      : "border-border bg-background text-muted-foreground hover:border-sage-600/20"
                  }`}
                >
                  <span className="text-lg leading-none">{f.emoji}</span>
                  {f.label}
                </button>
              ))}
            </div>
            <textarea
              value={notes[p.key]}
              onChange={(e) =>
                setNotes((prev) => ({ ...prev, [p.key]: e.target.value }))
              }
              rows={4}
              maxLength={MAX_NOTE}
              placeholder={p.placeholder}
              className="mt-4 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/70 focus:border-sage-600/40 focus:outline-none"
            />
            <p className="mt-1 text-right text-[11px] text-muted-foreground">
              {notes[p.key].length}/{MAX_NOTE}
            </p>
          </Card>
        ))}

        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            Shared privately with the Continuity team.
          </p>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !hasAnything}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-sage-700 disabled:opacity-50"
          >
            {submitting ? "Sending…" : "Send feedback"}
          </button>
        </div>
      </div>
    </PageShell>
  );
}
