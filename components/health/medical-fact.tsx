import { ConfidenceBadge } from "@/components/health/confidence-badge";
import { VerificationBadge } from "@/components/health/verification-badge";
import { Badge } from "@/components/ui/badge";
import type { ExtractedFact, SourceType } from "@/lib/types";

const sourceLabels: Record<SourceType, string> = {
  specialist_letter: "Specialist letter",
  prescription: "Prescription",
  lab_report: "Lab report",
  doctor_conversation: "Doctor conversation",
  patient_reported: "Patient-reported",
  colonoscopy: "Colonoscopy",
  vaccination: "Vaccination",
  medication_history: "Medication history",
  ai_generated: "AI-generated",
  official_source: "Official source",
  provider_source: "Provider source",
};

export function MedicalFact({ fact }: { fact: ExtractedFact }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Badge>{fact.category}</Badge>
        <Badge>{sourceLabels[fact.source]}</Badge>
        <ConfidenceBadge confidence={fact.confidence} />
        <VerificationBadge status={fact.verificationStatus} />
      </div>
      <p className="text-sm font-medium text-foreground">{fact.value}</p>
      {fact.sourceText ? (
        <p className="mt-2 text-xs text-muted-foreground">“{fact.sourceText}”</p>
      ) : null}
    </div>
  );
}
