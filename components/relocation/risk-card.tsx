import { Badge } from "@/components/ui/badge";
import type { ContinuityRisk } from "@/lib/types";
import { cn } from "@/lib/utils";

export function RiskCard({ risk }: { risk: ContinuityRisk }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Badge
          className={cn(
            risk.severity === "critical" &&
              "bg-danger-soft text-danger border-transparent",
            risk.severity === "high" &&
              "bg-warning-soft text-warning border-transparent",
            (risk.severity === "medium" || risk.severity === "low") &&
              "bg-muted text-muted-foreground"
          )}
        >
          {risk.severity}
        </Badge>
        <Badge>{risk.sourceStatus}</Badge>
      </div>
      <h4 className="font-medium">{risk.title}</h4>
      <p className="mt-1 text-sm text-muted-foreground">{risk.description}</p>
    </div>
  );
}
