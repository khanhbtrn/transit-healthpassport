import type {
  Allergy,
  Condition,
  ContinuityRisk,
  JourneyStep,
  Medication,
  MonitoringRequirement,
  Profile,
  Specialist,
} from "@/lib/types";

export const mariaProfile: Profile = {
  id: "maria-santos",
  fullName: "Maria Santos",
  age: 34,
  dateOfBirth: "1992-03-18",
  currentCountry: "United Kingdom",
  destinationCountry: "Spain",
  currentCity: "London",
  destinationCity: "Barcelona",
  moveDate: "2026-09-14",
  preferredLanguage: "English",
  destinationDoctorLanguage: "Spanish or Catalan",
  insuranceRoute: "Not yet confirmed",
  primaryConcern: "Avoid interruption to biologic treatment",
  avatarInitials: "MS",
  heightCm: "165",
  weightKg: "58",
  sex: "Female",
  reasonForMove: "Relocating for work",
}

export const mariaConditions: Condition[] = [
  {
    id: "cond-crohns",
    name: "Crohn's disease",
    diagnosedAt: "2018-06-12",
    status: "Stable",
    notes:
      "Ileocolonic Crohn's disease. Currently stable on adalimumab with regular monitoring.",
    confidence: "high",
    verificationStatus: "verified",
    source: "specialist_letter",
  },
];

export const mariaMedications: Medication[] = [
  {
    id: "med-adalimumab",
    name: "Adalimumab",
    dosage: "40 mg",
    frequency: "Every two weeks",
    startDate: "2021-02-08",
    status: "current",
    prescribingSpecialist: "Dr. Amelia Reed",
    confidence: "high",
    verificationStatus: "verified",
    source: "prescription",
  },
  {
    id: "med-azathioprine",
    name: "Azathioprine",
    dosage: "100 mg",
    frequency: "Once daily",
    startDate: "2019-04-03",
    endDate: "2020-11-20",
    status: "stopped",
    reasonStopped: "Persistent nausea and elevated liver enzymes",
    prescribingSpecialist: "Dr. Amelia Reed",
    confidence: "high",
    verificationStatus: "verified",
    source: "specialist_letter",
  },
];

export const mariaAllergies: Allergy[] = [
  {
    id: "allergy-penicillin",
    substance: "Penicillin",
    reaction: "Rash and swelling",
    severity: "Moderate",
    verificationStatus: "patient_reported",
    source: "patient_reported",
  },
];

export const mariaMonitoring: MonitoringRequirement[] = [
  {
    id: "mon-bloods",
    title: "Blood tests",
    frequency: "Every three months",
    lastCompleted: "2026-05-22",
    notes: "Latest results satisfactory. Continued monitoring required.",
    source: "lab_report",
    verificationStatus: "verified",
  },
];

export const mariaSpecialists: Specialist[] = [
  {
    id: "spec-reed",
    name: "Dr. Amelia Reed",
    specialty: "Gastroenterology",
    organization: "Thames Valley Gastroenterology Clinic",
    location: "London, United Kingdom",
    relationship: "Current specialist",
  },
];

export const mariaContinuityRisks: ContinuityRisk[] = [
  {
    id: "risk-supply",
    title: "Medication supply may end 18 days after arrival",
    description:
      "Based on available information, Maria's current adalimumab supply may end around 2 October 2026. Local prescription oversight should be confirmed before then.",
    severity: "critical",
    sourceStatus: "Based on available information — verify with prescribing clinician",
  },
  {
    id: "risk-letter",
    title: "Final specialist letter is not signed",
    description:
      "A signed gastroenterology summary from Dr. Reed will strengthen continuity of care and support specialist referral in Spain.",
    severity: "high",
    sourceStatus: "Requires confirmation",
  },
  {
    id: "risk-bloods",
    title: "Latest blood test requires review",
    description:
      "May 2026 blood results are available but should be reviewed before sharing with the destination clinic.",
    severity: "medium",
    sourceStatus: "Needs review",
  },
  {
    id: "risk-route",
    title: "Destination care route is not confirmed",
    description:
      "Healthcare eligibility and registration pathway in Spain must be verified with official sources. Transit does not determine legal eligibility.",
    severity: "high",
    sourceStatus: "Verify with the relevant official provider",
  },
];

export const mariaJourneySteps: JourneyStep[] = [
  {
    id: "health_profile",
    title: "Health profile",
    status: "complete",
    description: "Condition, medications, and allergies reconstructed",
  },
  {
    id: "records_collected",
    title: "Records collected",
    status: "in_progress",
    description: "6 documents uploaded — final specialist letter pending",
  },
  {
    id: "medication_review",
    title: "Medication review",
    status: "needs_review",
    description: "Supply duration and destination oversight need confirmation",
  },
  {
    id: "healthcare_registration",
    title: "Healthcare registration",
    status: "waiting",
    description: "Spain eligibility route not yet confirmed",
  },
  {
    id: "specialist_selection",
    title: "Specialist selection",
    status: "ready",
    description: "Recommended gastroenterologist identified",
  },
  {
    id: "clinical_handoff",
    title: "Clinical handoff",
    status: "ready",
    description: "Translated handoff prepared for review",
  },
  {
    id: "arrival_readiness",
    title: "Arrival readiness",
    status: "in_progress",
    description: "Care coordination nearly complete",
  },
];

export const unresolvedQuestions = [
  "Has Dr. Reed signed the final gastroenterology summary?",
  "How many adalimumab doses remain after the move date?",
  "Which Spanish healthcare eligibility route will Maria use?",
  "Will the destination clinic accept a direct specialist request or require primary care referral?",
];

export const continuityPriorities = [
  "Do not interrupt biologic treatment (adalimumab)",
  "Document azathioprine intolerance and elevated liver enzymes",
  "Continue blood monitoring every three months",
  "Share verified diagnosis and treatment history with the new specialist",
];
