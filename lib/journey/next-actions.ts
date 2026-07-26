import type { JourneyIntent } from "@/lib/types";

export type HomeAction = {
  title: string;
  description: string;
  href: string;
  cta: string;
  primary?: boolean;
};

function isUkDestination(destinationCountry: string, destinationCity: string) {
  const blob = `${destinationCountry} ${destinationCity}`.toLowerCase();
  return /united kingdom|\buk\b|england|scotland|wales|northern ireland|london|manchester|birmingham|edinburgh/.test(
    blob
  );
}

export function getIntentHomeActions(input: {
  intent: JourneyIntent;
  hasHistory: boolean;
  transitionReady: boolean;
  destinationLabel: string;
  destinationCountry?: string;
  destinationCity?: string;
  pendingApprovals: number;
  openNeeds: number;
}): HomeAction[] {
  const {
    hasHistory,
    transitionReady,
    destinationLabel,
    destinationCountry = "",
    destinationCity = "",
    pendingApprovals,
    openNeeds,
  } = input;

  const uk = isUkDestination(destinationCountry, destinationCity);

  if (pendingApprovals > 0) {
    return [
      {
        title: `${pendingApprovals} item${pendingApprovals === 1 ? "" : "s"} waiting for your OK`,
        description: uk
          ? "Approving drafts your GP registration pack and letters. It does not register you with the NHS — you still use Find a GP / submit yourself."
          : "TransitH drafted booking and paperwork. Approve what can leave this app — nothing is sent for real until you say so.",
        href: "/app/arrival",
        cta: "Review approvals",
        primary: true,
      },
      {
        title: "Ask a question",
        description: "What’s left on your route, or what’s still missing.",
        href: "/app/agent",
        cta: "Ask TransitH",
      },
    ];
  }

  if (transitionReady) {
    return [
      {
        title: uk
          ? "Your NHS-ready package is drafted"
          : "Your agent package is ready",
        description: uk
          ? "Copy the pack for your GP, approve what’s left, then register via NHS Find a GP — hospital specialty usually comes after."
          : "See what TransitH prepared, what’s approved, and your clinic-ready letter.",
        href: "/app/arrival",
        cta: uk ? "Open GP pack" : "Open summary",
        primary: true,
      },
    ];
  }

  if (!hasHistory && openNeeds > 0) {
    if (uk) {
      return [
        {
          title: "Run your UK care agent",
          description:
            "TransitH will research NHS GP-first steps for " +
            destinationLabel +
            ", ask only for what’s missing (usually one English letter + your postcode area), then draft a pack you approve.",
          href: "/app/relocation",
          cta: "Start agent",
          primary: true,
        },
        {
          title: "Already have a clinic letter?",
          description:
            "Upload one English summary with diagnosis, meds, and recent results — enough to start GP registration.",
          href: "/app/documents",
          cta: "Upload letter",
        },
        {
          title: "Optional: capture a visit",
          description:
            "Only if you’re with your current doctor now. Most people upload a letter instead.",
          href: "/app/conversation",
          cta: "Listen to visit",
        },
      ];
    }

    return [
      {
        title: `Let TransitH prepare ${destinationLabel}`,
        description:
          "The agent lists exact docs it still needs, then drafts booking and paperwork for your approval.",
        href: "/app/relocation",
        cta: "Start agent",
        primary: true,
      },
      {
        title: "Optional: capture a clinic visit",
        description:
          "If you’re with your doctor now, TransitH can listen and extract facts. Otherwise upload a letter in Docs.",
        href: "/app/conversation",
        cta: "Listen to visit",
      },
    ];
  }

  if (openNeeds > 0 && hasHistory) {
    return [
      {
        title: uk
          ? `Finish ${openNeeds} step${openNeeds === 1 ? "" : "s"} for NHS setup`
          : `Finish ${openNeeds} item${openNeeds === 1 ? "" : "s"} TransitH asked for`,
        description: uk
          ? "Usually: confirm your borough/postcode, then run the agent for the GP pack."
          : "Uploads and quick confirmations only — the agent handles bureaucracy.",
        href: "/app/overview",
        cta: "See needs",
      },
      {
        title: uk
          ? "Draft your GP registration pack"
          : `Run your ${destinationLabel} agent`,
        description: uk
          ? "Match the NHS pathway, prepare Find a GP materials, and queue approvals — specialty after GP."
          : "Match a clinician, prepare arrival-day booking, and draft approvals.",
        href: "/app/relocation",
        cta: uk ? "Run agent" : "Run agent",
        primary: true,
      },
    ];
  }

  return [
    {
      title: uk
        ? `Handle NHS setup for ${destinationLabel}`
        : `Let TransitH handle ${destinationLabel}`,
      description: uk
        ? "Agent researches GP-first care, asks only for missing pieces, prepares your registration pack — you approve every draft."
        : "Agent researches the corridor, asks only for missing docs, prepares booking and handoff — you approve sends.",
      href: "/app/relocation",
      cta: "Start agent",
      primary: true,
    },
    {
      title: "Add a document",
      description: uk
        ? "One English clinical summary is enough to start."
        : "Insulin letter, labs, CGM report — drop it in anytime.",
      href: "/app/documents",
      cta: "Upload",
    },
  ];
}
