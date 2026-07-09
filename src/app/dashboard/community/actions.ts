"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function maskEmail(email: string): string {
  const [name, domain] = email.split("@");
  if (!domain) return email;
  const visible = name.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(1, name.length - 2))}@${domain}`;
}

export interface LeaderboardEntry {
  displayName: string;
  workoutsLogged: number;
  isMe: boolean;
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const admin = createAdminClient();
  if (!admin) return [];

  const { data: usersData } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  const { data: workoutHistory } = await admin.from("workout_history").select("user_id");

  const countByUser = new Map<string, number>();
  for (const w of workoutHistory ?? []) {
    countByUser.set(w.user_id, (countByUser.get(w.user_id) ?? 0) + 1);
  }

  return (usersData?.users ?? [])
    .map((u) => ({
      displayName: maskEmail(u.email ?? "unknown"),
      workoutsLogged: countByUser.get(u.id) ?? 0,
      isMe: u.id === user?.id,
    }))
    .filter((e) => e.workoutsLogged > 0)
    .sort((a, b) => b.workoutsLogged - a.workoutsLogged)
    .slice(0, 20);
}
