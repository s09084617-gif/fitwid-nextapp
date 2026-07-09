"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics/events";
import {
  getSubscriptionPlans,
  getMySubscription,
  requestSubscription,
  type SubscriptionPlanPublic,
} from "@/lib/db/user-data";

export default function BillingPage() {
  const [plans, setPlans] = useState<SubscriptionPlanPublic[]>([]);
  const [current, setCurrent] = useState<{ planId: string; status: string } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [requested, setRequested] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getSubscriptionPlans(), getMySubscription()]).then(([p, c]) => {
      setPlans(p);
      setCurrent(c);
      setMounted(true);
    });
  }, []);

  async function handleRequest(planId: string) {
    await requestSubscription(planId);
    trackEvent("subscription_requested", { planId });
    setRequested(planId);
  }

  if (!mounted) return <div className="h-48 rounded-lg bg-surface-2 animate-pulse" />;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl mb-2">Billing</h1>
        <p className="text-sm text-muted">
          Choose a plan. This records your request — your coach will follow
          up to collect payment since online checkout isn&apos;t connected
          yet.
        </p>
      </div>

      {current && (
        <Card>
          <Badge variant={current.status === "active" ? "success" : "warning"} className="mb-2">
            Current Status: {current.status}
          </Badge>
          <CardDescription>
            {current.status === "pending"
              ? "Your coach hasn't confirmed this yet — message them on WhatsApp if it's been a while."
              : "You're all set."}
          </CardDescription>
        </Card>
      )}

      {plans.length === 0 ? (
        <Card>
          <CardDescription>No plans configured yet — check back soon.</CardDescription>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {plans.map((p) => (
            <Card key={p.id}>
              <CardTitle>{p.name}</CardTitle>
              <p className="font-display text-3xl text-gold mb-1">₹{p.priceInr}</p>
              <CardDescription className="mb-4">per {p.billingPeriod.replace("ly", "")}</CardDescription>
              <Button
                className="w-full"
                onClick={() => handleRequest(p.id)}
                disabled={requested === p.id}
              >
                {requested === p.id ? "Requested ✓" : "Request This Plan"}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
