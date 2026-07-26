export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-3xl border border-border bg-card px-6 py-12 text-sm text-muted-foreground">
      <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
      {label}
    </div>
  );
}
