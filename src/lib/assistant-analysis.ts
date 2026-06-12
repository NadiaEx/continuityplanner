// Assistant analysis layer.
//
// This module takes the open-ended "tell me about ___" dump from the
// caregiver and returns a structured Plan: themes detected in what they
// shared + a tailored set of follow-up questions to ask in the wizard.
//
// Today this is a deterministic local stub (keyword-based) so the whole
// flow can be built and explored without any backend. To swap in Lovable
// AI, replace the body of `analyzeDump()` with a server function that
// calls Gemini with a structured-output schema returning the same `Plan`
// shape — every caller imports from this file, so it's a one-file change.

export type PlanSection = {
  id: string;
  title: string;
  description: string;
  questions: string[];
  /** Snippets from the dump that triggered this section, for context. */
  evidence: string[];
};

export type Plan = {
  summary: string;
  sections: PlanSection[];
  /** Areas the caregiver didn't mention that we should gently surface. */
  gaps: string[];
};

export type AnalyzeInput = {
  lovedOneName: string;
  persona?: string | null;
  dump: string;
};

// Keyword library used by the stub. Each entry maps to a plan section
// with tailored follow-up questions.
const THEMES: Array<{
  id: string;
  title: string;
  description: string;
  keywords: RegExp;
  questions: (name: string) => string[];
}> = [
  {
    id: "medical",
    title: "Medical & medications",
    description: "Conditions, medications, dosing, and providers.",
    keywords:
      /\b(med(ication|s)?|pill|dose|dosage|seizure|asthma|diabet|allerg|prescription|doctor|clinic|hospital|therap(y|ist)|diagnos)/i,
    questions: (name) => [
      `What medications does ${name} take, and at what times?`,
      `Are there any allergies or medications ${name} must never be given?`,
      `Who are ${name}'s primary providers, and how do you reach them after hours?`,
    ],
  },
  {
    id: "sensory",
    title: "Sensory & comfort",
    description: "What soothes them, and what overwhelms them.",
    keywords:
      /\b(sensor|loud|noise|light|texture|overwhelm|stim|headphone|blanket|weighted|music|quiet|calm|soothe|comfort)/i,
    questions: (name) => [
      `What sounds, lights, or textures overwhelm ${name}?`,
      `What specific objects, songs, or rituals help ${name} feel safe?`,
      `When ${name} is dysregulated, what helps them come back to center?`,
    ],
  },
  {
    id: "communication",
    title: "Communication",
    description: "How they express needs and understand others.",
    keywords:
      /\b(non[- ]?verbal|verbal|speak|talk|word|sign|aac|gesture|point|echolal|communicat)/i,
    questions: (name) => [
      `How does ${name} let you know they're hungry, hurting, or upset?`,
      `What words, signs, or devices does ${name} use?`,
      `What should a new caregiver know about how to speak with ${name}?`,
    ],
  },
  {
    id: "routines",
    title: "Daily routines",
    description: "The rhythm of an ordinary day.",
    keywords:
      /\b(routine|morning|bedtime|night|sleep|wake|school|breakfast|lunch|dinner|bath|shower|schedule)/i,
    questions: (name) => [
      `Walk me through a good morning with ${name}.`,
      `What does bedtime look like when it goes well?`,
      `Which parts of the day tend to be hardest?`,
    ],
  },
  {
    id: "safety",
    title: "Safety",
    description: "Risks, triggers, and protective routines.",
    keywords:
      /\b(wander|elope|run|traffic|water|stair|fall|hurt|self[- ]?harm|aggressi|bite|hit|danger|risk|safe)/i,
    questions: (name) => [
      `Are there situations where ${name} could be in danger if unsupervised?`,
      `What early signs tell you ${name} is becoming unsafe?`,
      `What has worked to keep ${name} safe in past hard moments?`,
    ],
  },
  {
    id: "care_team",
    title: "Care team",
    description: "Family, friends, and professionals who help.",
    keywords:
      /\b(grandma|grandpa|aunt|uncle|sibling|brother|sister|friend|neighbor|teacher|aide|nurse|respite|babysitter|sitter)/i,
    questions: (name) => [
      `Who outside the home already knows ${name} well?`,
      `Who could step in for a day, a week, or longer if needed?`,
      `What does each of them need to know to be effective?`,
    ],
  },
  {
    id: "future",
    title: "Looking ahead",
    description: "Long-horizon hopes, fears, and decisions.",
    keywords:
      /\b(future|adult|18|21|guardian|trust|estate|will|housing|independent|college|work|job|legacy|when i'?m gone|after)/i,
    questions: (name) => [
      `When you picture ${name} as an adult, what does a good life look like?`,
      `What decisions about ${name}'s future feel most urgent right now?`,
      `Who would you want making decisions with or for ${name} someday?`,
    ],
  },
  {
    id: "joys",
    title: "Joys & personality",
    description: "What lights them up — the things any caregiver should know.",
    keywords:
      /\b(love|favorite|happy|joy|laugh|smile|play|funny|silly|hobby|interest|obsess|passion)/i,
    questions: (name) => [
      `What three things make ${name} light up every time?`,
      `What's a small ritual that always brings ${name} joy?`,
      `What do you want any new caregiver to fall in love with about ${name}?`,
    ],
  },
];

// Sections we always want to make sure get covered, even if not mentioned.
const BASELINE_GAPS = [
  "Emergency contacts and what to do in a crisis",
  "Legal documents (guardianship, medical directives)",
  "Insurance and benefits",
];

export async function analyzeDump(input: AnalyzeInput): Promise<Plan> {
  // Simulate a thoughtful pause so the "analyzing" UI has room to breathe.
  await new Promise((r) => setTimeout(r, 1400));

  const { dump, lovedOneName } = input;
  const name = lovedOneName.trim() || "your loved one";
  const text = dump.toLowerCase();

  const matched = THEMES.filter((t) => t.keywords.test(text));

  // If they wrote almost nothing, fall back to a gentle core set.
  const sections: PlanSection[] =
    matched.length > 0
      ? matched.map((t) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          questions: t.questions(name),
          evidence: extractEvidence(dump, t.keywords),
        }))
      : ["joys", "routines", "communication"].map((id) => {
          const t = THEMES.find((x) => x.id === id)!;
          return {
            id: t.id,
            title: t.title,
            description: t.description,
            questions: t.questions(name),
            evidence: [],
          };
        });

  const coveredIds = new Set(sections.map((s) => s.id));
  const missingThemes = THEMES.filter((t) => !coveredIds.has(t.id))
    .slice(0, 2)
    .map((t) => t.title);

  const summary = buildSummary(name, dump, sections.map((s) => s.title));

  return {
    summary,
    sections,
    gaps: [...missingThemes, ...BASELINE_GAPS].slice(0, 4),
  };
}

function extractEvidence(dump: string, pattern: RegExp): string[] {
  const sentences = dump
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return sentences.filter((s) => pattern.test(s)).slice(0, 2);
}

function buildSummary(name: string, dump: string, themeTitles: string[]): string {
  const wordCount = dump.trim().split(/\s+/).filter(Boolean).length;
  if (wordCount < 8) {
    return `Thank you for starting. We'll gently walk through a few questions about ${name} together.`;
  }
  const themes =
    themeTitles.length <= 2
      ? themeTitles.join(" and ")
      : `${themeTitles.slice(0, -1).join(", ")}, and ${themeTitles.at(-1)}`;
  return `From what you shared about ${name}, I'm noticing themes around ${themes.toLowerCase()}. I've drafted a few gentle follow-up questions for each.`;
}
