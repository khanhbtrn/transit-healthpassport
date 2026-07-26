import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-[120px] w-full rounded-2xl border border-border bg-card/90 px-4 py-3 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] outline-none transition duration-300 placeholder:text-muted-foreground/70 focus:border-accent focus:bg-card focus:shadow-[0_0_0_4px_rgba(15,111,104,0.12)]",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
