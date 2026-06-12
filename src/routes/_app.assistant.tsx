import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";
import { analyzeDump, type Plan } from "@/lib/assistant-analysis";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";

export const Route = createFileRoute("/_app/assistant")({
  head: () => ({ meta: [{ title: "First conversation — Continuity" }] }),
  component: Assistant,
});

type Stage = "dump" | "analyzing" | "wizard" | "ready" | "complete";

type StoredProfile = {
  caregiverName?: string;
  dependents?: Array<{ id: string; name: string; persona: string | null }>;
};

export default function Assistant() {
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
                : "Your first pages are drafted."
        }
        description={
          stage === "dump"
            ? "You know them better than anyone. Type or speak — in any order, as much as you want. I'll structure it and bring back the right follow-ups."
            : stage === "analyzing"
              ? "Pulling themes from what you wrote and drafting targeted follow-ups."
              : stage === "wizard"
                ? "One question at a time. Skip whatever doesn't apply."
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
            if (stepIdx >= flatQuestions.length - 1) setStage("complete");
            else setStepIdx((i) => i + 1);
          }}
          isLast={stepIdx === flatQuestions.length - 1}
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
}) {
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
        <Card className="bg-sage-50">
          <p className="text-xs font-semibold uppercase tracking-widest text-sage-700">
            What I heard
          </p>
          <p className="mt-2 text-sm text-foreground">{plan.summary}</p>
        </Card>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Sections drafted
          </p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {plan.sections.map((s) => (
              <li
                key={s.id}
                className={`flex items-center gap-2 ${
                  s.id === current.sectionId ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                <span
                  className={`size-1.5 rounded-full ${
                    s.id === current.sectionId ? "bg-primary" : "bg-muted-foreground/40"
                  }`}
                />
                {s.title}
              </li>
            ))}
          </ul>
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
