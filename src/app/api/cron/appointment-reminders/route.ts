import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/send";
import { appointmentReminderEmail } from "@/lib/email/templates";

/**
 * Runs daily via Vercel Cron (see vercel.json). Finds confirmed PT
 * sessions happening tomorrow and emails a reminder. Does nothing until
 * RESEND_API_KEY is set.
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

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowIso = tomorrow.toISOString().slice(0, 10);

  const { data: events } = await admin
    .from("calendar_events")
    .select("id, user_id, title, event_date")
    .eq("event_type", "pt_session")
    .in("status", ["confirmed", "pending"])
    .eq("event_date", tomorrowIso);

  let sent = 0;
  const results: string[] = [];

  for (const event of events ?? []) {
    const { data: userRes } = await admin.auth.admin.getUserById(event.user_id);
    const email = userRes.user?.email;
    if (!email) continue;

    const error = await sendEmail({
      to: email,
      subject: "Session reminder — tomorrow",
      html: appointmentReminderEmail(event.title ?? "PT Session", event.event_date),
    });
    if (!error) sent += 1;
    else results.push(`${email}: ${error}`);
  }

  return NextResponse.json({ sent, checked: events?.length ?? 0, note: results[0] });
}
