import { ConfidenceBadge } from "@/components/health/confidence-badge";
import { VerificationBadge } from "@/components/health/verification-badge";
import type { TimelineEvent } from "@/lib/types";

export function MedicalTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="relative space-y-6 border-l border-border pl-6">
      {events.map((event) => (
        <li key={event.id} className="relative">
          <span className="absolute -left-[1.54rem] top-1.5 h-3 w-3 rounded-full border-2 border-accent bg-card" />
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">
                {event.approximateDate
                  ? new Date(event.eventDate).getFullYear()
                  : new Date(event.eventDate).getFullYear()}
                {event.approximateDate ? " (approx.)" : ""}
              </span>
              <ConfidenceBadge confidence={event.confidence} />
              <VerificationBadge status={event.verificationStatus} />
            </div>
            <h4 className="font-medium">{event.title}</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              {event.description}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
