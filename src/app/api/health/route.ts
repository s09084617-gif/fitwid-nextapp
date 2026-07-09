import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Basic health check for uptime monitoring (e.g. UptimeRobot, Vercel
 * Cron, or any HTTP-based monitor). Checks that the app responds and
 * that the database is reachable — does not check third-party services
 * (Anthropic, Resend) since those failing shouldn't mark the whole app down.
 */
export async function GET() {
  const admin = createAdminClient();
  let dbOk = false;

  if (admin) {
    try {
      const { error } = await admin.from("programs").select("id", { head: true, count: "exact" }).limit(1);
      dbOk = !error;
    } catch {
      dbOk = false;
    }
  }

  const status = dbOk ? "ok" : "degraded";
  return NextResponse.json(
    { status, database: dbOk ? "ok" : "unreachable", timestamp: new Date().toISOString() },
    { status: dbOk ? 200 : 503 }
  );
}
