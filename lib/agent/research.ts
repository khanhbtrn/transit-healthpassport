import { detectCountry } from "@/lib/corridor/countries";
import type { CorridorBrief, CommunityLink } from "@/lib/corridor/knowledge";
import type {
  AgentNeed,
  ApprovalItem,
  Condition,
  MedicalDocument,
  Profile,
} from "@/lib/types";

function blob(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(" ").toLowerCase();
}

function hasDocs(documents: MedicalDocument[], needles: string[]) {
  const hay = documents
    .map((d) => `${d.title} ${d.documentType} ${d.previewText}`)
    .join(" ")
    .toLowerCase();
  return needles.some((n) => hay.includes(n));
}

export type ResearchPack = {
  /** Assume-zero-knowledge, max ~5 tight bullets */
  efficientBrief: string[];
  /** Why each ask exists — max 3 open critical/high needs */
  needs: AgentNeed[];
  /** Corridor pathway label for approvals */
  pathway:
    | "nhs_gp_first"
    | "private_international_desk"
    | "generic_specialty";
  researchNotes: string[];
};

/**
 * Deep but efficient research output for the agent.
 * Assumes the user knows nothing about the destination system.
 * Only asks for inputs that unblock real next steps.
 */
export function buildResearchPack(input: {
  profile: Profile;
  conditions: Condition[];
  documents: MedicalDocument[];
  conversationCompleted: boolean;
  brief: CorridorBrief | null;
  communityLinks?: CommunityLink[];
}): ResearchPack {
  const { profile, conditions, documents, conversationCompleted, brief } =
    input;
  const to = detectCountry(profile.destinationCity, profile.destinationCountry);
  const from = detectCountry(profile.currentCity, profile.currentCountry);
  const conditionText = blob(
    ...conditions.map((c) => c.name),
    profile.primaryConcern
  );
  const diabetes = /diabetes|t1d|type\s*1|insulin|cgm|pump/.test(conditionText);
  const destCity = profile.destinationCity || to?.name || "your destination";
  const originCity = profile.currentCity || from?.name || "your current clinic";

  const pathway: ResearchPack["pathway"] =
    to?.id === "uk"
      ? "nhs_gp_first"
      : to?.id === "thailand"
        ? "private_international_desk"
        : "generic_specialty";

  // Prefer override/composed mustKnow; tighten further for UK/Thailand.
  let efficientBrief =
    brief?.mustKnow && brief.mustKnow.length > 0
      ? brief.mustKnow.slice(0, 5)
      : brief?.overview
        ? [brief.overview, ...(brief.mustKnow || [])].slice(0, 5)
        : [];

  if (to?.id === "uk") {
    efficientBrief = [
      "UK care is mostly NHS: you usually register with a GP near your address first — specialists are often referral-based.",
      `Before leaving ${originCity}: get one English clinical letter + exact medication list (non-English packs slow NHS/GP review).`,
      "In the UK: use NHS Find a GP, register, then ask for the specialty referral you need.",
      "Confirm NHS entitlement for your visa/status on official NHS/GOV.UK pages — do not assume automatic cover.",
      diabetes
        ? "For diabetes: bring insulin/device list + recent HbA1c if you have it; UK clinician must re-prescribe locally."
        : "Overseas prescriptions are not auto-continued — a UK clinician reviews and re-prescribes.",
    ];
  } else if (to?.id === "thailand") {
    efficientBrief = [
      "For complex/chronic care as an expat, Bangkok usually means private hospitals with an international desk — not a European GP referral chain.",
      `Before leaving ${originCity}: English specialist summary + meds/devices list; email the pack ahead if the hospital allows.`,
      `In ${destCity}: contact an international patient centre, confirm payment/insurance, book specialty.`,
      "Carry a bridge supply of critical meds for the first week.",
      "Public Thai schemes rarely help new work arrivals for specialty care — plan private first.",
    ];
  } else if (!efficientBrief.length && brief) {
    efficientBrief = [
      brief.overview || brief.summary,
      brief.registrationNotes,
      brief.medicationNotes,
      brief.specialistNotes,
    ]
      .filter(Boolean)
      .map((t) => t.slice(0, 180))
      .slice(0, 4);
  }

  const communityNote = input.communityLinks?.[0];
  const researchNotes = [
    from && to
      ? `Matched corridor knowledge: ${from.name} → ${to.name}.`
      : "Corridor matched from city/country text.",
    pathway === "nhs_gp_first"
      ? "Researched pathway: NHS GP registration → referral → specialty."
      : pathway === "private_international_desk"
        ? "Researched pathway: private international desk booking with records ahead."
        : "Researched pathway: destination specialty access with local registration rules.",
    communityNote
      ? `Community signal: “${communityNote.title}” (${communityNote.why}). Tip only — not official.`
      : "Community scan: no high-confidence thread yet; using corridor knowledge + official pathways.",
  ];

  const needs: AgentNeed[] = [];
  const hasClinicalPack = hasDocs(documents, [
    "letter",
    "summary",
    "discharge",
    "clinic",
    "specialist",
    "endocrin",
    "prescription",
    "insulin",
    "report",
    "lab",
    "hba1c",
  ]);

  // 1) Only ask to listen if we have zero clinical signal
  if (!conversationCompleted && !hasClinicalPack && documents.length === 0) {
    needs.push({
      id: "need-source",
      kind: "talk_to_person",
      title: "Capture your current clinic visit or upload one letter",
      detail: `TransitH needs a source of truth from ${originCity} (listen now, or upload a signed summary). Without it, destination clinics will ask you to start over.`,
      status: "open",
      href: "/app/conversation",
      priority: "critical",
    });
  } else if (!hasClinicalPack) {
    needs.push({
      id: "need-letter",
      kind: "upload_doc",
      title: "Upload one English clinical summary",
      detail:
        pathway === "nhs_gp_first"
          ? "One signed letter with diagnosis, meds, and recent results is enough for GP registration + referral — don’t collect a whole archive yet."
          : "One English specialist summary + med list is enough to open an international-desk file.",
      status: "open",
      href: "/app/documents",
      priority: "critical",
    });
  }

  // 2) Pathway-specific blocker only
  if (pathway === "nhs_gp_first") {
    const addressKnown = Boolean(
      profile.carePreferences?.notes?.toLowerCase().includes("address") ||
        profile.destinationCity
    );
    needs.push({
      id: "need-uk-address",
      kind: "confirm_info",
      title: "Confirm your UK area for GP registration",
      detail:
        "NHS Find a GP needs a local address/postcode area. Tell TransitH your borough/city area so it can prepare the right registration pack — not a random London hospital cold-call.",
      status: addressKnown ? "done" : "open",
      href: "/app/profile",
      priority: "critical",
    });
  }

  if (pathway === "private_international_desk") {
    const payKnown =
      profile.insuranceRoute &&
      profile.insuranceRoute !== "Not yet confirmed";
    needs.push({
      id: "need-pay-route",
      kind: "confirm_info",
      title: "Confirm how you’ll pay at the private hospital",
      detail:
        "International desks book faster with insurance vs cash-pay stated up front. One line in Profile is enough.",
      status: payKnown ? "done" : "open",
      href: "/app/profile",
      priority: "high",
    });
  }

  // 3) Diabetes: only ask for regimen if missing from docs (not both labs + listen + bridge)
  if (diabetes && !hasDocs(documents, ["insulin", "pump", "cgm", "prescription", "regimen"])) {
    needs.push({
      id: "need-insulin-list",
      kind: "upload_doc",
      title: "Upload insulin / device list",
      detail:
        "Basal/bolus or pump + CGM model. One photo of your current plan beats five unrelated PDFs.",
      status: "open",
      href: "/app/documents",
      priority: "high",
    });
  }

  // Cap at 3 — efficiency over completeness theatre
  const capped = needs
    .sort((a, b) => {
      const rank = { critical: 0, high: 1, medium: 2, low: 3 };
      return rank[a.priority] - rank[b.priority];
    })
    .slice(0, 3);

  return {
    efficientBrief: efficientBrief.slice(0, 5),
    needs: capped,
    pathway,
    researchNotes,
  };
}

