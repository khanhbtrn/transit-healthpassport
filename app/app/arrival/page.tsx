"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ApprovalQueue } from "@/components/agent/approval-queue";
import { DoneLog } from "@/components/agent/done-log";
import { NeedsPanel } from "@/components/agent/needs-panel";
import { CriticalText } from "@/components/corridor/critical-text";
import { Button } from "@/components/ui/button";
import { useTransitStore } from "@/lib/store/use-transit-store";
import { cn } from "@/lib/utils";

type DocView = "letter" | "request" | "plain";

export default function ArrivalPage() {
  const profile = useTransitStore((s) => s.profile);
  const conditions = useTransitStore((s) => s.conditions);
  const medications = useTransitStore((s) => s.medications);
  const allergies = useTransitStore((s) => s.allergies);
  const documents = useTransitStore((s) => s.documents);
  const doctors = useTransitStore((s) => s.doctors);
  const selectedDoctorId = useTransitStore((s) => s.selectedDoctorId);
  const appointmentRequest = useTransitStore((s) => s.appointmentRequest);
  const handoff = useTransitStore((s) => s.handoff);
  const transitionComplete = useTransitStore((s) => s.transitionComplete);
  const spokenHandoffUrl = useTransitStore((s) => s.spokenHandoffUrl);
  const specialistRequestDraft = useTransitStore((s) => s.specialistRequestDraft);
  const corridorBrief = useTransitStore((s) => s.corridorBrief);
  const setAppointmentRequest = useTransitStore((s) => s.setAppointmentRequest);
  const agentNeeds = useTransitStore((s) => s.agentNeeds);
  const approvals = useTransitStore((s) => s.approvals);
  const agentDone = useTransitStore((s) => s.agentDone);
  const resolveAgentNeed = useTransitStore((s) => s.resolveAgentNeed);
  const setApprovalStatus = useTransitStore((s) => s.setApprovalStatus);

  const [view, setView] = useState<DocView>("letter");

  const destination =
    [profile.destinationCity, profile.destinationCountry]
      .filter(Boolean)
      .join(", ") || "destination";
  const origin =
    [profile.currentCity, profile.currentCountry].filter(Boolean).join(", ") ||
    "origin";

  const doctor = useMemo(
    () => doctors.find((d) => d.id === selectedDoctorId) || doctors[0],
    [doctors, selectedDoctorId]
  );

  const hasHandoff = Boolean(handoff.clinicalSummary);
  const hasPackage =
    transitionComplete ||
    Boolean(selectedDoctorId && hasHandoff && appointmentRequest);

  const ukBound = /united kingdom|\buk\b|england|london/i.test(
    `${profile.destinationCountry} ${profile.destinationCity}`
  );
  // Only show destination-language summaries when they match the corridor.
  const wantsEsCa = /spain|españa|barcelona|catalan|catalunya/i.test(
    `${profile.destinationCountry} ${profile.destinationCity}`
  );
  const translated = wantsEsCa
    ? handoff.spanishSummary || handoff.catalanSummary || ""
    : "";

  const letterBody =
    view === "plain"
      ? handoff.patientSummary || handoff.clinicalSummary
      : view === "request"
        ? [
            appointmentRequest?.patientIntroduction,
            appointmentRequest?.reasonForReferral
              ? `Reason for referral\n${appointmentRequest.reasonForReferral}`
              : "",
            appointmentRequest?.clinicalSummary
              ? `Clinical snapshot\n${appointmentRequest.clinicalSummary}`
              : "",
            appointmentRequest?.requestedTiming
              ? `Requested timing\n${appointmentRequest.requestedTiming}`
              : "",
            specialistRequestDraft
              ? `\n—\nRequest to current specialist\n${specialistRequestDraft}`
              : "",
          ]
            .filter(Boolean)
            .join("\n\n")
        : [
            handoff.clinicalSummary || handoff.detailedSummary,
            translated ? `\n—\nTranslated summary\n${translated}` : "",
          ]
            .filter(Boolean)
            .join("\n\n");

  const meds = medications
    .filter((m) => m.status === "current")
    .map((m) => `${m.name} ${m.dosage}`.trim())
    .filter(Boolean);

  function copyPackage() {
    const text = [
      `CARE TRANSFER PACKAGE`,
      `Patient: ${profile.fullName}`,
      profile.dateOfBirth ? `DOB: ${profile.dateOfBirth}` : "",
      profile.sex ? `Sex: ${profile.sex}` : "",
      profile.heightCm || profile.weightKg
        ? `Height/weight: ${profile.heightCm || "—"} cm / ${profile.weightKg || "—"} kg`
        : "",
      `Corridor: ${origin} → ${destination}`,
      doctor
        ? ukBound
          ? `First NHS step (not a hospital booking): ${doctor.doctorName}, ${doctor.organization}`
          : `Suggested receiving clinician: ${doctor.doctorName}, ${doctor.organization}`
        : "",
      "",
      letterBody,
    ]
      .filter(Boolean)
      .join("\n");

    void navigator.clipboard.writeText(text).then(
      () => toast.success("Package copied"),
      () => toast.error("Could not copy")
    );
  }

  function markSimulatedSent() {
    if (!appointmentRequest) return;
    setAppointmentRequest({
      ...appointmentRequest,
      status: "simulated_sent",
    });
    toast.success("Marked as simulated send (demo only)");
  }

  if (!hasPackage) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 py-4">
        <div>
          <p className="text-sm text-muted-foreground">TransitH package</p>
          <h1 className="mt-2 font-display text-3xl md:text-4xl">
            Not ready yet
          </h1>
          <p className="mt-3 text-muted-foreground">
            Run TransitH once to prepare the letter for your receiving clinic.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/app/relocation">Start agent</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 py-2">
      <header className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {origin} → {destination}
        </p>
        <h1 className="font-display text-3xl tracking-tight md:text-4xl">
          {ukBound ? "Your NHS care pack" : "Agent summary"}
        </h1>
        <p className="text-muted-foreground">
          {ukBound
            ? "Approve drafts, copy the pack for your GP, then register via NHS Find a GP. Approving here does not register you or book a hospital specialty."
            : "What TransitH did for you, what still needs your approval, and the clinic-ready letter. Nothing is sent outside this app until you approve."}
        </p>
      </header>

      <NeedsPanel needs={agentNeeds} onResolve={resolveAgentNeed} />
      <ApprovalQueue items={approvals} onStatus={setApprovalStatus} />
      <DoneLog items={agentDone} />

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {(
          [
            ["letter", "Clinical letter"],
            ["request", "Clinic request"],
            ["plain", "Plain language"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setView(id)}
            className={cn(
              "border-b pb-0.5 transition",
              view === id
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <article className="surface-elevated px-6 py-8 sm:px-10 sm:py-10">
        <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
          TransitH · confidential draft
        </p>

        <div className="mt-6 space-y-1 border-b border-border pb-6">
          <p className="font-display text-2xl">{profile.fullName || "Patient"}</p>
          <p className="text-sm text-muted-foreground">
            {[
              profile.dateOfBirth ? `DOB ${profile.dateOfBirth}` : null,
              profile.age ? `Age ${profile.age}` : null,
              profile.sex || null,
              profile.heightCm ? `${profile.heightCm} cm` : null,
              profile.weightKg ? `${profile.weightKg} kg` : null,
            ]
              .filter(Boolean)
              .join(" · ") || "Demographics incomplete"}
          </p>
          <p className="text-sm text-muted-foreground">
            Relocating {origin} → {destination}
            {profile.moveDate ? ` · ${profile.moveDate}` : ""}
          </p>
          {profile.reasonForMove ? (
            <p className="text-sm text-muted-foreground">
              Reason for move: {profile.reasonForMove}
            </p>
          ) : null}
        </div>

        {doctor ? (
          <section className="mt-6 space-y-1 border-b border-border pb-6">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              {ukBound
                ? "First step · GP registration (not hospital booking)"
                : "Suggested receiving clinician"}
            </p>
            <p className="text-base">
              {doctor.doctorName}
              <span className="text-muted-foreground">
                {" "}
                · {doctor.organization}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              {[doctor.specialty, doctor.location, doctor.languages?.join(", ")]
                .filter(Boolean)
                .join(" · ")}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {ukBound
                ? "Use NHS Find a GP with your borough/postcode. Hospital specialists are usually after a GP referral — don’t cold-call trusts first."
                : "Planning suggestion only — not a confirmed booking."}
            </p>
            {ukBound ? (
              <a
                href="https://www.nhs.uk/service-search/find-a-gp"
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm text-accent underline-offset-4 hover:underline"
              >
                Open official Find a GP →
              </a>
            ) : null}
          </section>
        ) : null}

        <section className="mt-6 space-y-3 border-b border-border pb-6">
          <p className="text-xs tracking-wide text-muted-foreground uppercase">
            Clinical snapshot
          </p>
          <p className="text-sm leading-relaxed">
            <span className="text-muted-foreground">Conditions · </span>
            {conditions.map((c) => c.name).join(", ") ||
              profile.primaryConcern ||
              "Not recorded"}
          </p>
          <p className="text-sm leading-relaxed">
            <span className="text-muted-foreground">Medications · </span>
            {meds.join("; ") || "Not recorded"}
          </p>
          <p className="text-sm leading-relaxed">
            <span className="text-muted-foreground">Allergies · </span>
            {allergies.map((a) => a.substance).join(", ") || "None recorded"}
          </p>
          <p className="text-sm leading-relaxed">
            <span className="text-muted-foreground">Concern · </span>
            {profile.primaryConcern || "Not recorded"}
          </p>
          {documents.length ? (
            <p className="text-sm leading-relaxed">
              <span className="text-muted-foreground">Attached records · </span>
              {documents.map((d) => d.title).join("; ")}
            </p>
          ) : null}
        </section>

        <section className="mt-6">
          <p className="text-xs tracking-wide text-muted-foreground uppercase">
            {view === "letter"
              ? "Clinical handoff"
              : view === "request"
                ? "Clinic request"
                : "Patient summary"}
          </p>
          <div className="mt-4 whitespace-pre-wrap text-[15px] leading-7 text-foreground/90">
            {letterBody || "No letter content yet."}
          </div>
        </section>

        {spokenHandoffUrl && view === "letter" ? (
          <div className="mt-8 border-t border-border pt-6">
            <p className="mb-2 text-xs tracking-wide text-muted-foreground uppercase">
              Spoken handoff
            </p>
            <audio controls className="w-full" src={spokenHandoffUrl}>
              Spoken handoff
            </audio>
          </div>
        ) : null}
      </article>

      {corridorBrief?.mustKnow?.length ? (
        <section className="space-y-3">
          <p className="text-sm text-muted-foreground">Next for your route</p>
          <p className="text-[11px] text-danger">
            Red = critical for continuity / safety
          </p>
          <ul className="space-y-2 text-sm leading-relaxed">
            {corridorBrief.mustKnow.slice(0, 4).map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-px w-3 shrink-0 bg-border" />
                <span>
                  <CriticalText text={item} />
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="flex flex-col gap-2 border-t border-border pt-6 sm:flex-row">
        <Button className="flex-1" onClick={copyPackage}>
          {ukBound ? "Copy pack for your GP" : "Copy package"}
        </Button>
        <Button
          variant="secondary"
          className="flex-1"
          onClick={markSimulatedSent}
        >
          Mark as sent (demo)
        </Button>
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <Link
          href="/app/handoff"
          className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Edit handoff
        </Link>
        <Link
          href="/app/overview"
          className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
