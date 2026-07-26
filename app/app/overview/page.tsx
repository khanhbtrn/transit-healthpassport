"use client";

import { useCallback, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ApprovalQueue } from "@/components/agent/approval-queue";
import { DoneLog } from "@/components/agent/done-log";
import { NeedsPanel } from "@/components/agent/needs-panel";
import { EntryStamp } from "@/components/brand/entry-stamp";
import { RouteBriefCard } from "@/components/corridor/route-brief-card";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import {
  buildCorridorBrief,
  type CommunityLink,
} from "@/lib/corridor/knowledge";
import { getIntentHomeActions } from "@/lib/journey/next-actions";
import { useTransitStore } from "@/lib/store/use-transit-store";

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
  const agentNeeds = useTransitStore((s) => s.agentNeeds);
  const approvals = useTransitStore((s) => s.approvals);
  const agentDone = useTransitStore((s) => s.agentDone);
  const resolveAgentNeed = useTransitStore((s) => s.resolveAgentNeed);
  const setApprovalStatus = useTransitStore((s) => s.setApprovalStatus);
  const refreshAgentNeeds = useTransitStore((s) => s.refreshAgentNeeds);

  const firstName = profile.fullName.split(" ")[0] || "there";
  const destinationLabel =
    profile.destinationCity || profile.destinationCountry || "your destination";
  const conditionText = conditions.map((c) => c.name).join(", ");

  const hasHistory = documents.length > 0 || conversationCompleted;
  const transitionReady = Boolean(
    transitionComplete ||
      (selectedDoctorId &&
        handoffApproved &&
        (appointmentRequest?.status === "approved" ||
          appointmentRequest?.status === "prepared" ||
          appointmentRequest?.status === "simulated_sent"))
  );
  const pendingApprovals = approvals.filter(
    (a) => a.status === "needs_approval"
  ).length;
  const openNeeds = agentNeeds.filter((n) => n.status === "open").length;

  useEffect(() => {
    if (!profile.destinationCity && !profile.destinationCountry) return;
    setCorridorBrief(
      buildCorridorBrief({
        currentCity: profile.currentCity,
        currentCountry: profile.currentCountry,
        destinationCity: profile.destinationCity,
        destinationCountry: profile.destinationCountry,
        conditions: conditionText || profile.primaryConcern,
        primaryConcern: profile.primaryConcern,
      })
    );
    refreshAgentNeeds();
  }, [
    profile.currentCity,
    profile.currentCountry,
    profile.destinationCity,
    profile.destinationCountry,
    profile.primaryConcern,
    conditionText,
    setCorridorBrief,
    refreshAgentNeeds,
  ]);

  const handleCommunityLinks = useCallback(
    (links: CommunityLink[]) => {
      const current = useTransitStore.getState().corridorBrief;
      if (!current) return;
      setCorridorBrief({
        ...current,
        communityLinks: links,
      });
    },
    [setCorridorBrief]
  );

  const actions = getIntentHomeActions({
    intent: profile.journeyIntent || "continue_treatment",
    hasHistory,
    transitionReady,
    destinationLabel,
    destinationCountry: profile.destinationCountry,
    destinationCity: profile.destinationCity,
    pendingApprovals,
    openNeeds,
  });

  const ukBound =
    /united kingdom|\buk\b|england|london/i.test(
      `${profile.destinationCountry} ${profile.destinationCity}`
    );

  const primary = actions.find((a) => a.primary) || actions[0];
  const secondary = actions.filter((a) => a !== primary);

  const clearanceLabel =
    readinessPercent >= 85
      ? "Arrival ready"
      : readinessPercent >= 45
        ? "In clearance"
        : "Issuing";

  return (
    <div className="space-y-8">
      <Reveal variant="passport">
        <section className="passport-page rounded-[1.2rem] p-4 sm:rounded-[1.35rem] sm:p-7">
          <div className="relative flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7 }}
                className="text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--brass)] sm:text-[11px] sm:tracking-[0.2em]"
              >
                Health passport · {readinessPercent}%
              </motion.p>
              <p className="mt-2 break-words text-xs uppercase tracking-[0.12em] text-muted-foreground sm:mt-3 sm:tracking-[0.16em]">
                {profile.currentCity && profile.destinationCity
                  ? `From ${profile.currentCity} · To ${profile.destinationCity}`
                  : "Corridor pending"}
              </p>
              <h1 className="mt-2 break-words font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                {firstName}
              </h1>
              <p className="mt-2 max-w-lg text-sm text-muted-foreground">
                {ukBound
                  ? "UK path is GP first: get one English letter, confirm your borough/postcode, then register with a GP. Hospital specialty usually comes after referral — TransitH drafts the pack; you approve every step."
                  : "Your care corridor is being prepared so you can show up ready. TransitH gathers what clinics need; you approve every send."}
              </p>
            </div>
            <EntryStamp
              label={clearanceLabel}
              sublabel={`${readinessPercent}%`}
              delay={0.35}
              className="hidden shrink-0 scale-90 sm:block sm:scale-100"
            />
          </div>
          <div className="mrz-band relative mt-5 -mx-4 overflow-hidden rounded-b-[1.1rem] sm:mt-6 sm:-mx-7 sm:rounded-b-[1.2rem]">
            <motion.p
              className="truncate px-4 py-2 text-[9px] sm:px-7 sm:text-[10px]"
              initial={{ x: 12, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.5 }}
            >
              {`P<${(profile.fullName || "HOLDER").replace(/\s+/g, "<").toUpperCase()}<<${(
                profile.destinationCity || "DEST"
              )
                .replace(/\s+/g, "<")
                .toUpperCase()}<<<`}
            </motion.p>
          </div>
        </section>
      </Reveal>

      {primary ? (
        <Reveal variant="passport" delay={0.08}>
          <section className="passport-page relative overflow-hidden rounded-[1.2rem] p-5 sm:rounded-[1.35rem] sm:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-[var(--brass)]/10 blur-3xl"
            />
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--brass)]">
              Next step
            </p>
            <h2 className="mt-2 max-w-lg break-words font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              {primary.title}
            </h2>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">
              {primary.description}
            </p>
            <motion.div
              className="mt-6 block w-full sm:inline-block sm:w-auto"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href={primary.href}>
                  {primary.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </section>
        </Reveal>
      ) : null}

      {corridorBrief ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <RouteBriefCard
            brief={corridorBrief}
            fromCountry={profile.currentCountry}
            toCountry={profile.destinationCountry}
            fromCity={profile.currentCity}
            toCity={profile.destinationCity}
            condition={conditionText || profile.primaryConcern}
            onLinks={handleCommunityLinks}
          />
        </motion.div>
      ) : null}

      <NeedsPanel needs={agentNeeds} onResolve={resolveAgentNeed} />

      {approvals.length > 0 ? (
        <ApprovalQueue items={approvals} onStatus={setApprovalStatus} />
      ) : null}

      {agentDone.length > 0 ? <DoneLog items={agentDone} /> : null}

      {secondary.length ? (
        <section className="grid gap-3 sm:grid-cols-2">
          {secondary.map((action) => (
            <Link
              key={action.href + action.title}
              href={action.href}
              className="surface-elevated surface-interactive block rounded-[1.5rem] p-5"
            >
              <p className="font-display text-xl tracking-tight">
                {action.title}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {action.description}
              </p>
              <p className="mt-3 text-sm text-accent">{action.cta} →</p>
            </Link>
          ))}
        </section>
      ) : null}
    </div>
  );
}
