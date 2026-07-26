import { cn } from "@/lib/utils";

export function PassportMark({
  className,
  tone = "brass",
}: {
  className?: string;
  tone?: "brass" | "ink" | "light";
}) {
  const stroke =
    tone === "brass"
      ? "#c9a45c"
      : tone === "light"
        ? "rgba(255,255,255,0.88)"
        : "currentColor";

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
      className={cn("h-8 w-8", className)}
    >
      <circle cx="24" cy="24" r="22" stroke={stroke} strokeWidth="1.25" />
      <circle
        cx="24"
        cy="24"
        r="16.5"
        stroke={stroke}
        strokeWidth="0.75"
        opacity="0.55"
      />
      <path
        d="M14 30c3.2-7.5 7.4-11.5 10-11.5S30.8 22.5 34 30"
        stroke={stroke}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M18 22.5c1.6-2.2 3.6-3.4 6-3.4s4.4 1.2 6 3.4"
        stroke={stroke}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle cx="24" cy="17" r="1.6" fill={stroke} opacity="0.9" />
    </svg>
  );
}
