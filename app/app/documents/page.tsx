"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DocumentUploader } from "@/components/documents/document-uploader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTransitStore } from "@/lib/store/use-transit-store";
import type { DocumentProcessingStatus, MedicalDocument } from "@/lib/types";

const pipeline: DocumentProcessingStatus[] = [
  "uploading",
  "reading",
  "extracting",
  "complete",
];

export default function DocumentsPage() {
  const router = useRouter();
  const documents = useTransitStore((s) => s.documents);
  const addDocument = useTransitStore((s) => s.addDocument);
  const updateDocument = useTransitStore((s) => s.updateDocument);
  const removeDocument = useTransitStore((s) => s.removeDocument);
  const addCondition = useTransitStore((s) => s.addCondition);
  const addMedication = useTransitStore((s) => s.addMedication);
  const [busyCount, setBusyCount] = useState(0);

  async function processFile(file: File) {
    const id = `doc-upload-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const text = await file.text().catch(() => "");
    const draft: MedicalDocument = {
      id,
      title: file.name.replace(/\.[^.]+$/, ""),
      documentType: "Uploaded record",
      sourceProvider: "Patient upload",
      documentDate: new Date().toISOString().slice(0, 10),
      language: "English",
      processingStatus: "uploading",
      verificationStatus: "needs_confirmation",
      previewText: text.slice(0, 800) || file.name,
      facts: [],
    };
    addDocument(draft);
    setBusyCount((n) => n + 1);

    try {
      for (const status of pipeline) {
        await new Promise((resolve) => setTimeout(resolve, 220));
        if (status !== "complete") {
          updateDocument(id, { processingStatus: status });
          continue;
        }

        const response = await fetch("/api/ai/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: text || `${file.name}\nMedical document`,
          }),
        });
        const payload = await response.json();
        const data = payload.data ?? payload;
        const facts = (data.facts || []).map(
          (
            fact: {
              category: string;
              value: string;
              confidence: "high" | "medium" | "low";
              verificationStatus: MedicalDocument["facts"][number]["verificationStatus"];
            },
            index: number
          ) => ({
            id: `${id}-fact-${index}`,
            category: fact.category,
            value: fact.value,
            confidence: fact.confidence,
            verificationStatus: fact.verificationStatus || "ai_extracted",
            source: "ai_generated" as const,
            documentId: id,
          })
        );

        updateDocument(id, {
          processingStatus: "complete",
          facts:
            facts.length > 0
              ? facts
              : [
                  {
                    id: `${id}-fact-1`,
                    category: "Note",
                    value: "Saved.",
                    confidence: "low",
                    verificationStatus: "needs_confirmation",
                    source: "ai_generated",
                    documentId: id,
                  },
                ],
        });

        if (data.diagnosis) {
          addCondition({
            id: `cond-${id}`,
            name: data.diagnosis,
            diagnosedAt: data.diagnosisDate || "",
            status: "From document",
            notes: "Extracted from upload",
            confidence: "medium",
            verificationStatus: "ai_extracted",
            source: "ai_generated",
          });
        }
        for (const med of data.medications || []) {
          addMedication({
            id: `med-${id}-${med.name}`,
            name: med.name,
            dosage: med.dosage || "",
            frequency: med.frequency || "",
            startDate: "",
            status: med.status === "stopped" ? "stopped" : "current",
            reasonStopped: med.reasonStopped,
            confidence: "medium",
            verificationStatus: "ai_extracted",
            source: "ai_generated",
          });
        }
      }
    } catch {
      updateDocument(id, {
        processingStatus: "complete",
        facts: [
          {
            id: `${id}-fact-1`,
            category: "Note",
            value: "Saved.",
            confidence: "low",
            verificationStatus: "needs_confirmation",
            source: "patient_reported",
            documentId: id,
          },
        ],
      });
    } finally {
      setBusyCount((n) => Math.max(0, n - 1));
    }
  }

  async function handleUpload(file: File) {
    toast.message("Adding record…");
    await processFile(file);
    toast.success("Record added — add more or continue");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl">My documents</h1>
        <p className="mt-2 text-muted-foreground">
          Throw everything in. TransitH organises it.
        </p>
      </div>

      <DocumentUploader onUpload={handleUpload} />

      <div className="space-y-3">
        {documents.map((document) => (
          <div
            key={document.id}
            className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-4"
          >
            <div className="min-w-0">
              <p className="truncate font-medium">{document.title}</p>
              {document.facts[0] ? (
                <p className="truncate text-xs text-muted-foreground">
                  {document.facts[0].value}
                </p>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <Badge>
                {document.processingStatus === "complete"
                  ? "Ready"
                  : "Working…"}
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeDocument(document.id)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      {documents.length > 0 ? (
        <Button
          size="lg"
          className="w-full"
          disabled={busyCount > 0}
          onClick={() => router.push("/app/overview")}
        >
          {busyCount > 0 ? "Organising…" : "Continue"}
        </Button>
      ) : (
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => router.push("/app/conversation")}
        >
          I’m with my doctor instead
        </Button>
      )}
    </div>
  );
}
