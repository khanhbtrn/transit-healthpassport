"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, FileUp, Mic, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildCorridorBrief } from "@/lib/corridor/knowledge";
import { useTransitStore } from "@/lib/store/use-transit-store";
import { cn } from "@/lib/utils";

function getNextStep(state: {
  hasHistory: boolean;
  transitionReady: boolean;
  destinationLabel: string;
}) {
  if (!state.hasHistory) return null;
  if (!state.transitionReady) {
    return {
      title: `Let Transit prepare your ${state.destinationLabel} move`,
      href: "/app/relocation",
      cta: "Start Transit",
      step: 2,
    };
  }
  return {
    title: "Your Transit package is ready",
    href: "/app/arrival",
    cta: "See your results",
    step: 4,
  };
}

const steps = [
  { id: 1, label: "History" },
  { id: 2, label: "Transit" },
  { id: 3, label: "Ready" },
];

export default function OverviewPage() {
  const profile = useTransitStore((s) => s.profile);
  const readinessPercent = useTransitStore((s) => s.readinessPercent);
  const documents = useTransitStore((s) => s.documents);
  const selectedDoctorId = useTransitStore((s) => s.selectedDoctorId);
  const handoffApproved = useTransitStore((s) => s.handoffApproved);
  const appointmentRequest = useTransitStore((s) => s.appointmentRequest);
  const transitionComplete = useTransitStore((s) => s.transitionComplete);
  const conversationCompleted = useTransitStore((s) => s.conversationCompleted);
  const conditions = useTransitStore((s) => s.conditions);
  const corridorBrief = useTransitStore((s) => s.corridorBrief);
  const setCorridorBrief = useTransitStore((s) => s.setCorridorBrief);

  const firstName = profile.fullName.split(" ")[0] || "there";
  const destinationLabel =
    profile.destinationCity || profile.destinationCountry || "your destination";

  const hasHistory = documents.length > 0 || conversationCompleted;
  const transitionReady = Boolean(
    transitionComplete ||
      (selectedDoctorId &&
        handoffApproved &&
        (appointmentRequest?.status === "approved" ||
          appointmentRequest?.status === "prepared" ||
          appointmentRequest?.status === "simulated_sent"))
  );

  useEffect(() => {
    if (!profile.destinationCity && !profile.destinationCountry) return;
    setCorridorBrief(
      buildCorridorBrief({
        currentCity: profile.currentCity,
        currentCountry: profile.currentCountry,
        destinationCity: profile.destinationCity,
        destinationCountry: profile.destinationCountry,
        conditions: conditions.map((c) => c.name).join(", "),
        primaryConcern: profile.primaryConcern,
      })
    );
  }, [
    profile.currentCity,
    profile.currentCountry,
    profile.destinationCity,
    profile.destinationCountry,
    profile.primaryConcern,
    conditions,
    setCorridorBrief,
  ]);

  const next = getNextStep({
    hasHistory,
    transitionReady,
    destinationLabel,
  });

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {profile.currentCity && profile.destinationCity
              ? `${profile.currentCity} → ${profile.destinationCity}`
              : "Your move"}
            {` · ${readinessPercent}%`}
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight md:text-5xl">
            Hi {firstName}
          </h1>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs text-muted-foreground shadow-[var(--shadow-soft)] sm:inline-flex">
          <ShieldCheck className="h-3.5 w-3.5 text-accent" />
          Private draft
        </div>
      </div>

      {corridorBrief ? (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="surface-elevated rounded-[1.75rem] p-5"
        >
          <p className="text-xs tracking-[0.14em] text-accent uppercase">
            For your route
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {corridorBrief.routeLabel}
          </p>
          <ul className="mt-4 space-y-2.5 text-sm leading-snug">
            {corridorBrief.mustKnow.slice(0, 4).map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-px w-3 shrink-0 bg-accent/50" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.section>
      ) : null}

      {!hasHistory ? (
        <section className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Start with your medical history
          </p>

          <Link
            href="/app/documents"
            className="surface-elevated surface-interactive shine-sweep block rounded-[1.75rem] p-6"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-[0_10px_24px_rgba(31,92,74,0.2)]">
                <FileUp className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h2 className="font-display text-2xl tracking-tight">
                  I have documents
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Drop letters, results, or prescriptions. Transit organises
                  them.
                </p>
              </div>
              <ArrowRight className="mt-1 h-5 w-5 text-muted-foreground" />
            </div>
          </Link>

          <Link
            href="/app/conversation"
            className="surface-elevated surface-interactive shine-sweep block rounded-[1.75rem] p-6"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-[0_10px_24px_rgba(31,92,74,0.2)]">
                <Mic className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h2 className="font-display text-2xl tracking-tight">
                  I’m with my doctor
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tap listen. Transit hears the visit and builds your history.
                </p>
              </div>
              <ArrowRight className="mt-1 h-5 w-5 text-muted-foreground" />
            </div>
          </Link>
        </section>
      ) : (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="surface-elevated relative overflow-hidden rounded-[1.75rem] p-6 sm:p-8"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/10 blur-3xl"
          />
          <p className="text-sm text-muted-foreground">Do this next</p>
          <h2 className="mt-2 max-w-md font-display text-3xl tracking-tight">
            {next?.title}
          </h2>
          {next ? (
            <Button asChild size="lg" className="mt-6">
              <Link href={next.href}>
                {next.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          ) : null}
        </motion.section>
      )}

      <section className="grid grid-cols-3 gap-2.5">
        {steps.map((step, index) => {
          const done =
            (step.id === 1 && hasHistory) ||
            (step.id === 2 && transitionReady) ||
            (step.id === 3 && transitionReady);
          const current =
            (!hasHistory && step.id === 1) ||
            (hasHistory && !transitionReady && step.id === 2) ||
            (transitionReady && step.id === 3);
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className={cn(
                "rounded-2xl border px-2 py-3.5 text-center transition duration-300",
                done && "border-accent/25 bg-accent-soft/70 shadow-[var(--shadow-soft)]",
                current && !done && "border-accent/40 bg-card shadow-[var(--shadow)]",
                !done && !current && "border-border/80 bg-muted/30"
              )}
            >
              <div
                className={cn(
                  "mx-auto mb-2 flex h-7 w-7 items-center justify-center rounded-full text-xs",
                  done
                    ? "bg-accent text-accent-foreground"
                    : current
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground"
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : step.id}
              </div>
              <p className="text-xs font-medium">{step.label}</p>
            </motion.div>
          );
        })}
      </section>
    </div>
  );
}
