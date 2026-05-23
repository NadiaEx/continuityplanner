import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppSidebar, MobileTopBar } from "@/components/app-sidebar";

export const Route = createFileRoute("/_app")({
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
