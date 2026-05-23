import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader, Card, Button } from "@/components/page-shell";
import { Bell, Shield, Users, Palette } from "lucide-react";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — Continuity" }] }),
  component: Settings,
});

export default function Settings() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Settings"
        title="Your preferences."
        description="Small adjustments so Continuity feels right for you."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-lg bg-sage-50 text-sage-700">
              <Bell className="size-4" />
            </div>
            <h3 className="font-display text-lg font-semibold">Reminders</h3>
          </div>
          <ToggleRow label="Gentle weekly check-ins" defaultOn />
          <ToggleRow label="Email me when a section is updated" defaultOn />
          <ToggleRow label="Send packet review reminders" />
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-lg bg-mist-50 text-mist-600">
              <Shield className="size-4" />
            </div>
            <h3 className="font-display text-lg font-semibold">Privacy &amp; security</h3>
          </div>
          <ToggleRow label="Require passcode on every visit" defaultOn />
          <ToggleRow label="Two-factor authentication" />
          <ToggleRow label="Allow QR emergency access" defaultOn />
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-lg bg-sage-50 text-sage-700">
              <Users className="size-4" />
            </div>
            <h3 className="font-display text-lg font-semibold">Shared access</h3>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            Invite a co-parent, guardian, or caregiver. You control exactly what they can see.
          </p>
          <Button>Invite a collaborator</Button>
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-lg bg-mist-50 text-mist-600">
              <Palette className="size-4" />
            </div>
            <h3 className="font-display text-lg font-semibold">Appearance</h3>
          </div>
          <ToggleRow label="Reduce motion" />
          <ToggleRow label="Larger text" />
          <ToggleRow label="High contrast" />
        </Card>
      </div>
    </PageShell>
  );
}

function ToggleRow({ label, defaultOn = false }: { label: string; defaultOn?: boolean }) {
  return (
    <label className="flex cursor-pointer items-center justify-between border-t border-border py-3 first:border-t-0 first:pt-0">
      <span className="text-sm">{label}</span>
      <input type="checkbox" defaultChecked={defaultOn} className="peer sr-only" />
      <span className="relative inline-block h-5 w-9 rounded-full bg-muted transition peer-checked:bg-primary">
        <span className="absolute left-0.5 top-0.5 size-4 rounded-full bg-card shadow transition peer-checked:translate-x-4" />
      </span>
    </label>
  );
}
