import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/send";
import { renewalReminderEmail } from "@/lib/email/templates";

/**
 * Runs daily via Vercel Cron (see vercel.json). Finds active subscriptions
 * renewing in exactly 3 days and sends a reminder email. Does nothing
 * until RESEND_API_KEY is set — sendEmail() reports "not configured"
 * per-recipient without throwing.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ sent: 0, reason: "SUPABASE_SERVICE_ROLE_KEY not configured" });
  }

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 3);
  const targetDateIso = targetDate.toISOString().slice(0, 10);

  const [{ data: subs }, { data: plans }] = await Promise.all([
    admin
      .from("user_subscriptions")
      .select("id, user_id, plan_id, ends_at")
      .eq("status", "active")
      .eq("ends_at", targetDateIso),
    admin.from("subscription_plans").select("id, name"),
  ]);

  const planNameById = new Map((plans ?? []).map((p) => [p.id, p.name]));
  let sent = 0;
  const results: string[] = [];

  for (const sub of subs ?? []) {
    const { data: userRes } = await admin.auth.admin.getUserById(sub.user_id);
    const email = userRes.user?.email;
    if (!email) continue;

    const planName = planNameById.get(sub.plan_id) ?? "your plan";
    const error = await sendEmail({
      to: email,
      subject: `Your ${planName} renews in 3 days`,
      html: renewalReminderEmail(planName, 3),
    });
    if (!error) sent += 1;
    else results.push(`${email}: ${error}`);
  }

  return NextResponse.json({ sent, checked: subs?.length ?? 0, note: results[0] });
}
