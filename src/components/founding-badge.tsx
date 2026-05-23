import { Sparkle } from "lucide-react";

export function FoundingBadge({
  size = "sm",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "text-[10px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
    lg: "text-sm px-3.5 py-1.5 gap-2",
  };
  const icon = { sm: "size-2.5", md: "size-3", lg: "size-3.5" }[size];
  return (
    <span
      className={`inline-flex items-center rounded-full bg-gradient-to-r from-sage-100 to-mist-100 font-medium uppercase tracking-[0.14em] text-sage-700 ring-1 ring-sage-600/15 ${sizes[size]} ${className}`}
    >
      <Sparkle className={`${icon} fill-sage-600/40 text-sage-700`} strokeWidth={1.5} />
      Founding Family
    </span>
  );
}
