"use client";

import { useEffect, useMemo, useState } from "react";
import { Pause, Play, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function AudioPlayer({
  title,
  transcript,
  audioUrl,
  onHighlightChange,
}: {
  title: string;
  transcript: string;
  audioUrl?: string | null;
  onHighlightChange?: (progress: number) => void;
}) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const words = useMemo(() => transcript.split(" "), [transcript]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setProgress((prev) => {
        const next = prev >= 100 ? 100 : prev + 2;
        onHighlightChange?.(next);
        if (next >= 100) setPlaying(false);
        return next;
      });
    }, 120);
    return () => window.clearInterval(id);
  }, [playing, onHighlightChange]);

  useEffect(() => {
    if (!audioUrl || !playing) return;
    const audio = new Audio(audioUrl);
    void audio.play().catch(() => {
      // Fall back to simulated playback animation.
    });
    return () => {
      audio.pause();
    };
  }, [audioUrl, playing]);

  const highlightCount = Math.floor((progress / 100) * words.length);

  return (
    <div className="rounded-3xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Spoken handoff
          </p>
          <h4 className="font-display text-xl">{title}</h4>
        </div>
        <Volume2 className="h-5 w-5 text-accent" />
      </div>
      <Progress value={progress} className="mb-4" />
      <div className="mb-4 flex gap-2">
        <Button
          size="sm"
          onClick={() => {
            if (progress >= 100) setProgress(0);
            setPlaying((value) => !value);
          }}
          aria-label={playing ? "Pause audio" : "Play audio"}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {playing ? "Pause" : "Play for doctor"}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setPlaying(false);
            setProgress(0);
            onHighlightChange?.(0);
          }}
        >
          Reset
        </Button>
      </div>
      <p className="text-sm leading-relaxed">
        {words.map((word, index) => (
          <span
            key={`${word}-${index}`}
            className={
              index < highlightCount
                ? "bg-accent-soft text-accent"
                : "text-foreground"
            }
          >
            {word}{" "}
          </span>
        ))}
      </p>
      <p className="mt-3 text-xs text-muted-foreground">
        {audioUrl
          ? "Playing generated audio when available."
          : "Simulated playback — ElevenLabs credentials not configured."}
      </p>
    </div>
  );
}
