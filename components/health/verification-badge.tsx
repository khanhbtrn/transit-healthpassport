import { Badge } from "@/components/ui/badge";
import type { VerificationStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const labels: Record<VerificationStatus, string> = {
  verified: "Verified",
  high_confidence: "High confidence",
  needs_confirmation: "Needs confirmation",
  patient_reported: "Patient-reported",
  ai_extracted: "AI-extracted",
};

const styles: Record<VerificationStatus, string> = {
  verified: "bg-accent-soft text-accent border-transparent",
  high_confidence: "bg-accent-soft/70 text-accent border-transparent",
  needs_confirmation: "bg-warning-soft text-warning border-transparent",
  patient_reported: "bg-muted text-muted-foreground",
  ai_extracted: "bg-muted text-muted-foreground",
};

export function VerificationBadge({
  status,
  className,
}: {
  status: VerificationStatus;
  className?: string;
}) {
  return (
    <Badge className={cn(styles[status], className)}>{labels[status]}</Badge>
  );
}
