"use client";

import { createClient } from "@/lib/supabase/client";
import type { AssessmentResult } from "@/lib/assessment";
import type { WorkoutPlan } from "@/lib/workout-generator";
import type { MealPlan } from "@/lib/meal-plan-generator";

export interface WeightEntry {
  date: string;
  weightKg: number;
}

export interface StoredAssessment {
  result: AssessmentResult;
  weightKg: number;
  savedAt: string;
}

export interface MeasurementEntry {
  id: string;
  date: string;
  waistCm?: number;
  chestCm?: number;
  hipsCm?: number;
  bicepsCm?: number;
  thighsCm?: number;
}

export interface WorkoutHistoryEntry {
  id: string;
  date: string;
  title: string;
  durationMinutes?: number;
  notes?: string;
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

async function requireUserId(): Promise<string | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

// --- Weight Log ---

export async function getWeightLog(): Promise<WeightEntry[]> {
  const userId = await requireUserId();
  if (!userId) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("weight_logs")
    .select("log_date, weight_kg")
    .eq("user_id", userId)
    .order("log_date", { ascending: true });
  return (data ?? []).map((r) => ({ date: r.log_date, weightKg: Number(r.weight_kg) }));
}

export async function addWeightEntry(
  weightKg: number,
  date = todayISO()
): Promise<WeightEntry[]> {
  const userId = await requireUserId();
  if (!userId) return [];
  const supabase = createClient();
  await supabase
    .from("weight_logs")
    .upsert(
      { user_id: userId, log_date: date, weight_kg: weightKg },
      { onConflict: "user_id,log_date" }
    );
  return getWeightLog();
}

export async function deleteWeightEntry(date: string): Promise<WeightEntry[]> {
  const userId = await requireUserId();
  if (!userId) return [];
  const supabase = createClient();
  await supabase
    .from("weight_logs")
    .delete()
    .eq("user_id", userId)
    .eq("log_date", date);
  return getWeightLog();
}

// --- Assessments ---

export async function getLastAssessment(): Promise<StoredAssessment | null> {
  const userId = await requireUserId();
  if (!userId) return null;
  const supabase = createClient();
  const { data } = await supabase
    .from("assessments")
    .select("result, weight_kg, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!data) return null;
  return {
    result: data.result as AssessmentResult,
    weightKg: Number(data.weight_kg),
    savedAt: data.created_at,
  };
}

export async function saveLastAssessment(
  result: AssessmentResult,
  weightKg: number
): Promise<void> {
  const userId = await requireUserId();
  if (!userId) return;
  const supabase = createClient();
  await supabase.from("assessments").insert({
    user_id: userId,
    result,
    weight_kg: weightKg,
  });
  await addWeightEntry(weightKg);
}

/** Full assessment history (not just the latest) — used for body fat % trend over time. */
export async function getAssessmentHistory(): Promise<StoredAssessment[]> {
  const userId = await requireUserId();
  if (!userId) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("assessments")
    .select("result, weight_kg, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });
  return (data ?? []).map((r) => ({
    result: r.result as AssessmentResult,
    weightKg: Number(r.weight_kg),
    savedAt: r.created_at,
  }));
}

// --- Saved Workouts ---

export async function getSavedWorkouts(): Promise<WorkoutPlan[]> {
  const userId = await requireUserId();
  if (!userId) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("saved_workouts")
    .select("id, title, filters, exercises, estimated_minutes, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    filters: r.filters,
    exercises: r.exercises,
    estimatedMinutes: r.estimated_minutes,
    createdAt: r.created_at,
  })) as WorkoutPlan[];
}

export async function saveWorkout(plan: WorkoutPlan): Promise<WorkoutPlan[]> {
  const userId = await requireUserId();
  if (!userId) return [];
  const supabase = createClient();
  await supabase.from("saved_workouts").insert({
    id: plan.id,
    user_id: userId,
    title: plan.title,
    filters: plan.filters,
    exercises: plan.exercises,
    estimated_minutes: plan.estimatedMinutes,
  });
  return getSavedWorkouts();
}

export async function deleteWorkout(id: string): Promise<WorkoutPlan[]> {
  const userId = await requireUserId();
  if (!userId) return [];
  const supabase = createClient();
  await supabase.from("saved_workouts").delete().eq("user_id", userId).eq("id", id);
  return getSavedWorkouts();
}

// --- Saved Meal Plans ---

export async function getSavedMealPlans(): Promise<MealPlan[]> {
  const userId = await requireUserId();
  if (!userId) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("saved_meal_plans")
    .select("id, diet_tag, targets, meals, totals, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data ?? []).map((r) => ({
    id: r.id,
    dietTag: r.diet_tag,
    targets: r.targets,
    meals: r.meals,
    totals: r.totals,
    createdAt: r.created_at,
  })) as MealPlan[];
}

