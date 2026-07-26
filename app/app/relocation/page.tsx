"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { ApprovalQueue } from "@/components/agent/approval-queue";
import { DoneLog } from "@/components/agent/done-log";
import { NeedsPanel } from "@/components/agent/needs-panel";
import { Button } from "@/components/ui/button";
import {
  buildAgentApprovals,
  buildResearchPack,
  stampDone,
} from "@/lib/agent/plan";
import { suggestDoctorsForDestination } from "@/lib/corridor/doctors";
import type { CommunityLink } from "@/lib/corridor/knowledge";
import { buildProfileContext } from "@/lib/demo/seed";
import { useTransitStore } from "@/lib/store/use-transit-store";
import type { AgentDoneItem, RelocationTask } from "@/lib/types";
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
  const conversationCompleted = useTransitStore((s) => s.conversationCompleted);
  const setTasks = useTransitStore((s) => s.setTasks);
  const setDoctors = useTransitStore((s) => s.setDoctors);
  const selectDoctor = useTransitStore((s) => s.selectDoctor);
  const setAppointmentRequest = useTransitStore((s) => s.setAppointmentRequest);
  const setHandoff = useTransitStore((s) => s.setHandoff);
  const setSpokenHandoffUrl = useTransitStore((s) => s.setSpokenHandoffUrl);
  const setSpecialistRequestDraft = useTransitStore(
    (s) => s.setSpecialistRequestDraft
  );
  const markTransitionComplete = useTransitStore(
    (s) => s.markTransitionComplete
  );
  const agentNeeds = useTransitStore((s) => s.agentNeeds);
  const approvals = useTransitStore((s) => s.approvals);
  const agentDone = useTransitStore((s) => s.agentDone);
  const setAgentNeeds = useTransitStore((s) => s.setAgentNeeds);
  const resolveAgentNeed = useTransitStore((s) => s.resolveAgentNeed);
  const setApprovals = useTransitStore((s) => s.setApprovals);
  const setApprovalStatus = useTransitStore((s) => s.setApprovalStatus);
  const setAgentDone = useTransitStore((s) => s.setAgentDone);
  const setCorridorBrief = useTransitStore((s) => s.setCorridorBrief);
  const selectedDoctorId = useTransitStore((s) => s.selectedDoctorId);
  const doctors = useTransitStore((s) => s.doctors);
  const transitionComplete = useTransitStore((s) => s.transitionComplete);

  const [running, setRunning] = useState(false);
  const [steps, setSteps] = useState<RunStep[]>([]);
  const alreadyRan = transitionComplete || agentDone.length > 0;
  const chosenDoctor = doctors.find((d) => d.id === selectedDoctorId);
  const destination =
    profile.destinationCity || profile.destinationCountry || "your destination";
  const openNeeds = agentNeeds.filter((n) => n.status === "open").length;

  function patchStep(id: string, patch: Partial<RunStep>) {
    setSteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, ...patch } : step))
    );
  }

  async function runTransit() {
    if (running) return;
    setRunning(true);

    const doneLog: AgentDoneItem[] = [];
    const queue: RunStep[] = [
      {
        id: "research",
        label: `Research ${profile.currentCity || "origin"} → ${destination} system`,
        status: "pending",
      },
      {
        id: "community",
        label: "Scan community tips (Reddit / forums)",
        status: "pending",
      },
      {
        id: "needs",
        label: "Ask only for blockers (max 3)",
        status: "pending",
      },
      {
        id: "letter",
        label: "Draft current-clinic letter ask (only if needed)",
        status: "pending",
      },
      {
        id: "plan",
        label: "Build efficient destination checklist",
        status: "pending",
      },
      {
        id: "doctor",
        label: `Research real clinics / pathways in ${destination}`,
        status: "pending",
      },
      {
        id: "booking",
        label: "Prepare researched contact / registration request",
        status: "pending",
      },
      {
        id: "handoff",
        label: "Generate clinic handoff (pending your approval)",
        status: "pending",
      },
      {
        id: "approvals",
        label: "Queue only what needs your approval",
        status: "pending",
      },
    ];
    setSteps(queue);

    let liveBrief = corridorBrief;
    let communityLinks: CommunityLink[] = liveBrief?.communityLinks || [];

    try {
      patchStep("research", { status: "running" });
      await wait(400);
      const researchSeed = buildResearchPack({
        profile,
        conditions,
        documents,
        conversationCompleted,
        brief: liveBrief,
        communityLinks,
      });
      doneLog.push(
        stampDone(
          "Researched how care works on your route",
          researchSeed.efficientBrief.slice(0, 3).join(" · ")
        )
      );
      patchStep("research", {
        status: "done",
        detail: researchSeed.efficientBrief[0] || `Pathway for ${destination}.`,
      });

      patchStep("community", { status: "running" });
      try {
        const communityRes = await fetch("/api/corridor/community", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fromCountry: profile.currentCountry,
            toCountry: profile.destinationCountry,
            fromCity: profile.currentCity,
            toCity: profile.destinationCity,
            condition: conditions[0]?.name || profile.primaryConcern,
          }),
        });
        if (communityRes.ok) {
          const communityData = await communityRes.json();
          communityLinks = (communityData.links || []) as CommunityLink[];
          if (liveBrief) {
            liveBrief = { ...liveBrief, communityLinks };
            setCorridorBrief(liveBrief);
          }
        }
      } catch {
        // keep empty links
      }
      doneLog.push(
        stampDone(
          "Community research",
          communityLinks.length
            ? `Found ${communityLinks.length} relevant thread(s) — tips only, not official rules.`
            : "No high-confidence public threads for this exact path; using corridor + official pathways."
        )
      );
      patchStep("community", {
        status: "done",
        detail: communityLinks[0]
          ? communityLinks[0].title.slice(0, 90)
          : "No strong community matches — continuing with corridor research.",
      });

      const pack = buildResearchPack({
        profile,
        conditions,
        documents,
        conversationCompleted,
        brief: liveBrief,
        communityLinks,
      });

      const needs = pack.needs.map((need) => {
        const prev = agentNeeds.find((n) => n.id === need.id);
        if (prev?.status === "done" || prev?.status === "skipped") {
          return { ...need, status: prev.status };
        }
        return need;
      });
      setAgentNeeds(needs);

      patchStep("needs", { status: "running" });
      await wait(350);
      const stillOpen = needs.filter((n) => n.status === "open").length;
      doneLog.push(
        stampDone(
          "Intentional asks only",
          stillOpen
            ? `${stillOpen} blocker(s) — nothing extra.`
            : "No blockers — enough to prepare researched requests."
        )
      );
      patchStep("needs", {
        status: stillOpen ? "needs_you" : "done",
        detail:
          stillOpen > 0
            ? `${stillOpen} item(s) still need you.`
            : "No blocking asks.",
      });

      const context = buildProfileContext({
        profile,
        conditions,
        medications,
        allergies,
        documents,
        unresolvedQuestions,
        continuityPriorities,
        corridorBrief: liveBrief,
      });

      patchStep("letter", { status: "running" });
      const needsLetter = needs.some(
        (n) =>
          n.status === "open" &&
          (n.id === "need-letter" || n.id === "need-source")
      );
      let letterText = "";
      if (needsLetter || documents.length === 0) {
        letterText = `Please provide a signed English clinical summary for ${profile.fullName}, relocating from ${profile.currentCity}, ${profile.currentCountry} to ${destination}. Include diagnosis, current treatment, recent key results, and what must continue in the first weeks after arrival.`;
        try {
          const agentRes = await fetch("/api/ai/agent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              question:
                "Draft a SHORT request (max 120 words) to the patient's current clinic for one English transfer summary needed for destination registration. Return only the request text.",
              context,
            }),
          });
          if (agentRes.ok) {
            const data = await agentRes.json();
            if (data.answer) letterText = data.answer;
          }
        } catch {
          // keep fallback
        }
        setSpecialistRequestDraft(letterText);
        doneLog.push(
          stampDone(
            "Drafted current-clinic letter ask",
            "Only because a transfer summary is still missing — approve before send."
          )
        );
        patchStep("letter", {
          status: "done",
          detail: "Draft ready — approve before send.",
        });
      } else {
        letterText = useTransitStore.getState().specialistRequestDraft || "";
        doneLog.push(
          stampDone(
            "Skipped letter ask",
            "You already have clinical material — no busywork request."
          )
        );
        patchStep("letter", {
          status: "done",
          detail: "Skipped — records already available.",
        });
      }

      patchStep("plan", { status: "running" });
      const efficientTasks: RelocationTask[] = pack.efficientBrief
        .slice(0, 5)
        .map((line, index) => ({
          id: `research-${Date.now()}-${index}`,
          phase: index === 0 ? "before_departure" : "before_arrival",
          title: line.slice(0, 72) + (line.length > 72 ? "…" : ""),
          description: line,
          explanation: line,
          status: "complete",
          priority: index < 2 ? "critical" : "high",
          owner: "Transit",
          dueDate: profile.moveDate || "",
          sourceStatus: "Corridor + community research",
          actionType: "research_step",
        }));
      setTasks(efficientTasks);
      try {
        const planRes = await fetch("/api/ai/relocation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: context }),
        });
        if (planRes.ok) {
          const planPayload = await planRes.json();
          const plan = planPayload.data ?? planPayload;
          const aiTasks: RelocationTask[] = (plan.tasks || [])
            .slice(0, 3)
            .map(
              (
                task: {
                  phase: RelocationTask["phase"];
                  title: string;
                  explanation: string;
                  deadline: string;
                  priority: RelocationTask["priority"];
                },
                index: number
              ) => ({
                id: `ai-${Date.now()}-${index}`,
                phase: task.phase || "before_arrival",
                title: task.title,
                description: task.explanation,
                explanation: task.explanation,
                status: "complete",
                priority: task.priority || "high",
                owner: "Transit",
                dueDate: task.deadline || profile.moveDate || "",
                sourceStatus: "AI checklist (corridor-specific)",
                actionType: "research_step",
              })
            );
          if (aiTasks.length) {
            setTasks([...efficientTasks.slice(0, 3), ...aiTasks].slice(0, 6));
          }
        }
      } catch {
        // efficient tasks already set
      }
      doneLog.push(
        stampDone(
          "Efficient destination checklist",
          pack.efficientBrief.slice(0, 2).join(" · ")
        )
      );
      patchStep("plan", {
        status: "done",
        detail: `${pack.pathway.split("_").join(" ")} pathway.`,
      });

      patchStep("doctor", { status: "running" });
      await wait(500);
      const nextDoctors = suggestDoctorsForDestination({
        destinationCity: profile.destinationCity,
        destinationCountry: profile.destinationCountry,
        condition: conditions[0]?.name || profile.primaryConcern,
        preferredLanguage: profile.preferredLanguage,
      });
      setDoctors(nextDoctors);
      const chosen = nextDoctors.find((d) => d.recommended) || nextDoctors[0];
      if (chosen) selectDoctor(chosen.id);
      doneLog.push(
        stampDone(
          `Researched clinics / pathways · ${destination}`,
          chosen
            ? `${chosen.organization} — ${chosen.matchReason}`
            : "Directory shortlist ready."
        )
      );
      patchStep("doctor", {
        status: "done",
        detail: chosen
          ? `${chosen.organization}${chosen.fictional ? " (planning)" : " (researched org)"}`
          : "Shortlist ready.",
      });

      patchStep("booking", { status: "running" });
      await wait(400);
      const timing =
        pack.pathway === "nhs_gp_first"
          ? "After UK address available — GP registration, then specialty referral"
          : pack.pathway === "private_international_desk"
            ? "Earliest international-desk specialty slot after records received"
            : "Earliest suitable specialty review after arrival";
      setAppointmentRequest({
        patientIntroduction: `${profile.fullName} is relocating from ${profile.currentCity}, ${profile.currentCountry} to ${profile.destinationCity}, ${profile.destinationCountry}.`,
        reasonForReferral:
          profile.primaryConcern ||
          liveBrief?.specialistNotes ||
          "Continuity of care after international relocation",
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
        requestedTiming: timing,
        attachedDocuments: documents.map((d) => d.title),
        preferredLanguage: profile.preferredLanguage || "English",
        status: "prepared",
      });
      doneLog.push(
        stampDone(
          pack.pathway === "nhs_gp_first"
            ? "Prepared NHS GP registration request pack"
            : "Prepared researched clinic contact request",
          "Waiting for your approval. Demo does not place a live call/email until you simulate send."
        )
      );
      patchStep("booking", {
        status: "done",
        detail:
          pack.pathway === "nhs_gp_first"
            ? "GP-first pathway — not a cold hospital booking."
            : "Request prepared — approve to simulate contact.",
      });

      patchStep("handoff", { status: "running" });
      let handoffSummary = letterText;
      try {
        const handoffRes = await fetch("/api/ai/handoff", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: context }),
        });
        const handoffPayload = await handoffRes.json();
        const data = handoffPayload.data ?? handoffPayload;
        handoffSummary =
          data.clinicalSummary || data.detailedSummary || letterText;
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
      }
      doneLog.push(
        stampDone(
          "Generated clinical handoff",
          "Draft only — approve in the queue before sharing with a clinic."
        )
      );
      patchStep("handoff", {
        status: "done",
        detail: "Handoff drafted — needs your approval.",
      });

      try {
        const spoken =
          useTransitStore.getState().handoff.patientSummary ||
          useTransitStore.getState().handoff.clinicalSummary ||
          `Care handoff for ${profile.fullName}, relocating to ${destination}.`;
        const voiceRes = await fetch("/api/voice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: spoken.slice(0, 900) }),
        });
        const voiceData = await voiceRes.json();
        if (voiceData.audioUrl) {
          setSpokenHandoffUrl(voiceData.audioUrl);
          doneLog.push(
            stampDone(
              "Prepared spoken handoff",
              "Audio ready for the receiving clinic (demo/ElevenLabs)."
            )
          );
        } else {
          setSpokenHandoffUrl(null);
        }
      } catch {
        setSpokenHandoffUrl(null);
      }

      patchStep("approvals", { status: "running" });
      const approvalItems = buildAgentApprovals({
        profile,
        specialistDraft: letterText,
        pathway: pack.pathway,
        researchNotes: pack.researchNotes,
        doctorName: chosen?.doctorName,
        organization: chosen?.organization,
        handoffSummary,
        appointmentTiming: timing,
      });
      setApprovals(approvalItems);
      setAgentDone(doneLog);
      markTransitionComplete();
      doneLog.push(
        stampDone(
          "Queued approvals",
          `${approvalItems.length} items need your review before any send.`
        )
      );
      setAgentDone([...doneLog]);
      patchStep("approvals", {
        status: "done",
        detail: `${approvalItems.length} approvals waiting.`,
      });

      toast.success("Agent finished — review what needs your approval");
      router.push("/app/arrival");
    } catch {
      toast.error("Something stopped mid-run. Try again.");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl">Your Transit agent</h1>
        <p className="mt-2 text-muted-foreground">
          Assumes you know nothing about {destination} care. Researches the
          system, community tips, and real clinic pathways — then asks only for
          blockers and queues approvals.
        </p>
      </div>

      <NeedsPanel needs={agentNeeds} onResolve={resolveAgentNeed} />

      {!alreadyRan && steps.length === 0 ? (
        <div className="rounded-[2rem] border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            One run. Transit researches your corridor, scans community threads,
            matches researched organisations (e.g. NHS GP pathway / hospital
            international desks), asks for at most a few missing inputs, and
            queues only what needs your approval. Live calls stay simulated until
            you approve a send.
          </p>
          {openNeeds > 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              You still have {openNeeds} open ask
              {openNeeds === 1 ? "" : "s"} above — the agent can start anyway and
              keep those listed.
            </p>
          ) : null}
          <p className="mt-3 text-xs text-muted-foreground">
            Clinics are not contacted for real until you approve a simulated
            send in this demo.
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
                step.status === "needs_you" && "border-amber-500/40 bg-card",
                step.status === "pending" && "border-border bg-muted/40"
              )}
            >
              <div className="flex items-center gap-3">
                {step.status === "running" ? (
                  <Loader2 className="h-4 w-4 animate-spin text-accent" />
                ) : step.status === "done" ? (
                  <span className="text-accent">✓</span>
                ) : step.status === "needs_you" ? (
                  <span className="text-amber-700">!</span>
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

      {alreadyRan ? (
        <>
          <DoneLog items={agentDone} />
          <ApprovalQueue items={approvals} onStatus={setApprovalStatus} />
          <div className="space-y-3 rounded-[2rem] border border-border bg-card p-6">
            <p className="font-display text-2xl">Package ready for review</p>
            <p className="text-sm text-muted-foreground">
              {chosenDoctor
                ? `Matched clinician: ${chosenDoctor.doctorName}. `
                : ""}
              Approve items above, then open your arrival summary.
            </p>
            <Button
              size="lg"
              className="w-full"
              onClick={() => router.push("/app/arrival")}
            >
              Open agent summary
            </Button>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/app/handoff">Review handoff letter</Link>
            </Button>
            <Button
              variant="outline"
              className="w-full"
              disabled={running}
              onClick={() => {
                setSteps([]);
                void runTransit();
              }}
            >
              Run agent again
            </Button>
          </div>
        </>
      ) : null}

      {running ? (
        <p className="text-center text-sm text-muted-foreground">
          Transit is working… stay on this page.
        </p>
      ) : null}
    </div>
  );
}
