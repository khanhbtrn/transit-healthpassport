"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

export function EntryStamp({
  label,
  sublabel,
  className,
  animate = true,
  delay = 0.15,
}: {
  label: string;
  sublabel?: string;
  className?: string;
  animate?: boolean;
  delay?: number;
}) {
  const reduced = usePrefersReducedMotion();
  const shouldAnimate = animate && !reduced;

  return (
    <motion.div
      initial={
        shouldAnimate
          ? { opacity: 0, scale: 1.35, rotate: -18, filter: "blur(4px)" }
          : { opacity: 1, scale: 1, rotate: -8 }
      }
      whileInView={
        shouldAnimate
          ? { opacity: 1, scale: 1, rotate: -8, filter: "blur(0px)" }
          : undefined
      }
      viewport={{ once: true, amount: 0.35 }}
      transition={{
        type: "spring",
        stiffness: 320,
        damping: 16,
        delay: shouldAnimate ? delay : 0,
      }}
      className={cn(
        "pointer-events-none relative select-none rounded-full border-[3px] border-[var(--brass)] px-5 py-4 text-center uppercase tracking-[0.18em] text-[var(--brass)]",
        className
      )}
      aria-hidden
    >
      {shouldAnimate ? (
        <motion.span
          className="absolute inset-[-18%] rounded-full bg-[var(--brass)]/20"
          initial={{ opacity: 0.55, scale: 0.7 }}
          whileInView={{ opacity: 0, scale: 1.45 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: delay + 0.05 }}
        />
      ) : null}
      <p className="relative font-display text-[11px] font-bold leading-none">
        {label}
      </p>
      {sublabel ? (
        <p className="relative mt-1.5 text-[9px] tracking-[0.22em] opacity-80">
          {sublabel}
        </p>
      ) : null}
    </motion.div>
  );
}
