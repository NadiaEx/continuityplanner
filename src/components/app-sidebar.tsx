import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard,
  User,
  Sun,
  ShieldAlert,
  Stethoscope,
  Users,
  Compass,
  FolderLock,
  Sparkles,
  Download,
  Settings,
  Leaf,
  HeartHandshake,
  LineChart,
  FileText,
  LogOut,
} from "lucide-react";


const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/profile", label: "Child Profile", icon: User },
  { to: "/one-page", label: "One-Page About Them", icon: FileText },
  { to: "/routines", label: "Daily Routines", icon: Sun },
  { to: "/emergency", label: "Emergency Plan", icon: ShieldAlert },
  { to: "/medical", label: "Medical Information", icon: Stethoscope },
  { to: "/care-team", label: "Care Team", icon: Users },
  { to: "/future", label: "Future Planning", icon: Compass },
  { to: "/documents", label: "Documents", icon: FolderLock },
  { to: "/assistant", label: "AI Assistant", icon: Sparkles },
  { to: "/exports", label: "Exports", icon: Download },
  { to: "/insights", label: "Insights", icon: LineChart },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

void HeartHandshake;

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-border bg-sidebar p-5 lg:flex">
      <Link to="/" className="mb-6 flex items-center gap-2 px-2">
        <span className="grid size-7 place-items-center rounded-md bg-primary ring-1 ring-sage-700/10">
          <Leaf className="size-3.5 text-primary-foreground" />
        </span>
        <span className="font-display text-base font-semibold tracking-tight">
          Continuity
        </span>
      </Link>
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
        {nav.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-sidebar-accent text-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
              }`}
            >
              <Icon className="size-4 shrink-0" strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-6 rounded-xl bg-sage-100 p-4 ring-1 ring-black/5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-sage-700">
          Your plan
        </p>
        <p className="mt-2 font-display text-base font-medium text-foreground">
          Just getting started
        </p>
        <p className="mt-2 text-xs leading-relaxed text-sage-700/80">
          Add what you can, when you can. Every note makes the plan stronger.
        </p>
      </div>
    </aside>
  );
}

export function MobileTopBar() {
  return (
    <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/90 px-5 py-3 backdrop-blur lg:hidden">
      <Link to="/" className="flex items-center gap-2">
        <span className="grid size-6 place-items-center rounded bg-primary">
          <Leaf className="size-3 text-primary-foreground" />
        </span>
        <span className="font-display text-sm font-semibold">Continuity</span>
      </Link>
      <Link to="/assistant" className="text-xs font-medium text-primary">
        AI Assistant →
      </Link>
    </div>
  );
}
