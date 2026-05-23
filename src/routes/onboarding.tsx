import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ArrowLeft, Leaf, Check, Sparkle } from "lucide-react";
import { HearthIllustration, PathIllustration, HandsIllustration } from "@/components/soft-illustration";
import { FoundingBadge } from "@/components/founding-badge";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Begin gently — Continuity" },
      {
        name: "description",
        content: "A gentle onboarding into Continuity, your pay-what-you-can future care planning companion.",
      },
    ],
  }),
  component: Onboarding,
});

const reasons = [
  "Emergency preparedness",
  "Future planning",
  "Organizing medical information",
  "Caregiver support",
  "Hospitalization concerns",
  "Long-term continuity",
  "Just getting started",
];

const personas = ["Child", "Teen", "Adult dependent", "Aging loved one", "Other"];

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

type Profile = {
  caregiverName: string;
  caregiverEmail: string;
  reasons: string[];
  persona: string | null;
  lovedOneName: string;
  lovedOneAge: string;
  living: string | null;
  complexity: string[];
};

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const [caregiverName, setCaregiverName] = useState("");
  const [caregiverEmail, setCaregiverEmail] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [persona, setPersona] = useState<string | null>(null);
  const [lovedOneName, setLovedOneName] = useState("");
  const [lovedOneAge, setLovedOneAge] = useState("");
  const [living, setLiving] = useState<string | null>(null);
  const [complexity, setComplexity] = useState<string[]>([]);

  const total = 7;
  const next = () => setStep((s) => Math.min(total - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const togglePick = (r: string) =>
    setPicked((p) => (p.includes(r) ? p.filter((x) => x !== r) : [...p, r]));
  const toggleComplexity = (r: string) =>
    setComplexity((p) => (p.includes(r) ? p.filter((x) => x !== r) : [...p, r]));

  const saveAndGo = (to: "/assistant" | "/dashboard") => {
    const profile: Profile = {
      caregiverName,
      caregiverEmail,
      reasons: picked,
      persona,
      lovedOneName,
      lovedOneAge,
      living,
      complexity,
    };
    try {
      localStorage.setItem("continuity.profile", JSON.stringify(profile));
      localStorage.setItem("continuity.onboarded", "true");
    } catch {
      // ignore storage errors
    }
    navigate({ to });
  };

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
              You do not have to organize everything today.
            </h1>
            <p className="mt-5 text-pretty text-muted-foreground">
              Continuity helps you build a future care plan one small step at a
              time. There's no rush, and nothing to prove.
            </p>
            <button
              onClick={next}
              className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-sage-700"
            >
              Begin gently <ArrowRight className="size-4" />
            </button>
          </Panel>
        )}

        {step === 1 && (
          <Panel>
            <p className="font-display text-xs uppercase tracking-[0.18em] text-muted-foreground">
              First, a soft hello
            </p>
            <h2 className="mt-3 font-display text-3xl font-medium tracking-tight lg:text-4xl">
              What should we call you?
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Just a first name is plenty. Your email helps us save your place.
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
            <p className="font-display text-xs uppercase tracking-[0.18em] text-muted-foreground">
              A gentle question
            </p>
            <h2 className="mt-3 font-display text-3xl font-medium tracking-tight lg:text-4xl">
              What brought you here today?
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Pick anything that feels true. You can choose more than one.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {reasons.map((r) => {
                const active = picked.includes(r);
                return (
                  <button
                    key={r}
                    onClick={() => togglePick(r)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      active
                        ? "border-sage-600/40 bg-sage-50 text-sage-700"
                        : "border-border bg-card text-muted-foreground hover:border-sage-600/20"
                    }`}
                  >
                    {active && <Check className="mr-1.5 inline size-3.5" />}
                    {r}
                  </button>
                );
              })}
            </div>
            <NavRow onBack={back} onNext={next} disabled={picked.length === 0} />
          </Panel>
        )}

        {step === 3 && (
          <Panel>
            <p className="font-display text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Who are you planning for?
            </p>
            <h2 className="mt-3 font-display text-3xl font-medium tracking-tight lg:text-4xl">
              Tell us a little about your loved one.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              This helps us shape the questions ahead.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {personas.map((p) => {
                const active = persona === p;
                return (
                  <button
                    key={p}
                    onClick={() => setPersona(p)}
                    className={`rounded-2xl border px-4 py-5 text-left text-sm transition ${
                      active
                        ? "border-sage-600/40 bg-sage-50 text-sage-700"
                        : "border-border bg-card hover:border-sage-600/20"
                    }`}
                  >
                    <span className="font-display text-base font-medium">{p}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field
                label="Their name or nickname"
                value={lovedOneName}
                onChange={setLovedOneName}
                placeholder="e.g. Sam"
              />
              <Field
                label="Their age"
                value={lovedOneAge}
                onChange={setLovedOneAge}
                placeholder="e.g. 14"
                inputMode="numeric"
              />
            </div>
            <NavRow onBack={back} onNext={next} disabled={!persona || !lovedOneName.trim()} />
          </Panel>
        )}

        {step === 4 && (
          <Panel>
            <p className="font-display text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Their everyday context
            </p>
            <h2 className="mt-3 font-display text-3xl font-medium tracking-tight lg:text-4xl">
              Where does {lovedOneName || "your loved one"} live, and what kind of
              support do they rely on?
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              No detail is too small — and you can leave anything blank.
            </p>

            <div className="mt-7">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Living situation
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {livingOptions.map((opt) => {
                  const active = living === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setLiving(opt)}
                      className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                        active
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
                  const active = complexity.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleComplexity(tag)}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        active
                          ? "border-sage-600/40 bg-sage-50 text-sage-700"
                          : "border-border bg-card text-muted-foreground hover:border-sage-600/20"
                      }`}
                    >
                      {active && <Check className="mr-1.5 inline size-3.5" />}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <NavRow onBack={back} onNext={next} disabled={!living} />
          </Panel>
        )}

        {step === 5 && (
          <Panel illustration={<PathIllustration className="h-full w-full" />}>
            <p className="font-display text-xs uppercase tracking-[0.18em] text-muted-foreground">
              A note before we begin
            </p>
            <h2 className="mt-3 font-display text-3xl font-medium leading-tight tracking-tight lg:text-4xl">
              You can stop anytime.
            </h2>
            <ul className="mt-6 space-y-2 text-pretty text-lg leading-relaxed text-muted-foreground">
              <li>You can skip questions.</li>
              <li>You can come back later.</li>
              <li className="text-foreground">Small steps still matter.</li>
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
              <FoundingBadge size="md" />
            </div>
            <h2 className="font-display text-3xl font-medium leading-tight tracking-tight lg:text-4xl">
              {caregiverName ? `Welcome, ${caregiverName}.` : "Welcome to the pilot."}
            </h2>
            <p className="mt-4 text-pretty text-muted-foreground">
              Your founding family status is reserved. Next, our gentle assistant
              will help you turn what you've shared
              {lovedOneName ? ` about ${lovedOneName}` : ""} into the first pages
              of your plan — one quiet question at a time.
            </p>

            <div className="mt-6 rounded-2xl border border-border bg-surface-soft p-5 text-sm">
              <p className="mb-3 font-display text-xs uppercase tracking-[0.18em] text-muted-foreground">
                What we'll bring with us
              </p>
              <dl className="grid gap-2 sm:grid-cols-2">
                {caregiverName && <Summary label="You" value={caregiverName} />}
                {lovedOneName && (
                  <Summary
                    label="Planning for"
                    value={`${lovedOneName}${lovedOneAge ? `, ${lovedOneAge}` : ""}${persona ? ` · ${persona}` : ""}`}
                  />
                )}
                {living && <Summary label="Living" value={living} />}
                {picked.length > 0 && (
                  <Summary label="Focus" value={picked.slice(0, 3).join(", ")} />
                )}
                {complexity.length > 0 && (
                  <Summary label="Support" value={complexity.slice(0, 3).join(", ")} />
                )}
              </dl>
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
