import {
  alessiaAllergies,
  alessiaConditions,
  alessiaMedications,
  alessiaProfile,
  alessiaSpecialists,
} from "@/data/alessia";
import { mariaDocuments } from "@/data/documents";
import { mariaDoctors, defaultAppointmentRequest } from "@/data/doctors";
import { mariaHandoff } from "@/data/handoff";
import {
  continuityPriorities,
  mariaAllergies,
  mariaConditions,
  mariaContinuityRisks,
  mariaJourneySteps,
  mariaMedications,
  mariaMonitoring,
  mariaProfile,
  mariaSpecialists,
  unresolvedQuestions,
} from "@/data/maria";
import { mariaRelocationTasks } from "@/data/relocation";
import { mariaTimeline } from "@/data/timeline";
import { buildAgentNeeds } from "@/lib/agent/plan";
import {
  buildCorridorBrief,
  corridorContextBlock,
  type CorridorBrief,
} from "@/lib/corridor/knowledge";
import type {
  AgentDoneItem,
  AgentMessage,
  AgentNeed,
  Allergy,
  AppointmentRequest,
  ApprovalItem,
  Condition,
  ContinuityRisk,
  DoctorCandidate,
  Handoff,
  JourneyStep,
  MedicalDocument,
  Medication,
  MonitoringRequirement,
  Profile,
  RelocationTask,
  Specialist,
  TimelineEvent,
} from "@/lib/types";

export type { CorridorBrief };

export interface TransitState {
  profile: Profile;
  conditions: Condition[];
  medications: Medication[];
  allergies: Allergy[];
  monitoring: MonitoringRequirement[];
  specialists: Specialist[];
  documents: MedicalDocument[];
  timeline: TimelineEvent[];
  tasks: RelocationTask[];
  risks: ContinuityRisk[];
  doctors: DoctorCandidate[];
  handoff: Handoff;
  journeySteps: JourneyStep[];
  unresolvedQuestions: string[];
  continuityPriorities: string[];
  appointmentRequest: AppointmentRequest | null;
  messages: AgentMessage[];
  readinessPercent: number;
  onboarded: boolean;
  selectedDoctorId: string | null;
  handoffApproved: boolean;
  conversationCompleted: boolean;
  approvedFactIds: string[];
  completedTaskIds: string[];
  isDemo: boolean;
  corridorBrief: CorridorBrief | null;
  /** True after the Transit agent run finishes preparing transfer artifacts. */
  transitionComplete: boolean;
  spokenHandoffUrl: string | null;
  specialistRequestDraft: string;
  /** Inputs Transit still needs from the patient (docs, people, confirmations). */
  agentNeeds: AgentNeed[];
  /** Drafts awaiting patient approval before any real send. */
  approvals: ApprovalItem[];
  /** What the agent already did. */
  agentDone: AgentDoneItem[];
}

/** @deprecated use TransitState */
export type DemoSeed = TransitState;

export interface OnboardingInput {
  fullName: string;
  currentCity: string;
  currentCountry: string;
  destinationCity: string;
  destinationCountry: string;
  moveDate: string;
  conditions: string;
  primaryConcern: string;
  preferredLanguage: string;
  dateOfBirth?: string;
  age?: number;
  heightCm?: string;
  weightKg?: string;
  sex?: string;
  reasonForMove?: string;
  journeyIntent?: import("@/lib/types").JourneyIntent;
  careBudget?: import("@/lib/types").CareBudget | "";
  careLanguages?: string;
  careNotes?: string;
}

const emptyJourneySteps = (): JourneyStep[] => [
  {
    id: "health_profile",
    title: "Health profile",
    status: "not_started",
    description: "Add conditions, medications, and allergies",
  },
  {
    id: "records_collected",
    title: "Records collected",
    status: "not_started",
    description: "Upload clinical letters and prescriptions",
  },
  {
    id: "medication_review",
    title: "Medication review",
    status: "not_started",
    description: "Confirm supply and continuity risks",
  },
  {
    id: "healthcare_registration",
    title: "Healthcare registration",
    status: "not_started",
    description: "Verify destination eligibility with official sources",
  },
  {
    id: "specialist_selection",
    title: "Specialist selection",
    status: "not_started",
    description: "Find and select a destination clinician",
  },
  {
    id: "clinical_handoff",
    title: "Clinical handoff",
    status: "not_started",
    description: "Generate and approve a translated handoff",
  },
  {
    id: "arrival_readiness",
    title: "Arrival readiness",
    status: "not_started",
    description: "Confirm next steps before and after arrival",
  },
];

