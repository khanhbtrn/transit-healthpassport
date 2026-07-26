import { z } from "zod";
import { resolveAIProvider } from "@/lib/ai/provider";

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

/** Well-known city → country (disambiguates speech/AI mistakes). */
const CITY_COUNTRY: Record<string, string> = {
  tbilisi: "Georgia",
  batumi: "Georgia",
  kutaisi: "Georgia",
  london: "United Kingdom",
  manchester: "United Kingdom",
  birmingham: "United Kingdom",
  edinburgh: "United Kingdom",
  barcelona: "Spain",
  madrid: "Spain",
  valencia: "Spain",
  paris: "France",
  lyon: "France",
  berlin: "Germany",
  munich: "Germany",
  amsterdam: "Netherlands",
  dublin: "Ireland",
  milan: "Italy",
  milano: "Italy",
  rome: "Italy",
  roma: "Italy",
  bangkok: "Thailand",
  "chiang mai": "Thailand",
  "ho chi minh": "Vietnam",
  "ho chi minh city": "Vietnam",
  saigon: "Vietnam",
  hanoi: "Vietnam",
  "new york": "United States",
  "los angeles": "United States",
  "san francisco": "United States",
  atlanta: "United States",
  savannah: "United States",
  toronto: "Canada",
  vancouver: "Canada",
  sydney: "Australia",
  melbourne: "Australia",
  tokyo: "Japan",
  seoul: "South Korea",
  dubai: "United Arab Emirates",
  singapore: "Singapore",
  lisbon: "Portugal",
  porto: "Portugal",
  warsaw: "Poland",
  prague: "Czech Republic",
  vienna: "Austria",
  zurich: "Switzerland",
  geneva: "Switzerland",
  stockholm: "Sweden",
  oslo: "Norway",
  copenhagen: "Denmark",
  helsinki: "Finland",
  athens: "Greece",
  istanbul: "Turkey",
  ankara: "Turkey",
  cairo: "Egypt",
  lagos: "Nigeria",
  nairobi: "Kenya",
  "cape town": "South Africa",
  johannesburg: "South Africa",
  "mexico city": "Mexico",
  "sao paulo": "Brazil",
  "são paulo": "Brazil",
  "buenos aires": "Argentina",
  lima: "Peru",
  bogota: "Colombia",
  bogotá: "Colombia",
  manila: "Philippines",
  jakarta: "Indonesia",
  kuala: "Malaysia",
  "kuala lumpur": "Malaysia",
  delhi: "India",
  mumbai: "India",
  bangalore: "India",
  bengaluru: "India",
  beijing: "China",
  shanghai: "China",
  "hong kong": "Hong Kong",
  taipei: "Taiwan",
  moscow: "Russia",
  "st petersburg": "Russia",
  "saint petersburg": "Russia",
  kyiv: "Ukraine",
  kiev: "Ukraine",
  luanda: "Angola",
  kabul: "Afghanistan",
  yangon: "Myanmar",
};

const GEORGIA_COUNTRY_CITIES = new Set([
  "tbilisi",
  "batumi",
  "kutaisi",
  "rustavi",
  "gori",
]);

const US_GEORGIA_CITIES = new Set([
  "atlanta",
  "savannah",
  "augusta",
  "athens", // ambiguous — prefer US only if country already says US
  "macon",
  "columbus",
]);

