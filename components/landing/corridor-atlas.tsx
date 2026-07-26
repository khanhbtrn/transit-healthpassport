"use client";

import { motion } from "framer-motion";

const routes = [
  "M 40 220 C 180 40, 320 40, 460 180",
  "M 80 280 C 200 120, 380 90, 560 160",
  "M 20 160 C 160 220, 300 60, 520 100",
  "M 120 300 C 260 200, 400 240, 580 80",
];

const nodes = [
  { cx: 40, cy: 220, label: "Origin" },
  { cx: 460, cy: 180, label: "Care" },
  { cx: 560, cy: 160, label: "Arrive" },
  { cx: 520, cy: 100, label: "Clinic" },
  { cx: 80, cy: 280, label: "" },
  { cx: 300, cy: 90, label: "" },
];

export function CorridorAtlas({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <svg
        viewBox="0 0 600 340"
        className="absolute inset-0 h-full w-full opacity-70"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="routeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(94, 234, 212, 0)" />
            <stop offset="45%" stopColor="rgba(94, 234, 212, 0.85)" />
            <stop offset="100%" stopColor="rgba(125, 211, 252, 0.2)" />
          </linearGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {routes.map((d, i) => (
          <motion.path
            key={d}
            d={d}
            fill="none"
            stroke="url(#routeGlow)"
            strokeWidth={1.25}
            strokeLinecap="round"
            filter="url(#softGlow)"
            initial={
              reducedMotion
                ? { pathLength: 1, opacity: 0.45 }
                : { pathLength: 0, opacity: 0 }
            }
            animate={{ pathLength: 1, opacity: 0.55 + i * 0.08 }}
            transition={{
              duration: reducedMotion ? 0 : 2.4 + i * 0.35,
              delay: reducedMotion ? 0 : 0.2 + i * 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}

        {nodes.map((node, i) => (
          <g key={`${node.cx}-${node.cy}`}>
            <motion.circle
              cx={node.cx}
              cy={node.cy}
              r={4.5}
              fill="rgba(236, 253, 245, 0.95)"
              initial={reducedMotion ? { opacity: 0.9 } : { opacity: 0, scale: 0.4 }}
              animate={{ opacity: 0.95, scale: 1 }}
              transition={{
                delay: reducedMotion ? 0 : 1.1 + i * 0.12,
                duration: 0.5,
              }}
            />
            {!reducedMotion ? (
              <motion.circle
                cx={node.cx}
                cy={node.cy}
                r={12}
                fill="none"
                stroke="rgba(94, 234, 212, 0.45)"
                strokeWidth={1}
                initial={{ opacity: 0.5, scale: 0.7 }}
                animate={{ opacity: [0.45, 0, 0.45], scale: [0.75, 1.35, 0.75] }}
                transition={{
                  duration: 3.2,
                  delay: 1.4 + i * 0.25,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ) : null}
          </g>
        ))}
      </svg>

      {!reducedMotion ? (
        <>
          <motion.div
            className="absolute left-[12%] top-[28%] h-40 w-40 rounded-full bg-teal-300/10 blur-3xl"
            animate={{ y: [0, 18, 0], opacity: [0.35, 0.55, 0.35] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-[8%] top-[18%] h-56 w-56 rounded-full bg-sky-300/10 blur-3xl"
            animate={{ y: [0, -16, 0], x: [0, -10, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      ) : null}
    </div>
  );
}
