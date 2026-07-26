import { researchClinicsForDestination } from "@/lib/corridor/clinic-directory";
import { detectCountry } from "@/lib/corridor/countries";
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
  const country = detectCountry(input.destinationCity, input.destinationCountry);

  const researched = researchClinicsForDestination({
    destinationCity: input.destinationCity,
    destinationCountry: input.destinationCountry,
    destinationCountryId: country?.id,
    condition: input.condition,
  });
  if (researched.length) return researched;

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
    place.includes("thailand") ||
    place.includes("bangkok") ||
    place.includes("chiang mai") ||
    place.includes("phuket")
  ) {
    const diabetes = /diabetes|t1d|type\s*1|insulin|cgm|pump/.test(
      condition.toLowerCase()
    );
    const specialty = diabetes ? "Endocrinology / diabetes" : condition;
    const bangkok = city.toLowerCase().includes("bangkok") || place.includes("bangkok");
    return [
      {
        id: `doc-th-1-${Date.now()}`,
        doctorName: "Dr. Nattaporn Chaiyasit",
        organization: bangkok
          ? "Private tertiary hospital · International centre · Bangkok"
          : `Private hospital international desk · ${city}`,
        specialty,
        languages: ["Thai", "English"],
        location: bangkok ? "Bangkok" : city,
        distanceMinutes: 22,
        careRoute:
          "Book via international patient centre — email records + payment route first",
        availabilityText: diabetes
          ? "Ask for earliest endocrinology slot on/after arrival day"
          : "Ask international desk for earliest specialty slot",
        expertise: diabetes
          ? ["Type 1 diabetes", "Insulin / pump continuity", "Expat patients"]
          : [condition, "International patients"],
        matchScore: 92,
        matchReason: diabetes
          ? "Bangkok private hospitals with international desks are the usual expat path for T1D — they can pre-register you and hold an appointment when English records arrive."
          : `Practical first specialty contact in ${city} via international desk.`,
        preparationRequirements: diabetes
          ? [
              "English endocrinology transfer letter",
              "Insulin / pump / CGM list",
              "Recent HbA1c",
              "Passport + payment/insurance",
            ]
          : ["English clinical summary", "Medication list", "Passport", "Payment/insurance"],
        fictional: true,
        recommended: true,
      },
      {
        id: `doc-th-2-${Date.now()}`,
        doctorName: "Dr. Siriporn Wattana",
        organization: bangkok
          ? "University-affiliated private diabetes clinic · Bangkok"
          : `Specialty outpatient · ${city}`,
        specialty,
        languages: ["Thai", "English"],
        location: bangkok ? "Bangkok" : city,
        distanceMinutes: 30,
        careRoute: "Private outpatient — confirm fees and English clinic days",
        availabilityText: "Backup slot if tertiary hospital wait is long",
        expertise: diabetes
          ? ["Diabetes education", "CGM review"]
          : [condition],
        matchScore: 84,
        matchReason:
          "Secondary option if you want a diabetes-focused outpatient review after the hospital file is open.",
        preparationRequirements: [
          "Handoff letter",
          "Device downloads if available",
          "ID",
        ],
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

  if (
    place.includes("angola") ||
    place.includes("luanda") ||
    place.includes("benguela")
  ) {
    const pregnancy = condition.toLowerCase().includes("pregnan");
    return [
      {
        id: `doc-ao-1-${Date.now()}`,
        doctorName: "Dra. Ana Moreira",
        organization: city.toLowerCase().includes("luanda")
          ? "Private maternity & family clinic · Luanda"
          : `Private clinic · ${city}`,
        specialty: pregnancy ? "Antenatal / obstetrics" : condition,
        languages: ["Portuguese", "English"],
        location: city,
        distanceMinutes: 22,
        careRoute: "Private clinic — confirm fees and NGO insurance",
        availabilityText: "Book early for antenatal slots",
        expertise: pregnancy
          ? ["Antenatal care", "NGO/expat patients"]
          : [condition, "Expat care"],
        matchScore: 88,
        matchReason:
          "Luanda private clinics are the usual practical path for NGO/expat care, including pregnancy booking.",
        preparationRequirements: [
          "Passport/ID",
          "Prenatal notes or health summary",
          "Vaccine card if available",
          "Payment/insurance method",
        ],
        fictional: true,
        recommended: true,
      },
      {
        id: `doc-ao-2-${Date.now()}`,
        doctorName: "Dr. João Ferreira",
        organization: `Private hospital outpatient · ${city}`,
        specialty: condition,
        languages: ["Portuguese"],
        location: city,
        distanceMinutes: 35,
        careRoute: "Private hospital — Portuguese-first",
        availabilityText: "Ask international desk for English availability",
        expertise: [condition],
        matchScore: 80,
        matchReason:
          "Hospital outpatient backup if you need broader diagnostics.",
        preparationRequirements: ["Clinical summary", "Portuguese translation helpful"],
        fictional: true,
      },
    ];
  }

  if (
    place.includes("california") ||
    place.includes("united states") ||
    place.includes("usa") ||
    place.includes("los angeles") ||
    place.includes("san francisco") ||
    place.includes("san diego") ||
    place.includes("berkeley")
  ) {
    return [
      {
        id: `doc-us-1-${Date.now()}`,
        doctorName: "Dr. Emily Chen",
        organization: `Campus / student health · ${city}`,
        specialty: condition,
        languages: ["English", language].filter(
          (v, i, arr) => arr.indexOf(v) === i
        ),
        location: city,
        distanceMinutes: 12,
        careRoute: "Campus health or urgent care — confirm student access",
        availabilityText: "Check campus health hours and insurance rules",
        expertise: [condition, "Student health", "Vaccine records"],
        matchScore: 90,
        matchReason:
          "For international students, campus health or urgent care is often the fastest first step for injuries and vaccine gaps.",
        preparationRequirements: [
          "Student ID / insurance card",
          "Vaccine scraps and translations",
          "Imaging/reports if any",
        ],
        fictional: true,
        recommended: true,
      },
      {
        id: `doc-us-2-${Date.now()}`,
        doctorName: "Dr. Marcus Cole",
        organization: `Primary care clinic · ${city}`,
        specialty: "Primary care",
        languages: ["English"],
        location: city,
        distanceMinutes: 20,
        careRoute: "Insurance network primary care",
        availabilityText: "New-patient wait times vary",
        expertise: ["Primary care", "Referrals"],
        matchScore: 84,
        matchReason:
          "A primary care clinic helps assemble ongoing care and referrals after the first urgent issue is handled.",
        preparationRequirements: [
          "Insurance details",
          "Medication list",
          "Record pack",
        ],
        fictional: true,
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
