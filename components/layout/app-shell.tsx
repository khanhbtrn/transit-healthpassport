"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppNav } from "@/components/layout/app-nav";
import { PageEnter } from "@/components/motion/page-enter";
import { useTransitStore } from "@/lib/store/use-transit-store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const onboarded = useTransitStore((s) => s.onboarded);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!onboarded && pathname.startsWith("/app")) {
      router.replace("/");
    }
  }, [hydrated, onboarded, pathname, router]);

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 transit-grid opacity-40" />
      <div className="pointer-events-none absolute inset-0 passport-guilloche opacity-40" />
      <AppNav />
      <main className="relative mx-auto max-w-3xl px-3 py-6 pb-[max(7.5rem,calc(5.5rem+env(safe-area-inset-bottom)))] sm:px-6 sm:py-8 sm:pb-12">
        <PageEnter key={pathname}>{children}</PageEnter>
      </main>
    </div>
  );
}
