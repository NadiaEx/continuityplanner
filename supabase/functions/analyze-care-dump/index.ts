import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `You are a compassionate care planning assistant helping caregivers of autistic and disabled children document everything needed for their loved one's care.

Your job is to read a caregiver's free-form "brain dump" about their loved one and return a structured JSON plan with:
1. Relevant care sections based on what they actually mentioned
2. Gentle, specific follow-up questions for each section
3. A warm summary of what you heard
4. Gaps — important care areas they didn't mention yet

You must respond with ONLY valid JSON — no preamble, no markdown, no backticks. The JSON must match this exact shape:

{
  "summary": "string — 1-2 warm sentences summarizing what the caregiver shared",
  "sections": [
    {
      "id": "string — snake_case identifier like 'medical' or 'sensory'",
      "title": "string — short section name",
      "description": "string — one sentence describing what this section covers",
      "questions": ["string", "string", "string"],
      "evidence": ["string — short snippet from their dump that triggered this section"]
    }
  ],
  "gaps": ["string — important care area they didn't mention, phrased gently"]
}

Guidelines:
- Only create sections for things the caregiver actually mentioned — don't invent sections
- If they wrote very little, use 2-3 gentle starter sections (joys, routines, communication)
- Questions should feel like a caring friend asking, not a clinical intake form
- Use the loved one's name throughout the questions
- Evidence should be short snippets (under 15 words) from what they actually wrote
- Gaps should be phrased gently, e.g. "Emergency contacts and what to do in a crisis"
- Maximum 6 sections, 3 questions each, 4 gaps
- The summary should feel warm and seen, not clinical

Possible section ids to use (use others if appropriate):
medical, sensory, communication, routines, safety, care_team, future, joys, legal, school, behaviors, food`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    if (!ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not set in Supabase secrets.");
    }

    const { lovedOneName, persona, dump } = await req.json();
    const name = (lovedOneName ?? "").trim() || "your loved one";

    const userMessage = `The caregiver's name for their loved one is: ${name}${persona ? `\nAdditional context: ${persona}` : ""}

Here is what the caregiver shared:

${dump}

Please analyze this and return the structured JSON plan.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Anthropic API error ${response.status}: ${error}`);
    }

    const data = await response.json();
    const text = data.content?.[0]?.text ?? "";
    const plan = JSON.parse(text);

    return new Response(JSON.stringify(plan), {
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[analyze-care-dump]", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
    );
  }
});