export async function saveMealPlan(plan: MealPlan): Promise<MealPlan[]> {
  const userId = await requireUserId();
  if (!userId) return [];
  const supabase = createClient();
  await supabase.from("saved_meal_plans").insert({
    id: plan.id,
    user_id: userId,
    diet_tag: plan.dietTag,
    targets: plan.targets,
    meals: plan.meals,
    totals: plan.totals,
  });
  return getSavedMealPlans();
}

export async function deleteMealPlan(id: string): Promise<MealPlan[]> {
  const userId = await requireUserId();
  if (!userId) return [];
  const supabase = createClient();
  await supabase.from("saved_meal_plans").delete().eq("user_id", userId).eq("id", id);
  return getSavedMealPlans();
}

// --- Measurements ---

export async function getMeasurements(): Promise<MeasurementEntry[]> {
  const userId = await requireUserId();
  if (!userId) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("measurements")
    .select("id, log_date, waist_cm, chest_cm, hips_cm, biceps_cm, thighs_cm")
    .eq("user_id", userId)
    .order("log_date", { ascending: true });
  return (data ?? []).map((r) => ({
    id: r.id,
    date: r.log_date,
    waistCm: r.waist_cm ?? undefined,
    chestCm: r.chest_cm ?? undefined,
    hipsCm: r.hips_cm ?? undefined,
    bicepsCm: r.biceps_cm ?? undefined,
    thighsCm: r.thighs_cm ?? undefined,
  }));
}

export async function addMeasurement(
  entry: Omit<MeasurementEntry, "id" | "date"> & { date?: string }
): Promise<MeasurementEntry[]> {
  const userId = await requireUserId();
  if (!userId) return [];
  const supabase = createClient();
  const date = entry.date ?? todayISO();
  await supabase.from("measurements").upsert(
    {
      user_id: userId,
      log_date: date,
      waist_cm: entry.waistCm ?? null,
      chest_cm: entry.chestCm ?? null,
      hips_cm: entry.hipsCm ?? null,
      biceps_cm: entry.bicepsCm ?? null,
      thighs_cm: entry.thighsCm ?? null,
    },
    { onConflict: "user_id,log_date" }
  );
  return getMeasurements();
}

export async function deleteMeasurement(id: string): Promise<MeasurementEntry[]> {
  const userId = await requireUserId();
  if (!userId) return [];
  const supabase = createClient();
  await supabase.from("measurements").delete().eq("user_id", userId).eq("id", id);
  return getMeasurements();
}

// --- Workout History ---

export async function getWorkoutHistory(): Promise<WorkoutHistoryEntry[]> {
  const userId = await requireUserId();
  if (!userId) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("workout_history")
    .select("id, log_date, title, duration_minutes, notes")
    .eq("user_id", userId)
    .order("log_date", { ascending: false });
  return (data ?? []).map((r) => ({
    id: r.id,
    date: r.log_date,
    title: r.title,
    durationMinutes: r.duration_minutes ?? undefined,
    notes: r.notes ?? undefined,
  }));
}

export async function addWorkoutHistoryEntry(
  entry: Omit<WorkoutHistoryEntry, "id" | "date"> & { date?: string }
): Promise<WorkoutHistoryEntry[]> {
  const userId = await requireUserId();
  if (!userId) return [];
  const supabase = createClient();
  await supabase.from("workout_history").insert({
    user_id: userId,
    log_date: entry.date ?? todayISO(),
    title: entry.title,
    duration_minutes: entry.durationMinutes ?? null,
    notes: entry.notes ?? null,
  });
  return getWorkoutHistory();
}

export async function deleteWorkoutHistoryEntry(id: string): Promise<WorkoutHistoryEntry[]> {
  const userId = await requireUserId();
  if (!userId) return [];
  const supabase = createClient();
  await supabase.from("workout_history").delete().eq("user_id", userId).eq("id", id);
  return getWorkoutHistory();
}

