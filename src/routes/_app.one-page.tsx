// One-Page About Them — living document
//
// This is the primary document for Continuity. It exists from day one,
// gets filled progressively via the assistant or direct editing (madlibs),
// and becomes exportable at 85% completion.
//
// Drop this file at: src/routes/_app.one-page.tsx

import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { PageShell, PageHeader, Card, Button } from "@/components/page-shell";
import { DependentTabs } from "@/components/dependent-tabs";
import { useProfile } from "@/lib/use-profile";
import {
  Plus,
  Pencil,
  Check,
  X,
  Download,
  Copy,
  Sparkles,
  ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/_app/one-page")({
  head: () => ({ meta: [{ title: "One-Page About Them — Continuity" }] }),
  component: OnePageDocument,
});

// ── Types ──────────────────────────────────────────────────────────────────

type SlotValue = string;

type Slot = {
  id: string;
  label: string;
  placeholder: string;
  hint?: string;
  value: SlotValue;
  source?: "assistant" | "manual";
};

type Section = {
  id: string;
  title: string;
  description: string;
  slots: Slot[];
  extras: Array<{ id: string; label: string; value: string }>;
};

// ── Template definition ────────────────────────────────────────────────────
// These are the fixed slots every One-Page About Them needs.
// The assistant fills these in automatically; the caregiver can also
// click any blank to fill it directly (madlibs).

const makeTemplate = (): Section[] => [
  {
    id: "who",
    title: "Who they are",
    description: "The first things anyone caring for them should know.",
    extras: [],
    slots: [
      {
        id: "name",
        label: "Full name",
        placeholder: "What do they like to be called?",
        value: "",
      },
      {
        id: "age",
        label: "Age & birthday",
        placeholder: "e.g. 8 years old, born March 4",
        value: "",
      },
      {
        id: "diagnosis",
        label: "Diagnosis / condition",
        placeholder: "e.g. Autism, ADHD, Down syndrome",
        hint: "Only include what's relevant for caregivers to know",
        value: "",
      },
      {
        id: "personality",
        label: "Who they really are",
        placeholder: "The thing you'd want every caregiver to know about their personality",
        value: "",
      },
    ],
  },
  {
    id: "communication",
    title: "How they communicate",
    description: "How they express needs, and how to talk with them.",
    extras: [],
    slots: [
      {
        id: "comm_style",
        label: "How they communicate",
        placeholder: "e.g. Verbal, AAC device, signs, gestures, pictures",
        value: "",
      },
      {
        id: "hunger_pain",
        label: "How they show hunger or pain",
        placeholder: "The signs you've learned to recognize",
        value: "",
      },
      {
        id: "upset",
        label: "How they show they're upset",
        placeholder: "What does distress look like for them?",
        value: "",
      },
      {
        id: "talk_to",
        label: "How to talk to them",
        placeholder: "What works — short sentences, visual cues, a certain tone",
        value: "",
      },
    ],
  },
  {
    id: "comfort",
    title: "Comfort & sensory",
    description: "What soothes them, and what overwhelms them.",
    extras: [],
    slots: [
      {
        id: "soothes",
        label: "What soothes them",
        placeholder: "Objects, sounds, routines, or people that help them feel safe",
        value: "",
      },
      {
        id: "overwhelms",
        label: "What overwhelms them",
        placeholder: "Sounds, lights, textures, or situations to avoid",
        value: "",
      },
      {
        id: "dysregulated",
        label: "When they're dysregulated",
        placeholder: "What helps them come back to calm",
        value: "",
      },
    ],
  },
  {
    id: "never",
    title: "Never do this",
    description: "Things that could cause harm, distress, or a crisis.",
    extras: [],
    slots: [
      {
        id: "never_say",
        label: "Never say",
        placeholder: "Words, phrases, or tones that cause distress",
        value: "",
      },
      {
        id: "never_do",
        label: "Never do",
        placeholder: "Actions, touches, or situations to avoid completely",
        value: "",
      },
      {
        id: "never_give",
        label: "Never give",
        placeholder: "Foods, medications, or items that are unsafe",
        value: "",
      },
    ],
  },
  {
    id: "emergency",
    title: "In an emergency",
    description: "Who to call and what to do.",
    extras: [],
    slots: [
      {
        id: "primary_contact",
        label: "Primary contact",
        placeholder: "Name, relationship, phone number",
        value: "",
      },
      {
        id: "secondary_contact",
        label: "Secondary contact",
        placeholder: "Name, relationship, phone number",
        value: "",
      },
      {
        id: "doctor",
        label: "Doctor / provider",
        placeholder: "Name and phone number",
        value: "",
      },
      {
        id: "crisis",
        label: "In a crisis, do this",
        placeholder: "Step-by-step: what helps, what to avoid, when to call 911",
        value: "",
      },
    ],
  },
];

