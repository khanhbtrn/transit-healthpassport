"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { ApprovalItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ApprovalQueue({
  items,
  onStatus,
}: {
  items: ApprovalItem[];
  onStatus: (
    id: string,
    status: "approved" | "rejected" | "simulated_sent"
  ) => void;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const pending = items.filter((i) => i.status === "needs_approval");
  const settled = items.filter((i) => i.status !== "needs_approval");

  if (!items.length) return null;

  return (
    <section className="space-y-3">
      <div>
        <p className="text-sm text-muted-foreground">Needs your approval</p>
        <h2 className="mt-1 font-display text-2xl tracking-tight">
          Nothing leaves Transit until you say so
        </h2>
      </div>

      {pending.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No pending approvals. Review settled items below if needed.
        </p>
      ) : null}

      <ul className="space-y-2">
        {pending.map((item) => {
          const expanded = openId === item.id;
          return (
            <li
              key={item.id}
              className="rounded-2xl border border-accent/30 bg-accent-soft/30 px-4 py-3"
            >
              <button
                type="button"
                className="w-full text-left"
                onClick={() => setOpenId(expanded ? null : item.id)}
              >
                <p className="font-medium">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.summary}
                </p>
                <p className="mt-1 text-xs text-accent">
                  {expanded ? "Hide draft" : "Review draft"}
                </p>
              </button>
              {expanded ? (
                <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap rounded-xl bg-background/80 p-3 text-xs text-muted-foreground">
                  {item.detail}
                </pre>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" onClick={() => onStatus(item.id, "approved")}>
                  Approve
                </Button>
                {(item.kind === "appointment_request" ||
                  item.kind === "clinic_application" ||
                  item.kind === "specialist_request") && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onStatus(item.id, "simulated_sent")}
                  >
                    Approve + simulate send
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onStatus(item.id, "rejected")}
                >
                  Reject
                </Button>
              </div>
            </li>
          );
        })}

        {settled.map((item) => (
          <li
            key={item.id}
            className={cn(
              "rounded-2xl border px-4 py-3",
              item.status === "rejected"
                ? "border-border bg-muted/40"
                : "border-border bg-card"
            )}
          >
            <p className="font-medium">{item.title}</p>
            <p className="mt-1 text-sm capitalize text-muted-foreground">
              {item.status.replace("_", " ")}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
