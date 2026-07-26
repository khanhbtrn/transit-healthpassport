import type { JourneyIntent } from "@/lib/types";

export type HomeAction = {
  title: string;
  description: string;
  href: string;
  cta: string;
  primary?: boolean;
};

export function getIntentHomeActions(input: {
  intent: JourneyIntent;
  hasHistory: boolean;
  transitionReady: boolean;
  destinationLabel: string;
  pendingApprovals: number;
  openNeeds: number;
}): HomeAction[] {
  const {
    hasHistory,
    transitionReady,
    destinationLabel,
    pendingApprovals,
    openNeeds,
  } = input;

  if (pendingApprovals > 0) {
    return [
      {
        title: `${pendingApprovals} item${pendingApprovals === 1 ? "" : "s"} need your approval`,
        description:
          "Transit drafted booking and paperwork. Approve what can leave this app — nothing is sent for real until you say so.",
        href: "/app/arrival",
        cta: "Review approvals",
        primary: true,
      },
      {
        title: "Talk to your agent",
        description: "Ask what’s left for your route or what’s still missing.",
        href: "/app/agent",
        cta: "Ask Transit",
      },
    ];
  }

  if (transitionReady) {
    return [
      {
        title: "Your agent package is ready",
        description:
          "See what Transit prepared, what’s approved, and your clinic-ready letter.",
        href: "/app/arrival",
        cta: "Open summary",
        primary: true,
      },
    ];
  }

  if (!hasHistory && openNeeds > 0) {
    return [
      {
        title: "You’re with your doctor — let Transit listen",
        description:
          "Don’t chase hospital portals. Capture this visit, then the agent books and drafts everything for " +
          destinationLabel +
          ".",
        href: "/app/conversation",
        cta: "Listen now",
        primary: true,
      },
      {
        title: "Or let the agent start with what you have",
        description:
          "Transit will list exact docs and people it still needs, then draft booking + paperwork for your approval.",
        href: "/app/relocation",
        cta: "Start agent",
      },
    ];
  }

  if (openNeeds > 0 && hasHistory) {
    return [
      {
        title: `Finish ${openNeeds} item${openNeeds === 1 ? "" : "s"} Transit asked for`,
        description:
          "Uploads and quick confirmations only — the agent handles bureaucracy.",
        href: "/app/overview",
        cta: "See needs",
      },
      {
        title: `Run your ${destinationLabel} agent`,
        description:
          "Match a clinician, prepare arrival-day booking, and draft approvals.",
        href: "/app/relocation",
        cta: "Run agent",
        primary: true,
      },
    ];
  }

  return [
    {
      title: `Let Transit handle ${destinationLabel}`,
      description:
        "Agent researches the corridor, asks only for missing docs, prepares booking and handoff — you approve sends.",
      href: "/app/relocation",
      cta: "Start agent",
      primary: true,
    },
    {
      title: "Add another document",
      description: "Insulin letter, labs, CGM report — drop it in anytime.",
      href: "/app/documents",
      cta: "Upload",
    },
  ];
}