// ── Completion logic ───────────────────────────────────────────────────────

function getCompletion(sections: Section[]): number {
  const allSlots = sections.flatMap((s) => s.slots);
  const filled = allSlots.filter((s) => s.value.trim()).length;
  return Math.round((filled / allSlots.length) * 100);
}

function getSlotCount(sections: Section[]) {
  const allSlots = sections.flatMap((s) => s.slots);
  return {
    total: allSlots.length,
    filled: allSlots.filter((s) => s.value.trim()).length,
  };
}

// ── Main component ─────────────────────────────────────────────────────────

export default function OnePageDocument() {
  const { activeDependent } = useProfile();
  const key = activeDependent?.id ?? "__none";
  const [byDep, setByDep] = useState<Record<string, Section[]>>({});
  const sections = byDep[key] ?? makeTemplate();
  const setSections = useCallback(
    (updater: Section[] | ((prev: Section[]) => Section[])) => {
      setByDep((prev) => {
        const current = prev[key] ?? makeTemplate();
        const next =
          typeof updater === "function"
            ? (updater as (p: Section[]) => Section[])(current)
            : updater;
        return { ...prev, [key]: next };
      });
    },
    [key],
  );
  const [editingSlot, setEditingSlot] = useState<string | null>(null);
  const [draftValue, setDraftValue] = useState("");
  const [copied, setCopied] = useState(false);

  const completion = getCompletion(sections);
  const { total, filled } = getSlotCount(sections);
  const canExport = completion >= 85;

  const startEdit = (sectionId: string, slotId: string, current: string) => {
    setEditingSlot(`${sectionId}:${slotId}`);
    setDraftValue(current);
  };

  const commitEdit = (sectionId: string, slotId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              slots: s.slots.map((sl) =>
                sl.id === slotId
                  ? { ...sl, value: draftValue, source: "manual" }
                  : sl,
              ),
            }
          : s,
      ),
    );
    setEditingSlot(null);
  };

  const cancelEdit = () => setEditingSlot(null);

  const addExtra = (sectionId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              extras: [
                ...s.extras,
                { id: crypto.randomUUID(), label: "", value: "" },
              ],
            }
          : s,
      ),
    );
  };

  const updateExtra = (
    sectionId: string,
    extraId: string,
    field: "label" | "value",
    val: string,
  ) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              extras: s.extras.map((e) =>
                e.id === extraId ? { ...e, [field]: val } : e,
              ),
            }
          : s,
      ),
    );
  };

  const removeExtra = (sectionId: string, extraId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, extras: s.extras.filter((e) => e.id !== extraId) }
          : s,
      ),
    );
  };

  const copyToClipboard = useCallback(() => {
    const lines: string[] = ["ONE-PAGE ABOUT THEM\n"];
    for (const section of sections) {
      lines.push(`\n${section.title.toUpperCase()}`);
      for (const slot of section.slots) {
        if (slot.value.trim()) {
          lines.push(`${slot.label}: ${slot.value}`);
        }
      }
      for (const extra of section.extras) {
        if (extra.label.trim() && extra.value.trim()) {
          lines.push(`${extra.label}: ${extra.value}`);
        }
      }
    }
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [sections]);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Living document"
        title="One-Page About Them"
        description="Fill in any section directly, or let the assistant fill it in as you talk. This is the document you'd hand to a new caregiver, babysitter, or ER nurse."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={copyToClipboard}
              disabled={filled === 0}
            >
              <Copy className="size-4" />
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button
              variant={canExport ? "primary" : "secondary"}
              disabled={!canExport}
              title={
                canExport
                  ? "Download as PDF"
                  : `Fill in ${85 - completion}% more to export`
              }
            >
              <Download className="size-4" />
              {canExport ? "Download PDF" : `${completion}% complete`}
            </Button>
          </div>
        }
      />

      {/* Progress bar */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {filled} of {total} fields filled
          </span>
          <span className={completion >= 85 ? "text-sage-700 font-medium" : ""}>
            {completion >= 85
              ? "Ready to export ✓"
              : `${85 - completion}% more to unlock export`}
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              completion >= 85 ? "bg-sage-600" : "bg-primary"
            }`}
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      {/* Assistant prompt if mostly empty */}
      {completion < 20 && (
        <Card className="mb-6 flex items-center justify-between gap-4 bg-sage-50 border-sage-600/20">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground shrink-0">
              <Sparkles className="size-4" />
            </div>
            <div>
              <p className="text-sm font-medium">
                Let the assistant fill this in for you
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Talk naturally about your loved one — Continuity will quietly drop
                everything into the right fields.
              </p>
            </div>
          </div>
          <a
            href="/assistant"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-sage-700"
          >
            Start talking <ChevronRight className="size-4" />
          </a>
        </Card>
      )}

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section) => {
          const sectionFilled = section.slots.filter((s) => s.value.trim()).length;
          const sectionTotal = section.slots.length;

          return (
            <Card key={section.id} className="p-0 overflow-hidden">
              {/* Section header */}
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <div>
                  <h2 className="font-display text-base font-medium">
                    {section.title}
                  </h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {section.description}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 ml-4">
                  {sectionFilled}/{sectionTotal}
                </span>
              </div>

              {/* Slots */}
              <div className="divide-y divide-border">
                {section.slots.map((slot) => {
                  const key = `${section.id}:${slot.id}`;
                  const isEditing = editingSlot === key;
                  const isEmpty = !slot.value.trim();

                  return (
                    <div key={slot.id} className="px-6 py-4 group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                            {slot.label}
                            {slot.source === "assistant" && (
                              <span className="ml-2 normal-case tracking-normal font-normal text-sage-600">
                                · from assistant
                              </span>
                            )}
                          </p>

                          {isEditing ? (
                            <div className="space-y-2">
                              <textarea
                                autoFocus
                                value={draftValue}
                                onChange={(e) => setDraftValue(e.target.value)}
                                placeholder={slot.placeholder}
                                rows={3}
                                className="w-full resize-y rounded-xl border border-sage-600/40 bg-sage-50 px-4 py-3 text-sm leading-relaxed outline-none ring-2 ring-sage-600/10 placeholder:text-muted-foreground/50"
                              />
                              {slot.hint && (
                                <p className="text-xs text-muted-foreground">
                                  {slot.hint}
                                </p>
                              )}
                              <div className="flex gap-2">
                                <button
                                  onClick={() => commitEdit(section.id, slot.id)}
                                  className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition hover:bg-sage-700"
                                >
                                  <Check className="size-3" /> Save
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground"
                                >
                                  <X className="size-3" /> Cancel
                                </button>
                              </div>
                            </div>
                          ) : isEmpty ? (
                            <button
                              onClick={() =>
                                startEdit(section.id, slot.id, slot.value)
                              }
                              className="flex items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2.5 text-sm text-muted-foreground/60 transition hover:border-sage-600/40 hover:text-muted-foreground w-full text-left"
                            >
                              <Plus className="size-3.5 shrink-0" />
                              {slot.placeholder}
                            </button>
                          ) : (
                            <div className="flex items-start gap-2">
                              <p className="flex-1 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                                {slot.value}
                              </p>
                              <button
                                onClick={() =>
                                  startEdit(section.id, slot.id, slot.value)
                                }
                                className="shrink-0 rounded-lg p-1.5 text-muted-foreground opacity-0 transition hover:bg-muted hover:text-foreground group-hover:opacity-100"
                                aria-label="Edit"
                              >
                                <Pencil className="size-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Extras */}
                {section.extras.map((extra) => (
                  <div key={extra.id} className="px-6 py-4 group">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={extra.label}
                          onChange={(e) =>
                            updateExtra(
                              section.id,
                              extra.id,
                              "label",
                              e.target.value,
                            )
                          }
                          placeholder="Label (e.g. 'His favourite toy')"
                          className="w-full rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground outline-none transition placeholder:normal-case placeholder:tracking-normal placeholder:font-normal focus:border-sage-600/40"
                        />
                        <textarea
                          value={extra.value}
                          onChange={(e) =>
                            updateExtra(
                              section.id,
                              extra.id,
                              "value",
                              e.target.value,
                            )
                          }
                          placeholder="What should a caregiver know?"
                          rows={2}
                          className="w-full resize-y rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground/50 focus:border-sage-600/40"
                        />
                      </div>
                      <button
                        onClick={() => removeExtra(section.id, extra.id)}
                        className="mt-1 shrink-0 rounded-lg p-1.5 text-muted-foreground opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                        aria-label="Remove"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add custom field */}
                <div className="px-6 py-3">
                  <button
                    onClick={() => addExtra(section.id)}
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-sage-700"
                  >
                    <Plus className="size-3.5" />
                    Add something only you know
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Bottom export nudge */}
      {canExport && (
        <Card className="mt-6 bg-sage-50 border-sage-600/20 flex items-center justify-between gap-4">
          <div>
            <p className="font-medium text-sm">This document is ready.</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Download it as a PDF to share with caregivers, teachers, or first
              responders.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="secondary" onClick={copyToClipboard}>
              <Copy className="size-4" />
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button variant="primary">
              <Download className="size-4" /> Download PDF
            </Button>
          </div>
        </Card>
      )}
    </PageShell>
  );
}
