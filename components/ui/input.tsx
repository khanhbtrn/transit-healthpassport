import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex h-12 w-full rounded-2xl border border-border bg-card/90 px-4 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] outline-none transition duration-300 placeholder:text-muted-foreground/70 focus:border-accent focus:bg-card focus:shadow-[0_0_0_4px_rgba(31,92,74,0.1)]",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";
