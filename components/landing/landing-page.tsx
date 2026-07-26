"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTransitStore } from "@/lib/store/use-transit-store";

const steps = [
  {
    title: "Share your move",
    text: "Tell Transit where you’re going, what you live with, and what must not be interrupted.",
  },
  {
    title: "Collect your history",
    text: "Upload records or let Transit listen while you’re with your doctor.",
  },
  {
    title: "Leave with a package",
    text: "A clinic-ready handoff, destination guidance, and a clear next step — before you travel.",
  },
];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export function LandingPage() {
  const onboarded = useTransitStore((s) => s.onboarded);
  const reducedMotion = usePrefersReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.18]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-7, 7]);
  const glareX = useTransform(springX, [-0.5, 0.5], [20, 80]);
  const glareY = useTransform(springY, [-0.5, 0.5], [30, 70]);
  const glareBackground = useMotionTemplate`radial-gradient(520px circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.14), transparent 55%)`;

  function onHeroMove(event: MouseEvent<HTMLElement>) {
    if (reducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function onHeroLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  const startHref = onboarded ? "/app/overview" : "/onboarding";
  const startLabel = onboarded ? "Continue your move" : "Get started";

  return (
    <div className="min-h-screen text-foreground">
      <header className="absolute inset-x-0 top-0 z-20 px-4 pt-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/15 bg-white/10 px-5 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl"
        >
          <p className="font-display text-xl tracking-tight text-white">
            Transit
          </p>
          <Button
            asChild
            size="sm"
            variant="secondary"
            className="bg-white text-foreground hover:bg-white/90"
          >
            <Link href={startHref}>
              {onboarded ? "Continue" : "Get started"}
            </Link>
          </Button>
        </motion.div>
      </header>

      <section
        ref={heroRef}
        className="relative flex min-h-[100svh] items-end overflow-hidden"
        onMouseMove={onHeroMove}
        onMouseLeave={onHeroLeave}
        style={{ perspective: 1200 }}
      >
        <motion.div
          aria-hidden
          className="absolute inset-[-8%] bg-cover bg-center will-change-transform"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2400&q=80)",
            y: reducedMotion ? 0 : imageY,
            scale: reducedMotion ? 1.04 : imageScale,
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[#1c1b19] via-[#1c1b19]/55 to-[#1c1b19]/25"
        />
        {!reducedMotion ? (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-soft-light"
            style={{ background: glareBackground }}
          />
        ) : null}

        {/* Soft depth layers */}
        {!reducedMotion ? (
          <>
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -left-16 top-24 h-56 w-56 rounded-full bg-white/5 blur-3xl"
              animate={{ y: [0, 18, 0], x: [0, 10, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute right-0 top-1/3 h-72 w-72 rounded-full bg-accent/10 blur-3xl"
              animate={{ y: [0, -22, 0], x: [0, -12, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        ) : null}

        <motion.div
          className="relative z-10 w-full px-6 pb-16 pt-32 md:px-10 md:pb-24"
          style={{
            y: reducedMotion ? 0 : contentY,
            opacity: reducedMotion ? 1 : contentOpacity,
            rotateX: reducedMotion ? 0 : rotateX,
            rotateY: reducedMotion ? 0 : rotateY,
            transformStyle: "preserve-3d",
          }}
        >
          <div className="max-w-2xl" style={{ transform: "translateZ(40px)" }}>
            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-5xl tracking-tight text-white md:text-7xl"
            >
              Transit
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.65,
                delay: 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-4 max-w-xl font-display text-2xl leading-snug tracking-tight text-white/95 md:text-3xl"
            >
              Your healthcare moves with you.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.16,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-4 max-w-md text-base leading-relaxed text-white/80 md:text-lg"
            >
              An AI relocation agent that prepares your medical history,
              destination plan, and clinical handoff before you change countries.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.55,
                delay: 0.24,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <motion.div
                whileHover={reducedMotion ? undefined : { scale: 1.03, y: -2 }}
                whileTap={reducedMotion ? undefined : { scale: 0.98 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-foreground hover:bg-white/90"
                >
                  <Link href={startHref}>{startLabel}</Link>
                </Button>
              </motion.div>
              {!onboarded ? (
                <Link
                  href="#how"
                  className="px-2 text-sm text-white/75 underline-offset-4 hover:text-white hover:underline"
                >
                  See how it works
                </Link>
              ) : null}
            </motion.div>
          </div>
        </motion.div>

        {!reducedMotion ? (
          <motion.div
            aria-hidden
            className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 text-white/50 md:block"
            animate={{ y: [0, 6, 0], opacity: [0.35, 0.7, 0.35] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="block h-8 w-px bg-white/40" />
          </motion.div>
        ) : null}
      </section>

      <section className="border-b border-border bg-[rgba(20,19,17,0.97)] px-6 py-5 text-white md:px-10">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <p>Built for cross-border care continuity</p>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            <span>Private by default</span>
            <span>Clinic-ready drafts</span>
            <span>No surprise sends</span>
          </div>
        </div>
      </section>

      <section className="border-b border-border px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm text-muted-foreground">What this is</p>
            <h2 className="mt-3 font-display text-3xl tracking-tight md:text-5xl">
              Continuity of care, prepared before you land.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Moving with a chronic condition means more than packing a suitcase.
              Transit helps you gather what matters, understand the healthcare
              corridor you’re entering, and leave with a package a receiving
              clinician can actually use.
            </p>
          </motion.div>
        </div>
      </section>

      <section
        id="how"
        className="border-b border-border bg-card/60 px-6 py-20 md:px-10 md:py-28"
      >
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45 }}
          >
            <p className="text-sm text-muted-foreground">How it works</p>
            <h2 className="mt-3 font-display text-3xl tracking-tight md:text-4xl">
              Three calm steps.
            </h2>
          </motion.div>
          <ol className="mt-12 space-y-10">
            {steps.map((step, index) => (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, y: 16, rotateX: reducedMotion ? 0 : 8 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="grid gap-2 border-t border-border pt-8 sm:grid-cols-[4rem_1fr]"
                style={{ transformStyle: "preserve-3d" }}
              >
                <span className="font-display text-2xl text-accent">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="font-display text-2xl tracking-tight">
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
          <motion.div
            initial={{ opacity: 0, x: reducedMotion ? 0 : -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm text-muted-foreground">Built for</p>
            <h2 className="mt-3 font-display text-3xl tracking-tight md:text-4xl">
              People who can’t afford a gap in care.
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, x: reducedMotion ? 0 : 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.06 }}
            className="text-lg leading-relaxed text-muted-foreground"
          >
            If you’re relocating with Crohn’s, diabetes, epilepsy, cancer
            follow-up, or any condition that needs a clean handoff — Transit is
            the quiet preparation layer between your current clinic and the next
            one.
          </motion.p>
        </div>
      </section>

      <section className="relative overflow-hidden px-6 py-24 md:px-10 md:py-32">
        <motion.div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1488085061387-422e58bd2bef?auto=format&fit=crop&w=2000&q=80)",
          }}
          initial={{ scale: 1.08 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <div aria-hidden className="absolute inset-0 bg-[#1c1b19]/72" />
        <motion.div
          className="relative z-10 mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
        >
          <p className="font-display text-4xl tracking-tight text-white md:text-5xl">
            Ready when you are.
          </p>
          <p className="mx-auto mt-4 max-w-md text-white/75">
            Start with a few details about your move. Transit takes it from
            there.
          </p>
          <motion.div
            className="mt-8 inline-block"
            whileHover={reducedMotion ? undefined : { scale: 1.03, y: -2 }}
            whileTap={reducedMotion ? undefined : { scale: 0.98 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-white text-foreground hover:bg-white/90"
            >
              <Link href={startHref}>{startLabel}</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <footer className="flex flex-col gap-2 px-6 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-10">
        <p className="font-display text-base text-foreground">Transit</p>
        <p>Your healthcare moves with you.</p>
      </footer>
    </div>
  );
}
