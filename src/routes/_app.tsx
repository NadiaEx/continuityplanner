import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppSidebar, MobileTopBar } from "@/components/app-sidebar";
import { getRestoredSession } from "@/lib/auth-flow";

export const Route = createFileRoute("/_app")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const session = await getRestoredSession();
    if (!session) {
      throw redirect({
        to: "/auth",
        search: { redirect: location.pathname === "/" ? "/dashboard" : location.pathname },
      });
    }
    return { user: session.user };
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
