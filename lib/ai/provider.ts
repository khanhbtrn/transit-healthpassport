import {
  anthropicAgent,
  anthropicExtract,
  anthropicGaps,
  anthropicHandoff,
  anthropicRelocation,
  anthropicTimeline,
} from "./anthropic";
import {
  mockAgent,
  mockExtract,
  mockGaps,
  mockHandoff,
  mockRelocation,
  mockTimeline,
} from "./mock";
import {
  openaiAgent,
  openaiExtract,
  openaiGaps,
  openaiHandoff,
  openaiRelocation,
  openaiTimeline,
} from "./openai";
import type {
  AgentResponseResult,
  ExtractionResult,
  GapAnalysis,
  HandoffResult,
  RelocationPlanResult,
  TimelineResult,
} from "./schemas";

export type AIProviderName = "anthropic" | "openai" | "mock";

export function resolveAIProvider(): AIProviderName {
  const configured = (process.env.AI_PROVIDER || "mock").toLowerCase();

  if (configured === "anthropic" && process.env.ANTHROPIC_API_KEY) {
    return "anthropic";
  }
  if (configured === "openai" && process.env.OPENAI_API_KEY) {
    return "openai";
  }
  if (configured === "anthropic" && !process.env.ANTHROPIC_API_KEY) {
    return "mock";
  }
  if (configured === "openai" && !process.env.OPENAI_API_KEY) {
    return "mock";
  }
  if (process.env.ANTHROPIC_API_KEY && configured !== "openai") {
    return configured === "mock" ? "mock" : "anthropic";
  }
  if (process.env.OPENAI_API_KEY && configured === "openai") {
    return "openai";
  }
  return "mock";
}

async function withFallback<T>(
  primary: () => Promise<T>,
  fallback: () => Promise<T>
): Promise<{ data: T; provider: AIProviderName; fallbackUsed: boolean }> {
  const provider = resolveAIProvider();
  if (provider === "mock") {
    return { data: await fallback(), provider: "mock", fallbackUsed: false };
  }

  try {
    return { data: await primary(), provider, fallbackUsed: false };
  } catch {
    return { data: await fallback(), provider: "mock", fallbackUsed: true };
  }
}

export async function extractClinicalFacts(input: string): Promise<{
  data: ExtractionResult;
  provider: AIProviderName;
  fallbackUsed: boolean;
}> {
  const provider = resolveAIProvider();
  if (provider === "anthropic") {
    return withFallback(() => anthropicExtract(input), () => mockExtract(input));
  }
  if (provider === "openai") {
    return withFallback(() => openaiExtract(input), () => mockExtract(input));
  }
  return { data: await mockExtract(input), provider: "mock", fallbackUsed: false };
}

export async function reconstructTimeline(input: string): Promise<{
  data: TimelineResult;
  provider: AIProviderName;
  fallbackUsed: boolean;
}> {
  const provider = resolveAIProvider();
  if (provider === "anthropic") {
    return withFallback(() => anthropicTimeline(input), () => mockTimeline());
  }
  if (provider === "openai") {
    return withFallback(() => openaiTimeline(input), () => mockTimeline());
  }
  return { data: await mockTimeline(), provider: "mock", fallbackUsed: false };
}

export async function analyseGaps(input: string): Promise<{
  data: GapAnalysis;
  provider: AIProviderName;
  fallbackUsed: boolean;
}> {
  const provider = resolveAIProvider();
  if (provider === "anthropic") {
    return withFallback(() => anthropicGaps(input), () => mockGaps(input));
  }
  if (provider === "openai") {
    return withFallback(() => openaiGaps(input), () => mockGaps(input));
  }
  return { data: await mockGaps(input), provider: "mock", fallbackUsed: false };
}

export async function generateRelocationPlan(input: string): Promise<{
  data: RelocationPlanResult;
  provider: AIProviderName;
  fallbackUsed: boolean;
}> {
  const provider = resolveAIProvider();
  if (provider === "anthropic") {
    return withFallback(
      () => anthropicRelocation(input),
      () => mockRelocation(input)
    );
  }
  if (provider === "openai") {
    return withFallback(
      () => openaiRelocation(input),
      () => mockRelocation(input)
    );
  }
  return {
    data: await mockRelocation(input),
    provider: "mock",
    fallbackUsed: false,
  };
}

export async function generateHandoff(input: string): Promise<{
  data: HandoffResult;
  provider: AIProviderName;
  fallbackUsed: boolean;
}> {
  const provider = resolveAIProvider();
  if (provider === "anthropic") {
    return withFallback(
      () => anthropicHandoff(input),
      () => mockHandoff(input)
    );
  }
  if (provider === "openai") {
    return withFallback(
      () => openaiHandoff(input),
      () => mockHandoff(input)
    );
  }
  return {
    data: await mockHandoff(input),
    provider: "mock",
    fallbackUsed: false,
  };
}

export async function askTransitAgent(
  question: string,
  context: string
): Promise<{
  data: AgentResponseResult;
  provider: AIProviderName;
  fallbackUsed: boolean;
}> {
  const provider = resolveAIProvider();
  if (provider === "anthropic") {
    return withFallback(
      () => anthropicAgent(question, context),
      () => mockAgent(question, context)
    );
  }
  if (provider === "openai") {
    return withFallback(
      () => openaiAgent(question, context),
      () => mockAgent(question, context)
    );
  }
  return {
    data: await mockAgent(question, context),
    provider: "mock",
    fallbackUsed: false,
  };
}
