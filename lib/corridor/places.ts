import { countryProfiles } from "@/lib/corridor/countries";

export type Place = {
  id: string;
  city: string;
  country: string;
  countryId: string;
  label: string;
  tokens: string[];
};

/** Aliases that name a country/region, not a city. */
const NON_CITY_ALIASES = new Set([
  "uk",
  "usa",
  "us",
  "uae",
  "britain",
  "great britain",
  "england",
  "scotland",
  "wales",
  "northern ireland",
  "españa",
  "italia",
  "burma",
  "holland",
  "czechia",
  "republic of korea",
  "south korea",
  "north korea",
  "prc",
  "roe",
]);

function titleCase(value: string) {
  return value
    .split(/\s+/)
    .map((part) =>
      part
        .split("-")
        .map((p) => (p ? p[0].toUpperCase() + p.slice(1) : p))
        .join("-")
    )
    .join(" ");
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isCountryAlias(countryId: string, countryName: string, alias: string) {
  const a = normalize(alias);
  if (!a) return true;
  if (a === normalize(countryId) || a === normalize(countryName)) return true;
  if (a.length <= 3) return true;
  if (NON_CITY_ALIASES.has(a)) return true;
  return false;
}

function levenshtein(a: string, b: string) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix = Array.from({ length: rows }, () => new Array<number>(cols).fill(0));
  for (let i = 0; i < rows; i += 1) matrix[i][0] = i;
  for (let j = 0; j < cols; j += 1) matrix[0][j] = j;
  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
}

function buildPlaces(): Place[] {
  const map = new Map<string, Place>();

  for (const profile of countryProfiles) {
    const countryTokens = profile.aliases
      .filter((alias) => isCountryAlias(profile.id, profile.name, alias))
      .map(normalize);

    const cityAliases = profile.aliases.filter(
      (alias) => !isCountryAlias(profile.id, profile.name, alias)
    );

    for (const alias of cityAliases) {
      const city = titleCase(alias);
      const id = `${profile.id}:${normalize(alias)}`;
      if (map.has(id)) continue;

      const tokens = [
        normalize(city),
        normalize(alias),
        normalize(profile.name),
        normalize(profile.id),
        ...countryTokens,
      ].filter(Boolean);

      map.set(id, {
        id,
        city,
        country: profile.name,
        countryId: profile.id,
        label: `${city}, ${profile.name}`,
        tokens: Array.from(new Set(tokens)),
      });
    }
  }

  return Array.from(map.values()).sort((a, b) =>
    a.label.localeCompare(b.label)
  );
}

export const places: Place[] = buildPlaces();

function scorePlace(query: string, place: Place): number {
  const q = normalize(query);
  if (!q) return 0;

  const city = normalize(place.city);
  const country = normalize(place.country);
  const label = normalize(place.label);
  const parts = q.split(" ").filter(Boolean);

  let score = 0;

  if (label === q) score = Math.max(score, 120);
  if (city === q) score = Math.max(score, 110);
  if (city.startsWith(q)) score = Math.max(score, 95);
  if (city.includes(q)) score = Math.max(score, 80);
  if (country.startsWith(q)) score = Math.max(score, 70);
  if (country.includes(q)) score = Math.max(score, 55);
  if (label.includes(q)) score = Math.max(score, 60);

  for (const token of place.tokens) {
    if (token === q) score = Math.max(score, 100);
    if (token.startsWith(q)) score = Math.max(score, 88);
    if (token.includes(q)) score = Math.max(score, 65);

    if (q.length >= 3 && token.length >= 3) {
      const dist = levenshtein(q, token);
      const allowed = q.length <= 4 ? 1 : 2;
      if (dist > 0 && dist <= allowed) {
        score = Math.max(score, 72 - dist * 8);
      }
    }
  }

  // "milan italy" / "london uk"
  if (parts.length > 1) {
    const cityPart = parts[0];
    const rest = parts.slice(1).join(" ");
    const cityHit =
      city.startsWith(cityPart) ||
      levenshtein(cityPart, city) <= (cityPart.length <= 4 ? 1 : 2);
    const countryHit =
      country.includes(rest) ||
      place.tokens.some((t) => t === rest || t.startsWith(rest));
    if (cityHit && countryHit) score = Math.max(score, 105);
  }

  return score;
}

export function searchPlaces(query: string, limit = 8): Place[] {
  const q = normalize(query);
  if (!q || q.length < 1) return [];

  return places
    .map((place) => ({ place, score: scorePlace(q, place) }))
    .filter((row) => row.score >= 50)
    .sort((a, b) => b.score - a.score || a.place.label.localeCompare(b.place.label))
    .slice(0, limit)
    .map((row) => row.place);
}

export function resolvePlace(city: string, country: string): Place | null {
  const cityQ = normalize(city);
  const countryQ = normalize(country);
  if (!cityQ && !countryQ) return null;

  if (cityQ && countryQ) {
    const exact = places.find(
      (p) =>
        normalize(p.city) === cityQ &&
        (normalize(p.country) === countryQ || p.countryId === countryQ)
    );
    if (exact) return exact;
  }

  const hits = searchPlaces([city, country].filter(Boolean).join(" "), 1);
  return hits[0] ?? null;
}

export function formatPlaceLabel(city: string, country: string) {
  const resolved = resolvePlace(city, country);
  if (resolved) return resolved.label;
  return [city, country].filter(Boolean).join(", ");
}
