"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getMissingProfileFields } from "@/lib/profile/completeness";
import { useTransitStore } from "@/lib/store/use-transit-store";
import { cn } from "@/lib/utils";

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: {
    results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }>;
  }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function getSpeechRecognition():
  | (new () => SpeechRecognitionLike)
  | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

function Field({
  label,
  children,
  highlight,
}: {
  label: string;
  children: ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl transition",
        highlight && "ring-2 ring-accent/25 ring-offset-2 ring-offset-background"
      )}
    >
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export function StartExperience() {
  const router = useRouter();
  const startJourney = useTransitStore((s) => s.startJourney);
  const onboarded = useTransitStore((s) => s.onboarded);

  const [name, setName] = useState("");
  const [story, setStory] = useState("");
  const [listening, setListening] = useState(false);
  const [busy, setBusy] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [highlightKeys, setHighlightKeys] = useState<string[]>([]);

  const [currentCity, setCurrentCity] = useState("");
  const [currentCountry, setCurrentCountry] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [destinationCountry, setDestinationCountry] = useState("");
  const [conditions, setConditions] = useState("");

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const draft = {
    fullName: name,
    currentCity,
    currentCountry,
    destinationCity,
    destinationCountry,
    conditions,
  };

  const missing = useMemo(
    () => getMissingProfileFields(draft),
    [
      name,
      currentCity,
      currentCountry,
      destinationCity,
      destinationCountry,
      conditions,
    ]
  );

  useEffect(() => {
    setSpeechSupported(Boolean(getSpeechRecognition()));
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  function clearHighlight(key: string) {
    setHighlightKeys((keys) => keys.filter((k) => k !== key));
  }

  function toggleListening() {
    const Recognition = getSpeechRecognition();
    if (!Recognition) {
      setError("Voice isn’t available in this browser — type below instead.");
      return;
    }

    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }

    const recognition = new Recognition();
    recognition.lang = "en-GB";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      const parts: string[] = [];
      for (let i = 0; i < event.results.length; i += 1) {
        parts.push(event.results[i][0].transcript);
      }
      setStory(parts.join(" ").trim());
    };
    recognition.onerror = () => {
      setListening(false);
      setError("Couldn’t hear that — try again, or type below.");
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    setError(null);
    setListening(true);
    recognition.start();
  }

  async function applyStoryToForm() {
    if (story.trim().length < 8) {
      setError("Say a bit more — where you’re going and your condition.");
      return;
    }
    setParsing(true);
    setError(null);
    recognitionRef.current?.stop();
    setListening(false);

    try {
      const response = await fetch("/api/ai/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: story, name: name.trim() }),
      });
      if (response.ok) {
        const payload = await response.json();
        const data = payload.data || {};
        if (!name.trim() && data.fullName) setName(data.fullName);
        if (data.currentCity) setCurrentCity(data.currentCity);
        if (data.currentCountry) setCurrentCountry(data.currentCountry);
        if (data.destinationCity) setDestinationCity(data.destinationCity);
        if (data.destinationCountry) {
          setDestinationCountry(data.destinationCountry);
        }
        if (data.conditions) setConditions(data.conditions);
        setHighlightKeys([]);
      } else {
        setError("Couldn’t read that — check the fields below.");
      }
    } catch {
      setError("Couldn’t read that — check the fields below.");
    } finally {
      setParsing(false);
    }
  }

  async function continueJourney() {
    const stillNeeded = getMissingProfileFields(draft);
    if (stillNeeded.length) {
      setHighlightKeys(stillNeeded.map((m) => m.key));
      setError(null);
      return;
    }

    setBusy(true);
    setError(null);

    try {
      let preferredLanguage = "English";
      let primaryConcern = "Continue care safely after moving";

      if (story.trim().length > 8) {
        try {
          const response = await fetch("/api/ai/onboarding", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: story, name: name.trim() }),
          });
          if (response.ok) {
            const payload = await response.json();
            preferredLanguage =
              payload.data?.preferredLanguage || preferredLanguage;
            primaryConcern =
              payload.data?.primaryConcern || primaryConcern;
          }
        } catch {
          // keep defaults
        }
      }

      startJourney({
        fullName: name.trim(),
        currentCity: currentCity.trim(),
        currentCountry: currentCountry.trim(),
        destinationCity: destinationCity.trim(),
        destinationCountry: destinationCountry.trim(),
        moveDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60)
          .toISOString()
          .slice(0, 10),
        conditions: conditions.trim(),
        primaryConcern,
        preferredLanguage,
      });
      router.push("/app/overview");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  if (onboarded) {
    return (
      <div className="min-h-screen">
        <div className="relative overflow-hidden px-6 py-16 md:px-10 md:py-20">
          <div
            aria-hidden
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1800&q=80)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-[#1c1b19] via-[#1c1b19]/70 to-[#1c1b19]/40"
          />
          <div className="relative z-10 mx-auto max-w-xl">
            <p className="font-display text-4xl text-white md:text-5xl">
              Welcome back
            </p>
            <p className="mt-3 text-white/75">
              Your transition is already started.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                className="bg-white text-foreground hover:bg-white/90"
                onClick={() => router.push("/app/overview")}
              >
                Continue
              </Button>
              <Button
                variant="secondary"
                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                onClick={() => {
                  localStorage.removeItem("transit-user-v2");
                  localStorage.removeItem("transit-demo-store");
                  window.location.href = "/";
                }}
              >
                Start fresh
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden px-6 pb-10 pt-10 md:px-10 md:pb-12 md:pt-14">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1488085061387-422e58bd2bef?auto=format&fit=crop&w=1800&q=80)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-background via-[#1c1b19]/55 to-[#1c1b19]/45"
        />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative z-10 mx-auto max-w-xl"
        >
          <Link
            href="/"
            className="text-sm text-white/70 underline-offset-4 hover:text-white hover:underline"
          >
            ← Transit
          </Link>
          <p className="mt-6 font-display text-4xl tracking-tight text-white md:text-5xl">
            To get started
          </p>
          <p className="mt-3 max-w-md text-white/75">
            Speak your move, or fill in four quick details.
          </p>
        </motion.div>
      </div>

      <div className="relative mx-auto w-full max-w-xl px-6 pb-16 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="space-y-8"
        >
          {speechSupported ? (
            <section className="pt-2">
              <button
                type="button"
                onClick={toggleListening}
                aria-pressed={listening}
                aria-label={
                  listening
                    ? "Stop listening"
                    : "Tap to speak about your move"
                }
                className={cn(
                  "surface-elevated group relative flex w-full flex-col items-center gap-4 overflow-hidden rounded-[2rem] px-6 py-10 text-center transition duration-300",
                  listening && "border-accent/40 ring-4 ring-accent/10"
                )}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-accent/10 blur-3xl transition group-hover:bg-accent/15"
                />
                <span className="relative flex h-24 w-24 items-center justify-center">
                  {listening ? (
                    <span className="pulse-ring absolute inset-0 rounded-full bg-accent/25" />
                  ) : null}
                  <span
                    className={cn(
                      "relative flex h-20 w-20 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-[0_16px_40px_rgba(31,92,74,0.35)] transition duration-300",
                      !listening && "group-hover:scale-105"
                    )}
                  >
                    {listening ? (
                      <MicOff className="h-8 w-8" />
                    ) : (
                      <Mic className="h-8 w-8" />
                    )}
                  </span>
                </span>
                <span className="relative font-display text-3xl tracking-tight">
                  {listening ? "Listening… tap to stop" : "Tap to speak"}
                </span>
                <span className="relative max-w-sm text-sm leading-relaxed text-muted-foreground">
                  {listening
                    ? "Say where you’re moving from and to, and your condition."
                    : "Tell Transit your move in one breath. We’ll fill the form for you."}
                </span>
              </button>

              {story ? (
                <div className="mt-4 space-y-3">
                  <p className="surface-elevated rounded-2xl px-4 py-3 text-sm leading-relaxed">
                    “{story}”
                  </p>
                  <Button
                    className="w-full"
                    disabled={parsing || story.trim().length < 8}
                    onClick={() => void applyStoryToForm()}
                  >
                    {parsing ? "Filling form…" : "Use this to fill the form"}
                  </Button>
                </div>
              ) : null}
            </section>
          ) : null}

          <section className="surface-elevated rounded-[2rem] p-6 sm:p-8">
            <p className="text-sm text-muted-foreground">
              {speechSupported ? "Or type these four details" : "Your details"}
            </p>

            <div className="mt-5 space-y-5">
              <Field
                label="Your name"
                highlight={highlightKeys.includes("fullName")}
              >
                <Input
                  className="h-12 text-base"
                  placeholder="Alex"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    clearHighlight("fullName");
                  }}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="From"
                  highlight={highlightKeys.includes("origin")}
                >
                  <div className="space-y-2">
                    <Input
                      className="h-12 text-base"
                      placeholder="City"
                      value={currentCity}
                      onChange={(e) => {
                        setCurrentCity(e.target.value);
                        clearHighlight("origin");
                      }}
                    />
                    <Input
                      className="h-12 text-base"
                      placeholder="Country"
                      value={currentCountry}
                      onChange={(e) => {
                        setCurrentCountry(e.target.value);
                        clearHighlight("origin");
                      }}
                    />
                  </div>
                </Field>
                <Field
                  label="To"
                  highlight={highlightKeys.includes("destination")}
                >
                  <div className="space-y-2">
                    <Input
                      className="h-12 text-base"
                      placeholder="City"
                      value={destinationCity}
                      onChange={(e) => {
                        setDestinationCity(e.target.value);
                        clearHighlight("destination");
                      }}
                    />
                    <Input
                      className="h-12 text-base"
                      placeholder="Country"
                      value={destinationCountry}
                      onChange={(e) => {
                        setDestinationCountry(e.target.value);
                        clearHighlight("destination");
                      }}
                    />
                  </div>
                </Field>
              </div>

              <Field
                label="Your condition"
                highlight={highlightKeys.includes("health")}
              >
                <Input
                  className="h-12 text-base"
                  placeholder="e.g. Crohn’s disease"
                  value={conditions}
                  onChange={(e) => {
                    setConditions(e.target.value);
                    clearHighlight("health");
                  }}
                />
              </Field>
            </div>

            {missing.length > 0 &&
            highlightKeys.some((k) => missing.some((m) => m.key === k)) ? (
              <p className="mt-5 text-sm text-muted-foreground">
                Still needed: {missing.map((m) => m.label).join(" · ")}
              </p>
            ) : null}

            {error ? (
              <p className="mt-4 text-sm text-danger" role="alert">
                {error}
              </p>
            ) : null}

            <Button
              size="lg"
              className="mt-6 w-full"
              disabled={busy || parsing}
              onClick={() => void continueJourney()}
            >
              {busy ? "Starting…" : "Continue"}
            </Button>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
