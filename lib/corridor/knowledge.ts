import {
  detectCountry,
  type CountryHealthProfile,
} from "@/lib/corridor/countries";
import type { CommunityLink } from "@/lib/corridor/community";

export type { CommunityLink };

export interface CorridorBrief {
  routeLabel: string;
  /** Short plain-language picture of the corridor */
  overview: string;
  summary: string;
  mustKnow: string[];
  registrationNotes: string;
  careSystemNotes: string;
  languageNotes: string;
  medicationNotes: string;
  specialistNotes: string;
  officialReminders: string[];
  communityLinks?: CommunityLink[];
  generatedAt: string;
  source: "knowledge" | "ai";
  fromCountryId?: string;
  toCountryId?: string;
}

type Playbook = Omit<
  CorridorBrief,
  | "routeLabel"
  | "generatedAt"
  | "source"
  | "fromCountryId"
  | "toCountryId"
  | "communityLinks"
>;

/** High-value corridor overrides when we have extra route-specific detail. */
const corridorOverrides: Record<string, Playbook> = {
  "philippines->angola": {
    overview:
      "Philippines → Angola: private Luanda clinics are the usual expat/NGO path. Portuguese helps; book antenatal early and confirm fees/language.",
    summary:
      "Philippines → Angola care setup for NGO/expat moves usually means private clinics in Luanda, Portuguese or English access, and clear fee expectations.",
    mustKnow: [
      "Before leaving: prenatal notes, vaccine card, blood type if known, and any labs.",
      "In Luanda: book a private antenatal/primary clinic; ask about Portuguese vs English and total visit cost.",
      "Confirm whether NGO insurance or cash-pay is accepted before the first appointment.",
      "Ask what registration/work health docs your organisation expects.",
    ],
    registrationNotes:
      "There is no single NHS-style GP register. Start by choosing a private clinic/hospital and completing their new-patient process; follow any NGO medical onboarding.",
    careSystemNotes:
      "Angola public capacity is limited; private Luanda care is the practical route for many NGO staff. Obstetrics is appointment-sensitive.",
    languageNotes:
      "Portuguese is default locally. Request English-speaking clinicians if needed — availability varies.",
    medicationNotes:
      "Confirm prenatal vitamins and any regular medicines are stocked locally; bring a bridge supply if advised.",
    specialistNotes:
      "For pregnancy, identify antenatal clinic + delivery hospital affiliation early.",
    officialReminders: [
      "Verify clinic capability and your organisation’s preferred provider list.",
      "Community and clinic advice is not a substitute for clinical care.",
    ],
  },
  "russia->uk": {
    overview:
      "Russia → UK: bring the imaging/report in English if possible, then use GP or private clinic for a local review.",
    summary:
      "For a Moscow clinic finding moving to London, UK review usually starts with records + GP/private appointment — not an automatic specialist transfer.",
    mustKnow: [
      "Bring ultrasound/report + clinician note; translate key lines to English.",
      "In the UK: GP registration or private clinic for a check — ask for musculoskeletal/ultrasound review as needed.",
      "Do not assume the Moscow conclusion is accepted without local review if you’re worried.",
      "Verify NHS entitlement if you plan to use NHS pathways.",
    ],
    registrationNotes:
      "For NHS: register with a GP when you have an address. For a faster check, private clinics can review imaging sooner.",
    careSystemNotes:
      "UK care is GP-gatekept on the NHS; private options exist for quicker imaging review.",
    languageNotes: "English summary of the ultrasound conclusion is highly useful.",
    medicationNotes:
      "Usually not medication-led for simple soft-tissue checks — focus on the report and exam.",
    specialistNotes:
      "Orthopedics/ultrasound follow-up can be GP-referred or booked privately depending on urgency and entitlement.",
    officialReminders: [
      "Check official NHS guidance for registration/entitlement.",
    ],
  },
  "china->us": {
    overview:
      "China → US (e.g. California): insurance/campus health first, then assemble vaccines + injury records for regular care.",
    summary:
      "International students often need campus/urgent care for injuries and a primary clinic, plus a reconstructed vaccine/record pack for school requirements.",
    mustKnow: [
      "Collect every vaccine scrap, hospital note, and imaging — even partial Chinese records help.",
      "Translate key pages; list vaccines you remember with approximate dates.",
      "For an untreated injury: urgent care or campus health first, then follow-up imaging if advised.",
      "Activate student/private insurance before non-emergency visits when possible.",
    ],
    registrationNotes:
      "No national GP register. Establish campus health or a primary care clinic; specialists often need referral/insurance OK.",
    careSystemNotes:
      "US care is insurance-driven. Students should learn campus health hours, urgent care, and ER thresholds.",
    languageNotes:
      "English records preferred. Keep Chinese originals as backup.",
    medicationNotes:
      "Bring medication names as generics; US pharmacies will need a local prescription for ongoing drugs.",
    specialistNotes:
      "Orthopedics for fractures may start in urgent care; keep all imaging for the specialist.",
    officialReminders: [
      "School immunisation requirements are official — verify with your campus health centre.",
    ],
  },
  "vietnam->uk": {
    overview:
      "Vietnam hospital/clinic care → UK GP-led NHS (plus private). Expect registration, English records, and a local re-prescribe step.",
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
      "TransitH prepares guidance — it does not determine eligibility.",
    ],
  },
  "uk->spain": {
    overview:
      "UK NHS → Spain’s regional public system and private clinics. Decide your route early and prepare a Spanish handoff.",
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
      "TransitH does not determine legal eligibility.",
    ],
  },
  "vietnam->russia": {
    overview:
      "You are moving from Vietnam to Russia. Vietnam care is often hospital- or clinic-based; Russia mixes compulsory medical insurance public pathways with private clinics in cities like Moscow. If you need ongoing specialty care (for example oncology), plan the Russian route before you fly — do not assume your Vietnam hospital can automatically transfer you.",
    summary:
      "Vietnam → Russia: leave with a complete English (or Russian) clinical pack, then choose public attachment vs private clinic in your Russian city. Specialty continuity usually means a private or tertiary centre with records sent ahead.",
    mustKnow: [
      "Before you leave Vietnam: get a signed hospital summary covering diagnosis (stage and histology if cancer), treatment history, latest imaging/pathology, current medicines with generic names, and last/next treatment dates. Ask for English if possible; keep Vietnamese originals.",
      "In Russia: decide early whether you will use a public polyclinic/hospital pathway (often needs local insurance attachment) or a private clinic in a major city for faster specialty access. Moscow and Saint Petersburg have more private oncology and specialty options.",
      "Medicines: Russian trade names often differ — list every drug by INN/generic name, dose, and schedule. Carry a bridge supply for travel and the first clinic visit; a Russian clinician will usually need to review and re-prescribe.",
      "Records: translate key Vietnamese pages into English or Russian. Include diagnosis codes/names, staging, treatment protocol names, and copies of pathology and imaging reports — not only conclusions.",
      "On arrival: contact the chosen clinic’s new-patient or oncology desk with your pack before or as soon as you land if treatment timing is critical. Confirm language support (Russian is default; English is limited outside private international desks).",
    ],
    registrationNotes:
      "Clarify whether your status allows attachment to the public compulsory medical insurance system. Many newcomers use private clinics first while public attachment is sorted. Bring passport/ID and your clinical pack to the first visit.",
    careSystemNotes:
      "Russia: public polyclinic/hospital pathways exist alongside a large private sector in major cities. Private clinics are often the practical first step for complex specialty continuity when language and speed matter.",
    languageNotes:
      "Russian is the working language in most public facilities. Private clinics in Moscow may offer some English — confirm before booking. Keep an English master summary even if you also translate into Russian.",
    medicationNotes:
      "Use INN/generic names. Specialty oncology and chronic therapies often need local specialist approval and may not match Vietnam brand packaging. Plan supply through the first Russian review.",
    specialistNotes:
      "For oncology or other tertiary care, identify a suitable centre in your destination city (often Moscow private or major oncology institutes) and send records ahead when the clinic allows.",
    officialReminders: [
      "Insurance attachment and foreign-patient rules are status-specific — verify with the clinic and official sources for your situation.",
      "Community tips are not a substitute for clinician advice or official eligibility rules.",
    ],
  },
  "georgia->uk": {
    overview:
      "Georgia → UK: leave with an English clinical pack, then enter via NHS GP registration. Specialists are usually referral-based — don’t cold-book a hospital as if it were a private EU clinic.",
    summary:
      "Tbilisi/Georgia → UK means switching into the NHS model: GP first, then specialty. English records and entitlement checks matter more than collecting every Georgian document.",
    mustKnow: [
      "UK care is mostly NHS: register with a GP near your address first — specialists are often referral-based.",
      "Before leaving Georgia: get one English hospital/clinic letter + exact medication list.",
      "In the UK: use NHS Find a GP (nhs.uk), register, then request the specialty referral you need.",
      "Confirm NHS entitlement for your visa/status on official NHS/GOV.UK pages — do not assume automatic cover.",
      "Community tip pattern: people who move from non-EU systems get stuck when they try to book hospital specialists directly without a GP.",
    ],
    registrationNotes:
      "First practical step after you have a UK address: register with a GP via https://www.nhs.uk/service-search/find-a-gp. Bring ID, proof of address if you have it, and your English clinical summary.",
    careSystemNotes:
      "The NHS is GP-gatekept for most specialty care. Private clinics exist for faster review but do not replace GP registration for ongoing NHS care.",
    languageNotes:
      "English clinical summary is essential. Keep Georgian originals as backup.",
    medicationNotes:
      "UK clinicians usually re-prescribe. Plan a bridge supply; map generics and doses clearly.",
    specialistNotes:
      "Identify the specialty (e.g. endocrinology). After GP registration, ask for referral — or use a researched private clinic only if you need a bridge review while NHS access starts.",
    officialReminders: [
      "Verify NHS entitlement on official NHS / GOV.UK sources for your status.",
      "Community threads are tips, not eligibility decisions.",
    ],
  },
  "italy->thailand": {
    overview:
      "Italy (SSN / private specialty) → Thailand private international hospitals. Expats usually book Bangkok endocrinology via an international desk — not a European GP referral chain.",
    summary:
      "Milan → Bangkok with type 1 diabetes: leave Europe with an English endocrinology letter, insulin/device list, and labs. In Bangkok, private hospitals with international centres book specialty visits and can often continue insulin/CGM — if records arrive ahead and payment/insurance is clear.",
    mustKnow: [
      "You’re leaving a European specialty culture for Thai private hospital booking — call/email an international patient centre; they schedule endocrinology when paperwork and payment route are ready.",
      "Ask your Italian endocrinologist for a signed English summary: diagnosis, regimen (basal/bolus or pump), complications screen, last HbA1c, allergies, and emergency plan.",
      "Carry a bridge supply of insulin, needles/pump consumables, and CGM sensors in hand luggage with a prescription letter — expat diabetes threads treat this as non-negotiable for first week.",
      "Book the Bangkok visit for arrival day or the next working day; send records before you fly so the slot is real, not a walk-in hope.",
      "Public Thai schemes rarely help new work expats for specialty diabetes — plan private care first, then verify any workplace insurance.",
      "English is common at major Bangkok private hospitals; Thai is default elsewhere. Request an English-speaking endocrinologist via the international desk.",
    ],
    registrationNotes:
      "First practical step: open a new-patient / international desk file at a Bangkok private hospital (or your city’s equivalent). Bring passport, work docs if asked, payment method, and English clinical pack. There is no Italian-style ASL transfer.",
    careSystemNotes:
      "Italy mixes regional SSN with private specialists. Thailand for complex chronic care (esp. T1D) is usually private hospital outpatient + pharmacy inside the hospital network. International desks exist to handle booking, records, and language.",
    languageNotes:
      "English clinical summary is the working language for Bangkok international clinics. Keep Italian originals as backup.",
    medicationNotes:
      "Major Bangkok private pharmacies often stock common insulins and can continue many regimens after local clinician review — confirm brands/devices before arrival. Do not rely on airport or hotel pharmacies for pump supplies.",
    specialistNotes:
      "Target endocrinology / diabetes clinic at a tertiary private hospital. Ask for the earliest slot after landing and whether CGM/pump downloads are accepted.",
    officialReminders: [
      "Hospital and immigration/insurance rules are status-specific — verify with your employer and the hospital desk.",
      "Community tips (Reddit/forums) help with bureaucracy, not clinical dosing.",
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
      overview: `${fromLabel} → ${toLabel}: confirm how new patients enter care at destination, and leave with a complete paper pack.`,
      summary: `We could not match a detailed healthcare profile for ${fromLabel} → ${toLabel} yet. Still: leave with a signed clinical summary, exact medication list, and confirm the destination’s first registration step before you travel.`,
      mustKnow: unique([
        concern ? `Your priority: ${concern}.` : "",
        condition
          ? `Document ${condition} with diagnosis detail, recent results, and treatment history.`
          : "Collect a current signed clinical summary before you travel.",
        `Learn the first official or practical registration step in ${toLabel}.`,
        "Confirm medication supply across the journey and first destination appointment.",
      ]).slice(0, 4),
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
        "TransitH organises route-specific guidance — it does not replace clinicians or determine eligibility.",
      ],
    };
  }

  const blob = `${condition || ""} ${concern || ""}`.toLowerCase();
  const isPregnancy = /pregnan|antenatal|prenatal|obstetric/.test(blob);
  const isStudent = /student|campus|university|college|visa/.test(blob);
  const isImagingCheck =
    /ultrasound|scan|x-?ray|mri|lump|elbow|second opinion|check/.test(blob);

  const priorityBit = isPregnancy
    ? "Book antenatal care early and confirm language and fees."
    : isStudent
      ? "Activate student or insurance access, then set up primary or campus care."
      : isImagingCheck
        ? "Bring imaging reports for a local review."
        : condition
          ? `Keep ${condition} continuous — arrive with a transfer pack.`
          : concern
            ? concern.replace(/\.$/, "") + "."
            : "Arrive with a signed summary and medication list.";

  /** Strip pregnancy-only examples when the user's condition is not pregnancy. */
  function adaptClinicCopy(text: string) {
    if (isPregnancy) return text;
    let next = text
      .replace(/\(e\.g\. antenatal\)/gi, condition ? `(for ${condition})` : "(for your specialty)")
      .replace(/\s*Antenatal care[^.]*\./gi, "")
      .replace(/prenatal vitamins and /gi, "")
      .replace(/prenatal vitamins/gi, "your regular medicines")
      .replace(/\s+/g, " ")
      .trim();
    return next;
  }

  const destFirstStep = to ? adaptClinicCopy(to.firstStepIn) : "";
  const destMeds = to ? adaptClinicCopy(to.medicationReality) : "";

  // Short headline only — full steps live in mustKnow below.
  const overview = [
    `${fromLabel} → ${toLabel}.`,
    destFirstStep,
    priorityBit,
  ]
    .filter(Boolean)
    .join(" ");

  const summary = [
    `${fromLabel} → ${toLabel}.`,
    condition ? `Condition focus: ${condition}.` : "",
    concern ? `Priority: ${concern}.` : "",
    destFirstStep ? `First access step: ${destFirstStep}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Complete sentences — never truncate mid-thought for patients reading this.
  const mustKnow = unique([
    isPregnancy
      ? "Before you leave: gather prenatal notes, your vaccine card, blood type if known, and recent labs — keep paper and phone photos."
      : from
        ? `Before you leave ${from.name}: get one signed clinical summary from your treating hospital or clinic, plus recent results and an exact list of medicines with doses. Keep paper copies and clear photos of every page.`
        : "Before you leave: get a signed clinical summary and a complete medication list (paper and photos).",
    isPregnancy && to
      ? `In ${to.name}: book antenatal or private clinic care early, and confirm which languages are available and what a visit costs before you arrive.`
      : isStudent && to
        ? `In ${to.name}: activate student or health insurance access first, then register with campus health or a primary clinic.`
        : isImagingCheck && to
          ? `In ${to.name}: book a GP or private review and bring the imaging report and images with you — do not rely on memory of the findings.`
          : to
            ? `In ${to.name}: ${destFirstStep} ${to.languages.length ? `Clinics commonly work in ${to.languages.join(" and ")}.` : ""}`
            : "On arrival: confirm the first clinic or registration step before you need urgent care.",
    to
      ? `Medicines in ${to.name}: ${destMeds} Carry enough supply for travel plus your first destination appointment, and list every drug by generic (INN) name.`
      : "Plan medication supply through travel and your first destination appointment; list every drug by generic name.",
    from && to
      ? `Records: ${from.recordsTip} Destination clinicians in ${to.name} commonly need ${to.languages[0] || "the local language"} and/or English — bring both originals and a clear English summary when you can.`
      : "Carry paper and digital copies of every key record, with an English summary if your originals are in another language.",
    condition
      ? `For ${condition}: ask your current clinician what must not be interrupted in the first 2–4 weeks after you arrive, and write that into the transfer letter.`
      : "",
  ]).slice(0, 5);

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
    overview,
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
      "TransitH provides corridor-specific guidance from healthcare-system knowledge — always confirm with the clinic and official sources for your status.",
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

  const overrideKey = from && to ? `${from.id}->${to.id}` : "";
  const composed = composeFromCountries(from, to, input);
  const override = overrideKey ? corridorOverrides[overrideKey] : undefined;

  // Prefer researched corridor overrides (efficient zero-knowledge steps).
  const playbook: Playbook = override
    ? {
        ...composed,
        ...override,
        overview: override.overview || composed.overview,
        summary: override.summary || composed.summary,
        mustKnow: (override.mustKnow?.length
          ? override.mustKnow
          : composed.mustKnow
        ).slice(0, 5),
      }
    : composed;

  return {
    ...playbook,
    overview: playbook.overview || playbook.summary,
    mustKnow: playbook.mustKnow.slice(0, 5),
    communityLinks: [],
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
