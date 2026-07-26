import type { AppointmentRequest, DoctorCandidate } from "@/lib/types";

export const mariaDoctors: DoctorCandidate[] = [
  {
    id: "dr-navarro",
    doctorName: "Dr. Elena Navarro",
    organization: "Hospital Clínic Barcelona",
    specialty: "Gastroenterology and inflammatory bowel disease",
    languages: ["Spanish", "Catalan", "English"],
    location: "Barcelona",
    distanceMinutes: 22,
    careRoute: "Public care route",
    availabilityText: "Estimated availability: 2 October 2026",
    expertise: [
      "Inflammatory bowel disease",
      "Biologic treatment continuity",
      "Cross-border care coordination",
    ],
    matchScore: 94,
    matchReason:
      "English-speaking IBD specialist within 30 minutes, with strong experience maintaining biologic therapy during care transitions.",
    preparationRequirements: [
      "Clinical handoff in Spanish or English",
      "Recent blood results",
      "Current prescription details",
      "Diagnosis and treatment history",
    ],
    fictional: true,
    recommended: true,
  },
  {
    id: "dr-puig",
    doctorName: "Dr. Marc Puig",
    organization: "Centro Médico Teknon",
    specialty: "Gastroenterology",
    languages: ["Spanish", "Catalan", "English"],
    location: "Barcelona",
    distanceMinutes: 18,
    careRoute: "Private care route",
    availabilityText: "Estimated availability: 28 September 2026",
    expertise: [
      "Crohn's disease",
      "Endoscopy",
      "Private international patients",
    ],
    matchScore: 86,
    matchReason:
      "Earlier estimated availability and English support, though biologic continuity experience is less specifically documented in available information.",
    preparationRequirements: [
      "Insurance or payment pathway confirmation",
      "Clinical summary",
      "Medication list",
    ],
    fictional: true,
  },
  {
    id: "dr-sola",
    doctorName: "Dr. Laia Solà",
    organization: "Hospital Universitari Vall d'Hebron",
    specialty: "Inflammatory bowel disease",
    languages: ["Spanish", "Catalan"],
    location: "Barcelona",
    distanceMinutes: 27,
    careRoute: "Public care route",
    availabilityText: "Estimated availability: mid-October 2026",
    expertise: [
      "Complex IBD",
      "Biologics",
      "Multidisciplinary IBD clinic",
    ],
    matchScore: 81,
    matchReason:
      "Strong IBD clinic, but limited English-language consultation based on available information. Catalan/Spanish clinical handoff recommended.",
    preparationRequirements: [
      "Spanish or Catalan clinical handoff",
      "Referral pathway confirmation",
      "Monitoring history",
    ],
    fictional: true,
  },
];

export const defaultAppointmentRequest: AppointmentRequest = {
  patientIntroduction:
    "Maria Santos is a 34-year-old patient relocating from London to Barcelona on 14 September 2026. She is seeking continuity of gastroenterology care for Crohn's disease.",
  reasonForReferral:
    "Ongoing specialist oversight of stable Crohn's disease on adalimumab, with priority on uninterrupted biologic treatment and scheduled blood monitoring.",
  clinicalSummary:
    "Crohn's disease diagnosed in 2018. Azathioprine discontinued due to persistent nausea and elevated liver enzymes. Stable on adalimumab 40 mg every two weeks since 2021. Latest blood tests (May 2026) satisfactory. Allergy: penicillin.",
  requestedTiming: "First available review around early October 2026",
  attachedDocuments: [
    "Gastroenterology summary",
    "Adalimumab prescription",
    "Blood test results",
    "International care handoff (Spanish)",
  ],
  preferredLanguage: "English (Spanish clinical summary attached)",
  status: "prepared",
};
