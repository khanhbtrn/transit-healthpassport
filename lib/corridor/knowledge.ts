import {
  detectCountry,
  type CountryHealthProfile,
} from "@/lib/corridor/countries";

export interface CorridorBrief {
  routeLabel: string;
  summary: string;
  mustKnow: string[];
  registrationNotes: string;
  careSystemNotes: string;
  languageNotes: string;
  medicationNotes: string;
  specialistNotes: string;
  officialReminders: string[];
  generatedAt: string;
  source: "knowledge" | "ai";
  fromCountryId?: string;
  toCountryId?: string;
}

type Playbook = Omit<
  CorridorBrief,
  "routeLabel" | "generatedAt" | "source" | "fromCountryId" | "toCountryId"
>;

/** High-value corridor overrides when we have extra route-specific detail. */
const corridorOverrides: Record<string, Playbook> = {
  "vietnam->uk": {
    summary:
      "Vietnam → UK: you are moving from a hospital-letter culture into an NHS system where GP registration is usually the gateway to specialists. English records, entitlement checks, and a medication bridge plan matter more than a perfect folder of Vietnamese paperwork.",
    mustKnow: [
      "Before leaving Vietnam: get a signed hospital/clinic summary with diagnosis, stage/severity, recent labs/imaging, and exact medication names (generic + dose).",
      "Translate key Vietnamese documents into English — receiving UK clinicians will not work from untranslated scans alone.",
      "In the UK: register with a GP once you have an address; NHS specialist care is typically referral-based.",
      "Do not assume a Vietnam prescription continues — a UK clinician usually must review and re-prescribe specialty drugs.",
      "Verify NHS entitlement for your immigration/residence situation on official UK pages before you rely on it.",
      "If therapy is time-critical, ask your Vietnam clinician for a written urgency statement and last/next dose dates.",
    ],
    registrationNotes:
      "UK first step is commonly GP registration with a local practice after you have a suitable address. Private clinics can give earlier specialty review but do not replace NHS registration.",
    careSystemNotes:
      "Vietnam care is often hospital/clinic episode-based. The UK is GP-led with referred specialty pathways (NHS) plus a separate private market.",
    languageNotes:
      "English clinical summary is essential. Keep Vietnamese originals as backup.",
    medicationNotes:
      "Map every drug to a generic name, remaining supply, and next due date. Specialty medicines in the UK usually need local clinician approval and may need hospital/homecare setup.",
    specialistNotes:
      "Identify the UK specialty early (e.g. gastroenterology, oncology). Prepare a referral-style handoff your GP or private clinic can use immediately.",
    officialReminders: [
      "Confirm NHS registration/entitlement on official NHS / GOV.UK sources.",
      "Transit prepares guidance — it does not determine eligibility.",
    ],
  },
  "uk->spain": {
    summary:
      "UK → Spain: leave with a signed specialist letter and decide public vs private Spanish routes before you need care. Spanish (and Catalan in Catalonia) handoffs reduce first-visit friction.",
    mustKnow: [
      "Request a signed UK specialist summary and current medication list before you leave.",
      "Decide whether your first Spanish care will be public registration pathway or private clinic/insurance.",
      "Prepare a Spanish clinical handoff (Catalan too if Barcelona/Catalonia).",
      "Confirm how your specialty medicine is supplied in Spain — some biologics need specialist authorisation.",
      "Verify registration/eligibility with official Spanish or regional health sources for your status.",
    ],
    registrationNotes:
      "Public pathways are regional and status-dependent. Private clinics can see you sooner with complete records and payment/insurance.",
    careSystemNotes:
      "UK NHS is GP-gatekept. Spain mixes regional public care with a large private sector.",
    languageNotes:
      "Spanish handoff strongly preferred for local clinicians; keep an English master copy.",
    medicationNotes:
      "Bridge supply through travel and first Spanish specialist review. Confirm local brand/formulary equivalents.",
    specialistNotes:
      "Shortlist a destination specialist/clinic and send the UK letter ahead when possible.",
    officialReminders: [
      "Verify Spanish eligibility/registration with official authorities.",
      "Transit does not determine legal eligibility.",
    ],
  },
};

function unique(items: string[]) {
  return Array.from(new Set(items.filter(Boolean)));
}

