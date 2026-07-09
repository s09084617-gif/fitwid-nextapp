"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";
import { generateInsights, type Insight } from "@/lib/insights";

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isAdminEmail(user?.email)) throw new Error("Not authorized");
}

export interface ClientInsights {
  email: string;
  insights: Insight[];
}

export async function getAllClientInsights(): Promise<ClientInsights[]> {
  await assertAdmin();
  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");

  const [usersRes, weightRes, workoutRes, habitsRes] = await Promise.all([
    admin.auth.admin.listUsers({ page: 1, perPage: 200 }),
    admin.from("weight_logs").select("user_id, log_date, weight_kg"),
    admin.from("workout_history").select("user_id, log_date"),
    admin.from("habit_logs").select("user_id, log_date, sleep_hours, stress_level"),
  ]);

  const results: ClientInsights[] = [];

  for (const user of usersRes.data?.users ?? []) {
    const weightLog = (weightRes.data ?? [])
      .filter((w) => w.user_id === user.id)
      .map((w) => ({ date: w.log_date, weightKg: Number(w.weight_kg) }));
    const workoutDates = (workoutRes.data ?? [])
      .filter((w) => w.user_id === user.id)
      .map((w) => w.log_date);
    const habitLogs = (habitsRes.data ?? [])
      .filter((h) => h.user_id === user.id)
      .map((h) => ({ date: h.log_date, sleepHours: h.sleep_hours, stressLevel: h.stress_level }));

    const insights = generateInsights({ weightLog, workoutDates, habitLogs });
    if (insights.length > 0) {
      results.push({ email: user.email ?? "unknown", insights });
    }
  }

  return results.sort((a, b) => {
    const aScore = a.insights.filter((i) => i.severity === "attention").length;
    const bScore = b.insights.filter((i) => i.severity === "attention").length;
    return bScore - aScore;
  });
}