function norm(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function cityKey(city: string) {
  return norm(city).toLowerCase();
}

function looksLikeUsGeorgia(country: string, city: string) {
  const c = country.toLowerCase();
  const cityL = cityKey(city);
  if (c.includes("united states") || c.includes("usa") || /\busa\b/.test(c)) {
    return true;
  }
  if (US_GEORGIA_CITIES.has(cityL) && !GEORGIA_COUNTRY_CITIES.has(cityL)) {
    return true;
  }
  if (/\b(ga|georgia)\b/.test(c) && /,\s*(ga|usa|u\.s\.|united states)/i.test(country)) {
    return true;
  }
  return false;
}

/**
 * Fix common model/speech mistakes (esp. Georgia the country vs US state).
 */
export function normalizeOnboardingPlaces(
  data: OnboardingParseResult
): OnboardingParseResult {
  let currentCity = norm(data.currentCity);
  let currentCountry = norm(data.currentCountry);
  let destinationCity = norm(data.destinationCity);
  let destinationCountry = norm(data.destinationCountry);

  function fixPair(city: string, country: string): [string, string] {
    let nextCity = city;
    let nextCountry = country;
    const key = cityKey(city);

    // "Georgia, United States" / "Georgia, USA" when city is Tbilisi → country Georgia
    if (
      GEORGIA_COUNTRY_CITIES.has(key) ||
      key === "tbilisi"
    ) {
      nextCountry = "Georgia";
      if (!nextCity) nextCity = "Tbilisi";
      return [nextCity, nextCountry];
    }

    // Country field wrongly set to US Georgia while city is empty/ambiguous
    if (
      /georgia/i.test(nextCountry) &&
      looksLikeUsGeorgia(nextCountry, nextCity) &&
      !GEORGIA_COUNTRY_CITIES.has(key)
    ) {
      // Keep US only for clear US Georgia cities
      if (US_GEORGIA_CITIES.has(key) && key !== "athens") {
        nextCountry = "United States";
        return [nextCity, nextCountry];
      }
    }

    // If country says "Georgia, United States" but city is Georgian — force country
    if (
      /georgia/i.test(nextCountry) &&
      /united states|usa|u\.s\./i.test(nextCountry) &&
      (GEORGIA_COUNTRY_CITIES.has(key) || !nextCity)
    ) {
      // Without a US city, prefer the country of Georgia for international moves
      if (!US_GEORGIA_CITIES.has(key) || GEORGIA_COUNTRY_CITIES.has(key)) {
        nextCountry = "Georgia";
      }
    }

    // Bare "Georgia" as country with Tbilisi-like speech in city field elsewhere handled above
    if (/^georgia$/i.test(nextCountry) && GEORGIA_COUNTRY_CITIES.has(key)) {
      nextCountry = "Georgia";
    }

    // Known city → country override when missing or clearly wrong (US for Tbilisi)
    const mapped = CITY_COUNTRY[key];
    if (mapped) {
      const countryWrongForCity =
        !nextCountry ||
        (/united states|usa/i.test(nextCountry) && mapped !== "United States") ||
        (/georgia/i.test(nextCountry) &&
          /united states|usa/i.test(nextCountry) &&
          mapped === "Georgia");
      if (countryWrongForCity || !nextCountry) {
        nextCountry = mapped;
      }
    }

    // City field accidentally contains "Tbilisi, Georgia"
    const cityCountry = nextCity.match(
      /^([A-Za-zÀ-ÿ .'-]+?)\s*,\s*([A-Za-zÀ-ÿ .'-]+)$/
    );
    if (cityCountry) {
      nextCity = norm(cityCountry[1]);
      if (!nextCountry) nextCountry = norm(cityCountry[2]);
      const mappedInner = CITY_COUNTRY[cityKey(nextCity)];
      if (mappedInner) nextCountry = mappedInner;
      if (GEORGIA_COUNTRY_CITIES.has(cityKey(nextCity))) {
        nextCountry = "Georgia";
      }
    }

    // Country field is "Georgia, United States" → strip to Georgia when international context
    if (/^georgia\s*,\s*(united states|usa|u\.s\.a\.?)$/i.test(nextCountry)) {
      if (GEORGIA_COUNTRY_CITIES.has(key) || !US_GEORGIA_CITIES.has(key)) {
        nextCountry = "Georgia";
      } else {
        nextCountry = "United States";
      }
    }

    return [nextCity, nextCountry];
  }

  [currentCity, currentCountry] = fixPair(currentCity, currentCountry);
  [destinationCity, destinationCountry] = fixPair(
    destinationCity,
    destinationCountry
  );

  // If country alone is "Georgia" and no US city signal, keep as country Georgia
  if (/^georgia$/i.test(destinationCountry) && !destinationCity) {
    destinationCountry = "Georgia";
  }
  if (/^georgia$/i.test(currentCountry) && !currentCity) {
    currentCountry = "Georgia";
  }

  return {
    ...data,
    currentCity,
    currentCountry,
    destinationCity,
    destinationCountry,
    fullName: norm(data.fullName),
    conditions: norm(data.conditions),
    primaryConcern: norm(data.primaryConcern),
    preferredLanguage: norm(data.preferredLanguage) || "English",
    moveDate: norm(data.moveDate),
  };
}

const NAME_STOP = new Set([
  "moving",
  "from",
  "to",
  "and",
  "with",
  "have",
  "need",
  "here",
  "living",
  "going",
  "relocating",
]);

function extractName(text: string): string {
  const patterns = [
    /(?:my name is|i'm|i am|this is)\s+([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'-]*(?:\s+[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'-]*)?)/i,
    /^([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'-]*(?:\s+[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'-]*)?)\s*[,.]?\s+(?:here|speaking|moving)\b/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (!match?.[1]) continue;
    const parts = norm(match[1])
      .split(/\s+/)
      .filter((part) => !NAME_STOP.has(part.toLowerCase()));
    if (parts.length >= 1 && parts.length <= 3) {
      return parts
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
    }
  }
  return "";
}

function heuristicParse(text: string, nameHint: string): OnboardingParseResult {
  const cleaned = text.replace(/\s+/g, " ").trim();
  const lower = cleaned.toLowerCase();

  function splitCityCountry(raw: string): { city: string; country: string } {
    const trimmed = norm(raw);
    const comma = trimmed.match(/^(.+?)\s*,\s*(.+)$/);
    if (comma) {
      return { city: norm(comma[1]), country: norm(comma[2]) };
    }
    // "Milan Italy" / "Tbilisi Georgia"
    const parts = trimmed.split(/\s+/);
    if (parts.length >= 2) {
      const maybeCountry = parts[parts.length - 1];
      const maybeCity = parts.slice(0, -1).join(" ");
      const knownCity = CITY_COUNTRY[cityKey(maybeCity)];
      const knownSingle = CITY_COUNTRY[cityKey(trimmed)];
      if (knownSingle) return { city: trimmed, country: knownSingle };
      if (knownCity) return { city: maybeCity, country: knownCity };
      // Last token looks like a country word
      if (
        /^(italy|georgia|thailand|spain|france|germany|uk|usa|canada|japan|china|india|vietnam|angola)$/i.test(
          maybeCountry
        )
      ) {
        const countryName =
          CITY_COUNTRY[cityKey(maybeCity)] ||
          ({
            italy: "Italy",
            georgia: "Georgia",
            thailand: "Thailand",
            spain: "Spain",
            france: "France",
            germany: "Germany",
            uk: "United Kingdom",
            usa: "United States",
            canada: "Canada",
            japan: "Japan",
            china: "China",
            india: "India",
            vietnam: "Vietnam",
            angola: "Angola",
          }[maybeCountry.toLowerCase()] || maybeCountry);
        return { city: maybeCity, country: countryName };
      }
    }
    const mapped = CITY_COUNTRY[cityKey(trimmed)];
    return { city: trimmed, country: mapped || "" };
  }

  const fromTo =
    cleaned.match(
      /(?:from|leaving)\s+(.+?)\s+(?:to|moving to)\s+(.+?)(?:\s+with\s+|\s+for\s+|\.|$)/i
    ) ||
    cleaned.match(
      /moving\s+from\s+(.+?)\s+to\s+(.+?)(?:\s+with\s+|\s+for\s+|\.|$)/i
    );

  let currentCity = "";
  let currentCountry = "";
  let destinationCity = "";
  let destinationCountry = "";

  if (fromTo) {
    const origin = splitCityCountry(fromTo[1]);
    const dest = splitCityCountry(fromTo[2]);
    currentCity = origin.city;
    currentCountry = origin.country;
    destinationCity = dest.city;
    destinationCountry = dest.country;
  }

  // "Tbilisi, Georgia" as a standalone place mention (origin or destination)
  const placeComma = [
    ...cleaned.matchAll(
      /\b([A-Za-zÀ-ÿ .'-]{2,40}?)\s*,\s*([A-Za-zÀ-ÿ .'-]{2,40})\b/g
    ),
  ];
  for (const match of placeComma) {
    const city = norm(match[1]);
    const country = norm(match[2]);
    const key = cityKey(city);
    if (CITY_COUNTRY[key] || GEORGIA_COUNTRY_CITIES.has(key)) {
      if (!currentCity && /from|leaving|live|living|in\b/i.test(cleaned)) {
        currentCity = city;
        currentCountry = CITY_COUNTRY[key] || country;
      } else if (!destinationCity) {
        destinationCity = city;
        destinationCountry = CITY_COUNTRY[key] || country;
      } else if (!currentCity) {
        currentCity = city;
        currentCountry = CITY_COUNTRY[key] || country;
      }
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
      /(?:worried about|concern(?:ed)? about|biggest concern is|need to|want to|need help with)\s+([^.]{5,120})/i
    ) || null;

  const guessedName = extractName(cleaned) || nameHint.trim();

  return normalizeOnboardingPlaces({
    fullName: guessedName,
    currentCity,
    currentCountry: currentCountry || CITY_COUNTRY[cityKey(currentCity)] || "",
    destinationCity,
    destinationCountry:
      destinationCountry || CITY_COUNTRY[cityKey(destinationCity)] || "",
    moveDate,
    conditions: conditionMatch?.[1]?.trim() || "",
    primaryConcern:
      concernMatch?.[1]?.trim() ||
      (lower.includes("medication") || lower.includes("treatment")
        ? "Avoid interruption to treatment"
        : "Continue care safely after moving"),
    preferredLanguage: "English",
  });
}

const PARSE_INSTRUCTIONS = `You extract healthcare-relocation onboarding fields from speech-to-text (may be messy).

Return ONLY a JSON object with keys:
fullName, currentCity, currentCountry, destinationCity, destinationCountry, moveDate (YYYY-MM-DD if possible), conditions, primaryConcern, preferredLanguage.

Rules:
- Use empty strings when unknown. Do not invent medical details.
- Fill EVERY field the user mentioned — name, origin city/country, destination city/country, and condition/care need.
- Geography: prefer the COUNTRY matching the city. Examples:
  - "Tbilisi, Georgia" → destinationCity "Tbilisi", destinationCountry "Georgia" (the country in the Caucasus — NOT Georgia, United States).
  - "Atlanta, Georgia" → city Atlanta, country "United States".
  - "Milan, Italy" → Milan / Italy. "Bangkok, Thailand" → Bangkok / Thailand.
- Never output "Georgia, United States" unless the user clearly means the US state (Atlanta, Savannah, etc.).
- If the user says only a name, leave places empty — do not guess.
- conditions = diagnosis or care need (e.g. "type 1 diabetes"). primaryConcern = what must continue / worry.`;

async function directJsonParse(
  text: string,
  nameHint: string
): Promise<OnboardingParseResult | null> {
  const provider = resolveAIProvider();
  const userContent = `${PARSE_INSTRUCTIONS}

Name hint (may be empty): ${nameHint || "(none)"}
User message:
${text}`;

  try {
    if (provider === "openai" && process.env.OPENAI_API_KEY) {
      const OpenAI = (await import("openai")).default;
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are a careful JSON extractor for international relocation. Disambiguate place names. Never confuse Georgia (country) with Georgia (US state) when the city is Tbilisi or another Georgian city.",
          },
          { role: "user", content: userContent },
        ],
      });
      const content = response.choices[0]?.message?.content;
      if (!content) return null;
      return normalizeOnboardingPlaces(
        onboardingParseSchema.parse(JSON.parse(content))
      );
    }

    if (provider === "anthropic" && process.env.ANTHROPIC_API_KEY) {
      const Anthropic = (await import("@anthropic-ai/sdk")).default;
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        temperature: 0,
        messages: [{ role: "user", content: userContent }],
      });
      const content = response.content
        .filter((block) => block.type === "text")
        .map((block) => (block.type === "text" ? block.text : ""))
        .join("\n");
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return null;
      return normalizeOnboardingPlaces(
        onboardingParseSchema.parse(JSON.parse(jsonMatch[0]))
      );
    }
  } catch {
    return null;
  }

  return null;
}

