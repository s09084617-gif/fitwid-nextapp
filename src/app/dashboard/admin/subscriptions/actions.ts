"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isAdminEmail(user?.email)) throw new Error("Not authorized");
}

export interface Plan {
  id: string;
  name: string;
  billingPeriod: "monthly" | "quarterly" | "annual";
  priceInr: number;
  active: boolean;
}

export async function listPlans(): Promise<Plan[]> {
  await assertAdmin();
  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");
  const { data } = await admin.from("subscription_plans").select("*").order("sort_order");
  return (data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    billingPeriod: p.billing_period,
    priceInr: Number(p.price_inr),
    active: p.active,
  }));
}

export async function upsertPlan(plan: Plan, sortOrder: number) {
  await assertAdmin();
  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");
  await admin.from("subscription_plans").upsert({
    id: plan.id,
    name: plan.name,
    billing_period: plan.billingPeriod,
    price_inr: plan.priceInr,
    active: plan.active,
    sort_order: sortOrder,
  });
}

export async function deletePlan(id: string) {
  await assertAdmin();
  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");
  await admin.from("subscription_plans").delete().eq("id", id);
}

export interface Coupon {
  code: string;
  discountPercent: number | null;
  active: boolean;
  usesCount: number;
}

export async function listCoupons(): Promise<Coupon[]> {
  await assertAdmin();
  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");
  const { data } = await admin.from("coupon_codes").select("*");
  return (data ?? []).map((c) => ({
    code: c.code,
    discountPercent: c.discount_percent,
    active: c.active,
    usesCount: c.uses_count,
  }));
}

export async function addCoupon(code: string, discountPercent: number) {
  await assertAdmin();
  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");
  await admin.from("coupon_codes").insert({ code: code.toUpperCase(), discount_percent: discountPercent });
}

export async function deleteCoupon(code: string) {
  await assertAdmin();
  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");
  await admin.from("coupon_codes").delete().eq("code", code);
}

export interface PendingSubscription {
  id: string;
  email: string;
  planName: string;
  status: string;
  couponUsed: string | null;
  createdAt: string;
}

export async function listSubscriptionRequests(): Promise<PendingSubscription[]> {
  await assertAdmin();
  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");

  const [subsRes, usersRes, plansRes] = await Promise.all([
    admin.from("user_subscriptions").select("*").order("created_at", { ascending: false }),
    admin.auth.admin.listUsers({ page: 1, perPage: 200 }),
    admin.from("subscription_plans").select("id, name"),
  ]);

  const emailById = new Map(usersRes.data?.users.map((u) => [u.id, u.email ?? "unknown"]));
  const planNameById = new Map((plansRes.data ?? []).map((p) => [p.id, p.name]));

  return (subsRes.data ?? []).map((s) => ({
    id: s.id,
    email: emailById.get(s.user_id) ?? "unknown",
    planName: planNameById.get(s.plan_id) ?? "Unknown plan",
    status: s.status,
    couponUsed: s.coupon_used,
    createdAt: s.created_at,
  }));
}

export async function updateSubscriptionStatus(id: string, status: "active" | "cancelled" | "pending") {
  await assertAdmin();
  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");
  await admin.from("user_subscriptions").update({ status }).eq("id", id);
}
