"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, Loader2, MessagesSquare } from "lucide-react";
import {
  CriticalText,
  isCriticalBullet,
} from "@/components/corridor/critical-text";
import type { CommunityLink, CorridorBrief } from "@/lib/corridor/knowledge";
import { cn } from "@/lib/utils";

export function RouteBriefCard({
  brief,
  fromCountry,
  toCountry,
  fromCity,
  toCity,
  condition,
  onLinks,
}: {
  brief: CorridorBrief;
  fromCountry: string;
  toCountry: string;
  fromCity?: string;
  toCity?: string;
  condition?: string;
  onLinks?: (links: CommunityLink[]) => void;
}) {
  const [links, setLinks] = useState<CommunityLink[]>(
    brief.communityLinks || []
  );
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(
    Boolean(brief.communityLinks && brief.communityLinks.length > 0)
  );
  const onLinksRef = useRef(onLinks);
  onLinksRef.current = onLinks;

  useEffect(() => {
    if (!fromCountry || !toCountry) return;

    let cancelled = false;

    async function run() {
      setLoading(true);
      setSearched(false);
      try {
        const response = await fetch("/api/corridor/community", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fromCountry,
            toCountry,
            fromCity,
            toCity,
            condition,
          }),
        });
        const data = await response.json();
        if (cancelled) return;
        const next = (data.links || []) as CommunityLink[];
        setLinks(next);
        setSearched(true);
        onLinksRef.current?.(next);
      } catch {
        if (!cancelled) {
          setLinks([]);
          setSearched(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [fromCountry, toCountry, fromCity, toCity, condition]);

  return (
    <section className="surface-elevated relative overflow-hidden rounded-[1.35rem] p-4 sm:rounded-[1.75rem] sm:p-5">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(ellipse_at_top,rgba(15,111,104,0.12),transparent_70%)]"
      />
      <p className="relative text-[11px] tracking-[0.14em] text-accent uppercase sm:text-xs">
        How care works on your route
      </p>
      <p className="relative mt-1 break-words font-display text-base font-semibold tracking-tight sm:text-lg">
        {brief.routeLabel}
      </p>

      <p className="relative mt-3 text-[15px] leading-relaxed text-muted-foreground">
        <CriticalText text={brief.overview || brief.summary} />
      </p>

      <div className="mt-5 border-t border-border pt-4">
        <p className="text-xs tracking-wide text-muted-foreground uppercase">
          Assume you know nothing — do this
        </p>
        <p className="mt-1 text-[11px] text-danger">
          Red = critical for continuity / safety — do not skip
        </p>
        <ul className="mt-3 space-y-2.5 text-sm leading-snug">
          {brief.mustKnow.slice(0, 5).map((item) => {
            const critical = isCriticalBullet(item);
            return (
              <li
                key={item}
                className={cn(
                  "flex gap-3 rounded-xl px-2 py-1.5 -mx-2",
                  critical && "bg-danger-soft/50"
                )}
              >
                <span
                  className={cn(
                    "mt-2 h-px w-3 shrink-0",
                    critical ? "bg-danger" : "bg-accent/50"
                  )}
                />
                <span>
                  <CriticalText text={item} />
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center gap-2 text-xs tracking-wide text-muted-foreground uppercase">
          <MessagesSquare className="h-3.5 w-3.5" />
          From people who did similar moves
        </div>

        {loading ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Researching discussions…
          </p>
        ) : null}

        {!loading && links.length > 0 ? (
          <ul className="space-y-2.5">
            {links.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-2 rounded-xl border border-border/70 bg-background/50 px-3 py-2.5 transition hover:border-accent/40"
                >
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-medium group-hover:text-accent">
                      {link.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {link.source === "reddit" ? "Reddit" : "Forum"} ·{" "}
                      {link.why}
                    </p>
                  </div>
                  <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                </a>
              </li>
            ))}
          </ul>
        ) : null}

        {!loading && searched && links.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Related chats could not be loaded right now. Use the steps above, and
            try again shortly.
          </p>
        ) : null}

        <p className="mt-2 text-[11px] text-muted-foreground">
          Community chats are experiences only — not medical advice or official
          eligibility.
        </p>
      </div>
    </section>
  );
}