function mergeParse(
  primary: OnboardingParseResult,
  fallback: OnboardingParseResult
): OnboardingParseResult {
  return normalizeOnboardingPlaces({
    fullName: primary.fullName || fallback.fullName,
    currentCity: primary.currentCity || fallback.currentCity,
    currentCountry: primary.currentCountry || fallback.currentCountry,
    destinationCity: primary.destinationCity || fallback.destinationCity,
    destinationCountry:
      primary.destinationCountry || fallback.destinationCountry,
    moveDate: primary.moveDate || fallback.moveDate,
    conditions: primary.conditions || fallback.conditions,
    primaryConcern:
      primary.primaryConcern &&
      primary.primaryConcern !== "Continue care safely after moving"
        ? primary.primaryConcern
        : fallback.primaryConcern || primary.primaryConcern,
    preferredLanguage: primary.preferredLanguage || fallback.preferredLanguage,
  });
}

export async function parseOnboardingMessage(
  text: string,
  nameHint = ""
): Promise<{ data: OnboardingParseResult; source: "ai" | "heuristic" }> {
  const heuristic = heuristicParse(text, nameHint);
  const ai = await directJsonParse(text, nameHint);

  if (ai) {
    return {
      data: mergeParse(
        {
          ...ai,
          fullName: ai.fullName || nameHint || heuristic.fullName,
        },
        heuristic
      ),
      source: "ai",
    };
  }

  return {
    data: heuristic,
    source: "heuristic",
  };
}
