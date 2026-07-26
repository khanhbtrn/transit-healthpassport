import type { ExtractedFact, LiveFact, TranscriptSegment } from "@/lib/types";

export const doctorConversationTranscript: TranscriptSegment[] = [
  {
    id: "seg-1",
    speaker: "doctor",
    speakerName: "Dr. Reed",
    text: "Maria was diagnosed with Crohn's disease in 2018. She did not tolerate azathioprine because of persistent nausea and elevated liver enzymes. She has been stable on adalimumab since 2021. It is important that her biologic treatment is not interrupted during the move. Her latest blood tests were satisfactory, but she will need continued monitoring every three months.",
    timestampSeconds: 0,
  },
  {
    id: "seg-2",
    speaker: "patient",
    speakerName: "Maria",
    text: "What should the new doctor know first?",
    timestampSeconds: 28,
  },
  {
    id: "seg-3",
    speaker: "doctor",
    speakerName: "Dr. Reed",
    text: "They should know why azathioprine was stopped, that she has responded well to adalimumab, and that the next dose should not be delayed.",
    timestampSeconds: 34,
  },
];

export const liveFactsFromConversation: LiveFact[] = [
  { id: "lf-1", label: "Condition", value: "Crohn's disease", confidence: "high" },
  { id: "lf-2", label: "Diagnosis year", value: "2018", confidence: "high" },
  { id: "lf-3", label: "Previous treatment", value: "Azathioprine intolerance", confidence: "high" },
  { id: "lf-4", label: "Side effect", value: "Nausea", confidence: "high" },
  { id: "lf-5", label: "Lab finding", value: "Elevated liver enzymes", confidence: "high" },
  { id: "lf-6", label: "Current therapy start", value: "Adalimumab since 2021", confidence: "high" },
  { id: "lf-7", label: "Status", value: "Currently stable", confidence: "high" },
  { id: "lf-8", label: "Continuity risk", value: "Treatment interruption risk", confidence: "high" },
  { id: "lf-9", label: "Monitoring", value: "Blood tests every 3 months", confidence: "high" },
  { id: "lf-10", label: "Urgency", value: "Next dose should not be delayed", confidence: "high" },
];

export const conversationFactsForApproval: ExtractedFact[] = [
  {
    id: "conv-fact-1",
    category: "Diagnosis",
    value: "Crohn's disease diagnosed in 2018",
    sourceText: "Maria was diagnosed with Crohn's disease in 2018.",
    confidence: "high",
    verificationStatus: "ai_extracted",
    source: "doctor_conversation",
  },
  {
    id: "conv-fact-2",
    category: "Previous treatment",
    value: "Azathioprine stopped due to nausea and elevated liver enzymes",
    sourceText:
      "She did not tolerate azathioprine because of persistent nausea and elevated liver enzymes.",
    confidence: "high",
    verificationStatus: "ai_extracted",
    source: "doctor_conversation",
  },
  {
    id: "conv-fact-3",
    category: "Current treatment",
    value: "Stable on adalimumab since 2021",
    sourceText: "She has been stable on adalimumab since 2021.",
    confidence: "high",
    verificationStatus: "ai_extracted",
    source: "doctor_conversation",
  },
  {
    id: "conv-fact-4",
    category: "Continuity priority",
    value: "Biologic treatment should not be interrupted during the move",
    sourceText:
      "It is important that her biologic treatment is not interrupted during the move.",
    confidence: "high",
    verificationStatus: "ai_extracted",
    source: "doctor_conversation",
  },
  {
    id: "conv-fact-5",
    category: "Monitoring",
    value: "Continued blood monitoring every three months",
    sourceText:
      "Her latest blood tests were satisfactory, but she will need continued monitoring every three months.",
    confidence: "high",
    verificationStatus: "ai_extracted",
    source: "doctor_conversation",
  },
  {
    id: "conv-fact-6",
    category: "Clinical guidance",
    value: "Next adalimumab dose should not be delayed",
    sourceText: "the next dose should not be delayed.",
    confidence: "high",
    verificationStatus: "ai_extracted",
    source: "doctor_conversation",
  },
];