const emptyHandoff = (): Handoff => ({
  id: "handoff-draft",
  language: "en",
  clinicalSummary: "",
  detailedSummary: "",
  patientSummary: "",
  spanishSummary: "",
  catalanSummary: "",
  unresolvedQuestions: [],
  continuityPriorities: [],
  supportingDocuments: [],
  generatedAt: new Date().toISOString(),
});

function ageFromDob(dob: string): number {
  if (!dob) return 0;
  const born = new Date(dob);
  if (Number.isNaN(born.getTime())) return 0;
  const now = new Date();
  let age = now.getFullYear() - born.getFullYear();
  const m = now.getMonth() - born.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < born.getDate())) age -= 1;
  return age > 0 && age < 130 ? age : 0;
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "TR";
}

export function createEmptyState(): TransitState {
  return {
    profile: {
      id: "user-draft",
      fullName: "",
      age: 0,
      dateOfBirth: "",
      currentCountry: "",
      destinationCountry: "",
      currentCity: "",
      destinationCity: "",
      moveDate: "",
      preferredLanguage: "English",
      destinationDoctorLanguage: "",
      insuranceRoute: "Not yet confirmed",
      primaryConcern: "",
      avatarInitials: "TR",
      heightCm: "",
      weightKg: "",
      sex: "",
      reasonForMove: "",
      journeyIntent: "continue_treatment",
      carePreferences: {
        budget: "",
        languages: "",
        notes: "",
      },
    },
    conditions: [],
    medications: [],
    allergies: [],
    monitoring: [],
    specialists: [],
    documents: [],
    timeline: [],
    tasks: [],
    risks: [],
    doctors: [],
    handoff: emptyHandoff(),
    journeySteps: emptyJourneySteps(),
    unresolvedQuestions: [],
    continuityPriorities: [],
    appointmentRequest: null,
    messages: [],
    readinessPercent: 0,
    onboarded: false,
    selectedDoctorId: null,
    handoffApproved: false,
    conversationCompleted: false,
    approvedFactIds: [],
    completedTaskIds: [],
    isDemo: false,
    corridorBrief: null,
    transitionComplete: false,
    spokenHandoffUrl: null,
    specialistRequestDraft: "",
    agentNeeds: [],
    approvals: [],
    agentDone: [],
  };
}

