"use client";

import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

export function MrzMarquee({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const line = `${text} `;

  return (
    <div className={cn("mrz-band overflow-hidden whitespace-nowrap", className)}>
      {reduced ? (
        <p className="px-4 py-2 text-[10px] md:text-xs">{text}</p>
      ) : (
        <div className="mrz-track flex w-max py-2 text-[10px] md:text-xs">
          <span className="px-4">{line}</span>
          <span className="px-4" aria-hidden>
            {line}
          </span>
        </div>
      )}
    </div>
  );
}
