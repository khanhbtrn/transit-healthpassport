"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { StartExperience } from "@/components/onboarding/start-experience";
import { LoadingState } from "@/components/ui/loading-state";
import { useTransitStore } from "@/lib/store/use-transit-store";

function OnboardingGate() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const seedMariaJourney = useTransitStore((s) => s.seedMariaJourney);

  useEffect(() => {
    if (searchParams.get("demo") === "maria") {
      seedMariaJourney();
      router.replace("/app/overview");
    }
  }, [searchParams, seedMariaJourney, router]);

  return <StartExperience />;
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<LoadingState label="Preparing…" />}>
      <OnboardingGate />
    </Suspense>
  );
}
