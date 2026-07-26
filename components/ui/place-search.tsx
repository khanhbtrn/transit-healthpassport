"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { MapPin } from "lucide-react";
import {
  formatPlaceLabel,
  searchPlaces,
  type Place,
} from "@/lib/corridor/places";
import { cn } from "@/lib/utils";

type PlaceSearchProps = {
  label?: string;
  city: string;
  country: string;
  placeholder?: string;
  highlight?: boolean;
  onSelect: (place: { city: string; country: string }) => void;
  onClear?: () => void;
};

export function PlaceSearch({
  city,
  country,
  placeholder = "Search city or country",
  highlight,
  onSelect,
  onClear,
}: PlaceSearchProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedLabel = city && country ? formatPlaceLabel(city, country) : "";
  const [query, setQuery] = useState(selectedLabel);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [results, setResults] = useState<Place[]>([]);

  useEffect(() => {
    setQuery(selectedLabel);
  }, [selectedLabel]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        if (selectedLabel) setQuery(selectedLabel);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [selectedLabel]);

  function runSearch(value: string) {
    setQuery(value);
    const next = searchPlaces(value, 8);
    setResults(next);
    setActive(0);
    setOpen(value.trim().length > 0);
    if (!value.trim()) {
      onClear?.();
    }
  }

  function choose(place: Place) {
    onSelect({ city: place.city, country: place.country });
    setQuery(place.label);
    setOpen(false);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) {
      if (event.key === "Escape") setOpen(false);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      choose(results[active]);
    } else if (event.key === "Escape") {
      setOpen(false);
      if (selectedLabel) setQuery(selectedLabel);
    }
  }

  function onBlurCommit() {
    if (!query.trim()) {
      onClear?.();
      return;
    }
    if (selectedLabel && query === selectedLabel) return;
    const top = searchPlaces(query, 1)[0];
    if (top) choose(top);
    else if (selectedLabel) setQuery(selectedLabel);
  }

  return (
    <div ref={rootRef} className="relative">
      <div className="relative">
        <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="words"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            open && results[active] ? `${listId}-${results[active].id}` : undefined
          }
          placeholder={placeholder}
          onChange={(e) => runSearch(e.target.value)}
          onFocus={() => {
            if (query.trim()) {
              setResults(searchPlaces(query, 8));
              setOpen(true);
            }
          }}
          onKeyDown={onKeyDown}
          onBlur={() => {
            // Delay so option click can register
            window.setTimeout(() => onBlurCommit(), 120);
          }}
          className={cn(
            "flex h-12 w-full rounded-2xl border border-border bg-card/90 py-2 pl-10 pr-4 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] outline-none transition duration-300 placeholder:text-muted-foreground/70 focus:border-accent focus:bg-card focus:shadow-[0_0_0_4px_rgba(15,111,104,0.12)]",
            highlight && "ring-2 ring-accent/25"
          )}
        />
      </div>

      {open && results.length > 0 ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-2 max-h-64 w-full overflow-auto rounded-2xl border border-border bg-card p-1.5 shadow-[var(--shadow-lift)]"
        >
          {results.map((place, index) => (
            <li key={place.id} role="option" aria-selected={index === active}>
              <button
                id={`${listId}-${place.id}`}
                type="button"
                className={cn(
                  "flex w-full flex-col items-start rounded-xl px-3 py-2.5 text-left transition",
                  index === active
                    ? "bg-accent-soft text-foreground"
                    : "hover:bg-muted/70"
                )}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setActive(index)}
                onClick={() => choose(place)}
              >
                <span className="text-sm font-medium">{place.city}</span>
                <span className="text-xs text-muted-foreground">
                  {place.country}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {open && query.trim() && results.length === 0 ? (
        <div className="absolute z-30 mt-2 w-full rounded-2xl border border-border bg-card px-3 py-3 text-sm text-muted-foreground shadow-[var(--shadow-soft)]">
          No matching place. Try another spelling.
        </div>
      ) : null}
    </div>
  );
}
