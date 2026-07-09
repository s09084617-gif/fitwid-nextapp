"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";
import { logAuditEvent } from "@/lib/audit";

/** Only the owner (isAdminEmail allowlist) can manage other coaches. */
async function assertOwner(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isAdminEmail(user?.email)) throw new Error("Owner access only");
  return user!.email!;
}

export interface CoachInfo {
  userId: string;
  email: string;
  role: "owner" | "coach" | "assistant";
  clientCount: number;
}

export async function listCoaches(): Promise<CoachInfo[]> {
  await assertOwner();
  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");

  const [coachesRes, usersRes, assignmentsRes] = await Promise.all([
    admin.from("coaches").select("*"),
    admin.auth.admin.listUsers({ page: 1, perPage: 200 }),
    admin.from("client_assignments").select("assigned_coach_id"),
  ]);

  const emailById = new Map(usersRes.data?.users.map((u) => [u.id, u.email ?? "unknown"]));
  const countByCoach = new Map<string, number>();
  for (const a of assignmentsRes.data ?? []) {
    if (a.assigned_coach_id) {
      countByCoach.set(a.assigned_coach_id, (countByCoach.get(a.assigned_coach_id) ?? 0) + 1);
    }
  }

  return (coachesRes.data ?? []).map((c) => ({
    userId: c.user_id,
    email: emailById.get(c.user_id) ?? "unknown",
    role: c.role,
    clientCount: countByCoach.get(c.user_id) ?? 0,
  }));
}

export async function addCoachByEmail(email: string, role: "coach" | "assistant") {
  const actorEmail = await assertOwner();
  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");

  const { data } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  const user = data?.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  if (!user) throw new Error("No registered user found with that email — they need to sign up first.");

  await admin.from("coaches").upsert({ user_id: user.id, role });
  await logAuditEvent({
    actorEmail,
    action: "add_coach",
    targetType: "coach",
    targetId: user.id,
    details: { email, role },
  });
}

export async function removeCoach(userId: string) {
  const actorEmail = await assertOwner();
  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");
  await admin.from("coaches").delete().eq("user_id", userId);
  await logAuditEvent({
    actorEmail,
    action: "remove_coach",
    targetType: "coach",
    targetId: userId,
  });
}

export async function assignClientToCoach(clientUserId: string, coachUserId: string | null) {
  const actorEmail = await assertOwner();
  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");
  await admin.from("client_assignments").upsert({
    user_id: clientUserId,
    assigned_coach_id: coachUserId,
  });
  await logAuditEvent({
    actorEmail,
    action: "assign_client_to_coach",
    targetType: "client",
    targetId: clientUserId,
    details: { coachUserId },
  });
}
