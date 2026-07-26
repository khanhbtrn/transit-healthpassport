"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransitStore } from "@/lib/store/use-transit-store";

export default function ProfilePage() {
  const profile = useTransitStore((s) => s.profile);
  const conditions = useTransitStore((s) => s.conditions);
  const medications = useTransitStore((s) => s.medications);
  const allergies = useTransitStore((s) => s.allergies);
  const updateProfile = useTransitStore((s) => s.updateProfile);

  const ukBound = /united kingdom|\buk\b|england|london/i.test(
    `${profile.destinationCountry} ${profile.destinationCity}`
  );

  const [area, setArea] = useState(profile.destinationArea || "");

  useEffect(() => {
    setArea(profile.destinationArea || "");
  }, [profile.destinationArea]);

  function saveArea() {
    const next = area.trim();
    updateProfile({ destinationArea: next });
    toast.success(
      next
        ? "UK area saved — GP pack can use this"
        : "Cleared UK area — still needed for Find a GP"
    );
  }

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

      {ukBound ? (
        <section className="space-y-3 rounded-2xl border border-accent/30 bg-accent-soft/20 p-5">
          <div>
            <p className="text-sm font-medium text-foreground">
              UK area for GP registration
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              NHS Find a GP needs a borough or postcode — not just “London”.
              Example: Camden, Hackney, or NW1. If you don’t have an address yet,
              write “after arrival”.
            </p>
          </div>
          <Input
            className="h-12"
            placeholder="e.g. Camden / NW1"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
          <Button type="button" onClick={saveArea} className="w-full sm:w-auto">
            Save area
          </Button>
          {profile.destinationArea ? (
            <p className="text-xs text-muted-foreground">
              Saved: {profile.destinationArea}
            </p>
          ) : null}
        </section>
      ) : null}

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
