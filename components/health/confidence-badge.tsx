import { Badge } from "@/components/ui/badge";
import type { Confidence } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ConfidenceBadge({
  confidence,
  className,
}: {
  confidence: Confidence;
  className?: string;
}) {
  return (
    <Badge
      className={cn(
        confidence === "high" && "bg-accent-soft text-accent border-transparent",
        confidence === "medium" && "bg-warning-soft text-warning border-transparent",
        confidence === "low" && "bg-danger-soft text-danger border-transparent",
        className
      )}
    >
      {confidence} confidence
    </Badge>
  );
}
