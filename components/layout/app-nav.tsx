"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderOpen,
  Home,
  Mic,
  Sparkles,
  ChevronDown,
  User,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { PassportMark } from "@/components/brand/passport-mark";
import { BrandWordmark } from "@/components/brand/wordmark";
import { CommandPalette } from "@/components/layout/command-palette";
import { Progress } from "@/components/ui/progress";
import { useTransitStore } from "@/lib/store/use-transit-store";
import { cn } from "@/lib/utils";

/**
 * Primary nav = the three jobs users actually do:
 * Home (status) · Agent (run the move) · Docs (when asked to upload).
 *
 * Everything else is situational and lives under You:
 * listen during a visit, package when ready, profile, reset.
 */
const primary = [
  { href: "/app/overview", label: "Home", icon: Home },
  { href: "/app/relocation", label: "Agent", icon: Sparkles },
  { href: "/app/documents", label: "Docs", icon: FolderOpen },
] as const;

export function AppNav() {
  const pathname = usePathname();
  const profile = useTransitStore((s) => s.profile);
  const readinessPercent = useTransitStore((s) => s.readinessPercent);
  const transitionComplete = useTransitStore((s) => s.transitionComplete);
  const approvals = useTransitStore((s) => s.approvals);
  const agentNeeds = useTransitStore((s) => s.agentNeeds);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const firstName = profile.fullName.split(" ")[0] || "You";
  const pendingApprovals = approvals.filter(
    (a) => a.status === "needs_approval"
  ).length;
  const listenNeeded = agentNeeds.some(
    (n) => n.status === "open" && n.kind === "talk_to_person"
  );
  const packageReady = transitionComplete || pendingApprovals > 0;
  const youActive = [
    "/app/profile",
    "/app/conversation",
    "/app/arrival",
    "/app/handoff",
    "/app/care-search",
    "/app/agent",
  ].includes(pathname);

  useEffect(() => {
    if (!menuOpen) return;
    function onPointerDown(event: MouseEvent) {
      const target = event.target as Element | null;
      if (target?.closest?.("[data-you-menu]")) return;
      setMenuOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  function startOver() {
    localStorage.removeItem("transit-user-v3");
    localStorage.removeItem("transit-user-v2");
    window.location.href = "/";
  }

  const youMenu = (
    <>
      {listenNeeded ? (
        <MenuLink
          href="/app/conversation"
          pathname={pathname}
          onClick={() => setMenuOpen(false)}
          emphasize
        >
          <Mic className="h-3.5 w-3.5" />
          Listen to visit
        </MenuLink>
      ) : (
        <MenuLink
          href="/app/conversation"
          pathname={pathname}
          onClick={() => setMenuOpen(false)}
        >
          <Mic className="h-3.5 w-3.5" />
          Listen to visit
        </MenuLink>
      )}

      {packageReady ? (
        <MenuLink
          href="/app/arrival"
          pathname={pathname}
          onClick={() => setMenuOpen(false)}
          emphasize={pendingApprovals > 0}
        >
          Package
          {pendingApprovals > 0 ? ` (${pendingApprovals})` : ""}
        </MenuLink>
      ) : null}

      <MenuLink
        href="/app/profile"
        pathname={pathname}
        onClick={() => setMenuOpen(false)}
      >
        Profile
      </MenuLink>

      <div className="my-1 border-t border-border/70" />

      <button
        type="button"
        role="menuitem"
        className="block w-full rounded-xl px-3 py-2.5 text-left text-sm text-muted-foreground hover:bg-muted/80"
        onClick={startOver}
      >
        Start over
      </button>
    </>
  );

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/50 bg-[rgba(238,242,246,0.86)] backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-2 px-3 sm:h-16 sm:gap-3 sm:px-6">
          <Link
            href="/app/overview"
            className="inline-flex min-w-0 shrink items-center gap-1.5 font-display text-lg font-bold tracking-tight transition hover:opacity-80 sm:gap-2 sm:text-2xl"
          >
            <PassportMark
              tone="ink"
              className="h-5 w-5 shrink-0 text-[var(--brass)]"
            />
            <BrandWordmark className="truncate text-lg sm:text-2xl" />
          </Link>

          <nav
            className="hidden items-center gap-0.5 sm:flex"
            aria-label="Primary"
          >
            {primary.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
                    active
                      ? "bg-accent text-accent-foreground shadow-[0_8px_20px_rgba(15,111,104,0.22)]"
                      : "text-muted-foreground hover:bg-white/70 hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex min-w-0 items-center gap-1.5 sm:gap-3">
            <CommandPalette />

            <div className="relative hidden sm:block" ref={menuRef} data-you-menu>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                className={cn(
                  "inline-flex max-w-[10rem] items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-left transition",
                  youActive || menuOpen
                    ? "bg-accent-soft text-accent"
                    : "hover:bg-white/70"
                )}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold tracking-tight text-foreground">
                    {firstName}
                  </span>
                  <span className="block truncate text-[11px] text-muted-foreground">
                    {readinessPercent}% clearance
                    {pendingApprovals > 0
                      ? ` · ${pendingApprovals} to approve`
                      : ""}
                  </span>
                </span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 shrink-0 text-muted-foreground transition",
                    menuOpen && "rotate-180"
                  )}
                />
              </button>

              {menuOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-white/60 bg-[rgba(247,250,252,0.96)] p-1.5 shadow-[var(--shadow-lift)] backdrop-blur-xl"
                >
                  {youMenu}
                </div>
              ) : null}
            </div>

            <div className="flex min-w-0 flex-col items-end sm:hidden">
              <span className="max-w-[5.5rem] truncate text-xs font-semibold text-foreground">
                {firstName}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {readinessPercent}%
                {pendingApprovals > 0 ? ` · ${pendingApprovals}` : ""}
              </span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-3 pb-2.5 sm:px-6">
          <Progress value={readinessPercent} className="h-1" />
        </div>
      </header>

      <nav
        data-you-menu
        className="fixed inset-x-0 bottom-0 z-40 border-t border-white/55 bg-[rgba(247,250,252,0.94)] px-2 pt-2 backdrop-blur-xl sm:hidden"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
        aria-label="Primary"
      >
        <div className="mx-auto grid max-w-lg grid-cols-4 gap-1">
          {primary.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-2 text-[11px] transition",
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
            onClick={() => setMenuOpen((v) => !v)}
            className={cn(
              "flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-2 text-[11px] transition",
              youActive || menuOpen
                ? "bg-accent-soft text-accent"
                : "text-muted-foreground"
            )}
          >
            <User className="h-5 w-5" />
            You
          </button>
        </div>
        {menuOpen ? (
          <div className="mx-auto mt-2 max-h-[45vh] max-w-lg space-y-1 overflow-y-auto border-t border-border/70 pt-2">
            {youMenu}
          </div>
        ) : null}
      </nav>
    </>
  );
}

function MenuLink({
  href,
  pathname,
  onClick,
  children,
  emphasize,
}: {
  href: string;
  pathname: string;
  onClick: () => void;
  children: ReactNode;
  emphasize?: boolean;
}) {
  const active = pathname === href;
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition",
        active && "bg-accent-soft text-accent",
        !active && emphasize && "font-medium text-accent hover:bg-accent-soft/60",
        !active && !emphasize && "hover:bg-muted/80"
      )}
    >
      {children}
    </Link>
  );
}
