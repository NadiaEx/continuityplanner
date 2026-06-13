import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ArrowLeft, Leaf, Check, Sparkle, Plus, X } from "lucide-react";
import { HearthIllustration, PathIllustration, HandsIllustration } from "@/components/soft-illustration";
import { supabase } from "@/integrations/supabase/client";


export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Set up your plan — Continuity" },
      {
        name: "description",
        content: "Set up Continuity — the pay-what-you-can planning tool built for the people who already do the hardest work.",
      },
    ],
  }),
  component: Onboarding,
});

const reasons = [
  "I'm holding all of this alone",
  "Nobody would know what to do in an emergency",
  "I don't know who takes over if I can't",
  "If something happened to me, nobody would know where to start",
  "I'm the only one who knows how to help them calm down",
  "Every appointment falls on me",
  "I need someone else to hold some of this",
  "Their history is spread across a dozen places",
  "I have to re-explain everything at every appointment",
  "Providers keep making decisions without the full picture",
  "The school calls and I freeze every time",
  "I'm always one bad day away from a crisis",
  "I don't know what happens when they age out of services",
  "Nobody has asked me what I actually want for them long-term",
  "I know I need a plan — I just never have time to make one",
  "I've never written any of this down",
];


const relationships = ["Son", "Daughter", "Parent", "Partner", "Sibling", "Other"];

const livingOptions = [
  "Lives with me",
  "Lives independently",
  "Lives in a care facility",
  "Lives with another family member",
  "It's complicated",
];

const complexityTags = [
  "Medical conditions",
  "Medications",
  "Mobility needs",
  "Cognitive support",
  "Behavioral support",
  "Communication differences",
  "None right now",
];

type Dependent = {
  id: string;
  persona: string | null;
  name: string;
  living: string | null;
  complexity: string[];
};

type Profile = {
  caregiverName: string;
  caregiverEmail: string;
  reasons: string[];
  dependents: Dependent[];
};