// --- Personal Records ---

export interface PersonalRecord {
  id: string;
  exerciseName: string;
  weightKg?: number;
  reps?: number;
  date: string;
  notes?: string;
}

export async function getPersonalRecords(): Promise<PersonalRecord[]> {
  const userId = await requireUserId();
  if (!userId) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("personal_records")
    .select("id, exercise_name, weight_kg, reps, log_date, notes")
    .eq("user_id", userId)
    .order("log_date", { ascending: false });
  return (data ?? []).map((r) => ({
    id: r.id,
    exerciseName: r.exercise_name,
    weightKg: r.weight_kg ? Number(r.weight_kg) : undefined,
    reps: r.reps ?? undefined,
    date: r.log_date,
    notes: r.notes ?? undefined,
  }));
}

export async function addPersonalRecord(
  record: Omit<PersonalRecord, "id" | "date"> & { date?: string }
): Promise<PersonalRecord[]> {
  const userId = await requireUserId();
  if (!userId) return [];
  const supabase = createClient();
  await supabase.from("personal_records").insert({
    user_id: userId,
    exercise_name: record.exerciseName,
    weight_kg: record.weightKg ?? null,
    reps: record.reps ?? null,
    log_date: record.date ?? todayISO(),
    notes: record.notes ?? null,
  });
  return getPersonalRecords();
}

export async function deletePersonalRecord(id: string): Promise<PersonalRecord[]> {
  const userId = await requireUserId();
  if (!userId) return [];
  const supabase = createClient();
  await supabase.from("personal_records").delete().eq("user_id", userId).eq("id", id);
  return getPersonalRecords();
}

// --- Client Assignment (read-only for clients; coaches write via admin panel) ---

export interface ClientAssignment {
  assignedProgram: string | null;
  coachNotes: string | null;
  updatedAt: string | null;
}

export async function getMyAssignment(): Promise<ClientAssignment | null> {
  const userId = await requireUserId();
  if (!userId) return null;
  const supabase = createClient();
  const { data } = await supabase
    .from("client_assignments")
    .select("assigned_program, coach_notes, updated_at")
    .eq("user_id", userId)
    .maybeSingle();
  if (!data) return null;
  return {
    assignedProgram: data.assigned_program,
    coachNotes: data.coach_notes,
    updatedAt: data.updated_at,
  };
}

// --- Onboarding ---

export interface ParqAnswers {
  heartCondition: boolean;
  chestPainActivity: boolean;
  chestPainRest: boolean;
  dizziness: boolean;
  boneJoint: boolean;
  bloodPressureMeds: boolean;
  otherReason: boolean;
}

export interface OnboardingResponse {
  goal?: string;
  activityLevel?: string;
  sleepHours?: number;
  stressLevel?: string;
  dietPreference?: string;
  consentAccepted: boolean;
  parqAnswers?: ParqAnswers;
  parqFlagged: boolean;
  completedAt: string | null;
}

export async function getOnboardingStatus(): Promise<OnboardingResponse | null> {
  const userId = await requireUserId();
  if (!userId) return null;
  const supabase = createClient();
  const { data } = await supabase
    .from("onboarding_responses")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (!data) return null;
  return {
    goal: data.goal ?? undefined,
    activityLevel: data.activity_level ?? undefined,
    sleepHours: data.sleep_hours ?? undefined,
    stressLevel: data.stress_level ?? undefined,
    dietPreference: data.diet_preference ?? undefined,
    consentAccepted: data.consent_accepted,
    parqAnswers: data.parq_answers ?? undefined,
    parqFlagged: data.parq_flagged,
    completedAt: data.completed_at,
  };
}

export async function saveOnboardingResponse(input: {
  goal: string;
  activityLevel: string;
  sleepHours: number;
  stressLevel: string;
  dietPreference: string;
  consentAccepted: boolean;
  parqAnswers: ParqAnswers;
  parqFlagged: boolean;
}): Promise<void> {
  const userId = await requireUserId();
  if (!userId) return;
  const supabase = createClient();
  await supabase.from("onboarding_responses").upsert({
    user_id: userId,
    goal: input.goal,
    activity_level: input.activityLevel,
    sleep_hours: input.sleepHours,
    stress_level: input.stressLevel,
    diet_preference: input.dietPreference,
    consent_accepted: input.consentAccepted,
    consent_accepted_at: input.consentAccepted ? new Date().toISOString() : null,
    parq_answers: input.parqAnswers,
    parq_flagged: input.parqFlagged,
    completed_at: new Date().toISOString(),
  });
}

