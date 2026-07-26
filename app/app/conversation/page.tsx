"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Mic, Square } from "lucide-react";
import { toast } from "sonner";
import { Waveform } from "@/components/conversation/waveform";
import { Button } from "@/components/ui/button";
import {
  getSpeechRecognition,
  type SpeechRecognitionLike,
} from "@/lib/speech";
import { useTransitStore } from "@/lib/store/use-transit-store";
import type { ExtractedFact } from "@/lib/types";
import { cn } from "@/lib/utils";

type Phase = "ready" | "listening" | "saving" | "done";

export default function ConversationPage() {
  const router = useRouter();
  const approveFacts = useTransitStore((s) => s.approveFacts);
  const addCondition = useTransitStore((s) => s.addCondition);
  const addMedication = useTransitStore((s) => s.addMedication);
  const addDocument = useTransitStore((s) => s.addDocument);

  const [phase, setPhase] = useState<Phase>("ready");
  const [transcript, setTranscript] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [facts, setFacts] = useState<ExtractedFact[]>([]);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const finalTranscriptRef = useRef("");
  const listeningRef = useRef(false);

  useEffect(() => {
    if (phase !== "listening") return;
    const timer = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  function startListening() {
    const Recognition = getSpeechRecognition();
    if (!Recognition) {
      setError("This browser can’t listen. Use Chrome, or paste notes instead.");
      return;
    }

    setError(null);
    setTranscript("");
    setFacts([]);
    setSeconds(0);
    finalTranscriptRef.current = "";

    const recognition = new Recognition();
    recognition.lang = "en-GB";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interim = "";
      let finalText = finalTranscriptRef.current;
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const piece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText = `${finalText} ${piece}`.trim();
        } else {
          interim += piece;
        }
      }
      finalTranscriptRef.current = finalText;
      setTranscript(`${finalText}${interim ? ` ${interim}` : ""}`.trim());
    };

    recognition.onerror = () => {
      listeningRef.current = false;
      setPhase("ready");
      setError("Listening stopped. Try again, or keep the phone closer to your doctor.");
    };

    recognition.onend = () => {
      if (listeningRef.current) {
        try {
          recognition.start();
        } catch {
          // ignore restart races
        }
      }
    };

    recognitionRef.current = recognition;
    listeningRef.current = true;
    recognition.start();
    setPhase("listening");
    toast.message("Listening — tell your doctor TransitH is helping with your move");
  }

  async function stopAndSave() {
    listeningRef.current = false;
    recognitionRef.current?.stop();
    setPhase("saving");

    const text = (finalTranscriptRef.current || transcript).trim();
    if (text.length < 12) {
      setPhase("ready");
      setError("I didn’t catch enough yet. Start again and keep talking a bit longer.");
      return;
    }

    try {
      const response = await fetch("/api/ai/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const payload = await response.json();
      const data = payload.data ?? payload;

      const nextFacts: ExtractedFact[] = (data.facts || []).map(
        (
          fact: {
            category: string;
            value: string;
            confidence: ExtractedFact["confidence"];
            verificationStatus: ExtractedFact["verificationStatus"];
          },
          index: number
        ) => ({
          id: `live-fact-${Date.now()}-${index}`,
          category: fact.category,
          value: fact.value,
          confidence: fact.confidence,
          verificationStatus: fact.verificationStatus || "ai_extracted",
          source: "doctor_conversation",
        })
      );

      if (data.diagnosis) {
        addCondition({
          id: `cond-live-${Date.now()}`,
          name: data.diagnosis,
          diagnosedAt: data.diagnosisDate || "",
          status: "From doctor visit",
          notes: "Captured during doctor conversation",
          confidence: "medium",
          verificationStatus: "ai_extracted",
          source: "doctor_conversation",
        });
      }

      for (const med of data.medications || []) {
        addMedication({
          id: `med-live-${Date.now()}-${med.name}`,
          name: med.name,
          dosage: med.dosage || "",
          frequency: med.frequency || "",
          startDate: "",
          status: med.status === "stopped" ? "stopped" : "current",
          reasonStopped: med.reasonStopped,
          confidence: "medium",
          verificationStatus: "ai_extracted",
          source: "doctor_conversation",
        });
      }

      addDocument({
        id: `doc-visit-${Date.now()}`,
        title: "Doctor visit transcript",
        documentType: "Doctor conversation",
        sourceProvider: "Live visit",
        documentDate: new Date().toISOString().slice(0, 10),
        language: "English",
        processingStatus: "complete",
        verificationStatus: "needs_confirmation",
        previewText: text.slice(0, 1200),
        facts: nextFacts,
      });

      approveFacts(nextFacts);
      setFacts(nextFacts);
      setPhase("done");
      toast.success("Visit captured");
    } catch {
      setPhase("ready");
      setError("Couldn’t process the visit. Try once more.");
    }
  }

  const clock = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
    seconds % 60
  ).padStart(2, "0")}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl">With my doctor</h1>
        <p className="mt-2 text-muted-foreground">
          One tap. TransitH listens. Then we continue your move.
        </p>
      </div>

      {phase === "ready" ? (
        <div className="space-y-4 rounded-[2rem] border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Tell your doctor: “TransitH is helping me move my care. It will listen
            with my permission.”
          </p>
          <Button size="lg" className="w-full" onClick={startListening}>
            <Mic className="h-4 w-4" />
            Start listening
          </Button>
          {error ? (
            <p className="text-sm text-danger" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      ) : null}

      {phase === "listening" ? (
        <div className="space-y-5 rounded-[2rem] border border-accent/30 bg-card p-6">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-danger">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-danger" />
              Listening
            </span>
            <span className="font-mono text-sm" aria-live="polite">
              {clock}
            </span>
          </div>
          <Waveform active />
          <div
            className={cn(
              "min-h-[140px] rounded-2xl bg-muted/70 p-4 text-sm leading-relaxed",
              !transcript && "text-muted-foreground"
            )}
          >
            {transcript || "Waiting for speech…"}
          </div>
          <Button size="lg" className="w-full" variant="secondary" onClick={() => void stopAndSave()}>
            <Square className="h-4 w-4" />
            Stop and save
          </Button>
        </div>
      ) : null}

      {phase === "saving" ? (
        <div className="rounded-[2rem] border border-border bg-card p-8 text-center">
          <p className="font-display text-2xl">Organising the visit…</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Pulling out the important medical details.
          </p>
        </div>
      ) : null}

      {phase === "done" ? (
        <div className="space-y-4 rounded-[2rem] border border-border bg-card p-6">
          <p className="font-display text-2xl">Saved</p>
          <div className="space-y-2">
            {facts.length > 0 ? (
              facts.slice(0, 6).map((fact) => (
                <div key={fact.id} className="rounded-xl bg-muted px-3 py-2 text-sm">
                  {fact.value}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Visit transcript saved. You can keep going.
              </p>
            )}
          </div>
          <Button
            size="lg"
            className="w-full"
            onClick={() => router.push("/app/overview")}
          >
            Continue
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              setPhase("ready");
              setTranscript("");
              setFacts([]);
            }}
          >
            Listen again
          </Button>
        </div>
      ) : null}
    </div>
  );
}
