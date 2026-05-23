import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { PageShell, PageHeader, Card, Chip, Button } from "@/components/page-shell";
import { Mic, Send, Sparkles, Save, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_app/assistant")({
  head: () => ({ meta: [{ title: "AI Assistant — Continuity" }] }),
  component: Assistant,
});

type Msg = { id: number; role: "ai" | "me"; text: string };

const seed: Msg[] = [
  {
    id: 1,
    role: "ai",
    text: "Hi Maya — whenever you're ready, let's gently document Leo's bedtime routine. What helps him wind down at night?",
  },
  {
    id: 2,
    role: "me",
    text: "He needs music playing and his blue blanket — otherwise he gets very upset.",
  },
  {
    id: 3,
    role: "ai",
    text: "Thank you for sharing. I've added \"Calming music\" and \"Blue blanket\" to his Comfort Supports and Bedtime Routine. Are there any sounds, lights, or activities that make bedtime harder?",
  },
];

const suggestions = [
  "Bright overhead lights upset him",
  "Loud TV in the next room",
  "Routine changes make it harder",
];

const sectionTopics = [
  { label: "Morning routine", topic: "morning" },
  { label: "Comfort supports", topic: "comfort" },
  { label: "Emergency contacts", topic: "emergency" },
  { label: "Things caregivers should never do", topic: "boundaries" },
];

export default function Assistant() {
  const [messages, setMessages] = useState<Msg[]>(seed);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const me: Msg = { id: Date.now(), role: "me", text };
    const reply: Msg = {
      id: Date.now() + 1,
      role: "ai",
      text: "Thank you — I've added that note. Would you like to tell me more, or move on to the next section?",
    };
    setMessages((m) => [...m, me, reply]);
    setInput("");
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="AI Assistant"
        title="A quiet conversation."
        description="Talk naturally. I'll quietly file everything into the right sections — and you can stop anytime."
        actions={
          <>
            <Button variant="secondary">
              <Save className="size-4" /> Save for later
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        <Card className="flex h-[640px] flex-col overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="grid size-8 place-items-center rounded-full bg-primary">
                <Sparkles className="size-3.5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Continuity Assistant</p>
                <p className="text-[11px] text-muted-foreground">
                  Currently documenting · Bedtime routine
                </p>
              </div>
            </div>
            <Chip tone="sage">Autosaved</Chip>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto p-6">
            {messages.map((m) => (
              <Bubble key={m.id} role={m.role}>
                {m.text}
              </Bubble>
            ))}
            <div className="flex flex-wrap gap-2 pl-11">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary/30 hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-border bg-surface-soft p-3"
          >
            <button
              type="button"
              className="grid size-10 place-items-center rounded-full text-muted-foreground hover:bg-muted"
              aria-label="Voice input"
            >
              <Mic className="size-4" />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Speak or type your response…"
              className="flex-1 rounded-full border border-border bg-card px-4 py-2.5 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
            />
            <button
              type="submit"
              className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground transition hover:bg-sage-700"
              aria-label="Send"
            >
              <Send className="size-4" />
            </button>
          </form>
        </Card>

        <div className="space-y-4">
          <Card>
            <h4 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Jump to topic
            </h4>
            <ul className="mt-3 space-y-1">
              {sectionTopics.map((s) => (
                <li key={s.topic}>
                  <button
                    onClick={() =>
                      send(
                        `Let's talk about ${s.label.toLowerCase()}.`,
                      )
                    }
                    className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm transition hover:bg-muted"
                  >
                    {s.label}
                    <ArrowRight className="size-3.5 text-muted-foreground" />
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="bg-sage-50">
            <p className="text-xs font-semibold uppercase tracking-widest text-sage-700">
              Today's summary
            </p>
            <ul className="mt-3 space-y-2 text-sm text-foreground">
              <li>• Added 2 comfort supports</li>
              <li>• Updated bedtime routine</li>
              <li>• Noted sensory triggers</li>
            </ul>
          </Card>

          <Card>
            <p className="text-sm text-muted-foreground">
              "You can update this anytime. Small steps matter."
            </p>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}

function Bubble({ role, children }: { role: "ai" | "me"; children: React.ReactNode }) {
  const isMe = role === "me";
  return (
    <div className={`flex max-w-[85%] gap-3 ${isMe ? "ml-auto flex-row-reverse" : ""}`}>
      <div
        className={`grid size-8 shrink-0 place-items-center rounded-full text-[10px] font-semibold ${
          isMe ? "bg-mist-600 text-white" : "bg-sage-100 text-sage-700"
        }`}
      >
        {isMe ? "ME" : "AI"}
      </div>
      <div
        className={`rounded-2xl p-4 text-sm leading-relaxed ${
          isMe
            ? "rounded-tr-none bg-mist-600 text-white"
            : "rounded-tl-none bg-muted text-foreground"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
