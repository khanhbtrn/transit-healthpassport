import type { Profile } from "@/lib/types";

export type MissingField = {
  key: string;
  label: string;
};

/** Only fields required to start a useful Transit journey. */
export function getMissingProfileFields(input: {
  fullName: string;
  currentCity: string;
  currentCountry: string;
  destinationCity: string;
  destinationCountry: string;
  conditions: string;
  primaryConcern?: string;
}): MissingField[] {
  const missing: MissingField[] = [];

  if (!input.fullName.trim()) {
    missing.push({ key: "fullName", label: "Your name" });
  }
  if (!input.currentCity.trim() || !input.currentCountry.trim()) {
    missing.push({
      key: "origin",
      label: "Where you’re moving from",
    });
  }
  if (!input.destinationCity.trim() || !input.destinationCountry.trim()) {
    missing.push({
      key: "destination",
      label: "Where you’re moving to",
    });
  }
  if (!input.conditions.trim() && !input.primaryConcern?.trim()) {
    missing.push({
      key: "health",
      label: "Your condition",
    });
  }

  return missing;
}

export function getMissingFromProfile(profile: Profile, conditionsText = "") {
  return getMissingProfileFields({
    fullName: profile.fullName,
    currentCity: profile.currentCity,
    currentCountry: profile.currentCountry,
    destinationCity: profile.destinationCity,
    destinationCountry: profile.destinationCountry,
    conditions: conditionsText,
    primaryConcern: profile.primaryConcern,
  });
}
