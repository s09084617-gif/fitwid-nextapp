"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";

async function assertOwner() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isAdminEmail(user?.email)) throw new Error("Owner access only");
}

const BACKUP_TABLES = [
  "programs", "custom_exercises", "weight_logs", "assessments",
  "saved_workouts", "saved_meal_plans", "measurements", "workout_history",
  "personal_records", "client_assignments", "onboarding_responses",
  "habit_logs", "calendar_events", "success_stories", "subscription_plans",
  "user_subscriptions", "coaches",
];

export async function exportAllData(): Promise<string> {
  await assertOwner();
  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");

  const dump: Record<string, unknown> = { exportedAt: new Date().toISOString() };
  for (const table of BACKUP_TABLES) {
    const { data, error } = await admin.from(table).select("*");
    dump[table] = error ? { error: error.message } : data;
  }
  return JSON.stringify(dump, null, 2);
}