const makeDependent = (): Dependent => ({
  id: Math.random().toString(36).slice(2, 9),
  persona: null,
  name: "",
  
  living: null,
  complexity: [],
});

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const [caregiverName, setCaregiverName] = useState("");
  const [caregiverEmail, setCaregiverEmail] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [dependents, setDependents] = useState<Dependent[]>([makeDependent()]);
  const [activeIdx, setActiveIdx] = useState(0);

  const total = 7;
  const next = () => setStep((s) => Math.min(total - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const togglePick = (r: string) =>
    setPicked((p) => (p.includes(r) ? p.filter((x) => x !== r) : [...p, r]));

  const updateDependent = (idx: number, patch: Partial<Dependent>) =>
    setDependents((arr) => arr.map((d, i) => (i === idx ? { ...d, ...patch } : d)));

  const toggleComplexityFor = (idx: number, tag: string) =>
    setDependents((arr) =>
      arr.map((d, i) =>
        i === idx
          ? {
              ...d,
              complexity: d.complexity.includes(tag)
                ? d.complexity.filter((x) => x !== tag)
                : [...d.complexity, tag],
            }
          : d,
      ),
    );

  const addDependent = () => {
    setDependents((arr) => [...arr, makeDependent()]);
    setActiveIdx(dependents.length);
    setStep(3);
  };

  const removeDependent = (idx: number) => {
    setDependents((arr) => {
      const next = arr.filter((_, i) => i !== idx);
      return next.length ? next : [makeDependent()];
    });
    setActiveIdx((i) => Math.max(0, Math.min(i, dependents.length - 2)));
  };

  const active = dependents[activeIdx] ?? dependents[0];

  const saveAndGo = async (to: "/assistant" | "/dashboard") => {
    const profile: Profile = {
      caregiverName,
      caregiverEmail,
      reasons: picked,
      dependents,
    };
    try {
      localStorage.setItem("continuity.profile", JSON.stringify(profile));
      localStorage.setItem("continuity.onboarded", "true");
    } catch {
      // ignore storage errors
    }
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      navigate({ to });
      return;
    }
    navigate({ to: "/auth", search: { redirect: to } });
  };

  const firstLovedOneName = dependents[0]?.name || "";

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-border/60 bg-background/80 px-6 py-4 lg:px-8">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-md bg-primary">
              <Leaf className="size-3.5 text-primary-foreground" />
            </span>
            <span className="font-display text-base font-semibold tracking-tight">
              Continuity
            </span>
          </Link>
          <button
            onClick={() => saveAndGo("/dashboard")}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Skip for now
          </button>
        </div>
      </header>

      {/* Progress */}
      <div className="mx-auto max-w-3xl px-6 pt-8 lg:px-8">
        <div className="flex gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition ${
                i <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-6 py-12 lg:px-8 lg:py-16">
        {step === 0 && (
          <Panel illustration={<HearthIllustration className="h-full w-full" />}>
            <h1 className="text-balance font-display text-3xl font-medium leading-tight tracking-tight lg:text-4xl">
              You're the expert. We're the system of record.
            </h1>
            <p className="mt-5 text-pretty text-muted-foreground">
              You already carry the plan in your head. Continuity gives it a place
              to live — structured, shareable, and ready the moment someone else
              needs it.
            </p>
            <button
              onClick={next}
              className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-sage-700"
            >
              Let's set it up <ArrowRight className="size-4" />
            </button>
          </Panel>
        )}

        {step === 1 && (
          <Panel>
            <p className="font-display text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Step 1 · You
            </p>
            <h2 className="mt-3 font-display text-3xl font-medium tracking-tight lg:text-4xl">
              Who's building this plan?
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              First name is fine. Email locks in your place.
            </p>
            <div className="mt-7 space-y-4">
              <Field
                label="Your name"
                value={caregiverName}
                onChange={setCaregiverName}
                placeholder="e.g. Jordan"
                autoFocus
              />
              <Field
                label="Email"
                type="email"
                value={caregiverEmail}
                onChange={setCaregiverEmail}
                placeholder="you@example.com"
              />
            </div>
            <NavRow onBack={back} onNext={next} disabled={!caregiverName.trim()} />
          </Panel>
        )}

        {step === 2 && (
          <Panel>
            <h2 className="font-display text-3xl font-medium tracking-tight lg:text-4xl">
              What brought you here?
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Pick anything that hits. We'll prioritize the plan around it.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {reasons.map((r) => {
                const isActive = picked.includes(r);
                return (
                  <button
                    key={r}
                    onClick={() => togglePick(r)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      isActive
                        ? "border-sage-600/40 bg-sage-50 text-sage-700"
                        : "border-border bg-card text-muted-foreground hover:border-sage-600/20"
                    }`}
                  >
                    {isActive && <Check className="mr-1.5 inline size-3.5" />}
                    {r}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 rounded-2xl border border-border bg-muted/30 px-5 py-4">
              <p className="font-display text-sm font-medium">
                Before we go further — this is hard work, and you're doing it.
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Most people never sit down to write any of this out. You are. That's the
                whole job, and you're doing it. I'm proud of you.
              </p>
            </div>
            <NavRow onBack={back} onNext={next} disabled={picked.length === 0} />
          </Panel>
        )}

        {step === 3 && (
          <Panel>
            <div className="flex items-center justify-between">
              <p className="font-display text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Who are you planning for?
              </p>
              {dependents.length > 1 && (
                <span className="text-xs text-muted-foreground">
                  Loved one {activeIdx + 1} of {dependents.length}
                </span>
              )}
            </div>
            <h2 className="mt-3 font-display text-3xl font-medium tracking-tight lg:text-4xl">
              Tell us a little about {active.name ? active.name : "your loved one"}.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              This helps us shape the questions ahead. You can add more loved ones at any time.
            </p>

            {dependents.length > 1 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {dependents.map((d, i) => (
                  <button
                    key={d.id}
                    onClick={() => setActiveIdx(i)}
                    className={`group inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${
                      i === activeIdx
                        ? "border-sage-600/40 bg-sage-50 text-sage-700"
                        : "border-border bg-card text-muted-foreground hover:border-sage-600/20"
                    }`}
                  >
                    {d.name || `Loved one ${i + 1}`}
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeDependent(i);
                      }}
                      className="rounded-full p-0.5 hover:bg-muted"
                      aria-label="Remove"
                    >
                      <X className="size-3" />
                    </span>
                  </button>
                ))}
              </div>
            )}

            <div className="mt-7">
              <Field
                label="Their name or nickname"
                value={active.name}
                onChange={(v) => updateDependent(activeIdx, { name: v })}
                placeholder="e.g. Roggie"
              />
            </div>

            <p className="mt-7 font-display text-lg">
              {active.name ? active.name : "They"} {active.name ? "is" : "are"} my…
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {relationships.map((p) => {
                const isActive = active.persona === p;
                return (
                  <button
                    key={p}
                    onClick={() => updateDependent(activeIdx, { persona: p })}
                    className={`rounded-2xl border px-4 py-5 text-left text-sm transition ${
                      isActive
                        ? "border-sage-600/40 bg-sage-50 text-sage-700"
                        : "border-border bg-card hover:border-sage-600/20"
                    }`}
                  >
                    <span className="font-display text-base font-medium">{p}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={addDependent}
              className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-dashed border-border bg-card px-4 py-2 text-sm text-muted-foreground hover:border-sage-600/30 hover:text-foreground"
            >
              <Plus className="size-4" /> Add another loved one
            </button>

            <NavRow
              onBack={back}
              onNext={next}
              disabled={!active.persona || !active.name.trim()}
            />
          </Panel>
        )}

        {step === 4 && (
          <Panel>
            <div className="flex items-center justify-between">
              <p className="font-display text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Their everyday context
              </p>
              {dependents.length > 1 && (
                <span className="text-xs text-muted-foreground">
                  {active.name || `Loved one ${activeIdx + 1}`} · {activeIdx + 1} of {dependents.length}
                </span>
              )}
            </div>
            <h2 className="mt-3 font-display text-3xl font-medium tracking-tight lg:text-4xl">
              Where does {active.name || "your loved one"} live, and what kind of
              support do they rely on?
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              No detail is too small — and you can leave anything blank.
            </p>

            {dependents.length > 1 && (
              <div className="mt-6 flex flex-wrap gap-2">
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

            <div className="mt-7">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Living situation
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {livingOptions.map((opt) => {
                  const isActive = active.living === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => updateDependent(activeIdx, { living: opt })}
                      className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                        isActive
                          ? "border-sage-600/40 bg-sage-50 text-sage-700"
                          : "border-border bg-card hover:border-sage-600/20"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-7">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Areas of support (choose any)
              </p>
              <div className="flex flex-wrap gap-2">
                {complexityTags.map((tag) => {
                  const isActive = active.complexity.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleComplexityFor(activeIdx, tag)}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        isActive
                          ? "border-sage-600/40 bg-sage-50 text-sage-700"
                          : "border-border bg-card text-muted-foreground hover:border-sage-600/20"
                      }`}
                    >
                      {isActive && <Check className="mr-1.5 inline size-3.5" />}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {activeIdx < dependents.length - 1 ? (
              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={back}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="size-4" /> Back
                </button>
                <button
                  onClick={() => setActiveIdx(activeIdx + 1)}
                  disabled={!active.living}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-sage-700 disabled:opacity-50"
                >
                  Next loved one <ArrowRight className="size-4" />
                </button>
              </div>
            ) : (
              <NavRow onBack={back} onNext={next} disabled={!active.living} />
            )}
          </Panel>
        )}

        {step === 5 && (
          <Panel illustration={<PathIllustration className="h-full w-full" />}>
            <p className="font-display text-xs uppercase tracking-[0.18em] text-muted-foreground">
              How this works
            </p>
            <h2 className="mt-3 font-display text-3xl font-medium leading-tight tracking-tight lg:text-4xl">
              You drive. We organize.
            </h2>
            <ul className="mt-6 space-y-2 text-pretty text-lg leading-relaxed text-muted-foreground">
              <li>Skip anything that doesn't apply.</li>
              <li>Edit, expand, or rewrite any answer later.</li>
              <li className="text-foreground">Every section you finish becomes a real, shareable document.</li>
            </ul>
            <button
              onClick={next}
              className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-sage-700"
            >
              Continue <ArrowRight className="size-4" />
            </button>
            <button onClick={back} className="ml-3 text-sm text-muted-foreground hover:text-foreground">
              Back
            </button>
          </Panel>
        )}

        {step === 6 && (
          <Panel illustration={<HandsIllustration className="h-full w-full" />}>
            <div className="mb-4 flex items-center gap-2 text-sage-700">
              <Sparkle className="size-4 fill-sage-600/40" strokeWidth={1.5} />
              <span className="text-xs font-semibold uppercase tracking-widest">
                You're in
              </span>
            </div>
            <h2 className="font-display text-3xl font-medium leading-tight tracking-tight lg:text-4xl">
              {caregiverName ? `You're in, ${caregiverName}.` : "You're in."}
            </h2>
            <p className="mt-4 text-pretty text-muted-foreground">
              Next, the assistant turns what you know
              {firstLovedOneName ? ` about ${firstLovedOneName}${dependents.length > 1 ? " and the others" : ""}` : ""} into
              the first real pages of your plan — in your words, on your terms.
            </p>

            <div className="mt-6 rounded-2xl border border-border bg-surface-soft p-5 text-sm">
              <p className="mb-3 font-display text-xs uppercase tracking-[0.18em] text-muted-foreground">
                What we'll bring with us
              </p>
              <dl className="grid gap-2 sm:grid-cols-2">
                {caregiverName && <Summary label="You" value={caregiverName} />}
                {picked.length > 0 && (
                  <Summary label="Focus" value={picked.slice(0, 3).join(", ")} />
                )}
              </dl>
              <div className="mt-4 space-y-3">
                <p className="font-display text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Planning for ({dependents.length})
                </p>
                {dependents.map((d, i) => (
                  <div key={d.id} className="rounded-xl border border-border bg-card p-3">
                    <p className="font-medium">
                      {d.name || `Loved one ${i + 1}`}
                      {d.persona ? ` · your ${d.persona.toLowerCase()}` : ""}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {d.living || "Living situation not set"}
                      {d.complexity.length > 0 ? ` · ${d.complexity.slice(0, 3).join(", ")}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={() => saveAndGo("/assistant")}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-sage-700"
              >
                Begin first conversation <ArrowRight className="size-4" />
              </button>
              <button
                onClick={() => saveAndGo("/dashboard")}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium hover:bg-muted"
              >
                Go to dashboard
              </button>
            </div>
          </Panel>
        )}
      </main>
    </div>
  );
}

function Panel({
  children,
  illustration,
}: {
  children: React.ReactNode;
  illustration?: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card">
      {illustration && (
        <div className="aspect-[16/7] w-full overflow-hidden bg-surface-soft">
          {illustration}
        </div>
      )}
      <div className="p-8 lg:p-12">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  autoFocus,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: "text" | "numeric" | "email";
  autoFocus?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        autoFocus={autoFocus}
        className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-sage-600/40 focus:ring-2 focus:ring-sage-600/10"
      />
    </label>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-foreground">{value}</dd>
    </div>
  );
}

function NavRow({
  onBack,
  onNext,
  disabled,
}: {
  onBack: () => void;
  onNext: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="mt-10 flex items-center justify-between">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back
      </button>
      <button
        onClick={onNext}
        disabled={disabled}
        className="inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-sage-700 disabled:opacity-50"
      >
        Continue <ArrowRight className="size-4" />
      </button>
    </div>
  );
}
