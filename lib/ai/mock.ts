import { buildCorridorBrief } from "@/lib/corridor/knowledge";
import type {
  AgentResponseResult,
  ExtractionResult,
  GapAnalysis,
  HandoffResult,
  RelocationPlanResult,
  TimelineResult,
} from "./schemas";

function readDestination(input = "") {
  const moveLine = input.match(
    /Move:\s*([^→\n]+)→\s*([^\n]+)/i
  );
  const from = moveLine?.[1]?.trim() || "your current city";
  const to = moveLine?.[2]?.trim() || "your destination";
  const toParts = to.split(",").map((p) => p.trim());
  const fromParts = from.split(",").map((p) => p.trim());
  return {
    fromCity: fromParts[0] || "Origin",
    fromCountry: fromParts[1] || "",
    toCity: toParts[0] || "Destination",
    toCountry: toParts[1] || "",
    toLabel: to,
  };
}

export async function mockExtract(input: string): Promise<ExtractionResult> {
  const lower = input.toLowerCase();
  const facts = [];

  if (lower.includes("cancer")) {
    facts.push({
      category: "Diagnosis",
      value: "Cancer diagnosis mentioned in materials",
      confidence: "medium" as const,
      verificationStatus: "ai_extracted" as const,
    });
  }
  if (lower.includes("crohn")) {
    facts.push({
      category: "Diagnosis",
      value: "Crohn's disease",
      confidence: "high" as const,
      verificationStatus: "ai_extracted" as const,
    });
  }
  if (lower.includes("adalimumab")) {
    facts.push({
      category: "Medication",
      value: "Adalimumab",
      confidence: "high" as const,
      verificationStatus: "ai_extracted" as const,
    });
  }

  if (facts.length === 0) {
    facts.push({
      category: "Note",
      value:
        "Document received. Limited structured facts in offline mode — review manually.",
      confidence: "low" as const,
      verificationStatus: "needs_confirmation" as const,
    });
  }

  return {
    diagnosis: lower.includes("cancer")
      ? "Cancer (details require confirmation)"
      : lower.includes("crohn")
        ? "Crohn's disease"
        : undefined,
    medications: [],
    allergies: [],
    monitoring: [],
    specialists: [],
    facts,
    warnings: [
      "AI-extracted medical facts should be reviewed before use.",
      "Offline extraction used — configure AI_PROVIDER for live extraction.",
    ],
  };
}

export async function mockTimeline(): Promise<TimelineResult> {
  return { events: [] };
}

export async function mockGaps(input = ""): Promise<GapAnalysis> {
  const { toLabel } = readDestination(input);
  return {
    gaps: [
      {
        title: `Registration steps for ${toLabel}`,
        explanation:
          "Confirm the official first step for healthcare access at your destination.",
        severity: "high",
        recommendedAction: "Review official registration guidance",
      },
      {
        title: "Clinical records incomplete",
        explanation:
          "Upload a specialist letter or prescription to strengthen the transition.",
        severity: "high",
        recommendedAction: "Upload documents",
      },
    ],
  };
}

export async function mockRelocation(input = ""): Promise<RelocationPlanResult> {
  const dest = readDestination(input);
  const brief = buildCorridorBrief({
    currentCity: dest.fromCity,
    currentCountry: dest.fromCountry,
    destinationCity: dest.toCity,
    destinationCountry: dest.toCountry,
  });

  return {
    tasks: [
      {
        phase: "before_departure",
        title: "Request a current specialist summary",
        explanation:
          "A signed clinical summary helps the receiving clinic understand your history.",
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14)
          .toISOString()
          .slice(0, 10),
        priority: "critical",
        owner: "You",
        status: "not_started",
        sourceStatus: "Requires confirmation",
        recommendedAction: "Prepare request",
      },
      {
        phase: "before_arrival",
        title: `Review healthcare registration in ${dest.toCountry || dest.toCity}`,
        explanation: brief.registrationNotes,
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21)
          .toISOString()
          .slice(0, 10),
        priority: "critical",
        owner: "You",
        status: "not_started",
        sourceStatus: "Verify with official sources",
        recommendedAction: "Review instructions",
      },
      {
        phase: "before_arrival",
        title: brief.languageNotes.toLowerCase().includes("english")
          ? "Prepare an English clinical handoff"
          : "Prepare a translated clinical handoff",
        explanation: brief.languageNotes,
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 18)
          .toISOString()
          .slice(0, 10),
        priority: "high",
        owner: "TransitH",
        status: "not_started",
        sourceStatus: "Corridor guidance",
        recommendedAction: "Prepare document",
      },
      {
        phase: "first_week",
        title: `Confirm local medication oversight in ${dest.toCity}`,
        explanation: brief.medicationNotes,
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
          .toISOString()
          .slice(0, 10),
        priority: "high",
        owner: "You",
        status: "not_started",
        sourceStatus: "Requires confirmation",
        recommendedAction: "Ask TransitH",
      },
      {
        phase: "first_week",
        title: `Start specialist access pathway in ${dest.toCity}`,
        explanation: brief.specialistNotes,
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 35)
          .toISOString()
          .slice(0, 10),
        priority: "high",
        owner: "You",
        status: "not_started",
        sourceStatus: "Corridor guidance",
        recommendedAction: "Find doctors",
      },
    ],
  };
}

