export function SafetyBanner({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="text-xs text-muted-foreground">
        Transit organises information and prepares actions. It does not replace
        clinicians or book appointments autonomously.
      </p>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-muted/70 p-4 text-sm text-muted-foreground">
      <p className="font-medium text-foreground">Safety and trust</p>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        <li>Transit organises information and prepares actions.</li>
        <li>Transit does not replace qualified medical professionals.</li>
        <li>Medical decisions must be confirmed by a clinician.</li>
        <li>
          Destination healthcare requirements must be verified with official
          sources.
        </li>
        <li>Transit does not contact providers without patient approval.</li>
        <li>AI-extracted medical facts should be reviewed before use.</li>
      </ul>
    </div>
  );
}
