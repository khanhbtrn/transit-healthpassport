"use client";

import { useEffect, useMemo, useState, type ComponentType } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Home,
  Mic,
  Search,
  Sparkles,
  Stethoscope,
  User,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useTransitStore } from "@/lib/store/use-transit-store";
import { cn } from "@/lib/utils";

type CommandItem = {
  id: string;
  label: string;
  hint?: string;
  href: string;
  group: string;
  keywords?: string;
};

const staticCommands: CommandItem[] = [
  {
    id: "home",
    label: "Home",
    hint: "Status, needs, next step",
    href: "/app/overview",
    group: "Primary",
    keywords: "overview dashboard",
  },
  {
    id: "transit",
    label: "Agent",
    hint: "Run booking + paperwork drafts",
    href: "/app/relocation",
    group: "Primary",
    keywords: "agent handoff relocation approve start",
  },
  {
    id: "docs",
    label: "Documents",
    hint: "Upload when the agent asks",
    href: "/app/documents",
    group: "Primary",
    keywords: "upload records pdf letter",
  },
  {
    id: "doctor",
    label: "Listen to visit",
    hint: "Capture what your clinician says",
    href: "/app/conversation",
    group: "During a visit",
    keywords: "mic listen conversation doctor",
  },
  {
    id: "package",
    label: "Package",
    hint: "Approvals and clinic letter",
    href: "/app/arrival",
    group: "Results",
    keywords: "results handoff arrival summary approve",
  },
  {
    id: "ask",
    label: "Ask a question",
    hint: "Chat about your corridor",
    href: "/app/agent",
    group: "More",
    keywords: "chat ai help ask",
  },
  {
    id: "clinics",
    label: "Browse clinics",
    hint: "Optional shortlist",
    href: "/app/care-search",
    group: "More",
    keywords: "doctor appointment search find",
  },
  {
    id: "profile",
    label: "Profile",
    hint: "Your move details",
    href: "/app/profile",
    group: "More",
    keywords: "settings account",
  },
];

const icons: Record<string, ComponentType<{ className?: string }>> = {
  home: Home,
  docs: FileText,
  doctor: Mic,
  transit: Sparkles,
  clinics: Stethoscope,
  ask: Search,
  package: FileText,
  profile: User,
};

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const documents = useTransitStore((s) => s.documents);
  const conditions = useTransitStore((s) => s.conditions);
  const profile = useTransitStore((s) => s.profile);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const items = useMemo(() => {
    const dynamic: CommandItem[] = [
      ...documents.slice(0, 8).map((doc) => ({
        id: `doc-${doc.id}`,
        label: doc.title,
        hint: doc.documentType || "Document",
        href: "/app/documents",
        group: "Your records",
        keywords: `${doc.title} ${doc.documentType} ${doc.previewText || ""}`,
      })),
      ...conditions.slice(0, 6).map((condition) => ({
        id: `cond-${condition.id}`,
        label: condition.name,
        hint: "Condition in your profile",
        href: "/app/profile",
        group: "Your health",
        keywords: condition.name,
      })),
    ];

    if (profile.destinationCity || profile.destinationCountry) {
      dynamic.unshift({
        id: "route",
        label: `${profile.currentCity || "Origin"} → ${profile.destinationCity || profile.destinationCountry}`,
        hint: "Your corridor",
        href: "/app/overview",
        group: "Your move",
        keywords: `${profile.currentCountry} ${profile.destinationCountry} route`,
      });
    }

    const all = [...staticCommands, ...dynamic];
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((item) =>
      `${item.label} ${item.hint || ""} ${item.keywords || ""} ${item.group}`
        .toLowerCase()
        .includes(q)
    );
  }, [query, documents, conditions, profile]);

  const groups = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const item of items) {
      const list = map.get(item.group) || [];
      list.push(item);
      map.set(item.group, list);
    }
    return Array.from(map.entries());
  }, [items]);

  function go(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden items-center gap-2 rounded-xl border border-border bg-card/80 px-3 py-1.5 text-xs text-muted-foreground shadow-[var(--shadow-soft)] transition hover:border-accent/40 hover:text-foreground sm:inline-flex"
        aria-label="Open search"
      >
        <Search className="h-3.5 w-3.5" />
        Search
        <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">
          ⌘K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0 sm:max-w-xl">
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pages, records, actions…"
              className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="max-h-[55vh] overflow-y-auto p-2">
            {groups.length === 0 ? (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                Nothing matches.
              </p>
            ) : (
              groups.map(([group, groupItems]) => (
                <div key={group} className="mb-2">
                  <p className="px-3 py-2 text-[11px] tracking-wide text-muted-foreground uppercase">
                    {group}
                  </p>
                  <ul>
                    {groupItems.map((item) => {
                      const Icon =
                        icons[item.id] ||
                        (item.group === "Your records" ? FileText : Sparkles);
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => go(item.href)}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-accent-soft/70"
                            )}
                          >
                            <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium">
                                {item.label}
                              </span>
                              {item.hint ? (
                                <span className="block truncate text-xs text-muted-foreground">
                                  {item.hint}
                                </span>
                              ) : null}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))
            )}
          </div>
          <div className="border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
            ↑↓ to browse · Enter to open · Esc to close
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
