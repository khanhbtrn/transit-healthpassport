"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DoctorCandidate } from "@/lib/types";

export function DoctorCard({
  doctor,
  selected,
  onSelect,
  onPrepare,
  onView,
  compareSelected,
  onCompareToggle,
}: {
  doctor: DoctorCandidate;
  selected?: boolean;
  onSelect: () => void;
  onPrepare: () => void;
  onView: () => void;
  compareSelected?: boolean;
  onCompareToggle?: () => void;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow)]">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {doctor.recommended ? (
          <Badge className="bg-accent-soft text-accent border-transparent">
            Recommended
          </Badge>
        ) : null}
        <Badge>Match {doctor.matchScore}%</Badge>
        <Badge className="bg-warning-soft text-warning border-transparent">
          Fictional demo doctor
        </Badge>
        {selected ? (
          <Badge className="bg-accent-soft text-accent border-transparent">
            Selected
          </Badge>
        ) : null}
      </div>
      <h3 className="font-display text-2xl">{doctor.doctorName}</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {doctor.organization} · {doctor.specialty}
      </p>
      <div className="mt-4 grid gap-2 text-sm">
        <p>
          <span className="text-muted-foreground">Languages:</span>{" "}
          {doctor.languages.join(", ")}
        </p>
        <p>
          <span className="text-muted-foreground">Route:</span>{" "}
          {doctor.careRoute}
        </p>
        <p>
          <span className="text-muted-foreground">Distance:</span>{" "}
          {doctor.distanceMinutes} minutes away
        </p>
        <p>
          <span className="text-muted-foreground">Availability:</span>{" "}
          {doctor.availabilityText}
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {doctor.expertise.map((item) => (
          <Badge key={item}>{item}</Badge>
        ))}
      </div>
      <p className="mt-4 text-sm">{doctor.matchReason}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" onClick={onView}>
          View profile
        </Button>
        {onCompareToggle ? (
          <Button size="sm" variant="outline" onClick={onCompareToggle}>
            {compareSelected ? "Remove compare" : "Compare"}
          </Button>
        ) : null}
        <Button size="sm" variant="outline" onClick={onSelect}>
          Select doctor
        </Button>
        <Button size="sm" onClick={onPrepare}>
          Prepare request
        </Button>
      </div>
    </div>
  );
}
