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
import {
  buildCorridorBrief,
  corridorContextBlock,
  type CorridorBrief,
} from "@/lib/corridor/knowledge";
import type {
  AgentMessage,
  Allergy,
  AppointmentRequest,
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
        content: `Hi ${firstName}. For ${corridorBrief.routeLabel}: ${corridorBrief.summary}`,
        whyItMatters: corridorBrief.mustKnow[0],
        nextAction:
          "Add documents or listen to your doctor, then I’ll build a destination-specific plan.",
        sourceStatus: "Corridor guidance for your route",
        actions: [
          {
            id: "w1",
            label: "What’s important for my route?",
            type: "urgent",
          },
          {
            id: "w2",
            label: "Add documents",
            type: "documents",
            href: "/app/documents",
          },
        ],
        createdAt: new Date().toISOString(),
      },
    ],
  };
}

/** Optional investor/demo path only — not the default product experience. */
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
    "Important: Customise every recommendation to this exact origin → destination corridor. Do not give Spain/Barcelona advice unless that is the destination.",
    "Rules: Do not diagnose or prescribe. Distinguish patient-reported vs verified. Encourage clinician confirmation. Verify eligibility with official sources.",
  ].join("\n");
}