export function buildResearchApprovals(input: {
  profile: Profile;
  pathway: ResearchPack["pathway"];
  specialistDraft: string;
  clinicName?: string;
  organization?: string;
  handoffSummary: string;
  researchNotes: string[];
}): ApprovalItem[] {
  const dest =
    [input.profile.destinationCity, input.profile.destinationCountry]
      .filter(Boolean)
      .join(", ") || "destination";
  const now = new Date().toISOString();
  const clinicLine = input.organization
    ? `${input.clinicName || "Care team"} · ${input.organization}`
    : `Researched clinic pathway · ${dest}`;

  const items: ApprovalItem[] = [];

  if (input.specialistDraft) {
    items.push({
      id: `apr-specialist-${Date.now()}`,
      kind: "specialist_request",
      title: "Approve ask to your current clinic for an English summary",
      summary:
        "Only if you still need a transfer letter — TransitH drafted a short, specific request.",
      detail: input.specialistDraft,
      status: "needs_approval",
      createdAt: now,
    });
  }

  if (input.pathway === "nhs_gp_first") {
    items.push({
      id: `apr-gp-${Date.now() + 1}`,
      kind: "clinic_application",
      title: "Approve NHS GP registration pack",
      summary:
        "Researched first step: register with a GP via NHS Find a GP, then seek specialty referral. Not a cold specialty booking.",
      detail: [
        clinicLine,
        "Pathway: NHS GP registration → referral.",
        "Official tool: https://www.nhs.uk/service-search/find-a-gp",
        ...input.researchNotes,
        "Demo: approve = prepare pack / simulate contact. Live phone booking is not placed until you explicitly allow outside this demo.",
      ].join("\n"),
      status: "needs_approval",
      createdAt: now,
    });
  } else if (input.pathway === "private_international_desk") {
    items.push({
      id: `apr-intl-${Date.now() + 1}`,
      kind: "clinic_application",
      title: "Approve international-desk booking request",
      summary: `${clinicLine}. Records + payment route attached. Demo send only after you approve.`,
      detail: [
        clinicLine,
        "Pathway: private international patient centre.",
        ...input.researchNotes,
        "Demo: no real call/email until you approve simulate-send.",
      ].join("\n"),
      status: "needs_approval",
      createdAt: now,
    });
  } else {
    items.push({
      id: `apr-appt-${Date.now() + 1}`,
      kind: "appointment_request",
      title: `Approve researched clinic request · ${dest}`,
      summary: clinicLine,
      detail: [clinicLine, ...input.researchNotes].join("\n"),
      status: "needs_approval",
      createdAt: now,
    });
  }

  items.push({
    id: `apr-handoff-${Date.now() + 2}`,
    kind: "handoff_letter",
    title: "Approve clinical handoff letter",
    summary: "Short clinic-ready summary from your docs/visit — approve before share.",
    detail: input.handoffSummary,
    status: "needs_approval",
    createdAt: now,
  });

  return items;
}
