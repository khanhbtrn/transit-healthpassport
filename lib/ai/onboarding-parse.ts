import { z } from "zod";
import { resolveAIProvider } from "@/lib/ai/provider";
import { anthropicAgent } from "@/lib/ai/anthropic";
import { openaiAgent } from "@/lib/ai/openai";

export const onboardingParseSchema = z.object({
  fullName: z.string().optional().default(""),
  currentCity: z.string().optional().default(""),
  currentCountry: z.string().optional().default(""),
  destinationCity: z.string().optional().default(""),
  destinationCountry: z.string().optional().default(""),
  moveDate: z.string().optional().default(""),
  conditions: z.string().optional().default(""),
  primaryConcern: z.string().optional().default(""),
  preferredLanguage: z.string().optional().default("English"),
});

export type OnboardingParseResult = z.infer<typeof onboardingParseSchema>;

function heuristicParse(text: string, nameHint: string): OnboardingParseResult {
  const cleaned = text.replace(/\s+/g, " ").trim();
  const lower = cleaned.toLowerCase();

  const fromTo =
    cleaned.match(
      /(?:from|leaving)\s+([A-Za-zÀ-ÿ .'-]+?)(?:\s*,\s*([A-Za-zÀ-ÿ .'-]+?))?\s+(?:to|for)\s+([A-Za-zÀ-ÿ .'-]+?)(?:\s*,\s*([A-Za-zÀ-ÿ .'-]+?))?(?:\.|,|$)/i
    ) ||
    cleaned.match(
      /moving\s+(?:from\s+)?([A-Za-zÀ-ÿ .'-]+?)\s+to\s+([A-Za-zÀ-ÿ .'-]+?)(?:\.|,|$)/i
    );

  let currentCity = "";
  let currentCountry = "";
  let destinationCity = "";
  let destinationCountry = "";

  if (fromTo) {
    if (fromTo.length >= 5 && fromTo[3]) {
      currentCity = fromTo[1].trim();
      currentCountry = (fromTo[2] || "").trim();
      destinationCity = fromTo[3].trim();
      destinationCountry = (fromTo[4] || "").trim();
    } else {
      currentCity = fromTo[1].trim();
      destinationCity = fromTo[2].trim();
    }
  }

  const isoDate = cleaned.match(/\b(20\d{2}-\d{2}-\d{2})\b/);
  const longDate = cleaned.match(
    /\b(\d{1,2}\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+20\d{2})\b/i
  );
  const monthFirst = cleaned.match(
    /\b((January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+20\d{2})\b/i
  );

  let moveDate = "";
  if (isoDate) {
    moveDate = isoDate[1];
  } else if (longDate || monthFirst) {
    const parsed = new Date((longDate || monthFirst)![1]);
    if (!Number.isNaN(parsed.getTime())) {
      moveDate = parsed.toISOString().slice(0, 10);
    }
  }

  const conditionMatch = cleaned.match(
    /(?:with|have|having)\s+([A-Za-zÀ-ÿ0-9 '"/-]{3,80}?)(?:\.|,|$)/i
  );
  const concernMatch =
    cleaned.match(
      /(?:worried about|concern(?:ed)? about|biggest concern is|need to|want to)\s+([^.]{5,120})/i
    ) || null;

  return {
    fullName: nameHint.trim(),
    currentCity,
    currentCountry: currentCountry || guessCountry(currentCity),
    destinationCity,
    destinationCountry: destinationCountry || guessCountry(destinationCity),
    moveDate,
    conditions: conditionMatch?.[1]?.trim() || "",
    primaryConcern:
      concernMatch?.[1]?.trim() ||
      (lower.includes("medication") || lower.includes("treatment")
        ? "Avoid interruption to treatment"
        : "Continue care safely after moving"),
    preferredLanguage: "English",
  };
}

function guessCountry(city: string) {
  const map: Record<string, string> = {
    london: "United Kingdom",
    manchester: "United Kingdom",
    barcelona: "Spain",
    madrid: "Spain",
    paris: "France",
    berlin: "Germany",
    amsterdam: "Netherlands",
    dublin: "Ireland",
    "new york": "United States",
  };
  return map[city.trim().toLowerCase()] || "";
}

async function aiParse(
  text: string,
  nameHint: string
): Promise<OnboardingParseResult | null> {
  const provider = resolveAIProvider();
  if (provider === "mock") return null;

  const prompt = `Extract relocation onboarding fields from the user's free-form message.
Return ONLY JSON with keys:
fullName, currentCity, currentCountry, destinationCity, destinationCountry, moveDate (YYYY-MM-DD if possible), conditions, primaryConcern, preferredLanguage.
Use empty strings when unknown. Do not invent medical details.
Known name hint: ${nameHint || "(none)"}
User message:
${text}`;

  try {
    const result =
      provider === "anthropic"
        ? await anthropicAgent(prompt, "Onboarding parse")
        : await openaiAgent(prompt, "Onboarding parse");

    // agent returns answer etc — better to use raw completion. Fallback: try parse answer as JSON
    const maybe = (result as { answer?: string }).answer || "";
    const jsonMatch = maybe.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    return onboardingParseSchema.parse(JSON.parse(jsonMatch[0]));
  } catch {
    return null;
  }
}

/** Dedicated lightweight OpenAI/Anthropic JSON parse when available. */
async function directJsonParse(
  text: string,
  nameHint: string
): Promise<OnboardingParseResult | null> {
  const provider = resolveAIProvider();
  try {
    if (provider === "openai" && process.env.OPENAI_API_KEY) {
      const OpenAI = (await import("openai")).default;
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "user",
            content: `Extract relocation onboarding fields as JSON with keys:
fullName, currentCity, currentCountry, destinationCity, destinationCountry, moveDate (YYYY-MM-DD if possible), conditions, primaryConcern, preferredLanguage.
Use empty strings when unknown. Do not invent facts.
Name hint: ${nameHint || "(none)"}
Message: ${text}`,
          },
        ],
      });
      const content = response.choices[0]?.message?.content;
      if (!content) return null;
      return onboardingParseSchema.parse(JSON.parse(content));
    }

    if (provider === "anthropic" && process.env.ANTHROPIC_API_KEY) {
      const Anthropic = (await import("@anthropic-ai/sdk")).default;
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `Extract relocation onboarding fields as JSON only with keys:
fullName, currentCity, currentCountry, destinationCity, destinationCountry, moveDate (YYYY-MM-DD if possible), conditions, primaryConcern, preferredLanguage.
Use empty strings when unknown.
Name hint: ${nameHint || "(none)"}
Message: ${text}`,
          },
        ],
      });
      const content = response.content
        .filter((block) => block.type === "text")
        .map((block) => (block.type === "text" ? block.text : ""))
        .join("\n");
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return null;
      return onboardingParseSchema.parse(JSON.parse(jsonMatch[0]));
    }
  } catch {
    return null;
  }

  void aiParse;
  return null;
}

export async function parseOnboardingMessage(
  text: string,
  nameHint = ""
): Promise<{ data: OnboardingParseResult; source: "ai" | "heuristic" }> {
  const ai = await directJsonParse(text, nameHint);
  if (ai) {
    return {
      data: {
        ...ai,
        fullName: ai.fullName || nameHint,
      },
      source: "ai",
    };
  }

  return {
    data: heuristicParse(text, nameHint),
    source: "heuristic",
  };
}
