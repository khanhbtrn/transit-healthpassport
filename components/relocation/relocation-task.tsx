"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { RelocationTask } from "@/lib/types";
import { formatShortDate } from "@/lib/utils";

const actionLabels: Record<string, string> = {
  generate_request: "Generate request",
  upload_proof: "Upload proof",
  review_instructions: "Review instructions",
  mark_complete: "Mark complete",
  ask_transit: "Ask Transit",
  prepare_document: "Prepare document",
  approve_action: "Approve action",
};

export function RelocationTaskCard({
  task,
  onAction,
}: {
  task: RelocationTask;
  onAction: (task: RelocationTask) => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge className="capitalize">{task.status.replaceAll("_", " ")}</Badge>
        <Badge className="capitalize">{task.priority}</Badge>
        <Badge>Due {formatShortDate(task.dueDate)}</Badge>
        <Badge>Owner: {task.owner}</Badge>
      </div>
      <h4 className="font-medium">{task.title}</h4>
      <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
      <p className="mt-3 text-sm">{task.explanation}</p>
      <p className="mt-2 text-xs text-muted-foreground">{task.sourceStatus}</p>
      <div className="mt-4">
        <Button
          size="sm"
          variant={task.status === "complete" ? "secondary" : "default"}
          onClick={() => onAction(task)}
        >
          {task.status === "complete"
            ? "Completed"
            : actionLabels[task.actionType] || "Take action"}
        </Button>
      </div>
    </div>
  );
}
