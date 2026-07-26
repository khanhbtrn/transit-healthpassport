"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Checkbox({
  checked,
  onCheckedChange,
  id,
  className,
}: {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  id?: string;
  className?: string;
}) {
  return (
    <CheckboxPrimitive.Root
      id={id}
      checked={checked}
      onCheckedChange={(value) => onCheckedChange?.(value === true)}
      className={cn(
        "flex h-5 w-5 items-center justify-center rounded-md border border-border bg-card data-[state=checked]:border-accent data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground",
        className
      )}
    >
      <CheckboxPrimitive.Indicator>
        <Check className="h-3.5 w-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
