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