// --- Habit Tracker ---

export interface HabitLog {
  date: string;
  waterMl?: number;
  sleepHours?: number;
  steps?: number;
  proteinG?: number;
  workoutCompleted: boolean;
  meditationMinutes?: number;
}

export async function getHabitLogs(days = 14): Promise<HabitLog[]> {
  const userId = await requireUserId();
  if (!userId) return [];
  const supabase = createClient();
  const since = new Date();
  since.setDate(since.getDate() - days);
  const { data } = await supabase
    .from("habit_logs")
    .select("*")
    .eq("user_id", userId)
    .gte("log_date", since.toISOString().slice(0, 10))
    .order("log_date", { ascending: true });
  return (data ?? []).map((r) => ({
    date: r.log_date,
    waterMl: r.water_ml ?? undefined,
    sleepHours: r.sleep_hours ?? undefined,
    steps: r.steps ?? undefined,
    proteinG: r.protein_g ?? undefined,
    workoutCompleted: r.workout_completed,
    meditationMinutes: r.meditation_minutes ?? undefined,
  }));
}

export async function upsertHabitLog(
  entry: Partial<Omit<HabitLog, "date">> & { date?: string }
): Promise<HabitLog[]> {
  const userId = await requireUserId();
  if (!userId) return [];
  const supabase = createClient();
  const date = entry.date ?? todayISO();

  // Merge with any existing entry for today so partial updates
  // (e.g. just logging water) don't wipe out other fields.
  const { data: existing } = await supabase
    .from("habit_logs")
    .select("*")
    .eq("user_id", userId)
    .eq("log_date", date)
    .maybeSingle();

  await supabase.from("habit_logs").upsert({
    user_id: userId,
    log_date: date,
    water_ml: entry.waterMl ?? existing?.water_ml ?? null,
    sleep_hours: entry.sleepHours ?? existing?.sleep_hours ?? null,
    steps: entry.steps ?? existing?.steps ?? null,
    protein_g: entry.proteinG ?? existing?.protein_g ?? null,
    workout_completed: entry.workoutCompleted ?? existing?.workout_completed ?? false,
    meditation_minutes: entry.meditationMinutes ?? existing?.meditation_minutes ?? null,
    updated_at: new Date().toISOString(),
  });
  return getHabitLogs();
}

// --- Calendar & Scheduling ---

export interface CalendarEvent {
  id: string;
  date: string;
  type: "rest" | "workout" | "pt_session";
  title: string | null;
  notes: string | null;
  status: "confirmed" | "pending" | "cancelled";
}

export async function getCalendarEvents(
  fromDate?: string,
  toDate?: string
): Promise<CalendarEvent[]> {
  const userId = await requireUserId();
  if (!userId) return [];
  const supabase = createClient();
  let query = supabase.from("calendar_events").select("*").eq("user_id", userId);
  if (fromDate) query = query.gte("event_date", fromDate);
  if (toDate) query = query.lte("event_date", toDate);
  const { data } = await query.order("event_date", { ascending: true });
  return (data ?? []).map((r) => ({
    id: r.id,
    date: r.event_date,
    type: r.event_type,
    title: r.title,
    notes: r.notes,
    status: r.status,
  }));
}

export async function addCalendarEvent(entry: {
  date: string;
  type: CalendarEvent["type"];
  title?: string;
  notes?: string;
  status?: CalendarEvent["status"];
}): Promise<CalendarEvent[]> {
  const userId = await requireUserId();
  if (!userId) return [];
  const supabase = createClient();
  await supabase.from("calendar_events").insert({
    user_id: userId,
    event_date: entry.date,
    event_type: entry.type,
    title: entry.title ?? null,
    notes: entry.notes ?? null,
    status: entry.status ?? "confirmed",
  });
  return getCalendarEvents();
}

export async function deleteCalendarEvent(id: string): Promise<CalendarEvent[]> {
  const userId = await requireUserId();
  if (!userId) return [];
  const supabase = createClient();
  await supabase.from("calendar_events").delete().eq("user_id", userId).eq("id", id);
  return getCalendarEvents();
}

// --- Referral Program ---

