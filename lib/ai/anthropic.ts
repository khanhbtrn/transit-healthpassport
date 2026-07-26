import Anthropic from "@anthropic-ai/sdk";
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
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY is not configured");
  return new Anthropic({ apiKey: key });
}

async function completeJson<T>(
  prompt: string,
  schema: { parse: (data: unknown) => T }
): Promise<T> {
  const client = getClient();
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `${prompt}\n\nRespond with valid JSON only.`,
      },
    ],
  });

  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("\n");

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Anthropic response did not include valid JSON");
  }

  return schema.parse(JSON.parse(jsonMatch[0]));
}

export async function anthropicExtract(input: string): Promise<ExtractionResult> {
  return completeJson(extractionPrompt(input), extractionResultSchema);
}

export async function anthropicTimeline(input: string): Promise<TimelineResult> {
  return completeJson(timelinePrompt(input), timelineResultSchema);
}

export async function anthropicGaps(input: string): Promise<GapAnalysis> {
  return completeJson(gapPrompt(input), gapAnalysisSchema);
}

export async function anthropicRelocation(
  input: string
): Promise<RelocationPlanResult> {
  return completeJson(relocationPrompt(input), relocationPlanSchema);
}

export async function anthropicHandoff(input: string): Promise<HandoffResult> {
  return completeJson(handoffPrompt(input), handoffResultSchema);
}

export async function anthropicAgent(
  question: string,
  context: string
): Promise<AgentResponseResult> {
  return completeJson(agentPrompt(question, context), agentResponseSchema);
}
