"use client";

import { ConfidenceBadge } from "@/components/health/confidence-badge";
import { VerificationBadge } from "@/components/health/verification-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MedicalDocument } from "@/lib/types";
import { formatShortDate } from "@/lib/utils";

export function DocumentCard({
  document,
  onOpen,
  onRemove,
}: {
  document: MedicalDocument;
  onOpen: () => void;
  onRemove?: () => void;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5">
      <div className="mb-3 flex flex-wrap gap-2">
        <Badge>{document.documentType}</Badge>
        <Badge className="capitalize">
          {document.processingStatus.replaceAll("_", " ")}
        </Badge>
        <VerificationBadge status={document.verificationStatus} />
      </div>
      <h3 className="font-display text-xl">{document.title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {document.sourceProvider} · {formatShortDate(document.documentDate)} ·{" "}
        {document.language}
      </p>
      <div className="mt-4 space-y-2">
        {document.facts.slice(0, 2).map((fact) => (
          <div
            key={fact.id}
            className="rounded-xl bg-muted/60 px-3 py-2 text-sm"
          >
            <div className="mb-1 flex flex-wrap gap-2">
              <ConfidenceBadge confidence={fact.confidence} />
            </div>
            {fact.value}
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" onClick={onOpen}>
          Review document
        </Button>
        {onRemove ? (
          <Button size="sm" variant="ghost" onClick={onRemove}>
            Remove
          </Button>
        ) : null}
      </div>
    </div>
  );
}
