import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Razorpay's own server-to-server webhook — a reliability backup for
 * /api/razorpay/verify. That route only fires if the user's browser stays
 * open long enough to complete the client-side callback; this webhook
 * fires from Razorpay's servers regardless, so a payment still gets
 * recorded even if the browser closes right after paying.
 *
 * Configure this URL in Razorpay Dashboard → Settings → Webhooks:
 * https://fitwid.fit/api/webhooks/razorpay
 * Subscribe to the "payment.captured" event, and set RAZORPAY_WEBHOOK_SECRET
 * to whatever secret you set there.
 */
export async function POST(request: Request) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  const expected = createHmac("sha256", webhookSecret).update(rawBody).digest("hex");
  if (signature !== expected) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);
  if (event.event !== "payment.captured") {
    return NextResponse.json({ received: true }); // acknowledge, but nothing to do
  }

  const payment = event.payload.payment.entity;
  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY not configured" }, { status: 500 });
  }

  const { data: txn } = await admin
    .from("transactions")
    .select("id, status, user_id, plan_id")
    .eq("razorpay_order_id", payment.order_id)
    .maybeSingle();

  // Already processed by the client-side verify route — avoid double-crediting.
  if (!txn || txn.status === "paid") {
    return NextResponse.json({ received: true });
  }

  await admin
    .from("transactions")
    .update({ razorpay_payment_id: payment.id, status: "paid" })
    .eq("id", txn.id);

  const { data: existingActive } = await admin
    .from("user_subscriptions")
    .select("id")
    .eq("user_id", txn.user_id)
    .eq("plan_id", txn.plan_id)
    .eq("status", "active");

  if (!existingActive || existingActive.length === 0) {
    const { data: plan } = await admin
      .from("subscription_plans")
      .select("billing_period")
      .eq("id", txn.plan_id)
      .maybeSingle();
    const start = new Date();
    const end = new Date(start);
    if (plan?.billing_period === "quarterly") end.setMonth(end.getMonth() + 3);
    else if (plan?.billing_period === "annual") end.setFullYear(end.getFullYear() + 1);
    else end.setMonth(end.getMonth() + 1);

    await admin.from("user_subscriptions").insert({
      user_id: txn.user_id,
      plan_id: txn.plan_id,
      status: "active",
      starts_at: start.toISOString().slice(0, 10),
      ends_at: end.toISOString().slice(0, 10),
    });
  }

  return NextResponse.json({ received: true });
}
