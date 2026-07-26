"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <ProgressPrimitive.Root
      className={cn(
        "relative h-1.5 w-full overflow-hidden rounded-full bg-muted/80",
        className
      )}
      value={value}
    >
      <ProgressPrimitive.Indicator
        className="h-full rounded-full bg-gradient-to-r from-accent to-[#2f8a6d] transition-all duration-700 ease-out"
        style={{ width: `${value}%` }}
      />
    </ProgressPrimitive.Root>
  );
}
