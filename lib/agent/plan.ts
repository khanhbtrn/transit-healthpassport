import { buildResearchApprovals, buildResearchPack } from "@/lib/agent/research";
import type { CorridorBrief, CommunityLink } from "@/lib/corridor/knowledge";
import type {
  AgentDoneItem,
  AgentNeed,
  ApprovalItem,
  Condition,
  MedicalDocument,
  Profile,
} from "@/lib/types";

export { buildResearchPack, buildResearchApprovals } from "@/lib/agent/research";

export function isDiabetes(text: string) {
  return /diabetes|t1d|type\s*1|insulin|cgm|libre|pump/.test(text.toLowerCase());
}

/**
 * Intentional needs from corridor research — max 3, no busywork.
 */
export function buildAgentNeeds(input: {
  profile: Profile;
  conditions: Condition[];
  documents: MedicalDocument[];
  conversationCompleted: boolean;
  brief?: CorridorBrief | null;
  communityLinks?: CommunityLink[];
}): AgentNeed[] {
  return buildResearchPack({
    profile: input.profile,
    conditions: input.conditions,
    documents: input.documents,
    conversationCompleted: input.conversationCompleted,
    brief: input.brief || null,
    communityLinks: input.communityLinks || input.brief?.communityLinks,
  }).needs;
}

export function buildAgentApprovals(input: {
  profile: Profile;
  specialistDraft: string;
  doctorName?: string;
  organization?: string;
  handoffSummary: string;
  appointmentTiming: string;
  pathway?: "nhs_gp_first" | "private_international_desk" | "generic_specialty";
  researchNotes?: string[];
}): ApprovalItem[] {
  return buildResearchApprovals({
    profile: input.profile,
    pathway: input.pathway || "generic_specialty",
    specialistDraft: input.specialistDraft,
    clinicName: input.doctorName,
    organization: input.organization,
    handoffSummary: input.handoffSummary,
    researchNotes: input.researchNotes || [
      `Requested timing: ${input.appointmentTiming}`,
    ],
  });
}

export function stampDone(title: string, detail: string): AgentDoneItem {
  return {
    id: `done-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title,
    detail,
    createdAt: new Date().toISOString(),
  };
}
