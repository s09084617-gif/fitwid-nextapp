import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: "Payments aren't configured yet. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET." },
      { status: 503 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { planId, couponCode } = await request.json();
  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY not configured" }, { status: 500 });
  }

  const { data: plan } = await admin
    .from("subscription_plans")
    .select("id, name, price_inr, active")
    .eq("id", planId)
    .maybeSingle();
  if (!plan || !plan.active) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  let finalPriceInr = Number(plan.price_inr);
  let appliedCoupon: string | null = null;

  if (couponCode) {
    const { data: coupon } = await admin
      .from("coupon_codes")
      .select("*")
      .eq("code", couponCode.toUpperCase())
      .eq("active", true)
      .maybeSingle();
    if (coupon && (!coupon.expires_at || new Date(coupon.expires_at) >= new Date())) {
      if (coupon.discount_percent) {
        finalPriceInr = finalPriceInr * (1 - coupon.discount_percent / 100);
      } else if (coupon.discount_flat_inr) {
        finalPriceInr = Math.max(0, finalPriceInr - Number(coupon.discount_flat_inr));
      }
      appliedCoupon = coupon.code;
    }
  }

  const amountPaise = Math.round(finalPriceInr * 100); // Razorpay uses the smallest currency unit

  try {
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency: "INR",
        notes: { plan_id: plan.id, user_id: user.id, coupon: appliedCoupon ?? "" },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Razorpay order creation failed:", errText);
      return NextResponse.json({ error: "Couldn't create the payment order. Try again shortly." }, { status: 502 });
    }

    const order = await response.json();

    await admin.from("transactions").insert({
      user_id: user.id,
      plan_id: plan.id,
      razorpay_order_id: order.id,
      amount_inr: finalPriceInr,
      status: "created",
    });

    return NextResponse.json({
      orderId: order.id,
      amount: amountPaise,
      currency: "INR",
      keyId, // public key, safe to send to the client — the secret never leaves the server
      planName: plan.name,
    });
  } catch (err) {
    console.error("Razorpay order creation error:", err);
    return NextResponse.json({ error: "Couldn't create the payment order. Try again shortly." }, { status: 500 });
  }
}
