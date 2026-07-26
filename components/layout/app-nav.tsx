"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderOpen, Home, Mic, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { useTransitStore } from "@/lib/store/use-transit-store";
import { cn } from "@/lib/utils";

const primary = [
  { href: "/app/overview", label: "Home", icon: Home },
  { href: "/app/documents", label: "Docs", icon: FolderOpen },
  { href: "/app/conversation", label: "Doctor", icon: Mic },
];

const moreLinks = [
  { href: "/app/agent", label: "Ask Transit" },
  { href: "/app/profile", label: "Profile" },
  { href: "/app/relocation", label: "Run Transit" },
  { href: "/app/care-search", label: "Find doctor" },
  { href: "/app/handoff", label: "Handoff" },
  { href: "/app/arrival", label: "Arrival" },
];

export function AppNav() {
  const pathname = usePathname();
  const profile = useTransitStore((s) => s.profile);
  const readinessPercent = useTransitStore((s) => s.readinessPercent);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreActive = moreLinks.some((link) => link.href === pathname);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/40 bg-[rgba(243,241,235,0.78)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/app/overview"
            className="font-display text-2xl tracking-tight transition hover:opacity-80"
          >
            Transit
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {primary.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm transition duration-300",
                    active
                      ? "bg-accent text-accent-foreground shadow-[0_8px_20px_rgba(31,92,74,0.2)]"
                      : "text-muted-foreground hover:bg-white/70 hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreOpen((v) => !v)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm transition duration-300",
                  moreActive || moreOpen
                    ? "bg-accent-soft text-accent"
                    : "text-muted-foreground hover:bg-white/70 hover:text-foreground"
                )}
              >
                <MoreHorizontal className="h-4 w-4" />
                More
              </button>
              {moreOpen ? (
                <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border border-white/50 bg-[rgba(255,252,247,0.92)] p-2 shadow-[var(--shadow-lift)] backdrop-blur-xl">
                  {moreLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMoreOpen(false)}
                      className={cn(
                        "block rounded-xl px-3 py-2.5 text-sm transition",
                        pathname === link.href
                          ? "bg-accent-soft text-accent"
                          : "hover:bg-muted/80"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <button
                    type="button"
                    className="mt-1 block w-full rounded-xl px-3 py-2.5 text-left text-sm text-muted-foreground hover:bg-muted/80"
                    onClick={() => {
                      localStorage.removeItem("transit-user-v2");
                      window.location.href = "/";
                    }}
                  >
                    Start over
                  </button>
                </div>
              ) : null}
            </div>
          </nav>
          <div className="min-w-[88px] text-right">
            <p className="text-sm font-semibold tracking-tight">
              {readinessPercent}%
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {profile.fullName.split(" ")[0] || "You"}
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-4 pb-3 sm:px-6">
          <Progress value={readinessPercent} />
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/50 bg-[rgba(255,252,247,0.88)] px-2 py-2 backdrop-blur-xl sm:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-4 gap-1">
          {primary.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-2xl px-2 py-2.5 text-[11px] transition",
                  active
                    ? "bg-accent-soft text-accent"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMoreOpen((v) => !v)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-2xl px-2 py-2.5 text-[11px] transition",
              moreActive || moreOpen
                ? "bg-accent-soft text-accent"
                : "text-muted-foreground"
            )}
          >
            <MoreHorizontal className="h-5 w-5" />
            More
          </button>
        </div>
        {moreOpen ? (
          <div className="mx-auto mt-2 grid max-w-lg grid-cols-2 gap-2 border-t border-border/70 pt-2">
            {moreLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMoreOpen(false)}
                className="rounded-xl bg-muted/80 px-3 py-2.5 text-center text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ) : null}
      </nav>
    </>
  );
}
