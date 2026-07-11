import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function computeRenewalDate(billingPeriod: string): { startsAt: string; endsAt: string } {
  const start = new Date();
  const end = new Date(start);
  if (billingPeriod === "quarterly") end.setMonth(end.getMonth() + 3);
  else if (billingPeriod === "annual") end.setFullYear(end.getFullYear() + 1);
  else end.setMonth(end.getMonth() + 1);
  return { startsAt: start.toISOString().slice(0, 10), endsAt: end.toISOString().slice(0, 10) };
}

export async function POST(request: Request) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return NextResponse.json({ error: "Payments aren't configured" }, { status: 503 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { orderId, paymentId, signature } = await request.json();

  // Verify the payment is genuinely from Razorpay, not a forged client
  // request — this HMAC check is the whole reason verification happens
  // server-side rather than trusting the browser's "payment succeeded" call.
  const expectedSignature = createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  if (expectedSignature !== signature) {
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY not configured" }, { status: 500 });
  }

  const { data: txn } = await admin
    .from("transactions")
    .select("id, plan_id, user_id")
    .eq("razorpay_order_id", orderId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!txn) {
    return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
  }

  await admin
    .from("transactions")
    .update({ razorpay_payment_id: paymentId, status: "paid" })
    .eq("id", txn.id);

  const { data: plan } = await admin
    .from("subscription_plans")
    .select("billing_period")
    .eq("id", txn.plan_id)
    .maybeSingle();
  const { startsAt, endsAt } = computeRenewalDate(plan?.billing_period ?? "monthly");

  await admin.from("user_subscriptions").insert({
    user_id: user.id,
    plan_id: txn.plan_id,
    status: "active",
    starts_at: startsAt,
    ends_at: endsAt,
  });

  return NextResponse.json({ success: true });
}
