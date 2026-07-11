"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
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

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function BillingPage() {
  const [plans, setPlans] = useState<SubscriptionPlanPublic[]>([]);
  const [current, setCurrent] = useState<{ planId: string; status: string } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [requested, setRequested] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [paymentsUnavailable, setPaymentsUnavailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paidSuccess, setPaidSuccess] = useState(false);

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

  async function handlePayNow(plan: SubscriptionPlanPublic) {
    setError(null);
    setPayingId(plan.id);

    const res = await fetch("/api/razorpay/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId: plan.id }),
    });
    const data = await res.json();

    if (res.status === 503) {
      // Razorpay isn't configured — fall back to the manual request flow.
      setPaymentsUnavailable(true);
      setPayingId(null);
      return;
    }
    if (!res.ok) {
      setError(data.error ?? "Couldn't start checkout. Try again.");
      setPayingId(null);
      return;
    }

    const razorpay = new window.Razorpay({
      key: data.keyId,
      order_id: data.orderId,
      amount: data.amount,
      currency: data.currency,
      name: "FitWid",
      description: data.planName,
      theme: { color: "#CC0000" },
      handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
        const verifyRes = await fetch("/api/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          }),
        });
        if (verifyRes.ok) {
          trackEvent("subscription_paid", { planId: plan.id });
          setPaidSuccess(true);
          setCurrent({ planId: plan.id, status: "active" });
        } else {
          setError("Payment verification failed — contact support with your payment ID if money was deducted.");
        }
        setPayingId(null);
      },
      modal: { ondismiss: () => setPayingId(null) },
    });
    razorpay.open();
  }

  if (!mounted) return <div className="h-48 rounded-lg bg-surface-2 animate-pulse" />;

  return (
    <div className="max-w-2xl space-y-6">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div>
        <h1 className="font-display text-3xl mb-2">Billing</h1>
        <p className="text-sm text-muted">
          {paymentsUnavailable
            ? "Online checkout isn't set up yet — requesting a plan notifies your coach to follow up directly."
            : "Choose a plan and pay securely — your subscription activates immediately."}
        </p>
      </div>

      {paidSuccess && (
        <Card className="border-success/40 bg-success/5">
          <Badge variant="success" className="mb-2">Payment Successful</Badge>
          <CardDescription>Your subscription is now active. Welcome aboard.</CardDescription>
        </Card>
      )}

      {current && !paidSuccess && (
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

      {error && <p className="text-sm text-danger">{error}</p>}

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
              {paymentsUnavailable ? (
                <Button className="w-full" onClick={() => handleRequest(p.id)} disabled={requested === p.id}>
                  {requested === p.id ? "Requested ✓" : "Request This Plan"}
                </Button>
              ) : (
                <Button className="w-full" onClick={() => handlePayNow(p)} disabled={payingId === p.id}>
                  {payingId === p.id ? "Opening checkout…" : "Pay Now"}
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