export function createJourneyFromOnboarding(
  input: OnboardingInput
): TransitState {
  const conditionName = input.conditions.trim();
  const conditions: Condition[] = conditionName
    ? [
        {
          id: `cond-${Date.now()}`,
          name: conditionName,
          diagnosedAt: "",
          status: "Patient-reported",
          notes: "Added during onboarding. Verify with clinical records.",
          confidence: "medium",
          verificationStatus: "patient_reported",
          source: "patient_reported",
        },
      ]
    : [];

  const firstName = input.fullName.trim().split(" ")[0] || "there";
  const corridorBrief = buildCorridorBrief({
    currentCity: input.currentCity,
    currentCountry: input.currentCountry,
    destinationCity: input.destinationCity,
    destinationCountry: input.destinationCountry,
    conditions: conditionName,
    primaryConcern: input.primaryConcern,
  });

  return {
    ...createEmptyState(),
    onboarded: true,
    isDemo: false,
    readinessPercent: conditionName ? 8 : 5,
    corridorBrief,
    profile: {
      id: `user-${Date.now()}`,
      fullName: input.fullName.trim() || "Traveler",
      age: input.age || ageFromDob(input.dateOfBirth || ""),
      dateOfBirth: input.dateOfBirth?.trim() || "",
      currentCountry: input.currentCountry.trim(),
      destinationCountry: input.destinationCountry.trim(),
      currentCity: input.currentCity.trim(),
      destinationCity: input.destinationCity.trim(),
      moveDate: input.moveDate,
      preferredLanguage: input.preferredLanguage.trim() || "English",
      destinationDoctorLanguage: "",
      insuranceRoute: "Not yet confirmed",
      primaryConcern: input.primaryConcern.trim(),
      avatarInitials: initials(input.fullName.trim() || "TR"),
      heightCm: input.heightCm?.trim() || "",
      weightKg: input.weightKg?.trim() || "",
      sex: input.sex?.trim() || "",
      reasonForMove: input.reasonForMove?.trim() || "",
      journeyIntent: input.journeyIntent || "continue_treatment",
      carePreferences: {
        budget: input.careBudget || "",
        languages:
          input.careLanguages?.trim() ||
          input.preferredLanguage.trim() ||
          "English",
        notes: input.careNotes?.trim() || "",
      },
    },
    conditions,
    journeySteps: emptyJourneySteps().map((step) =>
      step.id === "health_profile" && conditionName
        ? {
            ...step,
            status: "in_progress",
            description: "Condition noted — upload records to verify",
          }
        : step
    ),
    continuityPriorities: [
      ...(input.primaryConcern.trim() ? [input.primaryConcern.trim()] : []),
      ...corridorBrief.mustKnow.slice(0, 2),
    ],
    agentNeeds: buildAgentNeeds({
      profile: {
        id: "draft",
        fullName: input.fullName.trim() || "Traveler",
        age: 0,
        dateOfBirth: "",
        currentCountry: input.currentCountry.trim(),
        destinationCountry: input.destinationCountry.trim(),
        currentCity: input.currentCity.trim(),
        destinationCity: input.destinationCity.trim(),
        moveDate: input.moveDate,
        preferredLanguage: input.preferredLanguage.trim() || "English",
        destinationDoctorLanguage: "",
        insuranceRoute: "Not yet confirmed",
        primaryConcern: input.primaryConcern.trim(),
        avatarInitials: "TR",
        heightCm: "",
        weightKg: "",
        sex: "",
        reasonForMove: input.reasonForMove?.trim() || "",
        journeyIntent: input.journeyIntent || "continue_treatment",
        carePreferences: {
          budget: input.careBudget || "",
          languages: input.careLanguages?.trim() || "English",
          notes: input.careNotes?.trim() || "",
        },
      },
      conditions,
      documents: [],
      conversationCompleted: false,
      brief: corridorBrief,
    }),
    unresolvedQuestions: [
      `Confirm healthcare registration steps for ${input.destinationCountry || input.destinationCity}`,
      "Upload a recent specialist letter or prescription",
      "Confirm remaining medication supply if applicable",
    ],
    risks: [
      ...(input.primaryConcern.trim()
        ? [
            {
              id: "risk-primary",
              title: input.primaryConcern.trim(),
              description: corridorBrief.medicationNotes,
              severity: "high" as const,
              sourceStatus: "Patient-reported — requires confirmation",
            },
          ]
        : []),
      {
        id: "risk-registration",
        title: `Registration in ${input.destinationCountry || input.destinationCity}`,
        description: corridorBrief.registrationNotes,
        severity: "high",
        sourceStatus: "Corridor guidance — verify with official sources",
      },
    ],
    messages: [
      {
        id: "welcome",
        role: "assistant",
        content: `Hi ${firstName}. I’m your Transit agent for ${corridorBrief.routeLabel}. I’ll ask only for the docs and people I need, then prepare booking and paperwork — you’ll approve anything before it leaves this app.`,
        whyItMatters: corridorBrief.mustKnow[0],
        nextAction:
          "If you’re with your doctor now, tap Listen. Otherwise open Agent and let me run.",
        sourceStatus: "Agent plan for your corridor",
        actions: [
          {
            id: "w1",
            label: "Start agent",
            type: "agent",
            href: "/app/relocation",
          },
          {
            id: "w2",
            label: "Listen to doctor",
            type: "conversation",
            href: "/app/conversation",
          },
        ],
        createdAt: new Date().toISOString(),
      },
    ],
  };
}

