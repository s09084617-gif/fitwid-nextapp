import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/send";
import { weeklyReportEmail } from "@/lib/email/templates";

/**
 * Intended to run weekly via Vercel Cron (see vercel.json). Sends a
 * progress summary to every user. Does nothing useful until
 * RESEND_API_KEY is set — sendEmail() will just report "not configured"
 * for every user without throwing.
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

  const { data: usersData } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoIso = weekAgo.toISOString().slice(0, 10);

  let sent = 0;
  const results: string[] = [];

  for (const user of usersData?.users ?? []) {
    if (!user.email) continue;
    const { data: workouts } = await admin
      .from("workout_history")
      .select("log_date")
      .eq("user_id", user.id)
      .gte("log_date", weekAgoIso);

    const { data: weights } = await admin
      .from("weight_logs")
      .select("weight_kg, log_date")
      .eq("user_id", user.id)
      .gte("log_date", weekAgoIso)
      .order("log_date", { ascending: true });

    const weightChangeKg =
      weights && weights.length >= 2
        ? Math.round((Number(weights[weights.length - 1].weight_kg) - Number(weights[0].weight_kg)) * 10) / 10
        : null;

    const error = await sendEmail({
      to: user.email,
      subject: "Your FitWid Weekly Report",
      html: weeklyReportEmail({ workouts: workouts?.length ?? 0, weightChangeKg }),
    });
    if (!error) sent += 1;
    else results.push(`${user.email}: ${error}`);
  }

  return NextResponse.json({ sent, total: usersData?.users.length ?? 0, note: results[0] });
}
