import type { DoctorCandidate } from "@/lib/types";

function blob(...parts: string[]) {
  return parts.join(" ").toLowerCase();
}

export function suggestDoctorsForDestination(input: {
  destinationCity: string;
  destinationCountry: string;
  condition?: string;
  preferredLanguage?: string;
}): DoctorCandidate[] {
  const place = blob(input.destinationCity, input.destinationCountry);
  const condition = input.condition || "specialist care";
  const language = input.preferredLanguage || "English";
  const city = input.destinationCity || "your city";

  if (
    place.includes("uk") ||
    place.includes("united kingdom") ||
    place.includes("london") ||
    place.includes("england")
  ) {
    return [
      {
        id: `doc-uk-1-${Date.now()}`,
        doctorName: "Dr. Sarah Whitfield",
        organization: city.toLowerCase().includes("london")
          ? "NHS teaching hospital clinic (London)"
          : `NHS specialist clinic near ${city}`,
        specialty: condition,
        languages: ["English"],
        location: city,
        distanceMinutes: 25,
        careRoute: "NHS referral pathway — confirm locally",
        availabilityText: "Usually via GP referral or private clinic",
        expertise: [condition, "Cross-border record review"],
        matchScore: 90,
        matchReason:
          "UK care often starts with GP registration, then specialist referral. This is a planning suggestion only.",
        preparationRequirements: [
          "English clinical summary",
          "Medication list",
          "Key imaging/pathology reports",
        ],
        fictional: true,
        recommended: true,
      },
      {
        id: `doc-uk-2-${Date.now()}`,
        doctorName: "Dr. James Okonkwo",
        organization: `Private specialty centre · ${city}`,
        specialty: condition,
        languages: ["English"],
        location: city,
        distanceMinutes: 18,
        careRoute: "Private — confirm fees and wait times",
        availabilityText: "Ask clinic for earliest review",
        expertise: [condition, "International patients"],
        matchScore: 84,
        matchReason:
          "Private route can be faster while NHS registration is arranged.",
        preparationRequirements: ["Passport/ID", "Clinical handoff", "Payment/insurance details"],
        fictional: true,
      },
    ];
  }

  if (
    place.includes("spain") ||
    place.includes("barcelona") ||
    place.includes("madrid")
  ) {
    return [
      {
        id: `doc-es-1-${Date.now()}`,
        doctorName: "Dr. Elena Navarro",
        organization: `Hospital clinic · ${city}`,
        specialty: condition,
        languages: ["Spanish", "English", language].filter(
          (v, i, arr) => arr.indexOf(v) === i
        ),
        location: city,
        distanceMinutes: 22,
        careRoute: "Public or private — confirm locally",
        availabilityText: "Ask clinic for times",
        expertise: [condition, "Care continuity"],
        matchScore: 88,
        matchReason: `Suggested for ${condition} care in ${city}.`,
        preparationRequirements: [
          "Clinical summary",
          "Spanish handoff if possible",
          "Medication list",
        ],
        fictional: true,
        recommended: true,
      },
      {
        id: `doc-es-2-${Date.now()}`,
        doctorName: "Dr. Marc Puig",
        organization: `${city} Specialty Centre`,
        specialty: condition,
        languages: ["Spanish", "Catalan", "English"],
        location: city,
        distanceMinutes: 18,
        careRoute: "Private or public — confirm",
        availabilityText: "Ask clinic for times",
        expertise: [condition],
        matchScore: 80,
        matchReason: "Alternative nearby option.",
        preparationRequirements: ["Handoff"],
        fictional: true,
      },
    ];
  }

  if (
    place.includes("vietnam") ||
    place.includes("hanoi") ||
    place.includes("ho chi minh")
  ) {
    return [
      {
        id: `doc-vn-1-${Date.now()}`,
        doctorName: "Dr. Nguyen Minh Anh",
        organization: `International hospital · ${city}`,
        specialty: condition,
        languages: ["Vietnamese", "English"],
        location: city,
        distanceMinutes: 20,
        careRoute: "Hospital outpatient — confirm locally",
        availabilityText: "Ask hospital for specialist clinic times",
        expertise: [condition, "International patients"],
        matchScore: 86,
        matchReason: `Local specialist suggestion for ${city}.`,
        preparationRequirements: ["Clinical summary", "ID", "Medication list"],
        fictional: true,
        recommended: true,
      },
    ];
  }

  if (
    place.includes("afghanistan") ||
    place.includes("kabul") ||
    place.includes("herat") ||
    place.includes("kandahar")
  ) {
    return [
      {
        id: `doc-af-1-${Date.now()}`,
        doctorName: "Dr. Farid Ahmadi",
        organization: city.toLowerCase().includes("kabul")
          ? "Private specialty clinic · Kabul"
          : `Private clinic · ${city}`,
        specialty: condition,
        languages: ["Dari", "Pashto", "English"],
        location: city,
        distanceMinutes: 30,
        careRoute:
          "Private/NGO-supported city clinic — confirm current operations",
        availabilityText: "Call ahead; capacity changes with local conditions",
        expertise: [condition, "Continuity under constrained systems"],
        matchScore: 84,
        matchReason:
          "In Afghanistan, reachable private/NGO-linked city clinics are often the practical first review. Verify the facility is operating and can manage your therapy.",
        preparationRequirements: [
          "Full paper + digital clinical pack",
          "Medication list with generics",
          "Buffer supply plan",
          "ID",
        ],
        fictional: true,
        recommended: true,
      },
      {
        id: `doc-af-2-${Date.now()}`,
        doctorName: "Dr. Laila Rahimi",
        organization: `Hospital outpatient department · ${city}`,
        specialty: condition,
        languages: ["Dari", "Pashto"],
        location: city,
        distanceMinutes: 40,
        careRoute: "Hospital OPD — confirm specialty availability",
        availabilityText: "Ask which specialty days are running",
        expertise: [condition],
        matchScore: 76,
        matchReason:
          "Public/hospital outpatient access may be limited; use as backup after confirming the specialty is active.",
        preparationRequirements: [
          "Clinical summary",
          "Recent labs/imaging copies",
        ],
        fictional: true,
      },
    ];
  }

  if (
    place.includes("myanmar") ||
    place.includes("burma") ||
    place.includes("yangon") ||
    place.includes("mandalay")
  ) {
    return [
      {
        id: `doc-mm-1-${Date.now()}`,
        doctorName: "Dr. Aye Chan",
        organization: city.toLowerCase().includes("yangon")
          ? "Private hospital specialty clinic · Yangon"
          : `Private hospital · ${city}`,
        specialty: condition,
        languages: ["Burmese", "English"],
        location: city,
        distanceMinutes: 25,
        careRoute: "Private hospital outpatient — confirm locally",
        availabilityText: "Ask hospital specialty desk",
        expertise: [condition, "Transfer documentation"],
        matchScore: 85,
        matchReason:
          "In Myanmar, private hospitals in major cities are often the practical route for ongoing specialty review when accessible.",
        preparationRequirements: [
          "Signed clinical summary",
          "English translation if possible",
          "Medication list",
        ],
        fictional: true,
        recommended: true,
      },
    ];
  }

  return [
    {
      id: `doc-int-1-${Date.now()}`,
      doctorName: "Dr. Alex Rivera",
      organization: `Specialty clinic · ${city}`,
      specialty: condition,
      languages: [language, "English"].filter(
        (v, i, arr) => arr.indexOf(v) === i
      ),
      location: city,
      distanceMinutes: 20,
      careRoute: "Confirm local public/private pathway",
      availabilityText: "Ask clinic for times",
      expertise: [condition, "Care continuity"],
      matchScore: 82,
      matchReason: `Planning suggestion for ${city}. Verify independently.`,
      preparationRequirements: [
        "Clinical summary",
        "Medication list",
        "Translation if needed",
      ],
      fictional: true,
      recommended: true,
    },
    {
      id: `doc-int-2-${Date.now()}`,
      doctorName: "Dr. Priya Shah",
      organization: `${city} University clinic`,
      specialty: condition,
      languages: [language],
      location: city,
      distanceMinutes: 28,
      careRoute: "Confirm referral requirements",
      availabilityText: "Ask clinic for times",
      expertise: [condition],
      matchScore: 78,
      matchReason: "Alternative destination option.",
      preparationRequirements: ["Handoff", "ID/residence documents"],
      fictional: true,
    },
  ];
}
