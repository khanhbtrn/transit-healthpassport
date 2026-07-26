import { z } from "zod";

export const clinicalFactSchema = z.object({
  category: z.string(),
  value: z.string(),
  sourceText: z.string().optional(),
  confidence: z.enum(["high", "medium", "low"]),
  verificationStatus: z.enum([
    "verified",
    "high_confidence",
    "needs_confirmation",
    "patient_reported",
    "ai_extracted",
  ]),
  clinicalWarnings: z.array(z.string()).optional(),
});

export const extractionResultSchema = z.object({
  diagnosis: z.string().optional(),
  diagnosisDate: z.string().optional(),
  medications: z
    .array(
      z.object({
        name: z.string(),
        dosage: z.string().optional(),
        frequency: z.string().optional(),
        status: z.string().optional(),
        reasonStopped: z.string().optional(),
      })
    )
    .default([]),
  allergies: z.array(z.string()).default([]),
  monitoring: z.array(z.string()).default([]),
  specialists: z.array(z.string()).default([]),
  facts: z.array(clinicalFactSchema),
  warnings: z.array(z.string()).default([]),
});

export const timelineResultSchema = z.object({
  events: z.array(
    z.object({
      eventDate: z.string(),
      approximateDate: z.boolean(),
      eventType: z.string(),
      title: z.string(),
      description: z.string(),
      confidence: z.enum(["high", "medium", "low"]),
      verificationStatus: z.enum([
        "verified",
        "high_confidence",
        "needs_confirmation",
        "patient_reported",
        "ai_extracted",
      ]),
    })
  ),
});

export const gapAnalysisSchema = z.object({
  gaps: z.array(
    z.object({
      title: z.string(),
      explanation: z.string(),
      severity: z.enum(["critical", "high", "medium", "low"]),
      recommendedAction: z.string(),
    })
  ),
});

export const relocationPlanSchema = z.object({
  tasks: z.array(
    z.object({
      phase: z.enum([
        "before_departure",
        "before_arrival",
        "first_week",
        "first_30_days",
        "ongoing",
      ]),
      title: z.string(),
      explanation: z.string(),
      deadline: z.string(),
      priority: z.enum(["critical", "high", "medium", "low"]),
      owner: z.string(),
      status: z.string(),
      sourceStatus: z.string(),
      recommendedAction: z.string(),
    })
  ),
});

export const handoffResultSchema = z.object({
  clinicalSummary: z.string(),
  detailedSummary: z.string(),
  patientSummary: z.string(),
  spanishSummary: z.string(),
  catalanSummary: z.string(),
  unresolvedQuestions: z.array(z.string()),
  continuityPriorities: z.array(z.string()),
  supportingEvidence: z.array(z.string()),
});

export const agentResponseSchema = z.object({
  answer: z.string(),
  whyItMatters: z.string(),
  nextAction: z.string(),
  sourceStatus: z.string(),
  actions: z.array(
    z.object({
      label: z.string(),
      type: z.string(),
    })
  ),
});

export type ExtractionResult = z.infer<typeof extractionResultSchema>;
export type TimelineResult = z.infer<typeof timelineResultSchema>;
export type GapAnalysis = z.infer<typeof gapAnalysisSchema>;
export type RelocationPlanResult = z.infer<typeof relocationPlanSchema>;
export type HandoffResult = z.infer<typeof handoffResultSchema>;
export type AgentResponseResult = z.infer<typeof agentResponseSchema>;
