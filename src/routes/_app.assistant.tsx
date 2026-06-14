import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { PageShell, PageHeader, Card, Chip, Button } from "@/components/page-shell";
import {
  Mic,
  MicOff,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  RotateCcw,
  Lock,
  FileText,
  ShieldAlert,
  HeartPulse,
  Users,
  Compass,
} from "lucide-react";
import { toast } from "sonner";
import { analyzeDump, type Plan } from "@/lib/assistant-analysis";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";

/* -------------------- Unlocks -------------------- */
// Each unlock fires once the caregiver crosses the threshold (% of total
// questions answered). The copy is meant to feel like a confidence call —
// "we now have enough to draft X" — not a gamified badge.
type Unlock = {
  id: string;
  threshold: number; // 0..1
  title: string;
  doc: string;
  confidence: string;
  blurb: string;
  icon: React.ComponentType<{ className?: string }>;
};

const UNLOCKS: Unlock[] = [
  {
    id: "one_page",
    threshold: 0.15,
    title: "One-Page About Them",
    doc: "A printable one-pager any new caregiver can read in 90 seconds.",
    confidence: "We have enough to say with 90% confidence you should print a One-Page About Them next.",
    blurb: "Name, how they communicate, what soothes them, what to never do.",
    icon: FileText,
  },
  {
    id: "emergency_card",
    threshold: 0.35,
    title: "Emergency Wallet Card",
    doc: "Pocket-sized card with the 5 things a first responder needs.",
    confidence: "We have enough to say with 95% confidence you should generate an Emergency Wallet Card now.",
    blurb: "Diagnoses, meds, allergies, who to call, what helps them regulate.",
    icon: ShieldAlert,
  },
  {
    id: "med_sheet",
    threshold: 0.55,
    title: "Medication & Provider Sheet",
    doc: "A clean reference for any sitter, family member, or ER visit.",
    confidence: "We have enough to draft a Medication & Provider Sheet with high confidence.",
    blurb: "Daily meds, dosing windows, PRNs, and the providers behind each one.",
    icon: HeartPulse,
  },
  {
    id: "backup_plan",
    threshold: 0.7,
    title: "Backup Caregiver Brief",
    doc: "What someone else needs to step in for a day, a week, or longer.",
    confidence: "We have enough to draft a Backup Caregiver Brief you could hand to a real person today.",
    blurb: "Routines, regulation, food, sleep, school, and the soft stuff that breaks first.",
    icon: Users,
  },
  {
    id: "future_letter",
    threshold: 0.9,
    title: "Letter to the Future",
    doc: "Your long-horizon hopes, decisions, and lines you won't cross.",
    confidence: "We have enough to draft a Letter to the Future — the document most families never get to.",
    blurb: "What a good adult life looks like, who you'd want at the table, and what matters most.",
    icon: Compass,
  },
];

export const Route = createFileRoute("/_app/assistant")({
  head: () => ({ meta: [{ title: "First conversation — Continuity" }] }),
  validateSearch: (search: Record<string, unknown>) => ({
    prompt: typeof search.prompt === "string" ? search.prompt : undefined,
  }),
  component: Assistant,
});

type Stage = "dump" | "analyzing" | "wizard" | "ready" | "complete";

type StoredProfile = {
  caregiverName?: string;
  dependents?: Array<{ id: string; name: string; persona: string | null }>;
};

