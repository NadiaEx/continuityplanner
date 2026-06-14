import { useProfile } from "@/lib/use-profile";

export function DependentTabs({ className = "" }: { className?: string }) {
  const { dependents, activeIdx, setActiveIdx } = useProfile();
  if (dependents.length <= 1) return null;
  return (
    <div className={`mb-6 flex flex-wrap gap-2 ${className}`}>
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
  );
}
