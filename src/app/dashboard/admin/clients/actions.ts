"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail, getMyCoachRole } from "@/lib/admin";
import { logAuditEvent } from "@/lib/audit";

/** Returns the caller's user id if they're the owner or an added coach;
 * throws otherwise. Non-owner coaches get client lists scoped to their
 * own assigned clients only (enforced in listClients below). */
async function assertAdminOrCoach(): Promise<{ userId: string; email: string; isOwner: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isOwner = isAdminEmail(user?.email);
  if (isOwner) return { userId: user!.id, email: user!.email!, isOwner: true };
  const role = await getMyCoachRole(user?.id);
  if (!role) throw new Error("Not authorized");
  return { userId: user!.id, email: user!.email!, isOwner: false };
}

export interface ClientSummary {
  id: string;
  email: string;
  joined: string;
  lastSignIn: string | null;
}

export async function listClients(): Promise<ClientSummary[]> {
  const { userId, isOwner } = await assertAdminOrCoach();
  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");

  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (error) throw new Error(error.message);

  let allowedIds: Set<string> | null = null;
  if (!isOwner) {
    const { data: assignments } = await admin
      .from("client_assignments")
      .select("user_id")
      .eq("assigned_coach_id", userId);
    allowedIds = new Set((assignments ?? []).map((a) => a.user_id));
  }

  return data.users
    .filter((u) => !allowedIds || allowedIds.has(u.id))
    .map((u) => ({
      id: u.id,
      email: u.email ?? "—",
      joined: u.created_at,
      lastSignIn: u.last_sign_in_at ?? null,
    }))
    .sort((a, b) => new Date(b.joined).getTime() - new Date(a.joined).getTime());
}

export interface ClientProgress {
  latestWeightKg: number | null;
  weightEntryCount: number;
  latestBodyFat: number | null;
  latestFitnessScore: number | null;
  assessmentCount: number;
  workoutsLoggedCount: number;
  savedWorkoutsCount: number;
  savedMealPlansCount: number;
  measurementsCount: number;
  prCount: number;
}

export async function getClientProgress(userId: string): Promise<ClientProgress> {
  await assertAdminOrCoach();
  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");

  const [weightLogs, assessments, workoutHistory, savedWorkouts, savedMealPlans, measurements, prs] =
    await Promise.all([
      admin.from("weight_logs").select("weight_kg, log_date").eq("user_id", userId).order("log_date", { ascending: false }),
      admin.from("assessments").select("result, created_at").eq("user_id", userId).order("created_at", { ascending: false }),
      admin.from("workout_history").select("id", { count: "exact", head: true }).eq("user_id", userId),
      admin.from("saved_workouts").select("id", { count: "exact", head: true }).eq("user_id", userId),
      admin.from("saved_meal_plans").select("id", { count: "exact", head: true }).eq("user_id", userId),
      admin.from("measurements").select("id", { count: "exact", head: true }).eq("user_id", userId),
      admin.from("personal_records").select("id", { count: "exact", head: true }).eq("user_id", userId),
    ]);

  const latestAssessment = assessments.data?.[0];

  return {
    latestWeightKg: weightLogs.data?.[0]?.weight_kg ? Number(weightLogs.data[0].weight_kg) : null,
    weightEntryCount: weightLogs.data?.length ?? 0,
    latestBodyFat: latestAssessment?.result?.bodyFatPercent ?? null,
    latestFitnessScore: latestAssessment?.result?.fitnessScore ?? null,
    assessmentCount: assessments.data?.length ?? 0,
    workoutsLoggedCount: workoutHistory.count ?? 0,
    savedWorkoutsCount: savedWorkouts.count ?? 0,
    savedMealPlansCount: savedMealPlans.count ?? 0,
    measurementsCount: measurements.count ?? 0,
    prCount: prs.count ?? 0,
  };
}

export interface ClientAssignmentAdmin {
  assignedProgram: string;
  coachNotes: string;
  phoneNumber: string | null;
}

export async function getClientAssignment(userId: string): Promise<ClientAssignmentAdmin> {
  await assertAdminOrCoach();
  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");

  const [assignmentRes, onboardingRes] = await Promise.all([
    admin.from("client_assignments").select("assigned_program, coach_notes").eq("user_id", userId).maybeSingle(),
    admin.from("onboarding_responses").select("phone_number").eq("user_id", userId).maybeSingle(),
  ]);

  return {
    assignedProgram: assignmentRes.data?.assigned_program ?? "",
    coachNotes: assignmentRes.data?.coach_notes ?? "",
    phoneNumber: onboardingRes.data?.phone_number ?? null,
  };
}

export async function upsertClientAssignment(
  userId: string,
  assignedProgram: string,
  coachNotes: string
): Promise<void> {
  const { email } = await assertAdminOrCoach();
  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");

  await admin.from("client_assignments").upsert({
    user_id: userId,
    assigned_program: assignedProgram || null,
    coach_notes: coachNotes || null,
    updated_at: new Date().toISOString(),
  });
  await logAuditEvent({
    actorEmail: email,
    action: "update_client_assignment",
    targetType: "client",
    targetId: userId,
    details: { assignedProgram, coachNotesChanged: true },
  });
}

export interface ClientExportData {
  email: string;
  weightLogs: { date: string; weightKg: number }[];
  measurements: Record<string, unknown>[];
  workoutHistory: Record<string, unknown>[];
  personalRecords: Record<string, unknown>[];
}

export async function getClientExportData(userId: string): Promise<ClientExportData> {
  await assertAdminOrCoach();
  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");

  const [userRes, weightLogs, measurements, workoutHistory, prs] = await Promise.all([
    admin.auth.admin.getUserById(userId),
    admin.from("weight_logs").select("log_date, weight_kg").eq("user_id", userId).order("log_date"),
    admin.from("measurements").select("*").eq("user_id", userId).order("log_date"),
    admin.from("workout_history").select("*").eq("user_id", userId).order("log_date"),
    admin.from("personal_records").select("*").eq("user_id", userId).order("log_date"),
  ]);

  return {
    email: userRes.data.user?.email ?? "unknown",
    weightLogs: (weightLogs.data ?? []).map((w) => ({ date: w.log_date, weightKg: Number(w.weight_kg) })),
    measurements: measurements.data ?? [],
    workoutHistory: workoutHistory.data ?? [],
    personalRecords: prs.data ?? [],
  };
}
