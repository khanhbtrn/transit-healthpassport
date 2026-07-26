import { cn } from "@/lib/utils";

/** TransitH wordmark. The H stands for healthcare. */
export function BrandWordmark({
  className,
  accentH = true,
  as: Tag = "span",
}: {
  className?: string;
  accentH?: boolean;
  as?: "span" | "p" | "h1" | "h2";
}) {
  return (
    <Tag className={cn("font-display font-bold tracking-tight", className)}>
      <span>Transit</span>
      {accentH ? (
        <span className="text-[var(--brass)]">H</span>
      ) : (
        <span>H</span>
      )}
    </Tag>
  );
}