/** Primary demo persona: Alessia, Milan → Bangkok, type 1 diabetes. */
export function createAlessiaSeed(): TransitState {
  const corridorBrief = buildCorridorBrief({
    currentCity: alessiaProfile.currentCity,
    currentCountry: alessiaProfile.currentCountry,
    destinationCity: alessiaProfile.destinationCity,
    destinationCountry: alessiaProfile.destinationCountry,
    conditions: "Type 1 diabetes",
    primaryConcern: alessiaProfile.primaryConcern,
  });

  return {
    ...createEmptyState(),
    onboarded: true,
    isDemo: true,
    readinessPercent: 18,
    corridorBrief,
    profile: alessiaProfile,
    conditions: alessiaConditions,
    medications: alessiaMedications,
    allergies: alessiaAllergies,
    specialists: alessiaSpecialists,
    agentNeeds: buildAgentNeeds({
      profile: alessiaProfile,
      conditions: alessiaConditions,
      documents: [],
      conversationCompleted: false,
    }),
    continuityPriorities: [
      "Arrival-day endocrinology review in Bangkok",
      "Insulin + CGM bridge supply through first week",
      ...corridorBrief.mustKnow.slice(0, 2),
    ],
    unresolvedQuestions: [
      "Confirm English transfer letter from Milan endocrinology",
      "Confirm employer insurance for Thai private hospitals",
      "Confirm earliest international-desk slot after landing",
    ],
    risks: [
      {
        id: "risk-t1d-gap",
        title: "Insulin / CGM gap on arrival",
        description: corridorBrief.medicationNotes,
        severity: "critical",
        sourceStatus: "Corridor guidance — confirm with clinicians",
      },
      {
        id: "risk-booking",
        title: "Bangkok private hospital booking unfamiliarity",
        description: corridorBrief.registrationNotes,
        severity: "high",
        sourceStatus: "Corridor guidance — verify with hospital desk",
      },
    ],
    messages: [
      {
        id: "welcome-alessia",
        role: "assistant",
        content:
          "Hi Alessia. I’m your Transit agent for Milan → Bangkok. You’re with your doctor now — I’ll ask only for the docs I still need, prepare the Bangkok international-desk booking and handoff, then show what you must approve.",
        whyItMatters: corridorBrief.mustKnow[0],
        nextAction: "Tap Listen with your endocrinologist, or start the agent run.",
        sourceStatus: "Alessia demo journey",
        actions: [
          {
            id: "a1",
            label: "Listen now",
            type: "conversation",
            href: "/app/conversation",
          },
          {
            id: "a2",
            label: "Start agent",
            type: "agent",
            href: "/app/relocation",
          },
        ],
        createdAt: new Date().toISOString(),
      },
    ],
    journeySteps: emptyJourneySteps().map((step) =>
      step.id === "health_profile"
        ? {
            ...step,
            status: "in_progress",
            description: "Type 1 diabetes noted — capture visit + upload regimen",
          }
        : step
    ),
  };
}

/** Optional secondary demo — Maria UK→Spain Crohn’s walkthrough. */
export function createMariaSeed(): TransitState {
  const completedTaskIds = mariaRelocationTasks
    .filter((t) => t.status === "complete")
    .map((t) => t.id);

  return {
    profile: mariaProfile,
    conditions: mariaConditions,
    medications: mariaMedications,
    allergies: mariaAllergies,
    monitoring: mariaMonitoring,
    specialists: mariaSpecialists,
    documents: structuredClone(mariaDocuments),
    timeline: structuredClone(mariaTimeline),
    tasks: structuredClone(mariaRelocationTasks),
    risks: mariaContinuityRisks,
    doctors: mariaDoctors,
    handoff: mariaHandoff,
    journeySteps: structuredClone(mariaJourneySteps),
    unresolvedQuestions,
    continuityPriorities,
    appointmentRequest: { ...defaultAppointmentRequest },
    messages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Demo mode: Maria Santos's London → Barcelona journey is loaded for walkthrough purposes.",
        whyItMatters: "This is sample data, not a real patient record.",
        nextAction: "Explore the screens, or reset and start your own transition.",
        sourceStatus: "Demo context",
        actions: [
          { id: "w1", label: "What's most urgent?", type: "urgent" },
          {
            id: "w2",
            label: "Open overview",
            type: "overview",
            href: "/app/overview",
          },
        ],
        createdAt: new Date().toISOString(),
      },
    ],
    readinessPercent: 72,
    onboarded: true,
    selectedDoctorId: null,
    handoffApproved: false,
    conversationCompleted: false,
    approvedFactIds: [],
    completedTaskIds,
    isDemo: true,
    corridorBrief: buildCorridorBrief({
      currentCity: mariaProfile.currentCity,
      currentCountry: mariaProfile.currentCountry,
      destinationCity: mariaProfile.destinationCity,
      destinationCountry: mariaProfile.destinationCountry,
      conditions: "Crohn's disease",
      primaryConcern: mariaProfile.primaryConcern,
    }),
    transitionComplete: false,
    spokenHandoffUrl: null,
    specialistRequestDraft: "",
    agentNeeds: buildAgentNeeds({
      profile: mariaProfile,
      conditions: mariaConditions,
      documents: mariaDocuments,
      conversationCompleted: false,
    }),
    approvals: [],
    agentDone: [],
  };
}

