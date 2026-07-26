import type {
  Allergy,
  Condition,
  Medication,
  Profile,
  Specialist,
} from "@/lib/types";

export const alessiaProfile: Profile = {
  id: "alessia-rossi",
  fullName: "Alessia Rossi",
  age: 29,
  dateOfBirth: "1996-11-04",
  currentCountry: "Italy",
  destinationCountry: "Thailand",
  currentCity: "Milan",
  destinationCity: "Bangkok",
  destinationArea: "",
  moveDate: "2026-08-18",
  preferredLanguage: "English",
  destinationDoctorLanguage: "English",
  insuranceRoute: "Employer private cover — confirm Thai network",
  primaryConcern:
    "Type 1 diabetes continuity — endocrinology visit on arrival day in Bangkok",
  avatarInitials: "AR",
  heightCm: "168",
  weightKg: "61",
  sex: "Female",
  reasonForMove: "Relocating for work — first time living outside Europe",
  journeyIntent: "continue_treatment",
  carePreferences: {
    budget: "insured",
    languages: "English, Italian",
    notes: "Needs earliest private hospital endocrinology slot after landing",
  },
};

export const alessiaConditions: Condition[] = [
  {
    id: "cond-t1d",
    name: "Type 1 diabetes",
    diagnosedAt: "2012-05-01",
    status: "Active — insulin dependent",
    notes:
      "Long-standing T1D. Uses basal-bolus insulin and CGM. No recent DKA. Needs transfer letter and arrival-week review in Bangkok.",
    confidence: "high",
    verificationStatus: "patient_reported",
    source: "patient_reported",
  },
];

export const alessiaMedications: Medication[] = [
  {
    id: "med-glargine",
    name: "Insulin glargine",
    dosage: "18 units",
    frequency: "Once daily at night",
    startDate: "2019-01-10",
    status: "current",
    prescribingSpecialist: "Dr. Elena Bianchi",
    confidence: "medium",
    verificationStatus: "patient_reported",
    source: "patient_reported",
  },
  {
    id: "med-aspart",
    name: "Insulin aspart",
    dosage: "Mealtime — carb counted",
    frequency: "With meals",
    startDate: "2019-01-10",
    status: "current",
    prescribingSpecialist: "Dr. Elena Bianchi",
    confidence: "medium",
    verificationStatus: "patient_reported",
    source: "patient_reported",
  },
];

export const alessiaAllergies: Allergy[] = [];

export const alessiaSpecialists: Specialist[] = [
  {
    id: "spec-milan-endo",
    name: "Dr. Elena Bianchi",
    specialty: "Endocrinology / diabetes",
    organization: "Private diabetes clinic · Milan",
    location: "Milan, Italy",
    relationship: "Current treating endocrinologist",
  },
];
