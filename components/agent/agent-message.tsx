"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { AgentMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

export function AgentMessageCard({
  message,
  onAction,
}: {
  message: AgentMessage;
  onAction?: (label: string) => void;
}) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "max-w-3xl rounded-3xl px-4 py-3 text-sm",
        isUser
          ? "ml-auto bg-accent text-accent-foreground"
          : "bg-muted text-foreground"
      )}
    >
      <p className="leading-relaxed">{message.content}</p>
      {!isUser && message.nextAction ? (
        <p className="mt-2 text-xs opacity-80">{message.nextAction}</p>
      ) : null}
      {!isUser && message.actions?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {message.actions.slice(0, 2).map((action) =>
            action.href ? (
              <Button key={action.id} asChild size="sm" variant="secondary">
                <Link href={action.href}>{action.label}</Link>
              </Button>
            ) : (
              <Button
                key={action.id}
                size="sm"
                variant="secondary"
                onClick={() => onAction?.(action.label)}
              >
                {action.label}
              </Button>
            )
          )}
        </div>
      ) : null}
    </div>
  );
}
