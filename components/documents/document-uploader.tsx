"use client";

import { useCallback, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ACCEPTED = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "text/plain",
];
const MAX_BYTES = 8 * 1024 * 1024;

export function DocumentUploader({
  onUpload,
}: {
  onUpload: (file: File) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      setError(null);
      const file = files?.[0];
      if (!file) return;
      if (!ACCEPTED.includes(file.type) && !file.name.endsWith(".pdf")) {
        setError("Use PDF, PNG, JPG, or TXT.");
        return;
      }
      if (file.size > MAX_BYTES) {
        setError("Max file size is 8 MB.");
        return;
      }
      onUpload(file);
    },
    [onUpload]
  );

  return (
    <div
      className={cn(
        "rounded-[2rem] border border-dashed border-border bg-card p-8 text-center transition",
        dragging && "border-accent bg-accent-soft/40"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      <Upload className="mx-auto mb-3 h-8 w-8 text-accent" />
      <p className="font-display text-2xl">Drop a file here</p>
      <div className="mt-5">
        <label>
          <input
            type="file"
            className="sr-only"
            accept=".pdf,.png,.jpg,.jpeg,.txt"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <Button asChild size="sm">
            <span>Choose file</span>
          </Button>
        </label>
      </div>
      {error ? (
        <p className="mt-3 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