export async function mockHandoff(input = ""): Promise<HandoffResult> {
  const dest = readDestination(input);
  const toUk = `${dest.toCountry} ${dest.toCity}`.toLowerCase().includes("uk") ||
    `${dest.toCountry} ${dest.toCity}`.toLowerCase().includes("united kingdom") ||
    `${dest.toCountry} ${dest.toCity}`.toLowerCase().includes("london");
  const toSpain =
    `${dest.toCountry} ${dest.toCity}`.toLowerCase().includes("spain") ||
    `${dest.toCountry} ${dest.toCity}`.toLowerCase().includes("barcelona");

  return {
    clinicalSummary:
      `International care handoff for relocation to ${dest.toLabel}. ` +
      "Summary pending richer verified clinical details from documents or doctor conversation.",
    detailedSummary:
      `Destination: ${dest.toLabel}. ` +
      "Detailed summary will expand as verified medications, allergies, and monitoring are added.",
    patientSummary: `You are preparing to continue care in ${dest.toLabel}. Ask your clinician to confirm every medical detail before treatment decisions.`,
    spanishSummary: toSpain
      ? "Resumen clínico provisional para continuación de cuidados en España. Confirme todos los detalles con un profesional cualificado."
      : toUk
        ? "English clinical summary preferred for UK care. Spanish translation not required for this destination."
        : "Translation pending destination-language preparation.",
    catalanSummary: toSpain
      ? "Resum clínic provisional per a la continuïtat assistencial. Confirmeu tots els detalls amb un professional qualificat."
      : "Not required for this destination.",
    unresolvedQuestions: [
      `What is the first registration step in ${dest.toCountry || dest.toCity}?`,
      "Who will oversee medication after arrival?",
    ],
    continuityPriorities: [
      "Confirm treatment continuity before supply gaps",
      `Prepare records for clinicians in ${dest.toCity}`,
    ],
    supportingEvidence: [],
  };
}

export async function mockAgent(
  question: string,
  context = ""
): Promise<AgentResponseResult> {
  const dest = readDestination(context);
  const lower = question.toLowerCase();
  if (lower.includes("missing") || lower.includes("gap") || lower.includes("route") || lower.includes("important")) {
    return {
      answer: `For your move to ${dest.toLabel}, still confirm registration steps, gather clinical records, and plan medication continuity.`,
      whyItMatters:
        "Destination systems differ. What works in your current country may not transfer automatically.",
      nextAction: `Review the corridor tips for ${dest.toCity}, then add records or generate your plan.`,
      sourceStatus: "Corridor-aware guidance",
      actions: [
        { label: "Make plan", type: "plan" },
        { label: "Add documents", type: "documents" },
      ],
    };
  }
  if (lower.includes("urgent") || lower.includes("next")) {
    return {
      answer: `Next, collect your clinical history, then generate a ${dest.toCountry || dest.toCity}-specific move plan.`,
      whyItMatters: `Receiving clinicians in ${dest.toCity} need clear history before assuming care.`,
      nextAction: "Add documents or listen to your doctor, then continue from Home.",
      sourceStatus: "Corridor-aware guidance",
      actions: [
        { label: "Add documents", type: "documents" },
        { label: "Ask follow-up", type: "follow_up" },
      ],
    };
  }
  return {
    answer: `I can help with your move to ${dest.toLabel} using your profile, documents, and corridor guidance.`,
    whyItMatters:
      "TransitH customises next steps to your origin and destination — not a generic checklist.",
    nextAction: "Ask what matters for your route, or what to do next.",
    sourceStatus: "Corridor-aware guidance",
    actions: [
      { label: "What’s important for my route?", type: "urgent" },
      { label: "What should I do next?", type: "next" },
    ],
  };
}
