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
import { PassportMark } from "@/components/brand/passport-mark";
import { BrandWordmark } from "@/components/brand/wordmark";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlaceSearch } from "@/components/ui/place-search";
import { getMissingProfileFields } from "@/lib/profile/completeness";
import { useTransitStore } from "@/lib/store/use-transit-store";
import type { JourneyIntent } from "@/lib/types";
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

function inferIntent(text: string): JourneyIntent {
  const blob = text.toLowerCase();
  if (
    /diabetes|t1d|type\s*1|insulin|cgm|pump|chronic|specialist|continuity|handoff|endocrin/.test(
      blob
    )
  ) {
    return "continue_treatment";
  }
  if (
    /pregnan|antenatal|prenatal|register|registration|gp|book|appointment|clinic|budget|language/.test(
      blob
    )
  ) {
    return "set_up_care";
  }
  if (
    /vaccine|vaccination|fragment|missing|don't remember|dont remember|piece|assemble|broke|broken|records/.test(
      blob
    )
  ) {
    return "rebuild_history";
  }
  if (
    /ultrasound|scan|second opinion|just to make sure|check|lump|bubble|elbow|follow-?up/.test(
      blob
    )
  ) {
    return "second_look";
  }
  return "continue_treatment";
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
  const storyRef = useRef("");

  const draft = {
    fullName: name,
    currentCity,
    currentCountry,
    destinationCity,
    destinationCountry,
    conditions,
    primaryConcern: conditions,
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
      const latest = storyRef.current.trim();
      if (latest.length >= 8) {
        void applyStoryToForm(latest);
      }
      return;
    }
    const recognition = new Recognition();
    recognition.lang =
      typeof navigator !== "undefined" && navigator.language
        ? navigator.language
        : "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      const finals: string[] = [];
      let interim = "";
      for (let i = 0; i < event.results.length; i += 1) {
        const result = event.results[i];
        const piece = result[0]?.transcript || "";
        if (result.isFinal) finals.push(piece);
        else interim = piece;
      }
      const next = [...finals, interim].join(" ").replace(/\s+/g, " ").trim();
      storyRef.current = next;
      setStory(next);
    };
    recognition.onerror = () => {
      setListening(false);
      setError("Couldn’t hear that — try again, or type below.");
    };
    recognition.onend = () => {
      setListening(false);
    };
    recognitionRef.current = recognition;
    setError(null);
    setListening(true);
    recognition.start();
  }

  async function applyStoryToForm(textOverride?: string) {
    const spoken = (textOverride ?? (storyRef.current || story)).trim();
    if (spoken.length < 8) {
      setError("Say a bit more — where you’re going and what you need.");
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
        body: JSON.stringify({ text: spoken, name: name.trim() }),
      });
      if (!response.ok) {
        setError("Couldn’t read that — check the fields below.");
        return;
      }
      const payload = await response.json();
      const data = payload.data || {};
      if (data.fullName) setName(data.fullName);
      if (data.currentCity) setCurrentCity(data.currentCity);
      if (data.currentCountry) setCurrentCountry(data.currentCountry);
      if (data.destinationCity) setDestinationCity(data.destinationCity);
      if (data.destinationCountry) {
        setDestinationCountry(data.destinationCountry);
      }
      if (data.conditions) setConditions(data.conditions);
      else if (data.primaryConcern) setConditions(data.primaryConcern);
      setHighlightKeys([]);

      const filledPlaces = Boolean(
        data.currentCity ||
          data.currentCountry ||
          data.destinationCity ||
          data.destinationCountry
      );
      if (data.fullName && !filledPlaces && !data.conditions) {
        setError(
          "Got your name — say where you’re moving from/to and what care must continue, then fill again."
        );
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
      let primaryConcern =
        conditions.trim() || "Continue care safely after moving";
      const intent = inferIntent(`${story} ${conditions}`);

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
        conditions: conditions.trim() || primaryConcern,
        primaryConcern,
        preferredLanguage,
        journeyIntent: intent,
        careLanguages: preferredLanguage,
        careNotes: conditions.trim(),
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
        <div className="relative overflow-hidden bg-[var(--cover)] px-4 py-14 sm:px-6 sm:py-16 md:px-10 md:py-20">
          <div
            aria-hidden
            className="absolute inset-0 bg-cover bg-center opacity-70"
            style={{ backgroundImage: "url(/hero-passport.jpg)" }}
          />
          <div aria-hidden className="passport-guilloche absolute inset-0" />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,21,38,0.5),rgba(11,21,38,0.9))]"
          />
          <div className="relative z-10 mx-auto max-w-xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--brass)]">
              Passport open
            </p>
            <p className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              Welcome back
            </p>
            <p className="mt-3 text-white/70">
              Your corridor clearance is already under way.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                className="bg-white text-foreground hover:bg-white/92"
                onClick={() => router.push("/app/overview")}
              >
                Continue
              </Button>
              <Button
                variant="secondary"
                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                onClick={() => {
                  localStorage.removeItem("transit-user-v3");
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
      <div className="relative overflow-hidden bg-[var(--cover)] px-4 pb-12 pt-10 sm:px-6 md:px-10 md:pb-14 md:pt-14">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center opacity-70"
          style={{ backgroundImage: "url(/hero-passport.jpg)" }}
        />
        <div aria-hidden className="passport-guilloche absolute inset-0" />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,21,38,0.45)_0%,rgba(11,21,38,0.72)_70%,var(--background)_100%)]"
        />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto max-w-xl"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/75 underline-offset-4 hover:text-white hover:underline"
          >
            <PassportMark tone="brass" className="h-4 w-4" />
            <BrandWordmark className="text-sm font-medium text-white" />
          </Link>
          <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--brass)]">
            Issue passport
          </p>
          <p className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Your corridor entry
          </p>
          <p className="mt-3 max-w-md text-white/70">
            Tell TransitH where you’re moving and what care must continue. It
            prepares the rest so you can arrive ready.
          </p>
        </motion.div>
      </div>

      <div className="relative mx-auto w-full max-w-xl space-y-6 px-4 pb-16 sm:px-6 md:px-10">
        {speechSupported ? (
          <Reveal variant="passport">
            <section>
            <motion.button
              type="button"
              onClick={toggleListening}
              aria-pressed={listening}
              aria-label={
                listening ? "Stop listening" : "Tap to speak about your move"
              }
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.99 }}
              className={cn(
                "surface-elevated flex w-full flex-col items-center gap-3 rounded-[1.75rem] px-6 py-8 text-center transition",
                listening && "ring-4 ring-accent/15"
              )}
            >
              <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-[0_12px_28px_rgba(14,107,100,0.3)]">
                {listening ? (
                  <>
                    <span className="pulse-ring absolute inset-0 rounded-2xl border border-accent/40" />
                    <span className="pulse-ring absolute inset-[-6px] rounded-2xl border border-accent/25" style={{ animationDelay: "0.35s" }} />
                    <MicOff className="relative h-7 w-7" />
                  </>
                ) : (
                  <Mic className="h-7 w-7" />
                )}
              </span>
              <span className="font-display text-2xl font-semibold tracking-tight">
                {listening ? "Listening… tap to stop" : "Tap to speak"}
              </span>
              <span className="max-w-sm text-sm text-muted-foreground">
                Where from, where to, and what care must continue.
              </span>
            </motion.button>
            {story ? (
              <div className="mt-3 space-y-2">
                <p className="rounded-2xl bg-muted/50 px-4 py-3 text-sm">
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
          </Reveal>
        ) : null}

        <Reveal variant="passport" delay={0.06}>
        <section className="passport-page rounded-[1.35rem] p-6 sm:p-8">
          <p className="text-sm text-muted-foreground">
            {speechSupported ? "Or type these details" : "Your details"}
          </p>
          <div className="mt-5 space-y-5">
            <Field
              label="Your name"
              highlight={highlightKeys.includes("fullName")}
            >
              <Input
                className="h-12"
                placeholder="Alex"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  clearHighlight("fullName");
                }}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="From" highlight={highlightKeys.includes("origin")}>
                <PlaceSearch
                  city={currentCity}
                  country={currentCountry}
                  placeholder="Search city, e.g. Milan"
                  onSelect={({ city, country }) => {
                    setCurrentCity(city);
                    setCurrentCountry(country);
                    clearHighlight("origin");
                  }}
                  onClear={() => {
                    setCurrentCity("");
                    setCurrentCountry("");
                  }}
                />
              </Field>
              <Field
                label="To"
                highlight={highlightKeys.includes("destination")}
              >
                <PlaceSearch
                  city={destinationCity}
                  country={destinationCountry}
                  placeholder="Search city, e.g. London"
                  onSelect={({ city, country }) => {
                    setDestinationCity(city);
                    setDestinationCountry(country);
                    clearHighlight("destination");
                  }}
                  onClear={() => {
                    setDestinationCity("");
                    setDestinationCountry("");
                  }}
                />
              </Field>
            </div>

            <Field
              label="What do you need help with?"
              highlight={highlightKeys.includes("health")}
            >
              <Input
                className="h-12"
                placeholder="e.g. type 1 diabetes, endocrinology on arrival day"
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
            {busy ? "Starting…" : "Meet my agent"}
          </Button>
        </section>
        </Reveal>
      </div>
    </div>
  );
}
