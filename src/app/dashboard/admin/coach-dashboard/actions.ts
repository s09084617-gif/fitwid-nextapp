"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isAdminEmail(user?.email)) {
    throw new Error("Not authorized");
  }
}

export interface CoachDashboardData {
  activeClientsCount: number;
  newAssessmentsThisWeek: { email: string; date: string }[];
  pendingCheckIns: { email: string; lastActive: string | null; daysSince: number | null }[];
  mostEngaged: { email: string; workoutsLogged: number }[];
}

export async function getCoachDashboard(): Promise<CoachDashboardData> {
  await assertAdmin();
  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");

  const { data: usersData, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (error) throw new Error(error.message);
  const users = usersData.users;

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoIso = weekAgo.toISOString();

  const [assessmentsRes, workoutHistoryRes] = await Promise.all([
    admin
      .from("assessments")
      .select("user_id, created_at")
      .gte("created_at", weekAgoIso)
      .order("created_at", { ascending: false }),
    admin.from("workout_history").select("user_id, log_date"),
  ]);

  const emailById = new Map(users.map((u) => [u.id, u.email ?? "unknown"]));

  const newAssessmentsThisWeek = (assessmentsRes.data ?? []).map((a) => ({
    email: emailById.get(a.user_id) ?? "unknown",
    date: a.created_at,
  }));

  // Last activity per user = most recent workout_history log_date (a reasonable proxy for engagement)
  const lastActiveByUser = new Map<string, string>();
  for (const w of workoutHistoryRes.data ?? []) {
    const existing = lastActiveByUser.get(w.user_id);
    if (!existing || w.log_date > existing) {
      lastActiveByUser.set(w.user_id, w.log_date);
    }
  }

  const workoutCountByUser = new Map<string, number>();
  for (const w of workoutHistoryRes.data ?? []) {
    workoutCountByUser.set(w.user_id, (workoutCountByUser.get(w.user_id) ?? 0) + 1);
  }

  const today = new Date();
  const pendingCheckIns = users
    .map((u) => {
      const lastActive = lastActiveByUser.get(u.id) ?? null;
      const daysSince = lastActive
        ? Math.floor((today.getTime() - new Date(lastActive).getTime()) / (1000 * 60 * 60 * 24))
        : null;
      return { email: u.email ?? "unknown", lastActive, daysSince };
    })
    .filter((c) => c.daysSince === null || c.daysSince >= 7)
    .sort((a, b) => (b.daysSince ?? 999) - (a.daysSince ?? 999));

  const mostEngaged = users
    .map((u) => ({ email: u.email ?? "unknown", workoutsLogged: workoutCountByUser.get(u.id) ?? 0 }))
    .filter((c) => c.workoutsLogged > 0)
    .sort((a, b) => b.workoutsLogged - a.workoutsLogged)
    .slice(0, 10);

  return {
    activeClientsCount: users.length,
    newAssessmentsThisWeek,
    pendingCheckIns,
    mostEngaged,
  };
}