function generateReferralCode(userId: string): string {
  return `FW-${userId.slice(0, 6).toUpperCase()}`;
}

export async function getMyReferralCode(): Promise<string | null> {
  const userId = await requireUserId();
  if (!userId) return null;
  const supabase = createClient();

  const { data: existing } = await supabase
    .from("referral_codes")
    .select("code")
    .eq("user_id", userId)
    .maybeSingle();
  if (existing) return existing.code;

  const code = generateReferralCode(userId);
  await supabase.from("referral_codes").insert({ user_id: userId, code });
  return code;
}

export interface ReferralSignup {
  id: string;
  referredEmail: string | null;
  status: "pending" | "granted" | "denied";
  createdAt: string;
}

export async function getMyReferrals(): Promise<ReferralSignup[]> {
  const userId = await requireUserId();
  if (!userId) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("referral_signups")
    .select("id, referred_email, reward_status, created_at")
    .eq("referrer_user_id", userId)
    .order("created_at", { ascending: false });
  return (data ?? []).map((r) => ({
    id: r.id,
    referredEmail: r.referred_email,
    status: r.reward_status,
    createdAt: r.created_at,
  }));
}

/** Called at signup time with a ?ref= code from the URL, if present.
 * Resolves the code to its owner and records the referral. Silently
 * no-ops if the code doesn't exist — never blocks signup. */
export async function recordReferralSignup(
  code: string,
  referredEmail: string
): Promise<void> {
  const supabase = createClient();
  const { data: codeRow } = await supabase
    .from("referral_codes")
    .select("user_id")
    .eq("code", code)
    .maybeSingle();
  if (!codeRow) return;

  await supabase.from("referral_signups").insert({
    referrer_user_id: codeRow.user_id,
    referred_email: referredEmail,
  });
}

// --- Subscriptions (client-facing, read + create own request) ---

export interface SubscriptionPlanPublic {
  id: string;
  name: string;
  billingPeriod: "monthly" | "quarterly" | "annual";
  priceInr: number;
}

export async function getSubscriptionPlans(): Promise<SubscriptionPlanPublic[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("subscription_plans")
    .select("id, name, billing_period, price_inr")
    .eq("active", true)
    .order("sort_order");
  return (data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    billingPeriod: p.billing_period,
    priceInr: Number(p.price_inr),
  }));
}

export async function getMySubscription(): Promise<{ planId: string; status: string } | null> {
  const userId = await requireUserId();
  if (!userId) return null;
  const supabase = createClient();
  const { data } = await supabase
    .from("user_subscriptions")
    .select("plan_id, status")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!data) return null;
  return { planId: data.plan_id, status: data.status };
}

export async function requestSubscription(planId: string, couponCode?: string): Promise<void> {
  const userId = await requireUserId();
  if (!userId) return;
  const supabase = createClient();
  await supabase.from("user_subscriptions").insert({
    user_id: userId,
    plan_id: planId,
    status: "pending",
    coupon_used: couponCode || null,
  });
}

// --- Settings: Phone Number (for WhatsApp integration) ---

export async function getMyPhoneNumber(): Promise<string | null> {
  const userId = await requireUserId();
  if (!userId) return null;
  const supabase = createClient();
  const { data } = await supabase
    .from("onboarding_responses")
    .select("phone_number")
    .eq("user_id", userId)
    .maybeSingle();
  return data?.phone_number ?? null;
}

export async function updateMyPhoneNumber(phone: string): Promise<void> {
  const userId = await requireUserId();
  if (!userId) return;
  const supabase = createClient();
  await supabase.from("onboarding_responses").upsert({
    user_id: userId,
    phone_number: phone,
  });
}

// --- Device Management (lightweight session log, not a full auth audit) ---

export interface LoginSession {
  id: string;
  userAgent: string | null;
  createdAt: string;
}

export async function recordLoginSession(): Promise<void> {
  const userId = await requireUserId();
  if (!userId) return;
  const supabase = createClient();
  await supabase.from("login_sessions").insert({
    user_id: userId,
    user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
  });
}

export async function getMyLoginSessions(): Promise<LoginSession[]> {
  const userId = await requireUserId();
  if (!userId) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("login_sessions")
    .select("id, user_agent, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);
  return (data ?? []).map((r) => ({ id: r.id, userAgent: r.user_agent, createdAt: r.created_at }));
}
