import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";

/** Transit wordmark. */
export function BrandWordmark({
  className,
  as: Tag = "span",
}: {
  className?: string;
  as?: "span" | "p" | "h1" | "h2";
}) {
  return (
    <Tag className={cn("font-display font-bold tracking-tight", className)}>
      {BRAND}
    </Tag>
  );
}
