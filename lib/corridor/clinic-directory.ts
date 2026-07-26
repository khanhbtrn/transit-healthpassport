import type { DoctorCandidate } from "@/lib/types";

export type ClinicDirectoryEntry = {
  id: string;
  organization: string;
  /** Public contact desk / team name (not a fake individual doctor) */
  contactTeam: string;
  specialty: string;
  city: string;
  countryId: string;
  careRoute: string;
  languages: string[];
  /** How Transit researched this entry */
  researchBasis: string;
  /** Official or public directory URL */
  directoryUrl: string;
  phonePublic?: string;
  preparationRequirements: string[];
  matchScore: number;
  conditions?: string[]; // keyword hints
};

/**
 * Curated directory of real healthcare organisations / public pathways.
 * Used for researched booking targets — not invented private practitioners.
 * Phones/URLs are from publicly listed hospital/NHS pages; always verify.
 */
const DIRECTORY: ClinicDirectoryEntry[] = [
  {
    id: "uk-nhs-find-gp",
    organization: "NHS Find a GP",
    contactTeam: "Local GP practice registration desk",
    specialty: "GP registration (NHS gateway)",
    city: "United Kingdom",
    countryId: "uk",
    careRoute: "NHS — register with a GP near your UK address first",
    languages: ["English"],
    researchBasis:
      "Official NHS pathway: most specialist NHS care starts after GP registration/referral.",
    directoryUrl: "https://www.nhs.uk/service-search/find-a-gp",
    preparationRequirements: [
      "Proof of address (when available)",
      "Photo ID",
      "English clinical summary + medication list",
    ],
    matchScore: 96,
  },
  {
    id: "uk-london-gstt-diabetes",
    organization: "Guy's and St Thomas' NHS Foundation Trust",
    contactTeam: "Diabetes / endocrinology outpatient referrals",
    specialty: "Diabetes / endocrinology",
    city: "London",
    countryId: "uk",
    careRoute: "NHS specialist — usually via GP referral",
    languages: ["English"],
    researchBasis:
      "Major London NHS trust with public diabetes/endocrinology services; access typically via GP.",
    directoryUrl: "https://www.guysandstthomas.nhs.uk/",
    preparationRequirements: [
      "GP referral (NHS)",
      "English summary from previous clinic",
      "Current insulin/device list if diabetic",
    ],
    matchScore: 90,
    conditions: ["diabetes", "insulin", "endocrin", "t1d"],
  },
  {
    id: "uk-london-uclh-endo",
    organization: "University College London Hospitals NHS Foundation Trust",
    contactTeam: "Endocrinology / diabetes services",
    specialty: "Endocrinology / diabetes",
    city: "London",
    countryId: "uk",
    careRoute: "NHS specialist — usually via GP referral",
    languages: ["English"],
    researchBasis:
      "UCLH publicly lists endocrinology/diabetes pathways; standard NHS referral model.",
    directoryUrl: "https://www.uclh.nhs.uk/",
    preparationRequirements: [
      "GP referral",
      "Recent labs / HbA1c if available",
      "Medication list",
    ],
    matchScore: 88,
    conditions: ["diabetes", "insulin", "endocrin", "t1d"],
  },
  {
    id: "uk-london-kings-diabetes",
    organization: "King's College Hospital NHS Foundation Trust",
    contactTeam: "Diabetes centre / outpatient booking",
    specialty: "Diabetes",
    city: "London",
    countryId: "uk",
    careRoute: "NHS specialist — usually via GP referral",
    languages: ["English"],
    researchBasis:
      "King's College Hospital is a well-known London diabetes centre; NHS referral still applies.",
    directoryUrl: "https://www.kch.nhs.uk/",
    preparationRequirements: ["GP referral", "Clinical summary", "Medication list"],
    matchScore: 87,
    conditions: ["diabetes", "insulin", "t1d"],
  },
  {
    id: "th-bangkok-bnh",
    organization: "BNH Hospital",
    contactTeam: "International patient centre",
    specialty: "Multi-specialty / international desk",
    city: "Bangkok",
    countryId: "thailand",
    careRoute: "Private hospital — book via international centre",
    languages: ["English", "Thai"],
    researchBasis:
      "Established Bangkok private hospital with public international patient services.",
    directoryUrl: "https://www.bnhhospital.com/",
    preparationRequirements: [
      "Passport",
      "English medical summary",
      "Payment / insurance method",
    ],
    matchScore: 86,
  },
  {
    id: "th-bangkok-bumrungrad",
    organization: "Bumrungrad International Hospital",
    contactTeam: "International medical coordination",
    specialty: "Multi-specialty / endocrinology available",
    city: "Bangkok",
    countryId: "thailand",
    careRoute: "Private international hospital",
    languages: ["English", "Thai"],
    researchBasis:
      "Major Bangkok international hospital; public international coordination desks accept emailed records.",
    directoryUrl: "https://www.bumrungrad.com/",
    preparationRequirements: [
      "English clinical pack",
      "Medication / device list",
      "Insurance or payment route",
    ],
    matchScore: 91,
    conditions: ["diabetes", "insulin", "endocrin", "t1d", "chronic"],
  },
  {
    id: "th-bangkok-samitivej",
    organization: "Samitivej Hospital",
    contactTeam: "International center",
    specialty: "Multi-specialty",
    city: "Bangkok",
    countryId: "thailand",
    careRoute: "Private hospital international center",
    languages: ["English", "Thai"],
    researchBasis:
      "Bangkok private hospital network with public international patient services.",
    directoryUrl: "https://www.samitivejhospitals.com/",
    preparationRequirements: ["Passport", "English summary", "Payment method"],
    matchScore: 84,
  },
];