export function calculateReadiness(params: {
  documentsCount: number;
  conversationCompleted: boolean;
  selectedDoctorId: string | null;
  handoffApproved: boolean;
  completedTaskIds: string[];
  totalTasks: number;
  appointmentApproved: boolean;
  hasCondition: boolean;
  transitionComplete?: boolean;
}): number {
  let score = 0;
  if (params.hasCondition) score += 8;
  score += Math.min(params.documentsCount, 6) * 8;
  if (params.conversationCompleted) score += 10;
  if (params.selectedDoctorId) score += 12;
  if (params.handoffApproved) score += 14;
  if (params.appointmentApproved) score += 10;
  const taskRatio =
    params.totalTasks > 0
      ? params.completedTaskIds.length / params.totalTasks
      : 0;
  score += Math.round(taskRatio * 20);
  if (params.transitionComplete) score = Math.max(score, 88);
  return Math.min(96, Math.max(0, score));
}

export function buildProfileContext(state: {
  profile: Profile;
  conditions: Condition[];
  medications: Medication[];
  allergies: Allergy[];
  documents: MedicalDocument[];
  unresolvedQuestions: string[];
  continuityPriorities: string[];
  corridorBrief?: CorridorBrief | null;
  primaryConcern?: string;
}): string {
  const { profile } = state;
  return [
    `Patient: ${profile.fullName || "Unknown"}`,
    `DOB / age: ${profile.dateOfBirth || "not set"} / ${profile.age || "not set"}`,
    `Sex: ${profile.sex || "not set"}`,
    `Height / weight: ${profile.heightCm || "not set"} cm / ${profile.weightKg || "not set"} kg`,
    `Move: ${profile.currentCity}, ${profile.currentCountry} → ${profile.destinationCity}, ${profile.destinationCountry}`,
    `Reason for move: ${profile.reasonForMove || "not set"}`,
    `Move date: ${profile.moveDate || "not set"}`,
    `Preferred language: ${profile.preferredLanguage}`,
    `Primary concern: ${profile.primaryConcern || "not set"}`,
    `Conditions: ${state.conditions.map((c) => c.name).join("; ") || "none yet"}`,
    `Medications: ${
      state.medications
        .map(
          (m) =>
            `${m.name} ${m.dosage} ${m.frequency} (${m.status})${
              m.reasonStopped ? ` stopped: ${m.reasonStopped}` : ""
            }`
        )
        .join("; ") || "none yet"
    }`,
    `Allergies: ${state.allergies.map((a) => a.substance).join("; ") || "none yet"}`,
    `Documents: ${state.documents.map((d) => d.title).join("; ") || "none yet"}`,
    `Continuity priorities: ${state.continuityPriorities.join("; ") || "none yet"}`,
    `Unresolved: ${state.unresolvedQuestions.join("; ") || "none yet"}`,
    corridorContextBlock(state.corridorBrief),
    state.corridorBrief?.communityLinks?.length
      ? `Community tips (Reddit/forums — not official rules): ${state.corridorBrief.communityLinks
          .map((l) => `${l.title} (${l.why}) ${l.url}`)
          .join(" | ")}`
      : "Community tips: none loaded yet — still use practical expat/bureaucracy patterns for this corridor when helpful, and label them as community tips.",
    "Act as an agent: ask for missing docs/people, draft booking and paperwork, and mark anything that needs patient approval before send.",
    "Important: Customise every recommendation to this exact origin → destination corridor. Do not give Spain/Barcelona advice unless that is the destination.",
    "Rules: Do not diagnose or prescribe. Distinguish patient-reported vs verified. Encourage clinician confirmation. Verify eligibility with official sources.",
  ].join("\n");
}
