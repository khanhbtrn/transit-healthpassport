"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { AudioPlayer } from "@/components/handoff/audio-player";
import { Button } from "@/components/ui/button";
import { buildProfileContext } from "@/lib/demo/seed";
import { useTransitStore } from "@/lib/store/use-transit-store";

export default function HandoffPage() {
  const profile = useTransitStore((s) => s.profile);
  const conditions = useTransitStore((s) => s.conditions);
  const medications = useTransitStore((s) => s.medications);
  const allergies = useTransitStore((s) => s.allergies);
  const documents = useTransitStore((s) => s.documents);
  const unresolvedQuestions = useTransitStore((s) => s.unresolvedQuestions);
  const continuityPriorities = useTransitStore((s) => s.continuityPriorities);
  const corridorBrief = useTransitStore((s) => s.corridorBrief);
  const handoff = useTransitStore((s) => s.handoff);
  const setHandoff = useTransitStore((s) => s.setHandoff);
  const approveHandoff = useTransitStore((s) => s.approveHandoff);
  const handoffApproved = useTransitStore((s) => s.handoffApproved);
  const [generating, setGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const hasContent = Boolean(handoff.clinicalSummary);

  async function generate() {
    setGenerating(true);
    try {
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
      const response = await fetch("/api/ai/handoff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: context }),
      });
      const payload = await response.json();
      const data = payload.data ?? payload;
      setHandoff({
        id: `handoff-${Date.now()}`,
        language: "en",
        clinicalSummary: data.clinicalSummary || "",
        detailedSummary: data.detailedSummary || "",
        patientSummary: data.patientSummary || "",
        spanishSummary: data.spanishSummary || "",
        catalanSummary: data.catalanSummary || "",
        unresolvedQuestions: data.unresolvedQuestions || [],
        continuityPriorities: data.continuityPriorities || [],
        supportingDocuments: documents.map((d) => d.title),
        generatedAt: new Date().toISOString(),
      });
      toast.success("Handoff ready");
    } catch {
      toast.error("Could not create handoff.");
    } finally {
      setGenerating(false);
    }
  }

  async function play() {
    if (!handoff.clinicalSummary) return;
    try {
      const response = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: handoff.spanishSummary || handoff.clinicalSummary }),
      });
      const data = await response.json();
      setAudioUrl(data.audioUrl || null);
    } catch {
      setAudioUrl(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl">Handoff</h1>
        <p className="mt-2 text-muted-foreground">
          A short summary for your new doctor.
        </p>
      </div>

      {!hasContent ? (
        <Button
          size="lg"
          className="w-full"
          disabled={generating}
          onClick={() => void generate()}
        >
          {generating ? "Creating…" : "Create handoff"}
        </Button>
      ) : (
        <>
          <div className="rounded-2xl border border-border bg-card p-5 text-sm leading-relaxed">
            {handoff.patientSummary || handoff.clinicalSummary}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                approveHandoff();
                toast.success("Approved");
              }}
            >
              {handoffApproved ? "Approved" : "Approve"}
            </Button>
            <Button variant="outline" onClick={() => void play()}>
              Play
            </Button>
          </div>
          {audioUrl !== null || handoff.clinicalSummary ? (
            <AudioPlayer
              title="Spoken summary"
              transcript={handoff.spanishSummary || handoff.clinicalSummary}
              audioUrl={audioUrl}
            />
          ) : null}
          <Button asChild size="lg" className="w-full">
            <Link href="/app/overview">Back to Home</Link>
          </Button>
        </>
      )}
    </div>
  );
}