function toCandidate(
  entry: ClinicDirectoryEntry,
  opts: { recommended?: boolean; condition?: string }
): DoctorCandidate {
  return {
    id: `${entry.id}-${Date.now()}`,
    doctorName: entry.contactTeam,
    organization: entry.organization,
    specialty: entry.specialty,
    languages: entry.languages,
    location: entry.city,
    distanceMinutes: entry.city === "London" ? 25 : 20,
    careRoute: entry.careRoute,
    availabilityText: entry.phonePublic
      ? `Public listing — verify hours before contact (${entry.phonePublic})`
      : "Use official website / international desk; verify before any real booking",
    expertise: [entry.specialty, "Researched organisation"],
    matchScore: entry.matchScore,
    matchReason: `${entry.researchBasis} Source: ${entry.directoryUrl}`,
    preparationRequirements: entry.preparationRequirements,
    fictional: false,
    recommended: opts.recommended,
  };
}

export function researchClinicsForDestination(input: {
  destinationCity: string;
  destinationCountry: string;
  destinationCountryId?: string;
  condition?: string;
}): DoctorCandidate[] {
  const place = `${input.destinationCity} ${input.destinationCountry}`.toLowerCase();
  const condition = (input.condition || "").toLowerCase();
  const countryId =
    input.destinationCountryId ||
    (place.includes("thailand") || place.includes("bangkok")
      ? "thailand"
      : place.includes("uk") ||
          place.includes("united kingdom") ||
          place.includes("london") ||
          place.includes("england")
        ? "uk"
        : "");

  let pool = DIRECTORY.filter((e) => e.countryId === countryId);
  if (!pool.length) return [];

  // City preference
  if (place.includes("london")) {
    const london = pool.filter(
      (e) => e.city.toLowerCase().includes("london") || e.id.includes("find-gp")
    );
    if (london.length) pool = london;
  }
  if (place.includes("bangkok")) {
    const bkk = pool.filter((e) => e.city.toLowerCase().includes("bangkok"));
    if (bkk.length) pool = bkk;
  }

  // Score by condition keywords
  const scored = pool
    .map((entry) => {
      let score = entry.matchScore;
      if (entry.conditions?.length && condition) {
        const hit = entry.conditions.some((c) => condition.includes(c));
        score += hit ? 8 : -4;
      }
      // Always keep GP registration high for UK
      if (entry.id === "uk-nhs-find-gp") score += 12;
      return { entry, score };
    })
    .sort((a, b) => b.score - a.score);

  const top = scored.slice(0, 3);
  return top.map((row, index) =>
    toCandidate(row.entry, {
      recommended: index === 0,
      condition: input.condition,
    })
  );
}
