import type { TranscriptSegment } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Transcript({
  segments,
  visibleCount,
}: {
  segments: TranscriptSegment[];
  visibleCount: number;
}) {
  return (
    <div className="space-y-3" aria-live="polite">
      {segments.slice(0, visibleCount).map((segment) => (
        <div
          key={segment.id}
          className={cn(
            "rounded-2xl border border-border p-4",
            segment.speaker === "doctor" ? "bg-accent-soft/40" : "bg-card"
          )}
        >
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {segment.speakerName}
          </p>
          <p className="text-sm leading-relaxed">{segment.text}</p>
        </div>
      ))}
    </div>
  );
}
