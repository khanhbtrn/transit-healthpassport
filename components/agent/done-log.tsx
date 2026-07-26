"use client";

import type { AgentDoneItem } from "@/lib/types";

export function DoneLog({ items }: { items: AgentDoneItem[] }) {
  if (!items.length) return null;

  return (
    <section className="space-y-3">
      <div>
        <p className="text-sm text-muted-foreground">What TransitH did</p>
        <h2 className="mt-1 font-display text-2xl tracking-tight">
          Summary of agent work
        </h2>
      </div>
      <ol className="space-y-2">
        {items.map((item, index) => (
          <li
            key={item.id}
            className="rounded-2xl border border-border bg-card px-4 py-3"
          >
            <p className="text-xs text-muted-foreground">Step {index + 1}</p>
            <p className="mt-1 font-medium">{item.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
