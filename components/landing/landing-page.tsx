"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { EntryStamp } from "@/components/brand/entry-stamp";
import { PassportMark } from "@/components/brand/passport-mark";
import { MrzMarquee } from "@/components/motion/mrz-marquee";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { useTransitStore } from "@/lib/store/use-transit-store";

const stamps = [
  {
    code: "01",
    title: "Declare your corridor",
    text: "Origin, destination, and the care that must not stop. One entry, not a stack of forms.",
  },
  {
    code: "02",
    title: "Transit clears the path",
    text: "It knows how systems differ by country, gathers what clinics need, and drafts the handoff.",
  },
  {
    code: "03",
    title: "You arrive ready",
    text: "Show up with history, booking, and paperwork prepared. You approve every send before it leaves.",
  },
];

const brandLetters = "Transit".split("");

export function LandingPage() {
  const onboarded = useTransitStore((s) => s.onboarded);
  const reducedMotion = usePrefersReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.03, 1.12]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const stampY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const startHref = onboarded ? "/app/overview" : "/onboarding";
  const startLabel = onboarded ? "Open your passport" : "Issue your passport";

  return (
    <div className="min-h-screen text-foreground">
      <header className="absolute inset-x-0 top-0 z-20 px-6 pt-7 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto flex max-w-6xl items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <PassportMark
              tone="brass"
              className={`h-7 w-7 ${reducedMotion ? "" : "brass-glow"}`}
            />
            <p className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
              Transit
            </p>
          </div>
          <motion.div
            whileHover={reducedMotion ? undefined : { scale: 1.04, y: -1 }}
            whileTap={reducedMotion ? undefined : { scale: 0.98 }}
          >
            <Button
              asChild
              size="sm"
              className="border border-[var(--brass)]/40 bg-[var(--brass)] text-[var(--cover)] hover:bg-[#d4b46d]"
            >
              <Link href={startHref}>
                {onboarded ? "Continue" : "Begin"}
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </header>

      <section
        ref={heroRef}
        className="relative flex min-h-[100svh] items-end overflow-hidden bg-[var(--cover)]"
      >
        <motion.div
          aria-hidden
          className="absolute inset-[-6%] bg-cover bg-center will-change-transform"
          style={{
            backgroundImage: "url(/hero-passport.jpg)",
            y: reducedMotion ? 0 : imageY,
            scale: reducedMotion ? 1.02 : imageScale,
          }}
        />
        <motion.div
          aria-hidden
          className="passport-guilloche absolute inset-0 opacity-80"
          animate={
            reducedMotion
              ? undefined
              : { opacity: [0.55, 0.85, 0.55], scale: [1, 1.03, 1] }
          }
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,21,38,0.25)_0%,rgba(11,21,38,0.45)_45%,rgba(11,21,38,0.94)_100%)]"
        />

        {!reducedMotion ? (
          <motion.div
            aria-hidden
            className="absolute right-[8%] top-[22%] hidden md:block"
            style={{ y: stampY }}
          >
            <EntryStamp
              label="Health passport"
              sublabel="Corridor cleared"
              delay={0.55}
              className="border-[var(--brass)]/80 bg-[var(--cover)]/30 backdrop-blur-sm"
            />
          </motion.div>
        ) : null}

        <motion.div
          className="relative z-10 w-full px-6 pb-20 pt-32 md:px-10 md:pb-28"
          style={{
            y: reducedMotion ? 0 : contentY,
            opacity: reducedMotion ? 1 : contentOpacity,
          }}
        >
          <div className="mx-auto max-w-6xl">
            <motion.p
              initial={{ opacity: 0, y: 12, letterSpacing: "0.5em" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "0.34em" }}
              transition={{ duration: 0.7 }}
              className={`text-[11px] font-medium uppercase text-[var(--brass)] ${
                reducedMotion ? "" : "foil-shimmer"
              }`}
            >
              Health passport
            </motion.p>

            <h1 className="mt-4 font-display text-[clamp(3.8rem,13vw,8.75rem)] font-extrabold leading-[0.88] tracking-[-0.05em] text-white">
              <span className="sr-only">Transit</span>
              <span aria-hidden className="inline-flex">
                {brandLetters.map((letter, i) => (
                  <motion.span
                    key={`${letter}-${i}`}
                    initial={
                      reducedMotion
                        ? false
                        : { opacity: 0, y: 36, filter: "blur(10px)" }
                    }
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      duration: 0.55,
                      delay: 0.08 + i * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="inline-block"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.42 }}
              className="mt-6 max-w-xl font-display text-2xl font-semibold leading-snug tracking-tight text-white/95 md:text-3xl"
            >
              Arrive with care already prepared.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-4 max-w-md text-base leading-relaxed text-white/70 md:text-lg"
            >
              Like a visa for your healthcare: corridor knowledge, records, and
              clinic handoff ready before you land. You just show up.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.58 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <motion.div
                whileHover={
                  reducedMotion
                    ? undefined
                    : { scale: 1.04, y: -3 }
                }
                whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                animate={
                  reducedMotion
                    ? undefined
                    : {
                        boxShadow: [
                          "0 0 0 0 rgba(201,164,92,0)",
                          "0 0 0 8px rgba(201,164,92,0.12)",
                          "0 0 0 0 rgba(201,164,92,0)",
                        ],
                      }
                }
                transition={
                  reducedMotion
                    ? undefined
                    : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
                }
                className="rounded-2xl"
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-[var(--brass)] text-[var(--cover)] hover:bg-[#d4b46d]"
                >
                  <Link href={startHref}>{startLabel}</Link>
                </Button>
              </motion.div>
              {!onboarded ? (
                <Link
                  href="#endorsements"
                  className="text-sm text-white/70 underline-offset-4 transition hover:text-white hover:underline"
                >
                  How clearance works
                </Link>
              ) : null}
            </motion.div>
          </div>
        </motion.div>

        <MrzMarquee
          className="absolute inset-x-0 bottom-0 z-10"
          text="P<TRANSIT<HEALTH<PASSPORT<<<CORRIDOR<CLEARANCE<<READY<TO<ARRIVE<<<"
        />
      </section>

      <section className="border-b border-border bg-[var(--cover)] px-6 py-5 text-white md:px-10">
        <Stagger className="mx-auto flex max-w-5xl flex-col gap-3 text-sm text-white/65 sm:flex-row sm:items-center sm:justify-between">
          <StaggerItem>
            <p>Cross-border care, prepared like travel documents</p>
          </StaggerItem>
          <StaggerItem className="flex flex-wrap gap-x-6 gap-y-1">
            <span>System-aware by country</span>
            <span>Clinic-ready pack</span>
            <span>You approve every send</span>
          </StaggerItem>
        </Stagger>
      </section>

      <section className="border-b border-border px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--brass)]">
              The idea
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-5xl">
              A passport for continuity of care.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Moving countries should not mean starting medicine from zero.
              Transit holds your route, understands both healthcare systems, and
              gets the receiving clinic what it needs so arrival is seamless.
            </p>
          </Reveal>
        </div>
      </section>

      <section
        id="endorsements"
        className="border-b border-border bg-card/50 px-6 py-20 md:px-10 md:py-28"
      >
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--brass)]">
              Endorsements
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
              Three stamps to arrival.
            </h2>
          </Reveal>
          <ol className="mt-12 space-y-10">
            {stamps.map((step, index) => (
              <motion.li
                key={step.title}
                initial={
                  reducedMotion
                    ? false
                    : { opacity: 0, y: 20, rotate: -1.5 }
                }
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="grid gap-3 border-t border-border pt-8 sm:grid-cols-[5rem_1fr]"
              >
                <motion.span
                  className="font-display text-2xl font-semibold text-accent"
                  whileInView={
                    reducedMotion
                      ? undefined
                      : { scale: [0.85, 1.08, 1], opacity: [0.4, 1, 1] }
                  }
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: 0.05 + index * 0.1 }}
                >
                  {step.code}
                </motion.span>
                <div>
                  <h3 className="font-display text-2xl font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-muted-foreground">
                    {step.text}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-border px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2 md:items-end md:gap-16">
          <Reveal>
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--brass)]">
              For whom
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
              People who need to land already in the system.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Chronic care, pregnancy, specialty follow-up, fragmented records:
              Transit is the quiet preparation layer so your first week abroad is
              treatment, not paperwork.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden px-6 py-24 md:px-10 md:py-32">
        <motion.div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/hero-passport.jpg)" }}
          initial={reducedMotion ? false : { scale: 1.1 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,21,38,0.78),rgba(11,21,38,0.92))]"
        />
        <div aria-hidden className="passport-guilloche absolute inset-0" />
        <Reveal className="relative z-10 mx-auto max-w-2xl text-center">
          <motion.div
            animate={
              reducedMotion
                ? undefined
                : { rotate: [0, 4, -3, 0], scale: [1, 1.04, 1] }
            }
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block"
          >
            <PassportMark
              tone="brass"
              className={`mx-auto h-10 w-10 ${reducedMotion ? "" : "brass-glow"}`}
            />
          </motion.div>
          <p className="mt-5 font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
            Ready for entry.
          </p>
          <p className="mx-auto mt-4 max-w-md text-white/70">
            Issue your health passport before you fly. Arrive with everything
            clinics need already in hand.
          </p>
          <motion.div
            className="mt-8 inline-block"
            whileHover={reducedMotion ? undefined : { scale: 1.04, y: -2 }}
            whileTap={reducedMotion ? undefined : { scale: 0.98 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-[var(--brass)] text-[var(--cover)] hover:bg-[#d4b46d]"
            >
              <Link href={startHref}>{startLabel}</Link>
            </Button>
          </motion.div>
        </Reveal>
      </section>

      <footer className="flex flex-col gap-2 px-6 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-10">
        <div className="flex items-center gap-2">
          <PassportMark tone="ink" className="h-5 w-5" />
          <p className="font-display text-base font-semibold text-foreground">
            Transit
          </p>
        </div>
        <p>Your healthcare passport across borders.</p>
      </footer>
    </div>
  );
}
