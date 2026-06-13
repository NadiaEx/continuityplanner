import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppSidebar, MobileTopBar } from "@/components/app-sidebar";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_app")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/auth" });
    }
    return { user: data.user };
  },
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="flex min-h-dvh w-full bg-background text-foreground">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopBar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
