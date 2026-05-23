import { useState } from "react";
import { Check } from "lucide-react";

const faces = [
  { label: "Hard", emoji: "🌧" },
  { label: "Heavy", emoji: "🌥" },
  { label: "Okay", emoji: "🌤" },
  { label: "Calm", emoji: "🌿" },
  { label: "Hopeful", emoji: "🌞" },
];

export function FeedbackPrompt({
  question = "How did this feel?",
  className = "",
}: {
  question?: string;
  className?: string;
}) {
  const [score, setScore] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div
        className={`flex items-center gap-3 rounded-2xl border border-sage-200/60 bg-sage-50/60 px-5 py-4 text-sm text-sage-700 ${className}`}
      >
        <Check className="size-4" />
        Thank you. Your reflection helps us shape this for other families.
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-border bg-card/60 p-5 ${className}`}
    >
      <p className="font-display text-sm font-medium text-foreground">
        {question}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Optional — there are no wrong answers.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {faces.map((f, i) => (
          <button
            key={f.label}
            type="button"
            onClick={() => setScore(i)}
            className={`flex flex-col items-center gap-1 rounded-xl border px-3 py-2 text-[11px] transition ${
              score === i
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
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={2}
        placeholder="Anything that felt missing or overwhelming?"
        className="mt-4 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/70 focus:border-sage-600/40 focus:outline-none"
      />
      <div className="mt-3 flex items-center justify-between">
        <p className="text-[11px] text-muted-foreground">
          Shared only with the Continuity team.
        </p>
        <button
          type="button"
          onClick={() => setSent(true)}
          disabled={score === null}
          className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition hover:bg-sage-700 disabled:opacity-50"
        >
          Send reflection
        </button>
      </div>
    </div>
  );
}
