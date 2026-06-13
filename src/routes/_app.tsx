import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppSidebar, MobileTopBar } from "@/components/app-sidebar";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_app")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({
        to: "/auth",
        search: { redirect: location.pathname },
      });
    }
    return { user: data.session.user };
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
