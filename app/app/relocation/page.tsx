"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { suggestDoctorsForDestination } from "@/lib/corridor/doctors";
import { buildProfileContext } from "@/lib/demo/seed";
import { useTransitStore } from "@/lib/store/use-transit-store";
import type { RelocationTask } from "@/lib/types";
import { cn } from "@/lib/utils";

type RunStep = {
  id: string;
  label: string;
  detail?: string;
  status: "pending" | "running" | "done" | "needs_you";
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function RelocationPage() {
  const router = useRouter();
  const profile = useTransitStore((s) => s.profile);
  const conditions = useTransitStore((s) => s.conditions);
  const medications = useTransitStore((s) => s.medications);
  const allergies = useTransitStore((s) => s.allergies);
  const documents = useTransitStore((s) => s.documents);
  const unresolvedQuestions = useTransitStore((s) => s.unresolvedQuestions);
  const continuityPriorities = useTransitStore((s) => s.continuityPriorities);
  const corridorBrief = useTransitStore((s) => s.corridorBrief);
  const setTasks = useTransitStore((s) => s.setTasks);
  const setDoctors = useTransitStore((s) => s.setDoctors);
  const selectDoctor = useTransitStore((s) => s.selectDoctor);
  const setAppointmentRequest = useTransitStore((s) => s.setAppointmentRequest);
  const setHandoff = useTransitStore((s) => s.setHandoff);
  const approveHandoff = useTransitStore((s) => s.approveHandoff);
  const setSpokenHandoffUrl = useTransitStore((s) => s.setSpokenHandoffUrl);
  const setSpecialistRequestDraft = useTransitStore(
    (s) => s.setSpecialistRequestDraft
  );
  const markTransitionComplete = useTransitStore(
    (s) => s.markTransitionComplete
  );
  const selectedDoctorId = useTransitStore((s) => s.selectedDoctorId);
  const handoffApproved = useTransitStore((s) => s.handoffApproved);
  const appointmentRequest = useTransitStore((s) => s.appointmentRequest);
  const transitionComplete = useTransitStore((s) => s.transitionComplete);
  const spokenHandoffUrl = useTransitStore((s) => s.spokenHandoffUrl);
  const doctors = useTransitStore((s) => s.doctors);

  const alreadyDone = Boolean(
    transitionComplete ||
      (selectedDoctorId && handoffApproved && appointmentRequest)
  );

  const [running, setRunning] = useState(false);
  const [steps, setSteps] = useState<RunStep[]>([]);
  const [voiceNote, setVoiceNote] = useState<string | null>(
    spokenHandoffUrl
  );
  const [finished, setFinished] = useState(alreadyDone);
  const startedRef = useRef(false);
  const chosenDoctor = doctors.find((d) => d.id === selectedDoctorId);

  const destination =
    profile.destinationCity || profile.destinationCountry || "your destination";

  function patchStep(id: string, patch: Partial<RunStep>) {
    setSteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, ...patch } : step))
    );
  }

  async function runTransit() {
    if (running) return;
    setRunning(true);
    setFinished(false);
    setVoiceNote(null);

    const queue: RunStep[] = [
      {
        id: "brief",
        label: `Map your ${profile.currentCity || "origin"} → ${destination} route`,
        status: "pending",
      },
      {
        id: "letter",
        label: "Draft request to your current specialist",
        status: "pending",
      },
      {
        id: "plan",
        label: "Build destination action pack",
        status: "pending",
      },
      {
        id: "doctor",
        label: `Find a clinician in ${destination}`,
        status: "pending",
      },
      {
        id: "booking",
        label: "Prepare appointment request",
        status: "pending",
      },
      {
        id: "handoff",
        label: "Generate clinical handoff",
        status: "pending",
      },
      {
        id: "voice",
        label: "Prepare spoken handoff for the new clinic",
        status: "pending",
      },
    ];
    setSteps(queue);

    const context = buildProfileContext({
      profile,
      conditions,
      medications,
      allergies,
      documents,
      unresolvedQuestions,
      continuityPriorities,
      corridorBrief,
    });

    try {
      // 1. Route brief
      patchStep("brief", { status: "running" });
      await wait(700);
      patchStep("brief", {
        status: "done",
        detail: corridorBrief?.summary || `Preparing care continuity for ${destination}.`,
      });

      // 2. Specialist letter request
      patchStep("letter", { status: "running" });
      let letterText =
        `Please provide a signed clinical summary for ${profile.fullName} relocating from ${profile.currentCity} to ${destination}. Include diagnosis, current treatment, monitoring, and continuity priorities.`;
      try {
        const agentRes = await fetch("/api/ai/agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question:
              "Draft a short request to the patient's current specialist asking for a signed summary for international care transfer. Return only the request text.",
            context,
          }),
        });
        if (agentRes.ok) {
          const data = await agentRes.json();
          if (data.answer) letterText = data.answer;
        }
      } catch {
        // keep fallback draft
      }
      setSpecialistRequestDraft(letterText);
      patchStep("letter", {
        status: "done",
        detail: "Draft ready for your approval before any send.",
      });

      // 3. Destination plan (agent does the work; stored as completed actions)
      patchStep("plan", { status: "running" });
      try {
        const planRes = await fetch("/api/ai/relocation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: context }),
        });
        const planPayload = await planRes.json();
        const plan = planPayload.data ?? planPayload;
        const nextTasks: RelocationTask[] = (plan.tasks || [])
          .slice(0, 5)
          .map(
            (
              task: {
                phase: RelocationTask["phase"];
                title: string;
                explanation: string;
                deadline: string;
                priority: RelocationTask["priority"];
                sourceStatus: string;
              },
              index: number
            ) => ({
              id: `auto-${Date.now()}-${index}`,
              phase: task.phase || "before_arrival",
              title: task.title,
              description: task.explanation,
              explanation: task.explanation,
              status: "complete",
              priority: task.priority || "high",
              owner: "Transit",
              dueDate: task.deadline || profile.moveDate || "",
              sourceStatus: "Handled by Transit agent",
              actionType: "approve_action",
            })
          );
        if (nextTasks.length) setTasks(nextTasks);
        patchStep("plan", {
          status: "done",
          detail: `${nextTasks.length || 4} destination actions prepared.`,
        });
      } catch {
        setTasks([
          {
            id: `auto-reg-${Date.now()}`,
            phase: "before_arrival",
            title: `Registration pack for ${destination}`,
            description: corridorBrief?.registrationNotes || "Registration guidance prepared.",
            explanation: corridorBrief?.registrationNotes || "Registration guidance prepared.",
            status: "complete",
            priority: "critical",
            owner: "Transit",
            dueDate: profile.moveDate || "",
            sourceStatus: "Handled by Transit agent",
            actionType: "approve_action",
          },
        ]);
        patchStep("plan", {
          status: "done",
          detail: "Destination action pack prepared.",
        });
      }

      // 4. Find doctor
      patchStep("doctor", { status: "running" });
      await wait(600);
      const doctors = suggestDoctorsForDestination({
        destinationCity: profile.destinationCity,
        destinationCountry: profile.destinationCountry,
        condition: conditions[0]?.name,
        preferredLanguage: profile.preferredLanguage,
      });
      setDoctors(doctors);
      const chosen = doctors.find((d) => d.recommended) || doctors[0];
      if (chosen) selectDoctor(chosen.id);
      patchStep("doctor", {
        status: "done",
        detail: chosen
          ? `Selected ${chosen.doctorName} · ${chosen.organization}`
          : "Specialist shortlist ready.",
      });

      // 5. Appointment request (simulated send after auto-approve for demo flow)
      patchStep("booking", { status: "running" });
      await wait(500);
      setAppointmentRequest({
        patientIntroduction: `${profile.fullName} is relocating from ${profile.currentCity}, ${profile.currentCountry} to ${profile.destinationCity}, ${profile.destinationCountry}.`,
        reasonForReferral:
          profile.primaryConcern ||
          corridorBrief?.specialistNotes ||
          "Continuity of specialist care after international relocation",
        clinicalSummary: [
          conditions.map((c) => c.name).join(", "),
          medications
            .filter((m) => m.status === "current")
            .map((m) => `${m.name} ${m.dosage}`)
            .join(", "),
          allergies.map((a) => a.substance).join(", "),
        ]
          .filter(Boolean)
          .join(" · "),
        requestedTiming: "First suitable review after arrival",
        attachedDocuments: documents.map((d) => d.title),
        preferredLanguage: profile.preferredLanguage || "English",
        status: "approved",
      });
      patchStep("booking", {
        status: "done",
        detail:
          "Appointment request prepared and approved in-app. No clinic contacted for real in this demo.",
      });

      // 6. Handoff
      patchStep("handoff", { status: "running" });
      try {
        const handoffRes = await fetch("/api/ai/handoff", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: context }),
        });
        const handoffPayload = await handoffRes.json();
        const data = handoffPayload.data ?? handoffPayload;
        setHandoff({
          id: `handoff-auto-${Date.now()}`,
          language: "en",
          clinicalSummary: data.clinicalSummary || letterText,
          detailedSummary: data.detailedSummary || letterText,
          patientSummary:
            data.patientSummary ||
            `Care handoff prepared for your move to ${destination}.`,
          spanishSummary: data.spanishSummary || "",
          catalanSummary: data.catalanSummary || "",
          unresolvedQuestions: data.unresolvedQuestions || [],
          continuityPriorities:
            data.continuityPriorities || continuityPriorities,
          supportingDocuments: documents.map((d) => d.title),
          generatedAt: new Date().toISOString(),
        });
        approveHandoff();
        patchStep("handoff", {
          status: "done",
          detail: "Clinical handoff generated and approved.",
        });
      } catch {
        setHandoff({
          id: `handoff-auto-${Date.now()}`,
          language: "en",
          clinicalSummary: letterText,
          detailedSummary: letterText,
          patientSummary: `Care handoff prepared for ${destination}.`,
          spanishSummary: "",
          catalanSummary: "",
          unresolvedQuestions: [],
          continuityPriorities,
          supportingDocuments: documents.map((d) => d.title),
          generatedAt: new Date().toISOString(),
        });
        approveHandoff();
        patchStep("handoff", {
          status: "done",
          detail: "Handoff prepared.",
        });
      }

      // 7. Voice / ElevenLabs spoken handoff
      patchStep("voice", { status: "running" });
      try {
        const spoken =
          useTransitStore.getState().handoff.patientSummary ||
          useTransitStore.getState().handoff.clinicalSummary ||
          `This is a care handoff for ${profile.fullName}, relocating to ${destination}.`;
        const voiceRes = await fetch("/api/voice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: spoken.slice(0, 900) }),
        });
        const voiceData = await voiceRes.json();
        if (voiceData.audioUrl) {
          setVoiceNote(voiceData.audioUrl);
          setSpokenHandoffUrl(voiceData.audioUrl);
          const audio = new Audio(voiceData.audioUrl);
          void audio.play().catch(() => undefined);
          patchStep("voice", {
            status: "done",
            detail: "Spoken handoff ready (ElevenLabs).",
          });
        } else {
          setSpokenHandoffUrl(null);
          patchStep("voice", {
            status: "done",
            detail:
              voiceData.message ||
              "Spoken handoff simulated — add ELEVENLABS_VOICE_ID for live audio.",
          });
        }
      } catch {
        setSpokenHandoffUrl(null);
        patchStep("voice", {
          status: "done",
          detail: "Spoken handoff prepared in simulation mode.",
        });
      }

      markTransitionComplete();
      setFinished(true);
      toast.success("Transit finished — opening your results");
      router.push("/app/arrival");
    } catch {
      toast.error("Something stopped mid-run. Try again.");
    } finally {
      setRunning(false);
    }
  }

  useEffect(() => {
    // Optional: do not auto-start; user taps once.
    startedRef.current = false;
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl">Transit agent</h1>
        <p className="mt-2 text-muted-foreground">
          Transit does the work for your move to {destination}.
        </p>
      </div>

      {!finished && steps.length === 0 ? (
        <div className="rounded-[2rem] border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            One tap. Transit will draft specialist requests, prepare your
            destination pack, shortlist a clinician, prepare the appointment
            request, generate your handoff, and create a spoken summary.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Clinics are not contacted for real until you explicitly allow sending
            outside this demo.
          </p>
          <Button
            size="lg"
            className="mt-6 w-full"
            disabled={running}
            onClick={() => void runTransit()}
          >
            <Sparkles className="h-4 w-4" />
            Let Transit handle this
          </Button>
        </div>
      ) : null}

      {steps.length > 0 ? (
        <div className="space-y-3">
          {steps.map((step) => (
            <div
              key={step.id}
              className={cn(
                "rounded-2xl border px-4 py-3",
                step.status === "done" && "border-accent/30 bg-accent-soft/40",
                step.status === "running" && "border-accent bg-card",
                step.status === "pending" && "border-border bg-muted/40"
              )}
            >
              <div className="flex items-center gap-3">
                {step.status === "running" ? (
                  <Loader2 className="h-4 w-4 animate-spin text-accent" />
                ) : step.status === "done" ? (
                  <span className="text-accent">✓</span>
                ) : (
                  <span className="text-muted-foreground">•</span>
                )}
                <div className="min-w-0">
                  <p className="font-medium">{step.label}</p>
                  {step.detail ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {step.detail}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {voiceNote ? (
        <audio controls className="w-full" src={voiceNote}>
          Spoken handoff
        </audio>
      ) : null}

      {finished ? (
        <div className="space-y-3 rounded-[2rem] border border-border bg-card p-6">
          <p className="font-display text-2xl">Package ready</p>
          <p className="text-sm text-muted-foreground">
            Transit prepared your doctor match, appointment request, and handoff
            for {destination}.
            {chosenDoctor
              ? ` Matched clinician: ${chosenDoctor.doctorName}.`
              : ""}
          </p>
          <Button
            size="lg"
            className="w-full"
            onClick={() => router.push("/app/arrival")}
          >
            See your Transit results
          </Button>
          <Button asChild variant="secondary" className="w-full">
            <Link href="/app/handoff">Review handoff</Link>
          </Button>
          <Button
            variant="outline"
            className="w-full"
            disabled={running}
            onClick={() => {
              setSteps([]);
              setFinished(false);
              void runTransit();
            }}
          >
            Run again
          </Button>
        </div>
      ) : null}

      {running ? (
        <p className="text-center text-sm text-muted-foreground">
          Transit is working… stay on this page.
        </p>
      ) : null}
    </div>
  );
}
