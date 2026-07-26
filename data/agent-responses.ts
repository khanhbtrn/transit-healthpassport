import type { AgentAction } from "@/lib/types";

export interface ScriptedAgentResponse {
  match: RegExp;
  answer: string;
  whyItMatters: string;
  nextAction: string;
  sourceStatus: string;
  actions: AgentAction[];
}

export const agentStarterPrompts = [
  "What is the most urgent thing I need to do?",
  "What information is still missing?",
  "Prepare a request for Dr. Reed.",
  "Explain why Dr. Navarro is a strong match.",
  "Prepare me for my first appointment.",
  "Explain my care transition without medical jargon.",
  "What could interrupt my treatment?",
  "Which documents should I carry when I travel?",
];

export const scriptedAgentResponses: ScriptedAgentResponse[] = [
  {
    match: /urgent|most important|next/i,
    answer:
      "Your most urgent task is obtaining Dr. Reed's signed specialist summary.",
    whyItMatters:
      "Your destination clinic may need confirmation of your diagnosis, previous treatment, and current biologic regimen before assuming care.",
    nextAction:
      "I can prepare a request to Dr. Reed for your approval. Transit will not contact anyone without your permission.",
    sourceStatus: "Based on relocation plan and continuity risk analysis",
    actions: [
      { id: "a1", label: "Prepare request", type: "prepare_request", href: "/app/relocation" },
      { id: "a2", label: "View missing evidence", type: "view_missing", href: "/app/profile" },
      { id: "a3", label: "Add to plan", type: "add_to_plan", href: "/app/relocation" },
    ],
  },
  {
    match: /missing|gap|still need/i,
    answer:
      "Still missing or unconfirmed: a signed final specialist letter, exact remaining adalimumab supply, and your Spanish healthcare eligibility route.",
    whyItMatters:
      "These gaps create continuity risk around medication and first specialist contact after arrival.",
    nextAction:
      "Start with the specialist letter request, then confirm medication supply with your current clinic.",
    sourceStatus: "Information gap analysis — requires confirmation",
    actions: [
      { id: "b1", label: "View missing evidence", type: "view_missing", href: "/app/profile" },
      { id: "b2", label: "Open relocation plan", type: "open_plan", href: "/app/relocation" },
    ],
  },
  {
    match: /reed|request for dr/i,
    answer:
      "I can prepare a request asking Dr. Reed for a signed gastroenterology summary that documents diagnosis, azathioprine intolerance, current adalimumab regimen, and continuity priority.",
    whyItMatters:
      "A clear specialist letter reduces repeated explanations and supports safer transfer of care.",
    nextAction:
      "Review the draft request on the Relocation Plan page, then approve it. No message will be sent without your approval.",
    sourceStatus: "Simulated request preparation",
    actions: [
      { id: "c1", label: "Prepare request", type: "prepare_request", href: "/app/relocation" },
      { id: "c2", label: "Ask follow-up", type: "follow_up" },
    ],
  },
  {
    match: /navarro|strong match|why.*doctor/i,
    answer:
      "Dr. Elena Navarro is a strong match because she is an English-speaking gastroenterologist in Barcelona with IBD and biologic continuity experience, about 22 minutes from your address.",
    whyItMatters:
      "Language access and biologic continuity experience reduce friction in your first specialist contact.",
    nextAction:
      "You can compare doctors or prepare a simulated appointment request for review. All doctors in this demo are fictional.",
    sourceStatus: "AI-assisted matching on fictional demo directory",
    actions: [
      { id: "d1", label: "View care search", type: "care_search", href: "/app/care-search" },
      { id: "d2", label: "Prepare request", type: "prepare_request", href: "/app/care-search" },
    ],
  },
  {
    match: /first appointment|prepare me/i,
    answer:
      "For your first appointment, bring your approved clinical handoff, recent blood results, adalimumab prescription details, and a clear note that azathioprine was stopped for intolerance.",
    whyItMatters:
      "Giving the new doctor verified history first helps them focus on continuity rather than reconstruction.",
    nextAction:
      "Review the Medical Handoff and approve the Spanish version if you want it ready to share.",
    sourceStatus: "Prepared from verified profile and handoff draft",
    actions: [
      { id: "e1", label: "Open handoff", type: "handoff", href: "/app/handoff" },
      { id: "e2", label: "View documents", type: "documents", href: "/app/documents" },
    ],
  },
  {
    match: /jargon|simple|without medical|plain/i,
    answer:
      "You are moving from London to Barcelona with Crohn's disease that is currently stable. Transit has gathered your records, prepared a Spain-focused checklist, suggested a specialist, and drafted a handoff so your care can continue with less interruption.",
    whyItMatters:
      "The hard part of moving with a chronic condition is not only paperwork — it is keeping treatment continuous.",
    nextAction:
      "Focus next on the signed specialist letter and confirming who will oversee your medication after arrival.",
    sourceStatus: "Patient-friendly summary of current transition status",
    actions: [
      { id: "f1", label: "Open overview", type: "overview", href: "/app/overview" },
      { id: "f2", label: "Ask follow-up", type: "follow_up" },
    ],
  },
  {
    match: /interrupt|risk|supply|treatment/i,
    answer:
      "The main interruption risk is running out of adalimumab before local prescription oversight is confirmed — based on available information, supply may end about 18 days after arrival.",
    whyItMatters:
      "Biologic gaps can disrupt disease control. This is planning guidance, not a medical instruction.",
    nextAction:
      "Confirm remaining doses with your current clinic, then prioritise destination medication oversight in your first week.",
    sourceStatus: "Based on available information — verify with clinicians",
    actions: [
      { id: "g1", label: "View continuity risks", type: "risks", href: "/app/relocation" },
      { id: "g2", label: "Ask follow-up", type: "follow_up" },
    ],
  },
  {
    match: /documents|carry|travel|pack/i,
    answer:
      "Carry your gastroenterology summary, adalimumab prescription, latest blood results, colonoscopy report, medication history, and approved clinical handoff (English and Spanish).",
    whyItMatters:
      "Having verified documents ready reduces delays when registering or meeting a new specialist.",
    nextAction:
      "Review the Documents workspace and mark anything still needing confirmation before travel.",
    sourceStatus: "Document checklist from prepared transition plan",
    actions: [
      { id: "h1", label: "Open documents", type: "documents", href: "/app/documents" },
      { id: "h2", label: "Open handoff", type: "handoff", href: "/app/handoff" },
    ],
  },
];

export const defaultAgentResponse: ScriptedAgentResponse = {
  match: /.*/,
  answer:
    "I can help with Maria's care transition using her stored profile, documents, relocation plan, and handoff.",
  whyItMatters:
    "Transit organises information and prepares actions — it does not replace a qualified clinician or make medical decisions.",
  nextAction:
    "Try one of the suggested questions, or ask about urgency, missing information, doctors, or travel documents.",
  sourceStatus: "General guidance from Maria's demo context",
  actions: [
    { id: "z1", label: "View overview", type: "overview", href: "/app/overview" },
    { id: "z2", label: "Ask follow-up", type: "follow_up" },
  ],
};

export function matchAgentResponse(question: string): ScriptedAgentResponse {
  return (
    scriptedAgentResponses.find((item) => item.match.test(question)) ??
    defaultAgentResponse
  );
}
