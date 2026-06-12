import { useEffect, useState } from "react";
import { X, Check, Leaf } from "lucide-react";

const concerns = [
  "Emergency preparedness",
  "Future planning",
  "Organizing medical information",
  "Caregiver continuity",
  "Hospitalization concerns",
  "Just getting started",
];

const careFor = ["Child", "Teen", "Adult dependent", "Aging loved one", "Other"];

export function WaitlistModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm sm:items-center">
      <div className="relative max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-card p-7 shadow-xl sm:rounded-3xl">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-muted"
        >
          <X className="size-4" />
        </button>

        {submitted ? (
          <div className="py-10 text-center">
            <div className="mx-auto mb-5 grid size-12 place-items-center rounded-full bg-sage-50 text-sage-700">
              <Check className="size-5" />
            </div>
            <h3 className="font-display text-2xl font-medium tracking-tight">
              You're in.
            </h3>
            <p className="mx-auto mt-3 max-w-sm text-pretty text-sm text-muted-foreground">
              We'll be in touch soon. Thank you for helping us build this
              with care.
            </p>
            <button
              onClick={onClose}
              className="mt-7 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-sage-700"
            >
              Close
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <div className="mb-6 flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-md bg-primary">
                <Leaf className="size-3.5 text-primary-foreground" />
              </span>
              <p className="font-display text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Get early access
              </p>
            </div>
            <h3 className="font-display text-2xl font-medium tracking-tight">
              Join us in shaping Continuity.
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              We read every response personally. There's no script — share only
              what feels right.
            </p>

            <div className="mt-6 space-y-4">
              <Field label="Your name">
                <input
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-sage-600/40 focus:outline-none"
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-sage-600/40 focus:outline-none"
                />
              </Field>

              <Field label="Who are you caring for?">
                <div className="flex flex-wrap gap-2">
                  {careFor.map((c) => (
                    <label
                      key={c}
                      className="cursor-pointer rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition has-[:checked]:border-sage-600/40 has-[:checked]:bg-sage-50 has-[:checked]:text-sage-700"
                    >
                      <input type="radio" name="careFor" className="sr-only" />
                      {c}
                    </label>
                  ))}
                </div>
              </Field>

              <Field label="Your biggest planning concern (optional)">
                <select
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-sage-600/40 focus:outline-none"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Choose what feels closest…
                  </option>
                  {concerns.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-surface-soft p-4 text-sm">
                <input type="checkbox" className="mt-0.5 accent-sage-600" />
                <span className="text-muted-foreground">
                  I'd be open to <span className="text-foreground">beta testing new tools</span> as they're built.
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-surface-soft p-4 text-sm">
                <input type="checkbox" className="mt-0.5 accent-sage-600" />
                <span className="text-muted-foreground">
                  I'd consider sharing my family's story to help others (optional, never public without consent).
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="mt-7 w-full rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:bg-sage-700"
            >
              Request access
            </button>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              We'll never share your information. You can leave anytime.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  );
}
