import { Badge } from "@/components/ui/badge";
import type { JourneyStep, TaskStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusLabel: Record<TaskStatus, string> = {
  complete: "Complete",
  in_progress: "In progress",
  waiting: "Waiting",
  needs_review: "Needs review",
  ready: "Ready",
  not_started: "Not started",
};

const statusStyle: Record<TaskStatus, string> = {
  complete: "bg-accent-soft text-accent border-transparent",
  in_progress: "bg-warning-soft text-warning border-transparent",
  waiting: "bg-muted text-muted-foreground",
  needs_review: "bg-warning-soft text-warning border-transparent",
  ready: "bg-accent-soft text-accent border-transparent",
  not_started: "bg-muted text-muted-foreground",
};

export function JourneyProgress({ steps }: { steps: JourneyStep[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {steps.map((step, index) => (
        <div
          key={step.id}
          className="rounded-2xl border border-border bg-card p-4"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">
              Step {index + 1}
            </span>
            <Badge className={cn(statusStyle[step.status])}>
              {statusLabel[step.status]}
            </Badge>
          </div>
          <h4 className="font-medium">{step.title}</h4>
          <p className="mt-1 text-sm text-muted-foreground">
            {step.description}
          </p>
        </div>
      ))}
    </div>
  );
}
