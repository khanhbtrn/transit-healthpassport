import { cn } from "@/lib/utils";

export function Waveform({
  active,
  bars = 24,
}: {
  active: boolean;
  bars?: number;
}) {
  return (
    <div
      className="flex h-16 items-end justify-center gap-1"
      aria-hidden={!active}
    >
      {Array.from({ length: bars }).map((_, index) => (
        <span
          key={index}
          className={cn(
            "waveform-bar w-1.5 rounded-full bg-accent",
            active ? "opacity-100" : "opacity-30"
          )}
          style={{
            height: `${20 + ((index * 17) % 40)}px`,
            animationDelay: `${index * 0.05}s`,
            animationPlayState: active ? "running" : "paused",
          }}
        />
      ))}
    </div>
  );
}
