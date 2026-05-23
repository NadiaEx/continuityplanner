import { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="font-display text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-foreground lg:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 text-pretty text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10 lg:px-10 lg:py-14">
      {children}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-border bg-card p-6 transition ${className}`}
    >
      {children}
    </div>
  );
}

export function Chip({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "sage" | "mist" | "warn";
}) {
  const tones = {
    neutral: "bg-muted text-muted-foreground",
    sage: "bg-sage-50 text-sage-700",
    mist: "bg-mist-50 text-mist-600",
    warn: "bg-amber-50 text-amber-700",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
}) {
  const styles = {
    primary:
      "bg-primary text-primary-foreground ring-2 ring-sage-600/15 hover:bg-sage-700",
    secondary: "border border-border bg-card text-foreground hover:bg-muted",
    ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
