"use client";

import { useEffect, useState, useTransition } from "react";
import { Trash2, Plus } from "lucide-react";
import { Card, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  listPlans, upsertPlan, deletePlan,
  listCoupons, addCoupon, deleteCoupon,
  listSubscriptionRequests, updateSubscriptionStatus,
  type Plan, type Coupon, type PendingSubscription,
} from "./actions";

export default function AdminSubscriptionsPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [requests, setRequests] = useState<PendingSubscription[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [newPlan, setNewPlan] = useState({ name: "", billingPeriod: "monthly" as Plan["billingPeriod"], priceInr: "" });
  const [newCoupon, setNewCoupon] = useState({ code: "", discountPercent: "" });

  function refreshAll() {
    Promise.all([listPlans(), listCoupons(), listSubscriptionRequests()]).then(([p, c, r]) => {
      setPlans(p);
      setCoupons(c);
      setRequests(r);
    });
  }

  useEffect(() => {
    refreshAll();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration guard, same pattern used elsewhere
    setMounted(true);
  }, []);

  function handleAddPlan() {
    if (!newPlan.name || !newPlan.priceInr) return;
    startTransition(async () => {
      await upsertPlan(
        { id: `plan_${Date.now()}`, name: newPlan.name, billingPeriod: newPlan.billingPeriod, priceInr: Number(newPlan.priceInr), active: true },
        plans.length + 1
      );
      setNewPlan({ name: "", billingPeriod: "monthly", priceInr: "" });
      refreshAll();
    });
  }

  function handleAddCoupon() {
    if (!newCoupon.code || !newCoupon.discountPercent) return;
    startTransition(async () => {
      await addCoupon(newCoupon.code, Number(newCoupon.discountPercent));
      setNewCoupon({ code: "", discountPercent: "" });
      refreshAll();
    });
  }

  if (!mounted) return <div className="h-48 rounded-lg bg-surface-2 animate-pulse" />;

  return (
    <div className="space-y-6">
      <Card>
        <Badge variant="warning" className="mb-3">Not Live Yet</Badge>
        <CardDescription>
          This manages plan/coupon data and subscription requests, but no
          real payment processing happens here — Razorpay isn&apos;t
          connected. Treat &ldquo;subscribe&rdquo; requests below as
          intent-to-pay; collect payment manually and mark it Active once
          confirmed.
        </CardDescription>
      </Card>

      <Card>
        <Badge variant="crimson" className="mb-4">Plans</Badge>
        <div className="grid sm:grid-cols-4 gap-3 mb-4">
          <Input label="Name" value={newPlan.name} onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })} placeholder="Coached" />
          <Select label="Period" value={newPlan.billingPeriod} onChange={(e) => setNewPlan({ ...newPlan, billingPeriod: e.target.value as Plan["billingPeriod"] })}>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annual">Annual</option>
          </Select>
          <Input label="Price (₹)" type="number" value={newPlan.priceInr} onChange={(e) => setNewPlan({ ...newPlan, priceInr: e.target.value })} placeholder="7999" />
          <div className="flex items-end"><Button onClick={handleAddPlan} disabled={isPending} className="w-full"><Plus size={14} /> Add</Button></div>
        </div>
        <div className="space-y-2">
          {plans.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
              <span>{p.name} — ₹{p.priceInr}/{p.billingPeriod}</span>
              <button onClick={() => startTransition(async () => { await deletePlan(p.id); refreshAll(); })} className="text-muted hover:text-danger">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <Badge variant="gold" className="mb-4">Coupon Codes</Badge>
        <div className="grid sm:grid-cols-3 gap-3 mb-4">
          <Input label="Code" value={newCoupon.code} onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })} placeholder="WELCOME10" />
          <Input label="Discount %" type="number" value={newCoupon.discountPercent} onChange={(e) => setNewCoupon({ ...newCoupon, discountPercent: e.target.value })} placeholder="10" />
          <div className="flex items-end"><Button onClick={handleAddCoupon} disabled={isPending} className="w-full"><Plus size={14} /> Add</Button></div>
        </div>
        <div className="space-y-2">
          {coupons.map((c) => (
            <div key={c.code} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
              <span>{c.code} — {c.discountPercent}% off ({c.usesCount} uses)</span>
              <button onClick={() => startTransition(async () => { await deleteCoupon(c.code); refreshAll(); })} className="text-muted hover:text-danger">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <Badge variant="success" className="mb-4">Subscription Requests</Badge>
        {requests.length === 0 ? (
          <p className="text-sm text-muted">No requests yet.</p>
        ) : (
          <div className="space-y-2">
            {requests.map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
                <span>
                  {r.email} — {r.planName}{r.couponUsed ? ` (${r.couponUsed})` : ""}
                  {r.status === "active" && r.endsAt && ` · renews ${r.endsAt}`}
                </span>
                <Select value={r.status} onChange={(e) => startTransition(async () => { await updateSubscriptionStatus(r.id, e.target.value as "active" | "cancelled" | "pending"); refreshAll(); })}>
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
