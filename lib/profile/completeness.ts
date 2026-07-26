import type { JourneyIntent, Profile } from "@/lib/types";

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
  journeyIntent?: JourneyIntent;
}): MissingField[] {
  const missing: MissingField[] = [];
  const intent = input.journeyIntent || "continue_treatment";

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

  const hasHealthSignal =
    Boolean(input.conditions.trim()) ||
    Boolean(input.primaryConcern?.trim());

  // Rebuild-history can start with almost nothing clinical.
  // Other intents need at least a concern or condition.
  if (intent !== "rebuild_history" && !hasHealthSignal) {
    missing.push({
      key: "health",
      label:
        intent === "second_look"
          ? "What you want checked"
          : intent === "set_up_care"
            ? "What care you need"
            : "Your condition",
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
    journeyIntent: profile.journeyIntent,
  });
}

export const journeyIntentCopy: Record<
  JourneyIntent,
  { title: string; blurb: string; example: string }
> = {
  second_look: {
    title: "I need a check in my new city",
    blurb: "You already saw a doctor — bring the record and get a local review.",
    example: "Ultrasound follow-up, second opinion, “just to be sure”",
  },
  set_up_care: {
    title: "Help me set up care after I move",
    blurb: "Registration, clinics, and appointments that fit language and budget.",
    example: "Pregnancy care, GP registration, first local clinic",
  },
  rebuild_history: {
    title: "Help me piece my records together",
    blurb: "Fragmented vaccines, letters, and injuries — Transit organises them.",
    example: "Missing shots, old scans, incomplete files",
  },
  continue_treatment: {
    title: "I need treatment to continue without gaps",
    blurb:
      "Your agent asks for docs, prepares booking and handoff, and waits for your approval before any send.",
    example: "Chronic illness, specialty meds, specialist transfer",
  },
};
