"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTransitStore } from "@/lib/store/use-transit-store";

export default function ProfilePage() {
  const profile = useTransitStore((s) => s.profile);
  const conditions = useTransitStore((s) => s.conditions);
  const medications = useTransitStore((s) => s.medications);
  const allergies = useTransitStore((s) => s.allergies);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl">Profile</h1>
        <p className="mt-2 text-muted-foreground">{profile.fullName}</p>
      </div>

      <div className="space-y-3 rounded-2xl border border-border bg-card p-5 text-sm">
        <p>
          {profile.currentCity} → {profile.destinationCity}
        </p>
        <p>Move: {profile.moveDate || "Not set"}</p>
        <p>Concern: {profile.primaryConcern || "Not set"}</p>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Conditions</p>
        {conditions.length === 0 ? (
          <p className="text-sm">None yet</p>
        ) : (
          conditions.map((c) => (
            <p key={c.id} className="rounded-xl bg-muted px-3 py-2 text-sm">
              {c.name}
            </p>
          ))
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Medications</p>
        {medications.length === 0 ? (
          <p className="text-sm">None yet</p>
        ) : (
          medications.map((m) => (
            <p key={m.id} className="rounded-xl bg-muted px-3 py-2 text-sm">
              {m.name} {m.dosage}
            </p>
          ))
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Allergies</p>
        {allergies.length === 0 ? (
          <p className="text-sm">None yet</p>
        ) : (
          allergies.map((a) => (
            <p key={a.id} className="rounded-xl bg-muted px-3 py-2 text-sm">
              {a.substance}
            </p>
          ))
        )}
      </div>

      <Button asChild className="w-full">
        <Link href="/app/overview">Back to Home</Link>
      </Button>
    </div>
  );
}
