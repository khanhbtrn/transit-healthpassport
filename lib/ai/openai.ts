import OpenAI from "openai";
import {
  agentPrompt,
  extractionPrompt,
  gapPrompt,
  handoffPrompt,
  relocationPrompt,
  timelinePrompt,
} from "./prompts";
import {
  agentResponseSchema,
  extractionResultSchema,
  gapAnalysisSchema,
  handoffResultSchema,
  relocationPlanSchema,
  timelineResultSchema,
  type AgentResponseResult,
  type ExtractionResult,
  type GapAnalysis,
  type HandoffResult,
  type RelocationPlanResult,
  type TimelineResult,
} from "./schemas";

function getClient() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not configured");
  return new OpenAI({ apiKey: key });
}

async function completeJson<T>(
  prompt: string,
  schema: { parse: (data: unknown) => T }
): Promise<T> {
  const client = getClient();
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "user",
        content: `${prompt}\n\nRespond with valid JSON only.`,
      },
    ],
  });

  const text = response.choices[0]?.message?.content;
  if (!text) throw new Error("OpenAI returned an empty response");
  return schema.parse(JSON.parse(text));
}

export async function openaiExtract(input: string): Promise<ExtractionResult> {
  return completeJson(extractionPrompt(input), extractionResultSchema);
}

export async function openaiTimeline(input: string): Promise<TimelineResult> {
  return completeJson(timelinePrompt(input), timelineResultSchema);
}

export async function openaiGaps(input: string): Promise<GapAnalysis> {
  return completeJson(gapPrompt(input), gapAnalysisSchema);
}

export async function openaiRelocation(
  input: string
): Promise<RelocationPlanResult> {
  return completeJson(relocationPrompt(input), relocationPlanSchema);
}

export async function openaiHandoff(input: string): Promise<HandoffResult> {
  return completeJson(handoffPrompt(input), handoffResultSchema);
}

export async function openaiAgent(
  question: string,
  context: string
): Promise<AgentResponseResult> {
  return completeJson(agentPrompt(question, context), agentResponseSchema);
}
