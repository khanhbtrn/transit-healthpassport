"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { suggestDoctorsForDestination } from "@/lib/corridor/doctors";
import { useTransitStore } from "@/lib/store/use-transit-store";
import type { AppointmentRequest } from "@/lib/types";

export default function CareSearchPage() {
  const profile = useTransitStore((s) => s.profile);
  const conditions = useTransitStore((s) => s.conditions);
  const medications = useTransitStore((s) => s.medications);
  const allergies = useTransitStore((s) => s.allergies);
  const documents = useTransitStore((s) => s.documents);
  const corridorBrief = useTransitStore((s) => s.corridorBrief);
  const doctors = useTransitStore((s) => s.doctors);
  const setDoctors = useTransitStore((s) => s.setDoctors);
  const selectedDoctorId = useTransitStore((s) => s.selectedDoctorId);
  const selectDoctor = useTransitStore((s) => s.selectDoctor);
  const setAppointmentRequest = useTransitStore((s) => s.setAppointmentRequest);
  const approveAppointmentRequest = useTransitStore(
    (s) => s.approveAppointmentRequest
  );
  const appointmentRequest = useTransitStore((s) => s.appointmentRequest);

  const [searching, setSearching] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const destination =
    profile.destinationCity || profile.destinationCountry || "your destination";

  async function runSearch() {
    setSearching(true);
    try {
      const suggestions = suggestDoctorsForDestination({
        destinationCity: profile.destinationCity,
        destinationCountry: profile.destinationCountry,
        condition: conditions[0]?.name,
        preferredLanguage: profile.preferredLanguage,
      });
      setDoctors(suggestions);
      toast.success(`Suggestions for ${destination}`);
    } finally {
      setSearching(false);
    }
  }

  function prepare(doctorId: string) {
    const doctor = doctors.find((d) => d.id === doctorId);
    if (!doctor) return;
    selectDoctor(doctorId);
    const request: AppointmentRequest = {
      patientIntroduction: `${profile.fullName} is moving from ${profile.currentCity}, ${profile.currentCountry} to ${profile.destinationCity}, ${profile.destinationCountry}.`,
      reasonForReferral:
        profile.primaryConcern ||
        corridorBrief?.specialistNotes ||
        "Continuity of care after international relocation",
      clinicalSummary: [
        conditions.map((c) => c.name).join(", "),
        medications
          .filter((m) => m.status === "current")
          .map((m) => m.name)
          .join(", "),
        allergies.map((a) => a.substance).join(", "),
      ]
        .filter(Boolean)
        .join(" · "),
      requestedTiming: "First suitable review after arrival",
      attachedDocuments: documents.map((d) => d.title),
      preferredLanguage: profile.preferredLanguage || "English",
      status: "prepared",
    };
    setAppointmentRequest(request);
    setRequestOpen(true);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl">Doctors</h1>
        <p className="mt-2 text-muted-foreground">
          Suggestions for {destination}
          {corridorBrief ? ` · ${corridorBrief.careSystemNotes}` : ""}
        </p>
      </div>

      {doctors.length === 0 ? (
        <Button
          size="lg"
          className="w-full"
          disabled={searching}
          onClick={() => void runSearch()}
        >
          {searching ? "Searching…" : `Find doctors in ${destination}`}
        </Button>
      ) : (
        <div className="space-y-3">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="rounded-2xl border border-border bg-card p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{doctor.doctorName}</p>
                  <p className="text-sm text-muted-foreground">
                    {doctor.organization}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {doctor.matchReason}
                  </p>
                </div>
                {selectedDoctorId === doctor.id ? (
                  <span className="text-xs text-accent">Selected</span>
                ) : null}
              </div>
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => selectDoctor(doctor.id)}
                >
                  Select
                </Button>
                <Button size="sm" onClick={() => prepare(doctor.id)}>
                  Prepare request
                </Button>
              </div>
            </div>
          ))}
          <Button asChild size="lg" className="w-full">
            <Link href="/app/overview">Back to Home</Link>
          </Button>
        </div>
      )}

      <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request ready</DialogTitle>
          </DialogHeader>
          {appointmentRequest ? (
            <div className="space-y-3 text-sm">
              <p>{appointmentRequest.patientIntroduction}</p>
              <p>{appointmentRequest.clinicalSummary || "Summary prepared."}</p>
              <p className="text-muted-foreground">
                Nothing is sent without your approval.
              </p>
              <Button
                className="w-full"
                onClick={() => {
                  approveAppointmentRequest();
                  setRequestOpen(false);
                  toast.success("Saved");
                }}
              >
                Approve
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