function shorten(text: string, max = 120) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 60 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

function composeFromCountries(
  from: CountryHealthProfile | null,
  to: CountryHealthProfile | null,
  input: {
    currentCity: string;
    currentCountry: string;
    destinationCity: string;
    destinationCountry: string;
    conditions?: string;
    primaryConcern?: string;
  }
): Playbook {
  const fromLabel =
    from?.name ||
    input.currentCountry ||
    input.currentCity ||
    "your origin country";
  const toLabel =
    to?.name ||
    input.destinationCountry ||
    input.destinationCity ||
    "your destination country";
  const condition = input.conditions?.trim();
  const concern = input.primaryConcern?.trim();

  if (!from && !to) {
    return {
      summary: `We could not match a detailed healthcare profile for ${fromLabel} → ${toLabel} yet. Still: leave with a signed clinical summary, exact medication list, and confirm the destination’s first registration step before you travel.`,
      mustKnow: unique([
        concern ? `Your priority: ${concern}.` : "",
        condition
          ? `Document ${condition} with diagnosis detail, recent results, and treatment history.`
          : "Collect a current signed clinical summary before you travel.",
        `Learn the first official or practical registration step in ${toLabel}.`,
        "Confirm medication supply across the journey and first destination appointment.",
        "Carry paper and digital copies — do not rely on one hospital’s archive.",
        "Verify eligibility and facility capability with official/local sources.",
      ]),
      registrationNotes: `Confirm the official first registration or access step for ${toLabel}.`,
      careSystemNotes:
        "Healthcare systems differ in gatekeeping, insurance, and specialty access. A specific handoff beats generic advice.",
      languageNotes:
        "Prepare records in a language the destination clinic can use; keep originals.",
      medicationNotes:
        "Know remaining supply, generic names, and what a destination clinician needs before continuing treatment.",
      specialistNotes: `Identify the right specialty pathway in ${input.destinationCity || toLabel}.`,
      officialReminders: [
        "Verify destination healthcare requirements with official sources.",
        "Transit organises route-specific guidance — it does not replace clinicians or determine eligibility.",
      ],
    };
  }

  const summary = [
    `${fromLabel} → ${toLabel}.`,
    condition ? `Focus: keep ${condition} continuous.` : "",
    concern ? `Priority: ${concern}.` : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Short, actionable only — full system detail stays in other fields for the agent.
  const mustKnow = unique([
    from
      ? `Before leaving ${from.name}: get a signed summary, recent results, and exact meds/doses (paper + photos).`
      : `Before leaving: get a signed clinical summary and medication list.`,
    to
      ? `In ${to.name}: ${shorten(to.firstStepIn, 140)}`
      : `On arrival: confirm the first clinic/registration step before you need care.`,
    to
      ? `Meds in ${to.name}: ${shorten(to.medicationReality, 120)}`
      : "Plan medication supply through travel and the first destination appointment.",
    from && to
      ? `Records: prepare for ${to.languages[0] || "local language"}/English — ${shorten(from.recordsTip, 100)}`
      : "Carry paper and digital copies of every key record.",
    condition
      ? `For ${condition}: write last dose / next due date and what must not stop.`
      : "",
  ]).slice(0, 4);

  const languageNotes = unique([
    from
      ? `${from.name} records often involve: ${from.languages.join(", ")}. ${from.recordsTip}`
      : "",
    to
      ? `In ${to.name}, clinicians commonly use: ${to.languages.join(", ")}. ${to.recordsTip}`
      : "",
  ]).join(" ");

  const continuity = unique([
    ...(from?.continuityRisks.map((r) => `${from.name}: ${r}`) || []),
    ...(to?.continuityRisks.map((r) => `${to.name}: ${r}`) || []),
  ]);

  return {
    summary,
    mustKnow:
      mustKnow.length > 0
        ? mustKnow
        : [
            `Before leaving: get a signed clinical summary and medication list.`,
            `On arrival in ${toLabel}: confirm the first clinic/registration step.`,
          ],
    registrationNotes: to?.firstStepIn
      ? `${to.firstStepIn}${
          from ? ` (Also complete exit documentation from ${from.name}: ${from.firstStepOut})` : ""
        }`
      : `Confirm the first registration/access step in ${toLabel}.`,
    careSystemNotes: [
      from
        ? `${from.name}: ${from.systemType}. ${from.accessModel}`
        : `Origin (${fromLabel}): gather complete records before you lose access.`,
      to
        ? `${to.name}: ${to.systemType}. ${to.accessModel}`
        : `Destination (${toLabel}): confirm how new patients enter care.`,
      continuity.length
        ? `Key continuity risks — ${continuity.slice(0, 4).join("; ")}.`
        : "",
    ]
      .filter(Boolean)
      .join(" "),
    languageNotes:
      languageNotes ||
      "Prepare records in a language the destination clinic can use.",
    medicationNotes: [
      from?.medicationReality,
      to?.medicationReality,
      "List generic names, doses, last dose date, next due date, and what happens if the drug is unavailable for 2–4 weeks.",
    ]
      .filter(Boolean)
      .join(" "),
    specialistNotes: [
      to?.specialistReality,
      from?.specialistReality
        ? `From ${from.name}: ${from.specialistReality}`
        : "",
      `Target the correct specialty in ${input.destinationCity || toLabel} and send records ahead when the clinic allows.`,
    ]
      .filter(Boolean)
      .join(" "),
    officialReminders: unique([
      from?.officialHint || "",
      to?.officialHint || "",
      "Transit provides corridor-specific guidance from healthcare-system knowledge — always confirm with the clinic and official sources for your status.",
    ]),
  };
}

export function buildCorridorBrief(input: {
  currentCity: string;
  currentCountry: string;
  destinationCity: string;
  destinationCountry: string;
  conditions?: string;
  primaryConcern?: string;
}): CorridorBrief {
  const from = detectCountry(input.currentCity, input.currentCountry);
  const to = detectCountry(input.destinationCity, input.destinationCountry);
  const routeLabel = `${input.currentCity || "Origin"}, ${
    input.currentCountry || "—"
  } → ${input.destinationCity || "Destination"}, ${
    input.destinationCountry || "—"
  }`;

  const overrideKey =
    from && to ? `${from.id}->${to.id}` : "";
  const playbook =
    (overrideKey && corridorOverrides[overrideKey]) ||
    composeFromCountries(from, to, input);

  const condition = input.conditions?.trim();
  const concern = input.primaryConcern?.trim();
  const mustKnow = [...playbook.mustKnow];

  // Ensure condition/concern are visible near the top without duplicating if already composed
  if (
    condition &&
    !mustKnow.some((item) => item.toLowerCase().includes(condition.toLowerCase()))
  ) {
    mustKnow.unshift(
      `Condition focus (${condition}): make sure the receiving clinician in ${
        to?.name || input.destinationCountry || "your destination"
      } can see diagnosis detail, recent monitoring, and what must not be interrupted.`
    );
  }
  if (
    concern &&
    !mustKnow.some((item) => item.toLowerCase().includes(concern.toLowerCase()))
  ) {
    mustKnow.unshift(`Your stated priority: ${concern}.`);
  }

  return {
    ...playbook,
    mustKnow: mustKnow.slice(0, 8),
    routeLabel,
    generatedAt: new Date().toISOString(),
    source: "knowledge",
    fromCountryId: from?.id,
    toCountryId: to?.id,
  };
}

export function corridorContextBlock(brief: CorridorBrief | null | undefined) {
  if (!brief) return "Corridor guidance: not generated yet.";
  return [
    `Route: ${brief.routeLabel}`,
    `Matched countries: ${brief.fromCountryId || "unknown"} → ${brief.toCountryId || "unknown"}`,
    `Corridor summary: ${brief.summary}`,
    `Must know: ${brief.mustKnow.join(" | ")}`,
    `Registration: ${brief.registrationNotes}`,
    `Care system: ${brief.careSystemNotes}`,
    `Language: ${brief.languageNotes}`,
    `Medication: ${brief.medicationNotes}`,
    `Specialist: ${brief.specialistNotes}`,
    `Official reminders: ${brief.officialReminders.join(" | ")}`,
    "Important: Use this corridor-specific guidance. Do not give generic international advice when country-specific steps exist.",
  ].join("\n");
}
