"use client";

import Link from "next/link";
import { Check, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AgentNeed } from "@/lib/types";
import { cn } from "@/lib/utils";

export function NeedsPanel({
  needs,
  onResolve,
}: {
  needs: AgentNeed[];
  onResolve: (id: string, status?: "done" | "skipped") => void;
}) {
  const open = needs.filter((n) => n.status === "open");
  const done = needs.filter((n) => n.status !== "open");

  if (!needs.length) return null;

  return (
    <section className="space-y-3">
      <div>
        <p className="text-sm text-muted-foreground">Needs from you</p>
        <h2 className="mt-1 font-display text-xl tracking-tight sm:text-2xl">
          TransitH only asks for what it can’t do alone
        </h2>
      </div>
      <ul className="space-y-2">
        {open.map((need) => (
          <li
            key={need.id}
            className={cn(
              "rounded-2xl border border-border bg-card px-4 py-3",
              need.priority === "critical" && "border-accent/35"
            )}
          >
            <div className="flex gap-3">
              <Circle className="mt-1 h-4 w-4 shrink-0 text-accent" />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{need.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {need.detail}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {need.href ? (
                    <Button asChild size="sm">
                      <Link href={need.href}>
                        {need.kind === "talk_to_person"
                          ? "Open"
                          : need.kind === "upload_doc"
                            ? "Upload"
                            : "Go"}
                      </Link>
                    </Button>
                  ) : null}
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onResolve(need.id, "done")}
                  >
                    Mark done
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onResolve(need.id, "skipped")}
                  >
                    Skip
                  </Button>
                </div>
              </div>
            </div>
          </li>
        ))}
        {done.map((need) => (
          <li
            key={need.id}
            className="rounded-2xl border border-border/60 bg-muted/30 px-4 py-3 opacity-80"
          >
            <div className="flex gap-3">
              <Check className="mt-1 h-4 w-4 shrink-0 text-accent" />
              <div>
                <p className="font-medium line-through decoration-muted-foreground/50">
                  {need.title}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {need.status}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
