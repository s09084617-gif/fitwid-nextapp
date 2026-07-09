"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardCheck } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getOnboardingStatus } from "@/lib/db/user-data";

export function OnboardingBanner() {
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    getOnboardingStatus().then((status) => {
      setNeedsOnboarding(!status?.completedAt);
      setMounted(true);
    });
  }, []);

  if (!mounted || !needsOnboarding) return null;

  return (
    <Card className="border-gold/40 bg-gold/5 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0">
          <ClipboardCheck size={18} className="text-gold" />
        </div>
        <div>
          <Badge variant="gold" className="mb-1">
            3 minutes
          </Badge>
          <CardTitle className="text-base">Finish setting up your account</CardTitle>
          <CardDescription>
            Goal setting, lifestyle questions, and a quick safety screening.
          </CardDescription>
        </div>
      </div>
      <Link
        href="/dashboard/onboarding"
        className={buttonVariants({ variant: "primary", size: "sm", className: "shrink-0 w-full sm:w-auto" })}
      >
        Complete Onboarding
      </Link>
    </Card>
  );
}