export default function Assistant() {
  const { prompt } = Route.useSearch();
  const [profile, setProfile] = useState<StoredProfile>({});
  const [activeDependentIdx, setActiveDependentIdx] = useState(0);
  const [stage, setStage] = useState<Stage>("dump");
  const [dump, setDump] = useState("");
  const [plan, setPlan] = useState<Plan | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("continuity.profile");
      if (raw) setProfile(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  // Deep link: prefill the dump textarea when ?prompt=... is provided.
  useEffect(() => {
    if (prompt && !dump) setDump(prompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt]);


  const dependent = profile.dependents?.[activeDependentIdx];
  const lovedOneName = dependent?.name || "your loved one";

  const { listening, interim, supported, start, stop } = useSpeechRecognition({
    onFinalTranscript: (chunk) =>
      setDump((prev) => (prev ? `${prev.trimEnd()} ${chunk.trim()}` : chunk.trim())),
  });

  const beginAnalysis = async () => {
    setStage("analyzing");
    const result = await analyzeDump({
      lovedOneName: dependent?.name ?? "",
      persona: dependent?.persona ?? null,
      dump,
    });
    setPlan(result);
    setStepIdx(0);
    setStage("wizard");
  };

  const flatQuestions = useMemo(() => {
    if (!plan) return [] as Array<{ sectionId: string; sectionTitle: string; question: string }>;
    return plan.sections.flatMap((s) =>
      s.questions.map((q) => ({ sectionId: s.id, sectionTitle: s.title, question: q })),
    );
  }, [plan]);

  const current = flatQuestions[stepIdx];
  const currentAnswer = current ? answers[`${current.sectionId}:${stepIdx}`] ?? "" : "";

  const setCurrentAnswer = (v: string) => {
    if (!current) return;
    setAnswers((a) => ({ ...a, [`${current.sectionId}:${stepIdx}`]: v }));
  };

  const restart = () => {
    setStage("dump");
    setDump("");
    setPlan(null);
    setAnswers({});
    setStepIdx(0);
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="First conversation"
        title={
          stage === "dump"
            ? `Tell me about ${lovedOneName}.`
            : stage === "analyzing"
              ? "Structuring what you shared…"
              : stage === "wizard"
                ? "Sharpening the details."
                : stage === "ready"
                  ? "We have enough for a first draft."
                  : "Your first pages are drafted."
        }
        description={
          stage === "dump"
            ? "You know them better than anyone. Type or speak — in any order, as much as you want. I'll structure it and bring back the right follow-ups."
            : stage === "analyzing"
              ? "Pulling themes from what you wrote and drafting targeted follow-ups."
              : stage === "wizard"
                ? "One question at a time. Skip whatever doesn't apply."
                : stage === "ready"
                  ? "You can keep filling gaps, or let me generate the first draft now. You'll be able to edit anything later."
                  : "What you shared is now the first sections of the plan."
        }
        actions={
          stage !== "dump" && stage !== "analyzing" ? (
            <Button variant="secondary" onClick={restart}>
              <RotateCcw className="size-4" /> Start over
            </Button>
          ) : null
        }
      />

      {/* Dependent switcher */}
      {profile.dependents && profile.dependents.length > 1 && stage === "dump" && (
        <div className="mb-6 flex flex-wrap gap-2">
          {profile.dependents.map((d, i) => (
            <button
              key={d.id}
              onClick={() => setActiveDependentIdx(i)}
              className={`rounded-full border px-3 py-1.5 text-xs transition ${
                i === activeDependentIdx
                  ? "border-sage-600/40 bg-sage-50 text-sage-700"
                  : "border-border bg-card text-muted-foreground hover:border-sage-600/20"
              }`}
            >
              {d.name || `Loved one ${i + 1}`}
            </button>
          ))}
        </div>
      )}

      {stage === "dump" && (
        <DumpStage
          lovedOneName={lovedOneName}
          dump={dump}
          setDump={setDump}
          interim={interim}
          listening={listening}
          supported={supported}
          startMic={start}
          stopMic={stop}
          onContinue={beginAnalysis}
        />
      )}

      {stage === "analyzing" && <AnalyzingStage />}

      {stage === "wizard" && plan && current && (
        <WizardStage
          plan={plan}
          stepIdx={stepIdx}
          total={flatQuestions.length}
          current={current}
          answer={currentAnswer}
          onAnswer={setCurrentAnswer}
          onBack={() => setStepIdx((i) => Math.max(0, i - 1))}
          onNext={() => {
            if (stepIdx >= flatQuestions.length - 1) setStage("ready");
            else setStepIdx((i) => i + 1);
          }}
          isLast={stepIdx === flatQuestions.length - 1}
          answeredCount={
            Object.values(answers).filter((v) => v?.trim()).length
          }
          onDraftNow={() => setStage("ready")}
        />
      )}

      {stage === "ready" && plan && (
        <ReadyStage
          plan={plan}
          answers={answers}
          questions={flatQuestions}
          onKeepGoing={(idx) => {
            setStepIdx(idx);
            setStage("wizard");
          }}
          onGenerate={() => setStage("complete")}
        />
      )}

      {stage === "complete" && plan && (
        <CompleteStage plan={plan} answers={answers} questions={flatQuestions} />
      )}
    </PageShell>
  );
}

/* -------------------- Stage 1: Dump -------------------- */

function DumpStage({
  lovedOneName,
  dump,
  setDump,
  interim,
  listening,
  supported,
  startMic,
  stopMic,
  onContinue,
}: {
  lovedOneName: string;
  dump: string;
  setDump: (v: string) => void;
  interim: string;
  listening: boolean;
  supported: boolean;
  startMic: () => void;
  stopMic: () => void;
  onContinue: () => void;
}) {
  const wordCount = dump.trim() ? dump.trim().split(/\s+/).length : 0;
  const enough = wordCount >= 5;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid size-8 place-items-center rounded-full bg-primary">
              <Sparkles className="size-3.5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Continuity Assistant</p>
              <p className="text-[11px] text-muted-foreground">
                Listening for whatever you want to share about {lovedOneName}
              </p>
            </div>
          </div>
          {listening ? (
            <Chip tone="warn">● Listening</Chip>
          ) : (
            <Chip tone="sage">Autosaved</Chip>
          )}
        </div>

        <div className="p-6">
          <label className="block">
            <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Tell me about {lovedOneName}
            </span>
            <textarea
              value={dump + (interim ? ` ${interim}` : "")}
              onChange={(e) => setDump(e.target.value)}
              placeholder={`What do you want me to know about ${lovedOneName}? Their personality, what they need, what worries you, what brings them joy — anything, in any order.`}
              rows={14}
              className="w-full resize-y rounded-2xl border border-border bg-card px-5 py-4 text-base leading-relaxed outline-none transition placeholder:text-muted-foreground/60 focus:border-sage-600/40 focus:ring-2 focus:ring-sage-600/10"
            />
          </label>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{wordCount} words</span>
              {!enough && <span>· keep going whenever you're ready</span>}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {supported ? (
                <button
                  type="button"
                  onClick={listening ? stopMic : startMic}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition ${
                    listening
                      ? "border-red-300 bg-red-50 text-red-700"
                      : "border-border bg-card text-foreground hover:border-sage-600/30"
                  }`}
                >
                  {listening ? (
                    <>
                      <MicOff className="size-4" /> Stop
                    </>
                  ) : (
                    <>
                      <Mic className="size-4" /> Speak instead
                    </>
                  )}
                </button>
              ) : (
                <span className="text-xs text-muted-foreground">
                  (Voice input not supported in this browser)
                </span>
              )}

              <button
                onClick={() => {
                  if (listening) stopMic();
                  onContinue();
                }}
                disabled={!enough}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-sage-700 disabled:opacity-50"
              >
                I'm done sharing <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <Card className="bg-sage-50">
          <p className="text-xs font-semibold uppercase tracking-widest text-sage-700">
            Prompts to pull from
          </p>
          <ul className="mt-3 space-y-2 text-sm text-foreground">
            <li>• What does only you know about {lovedOneName}?</li>
            <li>• What does a great day actually look like?</li>
            <li>• What would fall apart fastest without you?</li>
            <li>• Who else already knows them well?</li>
          </ul>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">
            Dump everything. After you finish, I'll structure it and bring back
            targeted follow-ups based on what you actually said.
          </p>
        </Card>
      </div>
    </div>
  );
}

/* -------------------- Stage 2: Analyzing -------------------- */

function AnalyzingStage() {
  return (
    <Card className="grid place-items-center py-20 text-center">
      <div className="grid size-14 place-items-center rounded-full bg-sage-100 text-sage-700">
        <Loader2 className="size-6 animate-spin" strokeWidth={1.5} />
      </div>
      <p className="mt-5 font-display text-lg">Structuring what you shared…</p>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        Pulling themes and drafting targeted follow-ups.
      </p>
    </Card>
  );
}

/* -------------------- Stage 3: Wizard -------------------- */

function WizardStage({
  plan,
  stepIdx,
  total,
  current,
  answer,
  onAnswer,
  onBack,
  onNext,
  isLast,
  answeredCount,
  onDraftNow,
}: {
  plan: Plan;
  stepIdx: number;
  total: number;
  current: { sectionId: string; sectionTitle: string; question: string };
  answer: string;
  onAnswer: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
  isLast: boolean;
  answeredCount: number;
  onDraftNow: () => void;
}) {
  const enoughForDraft = answeredCount >= Math.max(3, Math.ceil(total * 0.5));
  const progress = total > 0 ? answeredCount / total : 0;

  // Which unlocks the caregiver has crossed the threshold for.
  const unlockedIds = useMemo(
    () => UNLOCKS.filter((u) => progress >= u.threshold).map((u) => u.id),
    [progress],
  );
  const nextLocked = UNLOCKS.find((u) => progress < u.threshold);

  // Fire a toast + inline confidence callout the first time each unlock crosses.
  const seenRef = useRef<Set<string>>(new Set());
  const [justUnlocked, setJustUnlocked] = useState<Unlock | null>(null);
  useEffect(() => {
    for (const u of UNLOCKS) {
      if (progress >= u.threshold && !seenRef.current.has(u.id)) {
        seenRef.current.add(u.id);
        setJustUnlocked(u);
        toast.success(`Unlocked: ${u.title}`, {
          description: u.confidence,
          duration: 6000,
        });
      }
    }
  }, [progress]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
      <div>
        {/* Progress */}
        <div className="mb-5 flex gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition ${
                i <= stepIdx ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <Card className="p-8 lg:p-10">
          <p className="font-display text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {current.sectionTitle} · {stepIdx + 1} of {total}
          </p>
          <h2 className="mt-3 font-display text-2xl font-medium tracking-tight lg:text-3xl">
            {current.question}
          </h2>

          <textarea
            value={answer}
            onChange={(e) => onAnswer(e.target.value)}
            placeholder="In your own words, however much or little feels right."
            rows={6}
            className="mt-6 w-full resize-y rounded-2xl border border-border bg-card px-5 py-4 text-base leading-relaxed outline-none transition placeholder:text-muted-foreground/60 focus:border-sage-600/40 focus:ring-2 focus:ring-sage-600/10"
          />

          {justUnlocked && (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-sage-600/40 bg-sage-50 px-4 py-3">
              <div className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                <justUnlocked.icon className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-sage-700">
                  Unlocked · {justUnlocked.title}
                </p>
                <p className="mt-0.5 text-sm text-foreground">{justUnlocked.confidence}</p>
              </div>
              <button
                onClick={() => setJustUnlocked(null)}
                className="shrink-0 text-xs text-muted-foreground hover:text-foreground"
                aria-label="Dismiss"
              >
                Dismiss
              </button>
            </div>
          )}

          {enoughForDraft && !isLast && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-sage-600/30 bg-sage-50 px-4 py-3">
              <p className="text-sm text-foreground">
                We have enough for a first draft. You can keep going or generate it now.
              </p>
              <button
                onClick={onDraftNow}
                className="inline-flex items-center gap-1.5 rounded-full border border-sage-600/40 bg-card px-4 py-1.5 text-xs font-medium text-sage-700 transition hover:bg-sage-100"
              >
                Draft my plan now <ArrowRight className="size-3.5" />
              </button>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={onBack}
              disabled={stepIdx === 0}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40"
            >
              <ArrowLeft className="size-4" /> Back
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={onNext}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Skip
              </button>
              <button
                onClick={onNext}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-sage-700"
              >
                {isLast ? "Finish" : "Continue"} <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Unlocked documents
            </p>
            <span className="text-[11px] text-muted-foreground">
              {unlockedIds.length}/{UNLOCKS.length}
            </span>
          </div>
          <ul className="mt-3 space-y-2.5">
            {UNLOCKS.map((u) => {
              const unlocked = unlockedIds.includes(u.id);
              const Icon = unlocked ? u.icon : Lock;
              return (
                <li
                  key={u.id}
                  className={`flex items-start gap-2.5 rounded-xl border px-3 py-2.5 transition ${
                    unlocked
                      ? "border-sage-600/30 bg-sage-50"
                      : "border-dashed border-border bg-card opacity-70"
                  }`}
                >
                  <div
                    className={`grid size-7 shrink-0 place-items-center rounded-full ${
                      unlocked
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="size-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-sm font-medium ${
                        unlocked ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {u.title}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                      {unlocked ? u.blurb : `Unlocks at ${Math.round(u.threshold * 100)}% answered`}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
          {nextLocked && (
            <p className="mt-3 text-[11px] text-muted-foreground">
              Next: <span className="text-foreground">{nextLocked.title}</span> at{" "}
              {Math.round(nextLocked.threshold * 100)}% (
              {Math.max(0, Math.ceil(nextLocked.threshold * total) - answeredCount)} more answers).
            </p>
          )}
        </Card>

        <Card className="bg-sage-50">
          <p className="text-xs font-semibold uppercase tracking-widest text-sage-700">
            What I heard
          </p>
          <p className="mt-2 text-sm text-foreground">{plan.summary}</p>
        </Card>

        {plan.gaps.length > 0 && (
          <Card>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              We'll come back to
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              {plan.gaps.map((g) => (
                <li key={g}>• {g}</li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
}

/* -------------------- Stage 4: Complete -------------------- */

function CompleteStage({
  plan,
  answers,
  questions,
}: {
  plan: Plan;
  answers: Record<string, string>;
  questions: Array<{ sectionId: string; sectionTitle: string; question: string }>;
}) {
  const bySection = plan.sections.map((s) => ({
    section: s,
    items: questions
      .map((q, i) => ({ ...q, idx: i, answer: answers[`${q.sectionId}:${i}`] }))
      .filter((q) => q.sectionId === s.id && q.answer?.trim()),
  }));

  return (
    <div className="space-y-6">
      <Card className="bg-sage-50">
        <div className="flex items-start gap-3">
          <div className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-4" />
          </div>
          <div>
            <p className="font-display text-lg">First pages drafted.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              You can keep refining anytime. Nothing is final, and you can come back to any
              section in the sidebar.
            </p>
          </div>
        </div>
      </Card>

      {bySection.map(({ section, items }) => (
        <Card key={section.id}>
          <p className="font-display text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {section.title}
          </p>
          {items.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              No notes yet — we'll come back to this.
            </p>
          ) : (
            <dl className="mt-4 space-y-4">
              {items.map((it) => (
                <div key={`${it.sectionId}:${it.idx}`}>
                  <dt className="text-sm font-medium">{it.question}</dt>
                  <dd className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                    {it.answer}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </Card>
      ))}
    </div>
  );
}

/* -------------------- Stage 3.5: Ready -------------------- */

function ReadyStage({
  plan,
  answers,
  questions,
  onKeepGoing,
  onGenerate,
}: {
  plan: Plan;
  answers: Record<string, string>;
  questions: Array<{ sectionId: string; sectionTitle: string; question: string }>;
  onKeepGoing: (idx: number) => void;
  onGenerate: () => void;
}) {
  const gaps = questions
    .map((q, i) => ({ ...q, idx: i, answer: answers[`${q.sectionId}:${i}`] }))
    .filter((q) => !q.answer?.trim());
  const answered = questions.length - gaps.length;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
      <Card className="p-8 lg:p-10">
        <div className="flex items-start gap-3">
          <div className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-4" />
          </div>
          <div>
            <p className="font-display text-xl">
              We have enough for a first draft. Should we start?
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              You've answered {answered} of {questions.length}. You can fill the remaining
              gaps now, or generate the draft and refine anything later.
            </p>
          </div>
        </div>

        {gaps.length > 0 && (
          <div className="mt-7">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Gaps you can still fill ({gaps.length})
            </p>
            <ul className="mt-3 space-y-2">
              {gaps.map((g) => (
                <li
                  key={`${g.sectionId}:${g.idx}`}
                  className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3"
                >
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      {g.sectionTitle}
                    </p>
                    <p className="mt-0.5 text-sm">{g.question}</p>
                  </div>
                  <button
                    onClick={() => onKeepGoing(g.idx)}
                    className="shrink-0 text-xs text-sage-700 hover:underline"
                  >
                    Answer
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
          <button
            onClick={() => onKeepGoing(gaps[0]?.idx ?? 0)}
            disabled={gaps.length === 0}
            className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-40"
          >
            Keep answering
          </button>
          <button
            onClick={onGenerate}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-sage-700"
          >
            Yes, draft my plan <ArrowRight className="size-4" />
          </button>
        </div>
      </Card>

      <div className="space-y-4">
        <Card className="bg-sage-50">
          <p className="text-xs font-semibold uppercase tracking-widest text-sage-700">
            What I'll draft
          </p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {plan.sections.map((s) => (
              <li key={s.id} className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary" />
                {s.title}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">
            Nothing is final. Every section stays editable, and you can come back to
            unanswered questions anytime.
          </p>
        </Card>
      </div>
    </div>
  );
}
