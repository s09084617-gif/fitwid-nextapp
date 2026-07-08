"use client";

import type { AssessmentResult } from "@/lib/assessment";
import type { WorkoutPlan } from "@/lib/workout-generator";
import type { MealPlan } from "@/lib/meal-plan-generator";

const LAST_ASSESSMENT_KEY = "fitwid:lastAssessment";
const WEIGHT_LOG_KEY = "fitwid:weightLog";
const SAVED_WORKOUTS_KEY = "fitwid:savedWorkouts";
const SAVED_MEAL_PLANS_KEY = "fitwid:savedMealPlans";
const PROGRESS_PHOTOS_KEY = "fitwid:progressPhotos";
const MEASUREMENTS_KEY = "fitwid:measurements";
const WORKOUT_HISTORY_KEY = "fitwid:workoutHistory";

export interface WeightEntry {
  date: string; // ISO date, e.g. 2026-07-08
  weightKg: number;
}

export interface StoredAssessment {
  result: AssessmentResult;
  weightKg: number;
  savedAt: string;
}

export interface ProgressPhoto {
  id: string;
  date: string;
  dataUrl: string;
  note?: string;
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

function safeGet<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function safeSet(key: string, value: unknown): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    // localStorage unavailable or quota exceeded — caller decides how to handle
    return false;
  }
}

export function getLastAssessment(): StoredAssessment | null {
  return safeGet<StoredAssessment>(LAST_ASSESSMENT_KEY);
}

export function getWeightLog(): WeightEntry[] {
  return safeGet<WeightEntry[]>(WEIGHT_LOG_KEY) ?? [];
}

export function addWeightEntry(weightKg: number, date = todayISO()) {
  const log = getWeightLog().filter((e) => e.date !== date);
  log.push({ date, weightKg });
  log.sort((a, b) => a.date.localeCompare(b.date));
  safeSet(WEIGHT_LOG_KEY, log.slice(-90)); // keep last ~90 entries
  return log;
}

export function saveLastAssessment(result: AssessmentResult, weightKg: number) {
  safeSet(LAST_ASSESSMENT_KEY, {
    result,
    weightKg,
    savedAt: todayISO(),
  } satisfies StoredAssessment);
  addWeightEntry(weightKg);
}

export function deleteWeightEntry(date: string) {
  const log = getWeightLog().filter((e) => e.date !== date);
  safeSet(WEIGHT_LOG_KEY, log);
  return log;
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function getSavedWorkouts(): WorkoutPlan[] {
  return safeGet<WorkoutPlan[]>(SAVED_WORKOUTS_KEY) ?? [];
}

export function saveWorkout(plan: WorkoutPlan) {
  const list = getSavedWorkouts();
  list.unshift(plan);
  safeSet(SAVED_WORKOUTS_KEY, list.slice(0, 50)); // cap at 50 saved workouts
  return list;
}

export function deleteWorkout(id: string) {
  const list = getSavedWorkouts().filter((w) => w.id !== id);
  safeSet(SAVED_WORKOUTS_KEY, list);
  return list;
}

export function getSavedMealPlans(): MealPlan[] {
  return safeGet<MealPlan[]>(SAVED_MEAL_PLANS_KEY) ?? [];
}

export function saveMealPlan(plan: MealPlan) {
  const list = getSavedMealPlans();
  list.unshift(plan);
  safeSet(SAVED_MEAL_PLANS_KEY, list.slice(0, 50));
  return list;
}

export function deleteMealPlan(id: string) {
  const list = getSavedMealPlans().filter((p) => p.id !== id);
  safeSet(SAVED_MEAL_PLANS_KEY, list);
  return list;
}

// --- Progress Photos ---

export function getProgressPhotos(): ProgressPhoto[] {
  return safeGet<ProgressPhoto[]>(PROGRESS_PHOTOS_KEY) ?? [];
}

/** Returns null on success, or an error message string if storage failed (e.g. quota exceeded). */
export function addProgressPhoto(
  dataUrl: string,
  note?: string,
  date = todayISO()
): string | null {
  const list = getProgressPhotos();
  const entry: ProgressPhoto = {
    id: `photo_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    date,
    dataUrl,
    note,
  };
  const updated = [entry, ...list].slice(0, 20); // cap at 20 photos
  const ok = safeSet(PROGRESS_PHOTOS_KEY, updated);
  if (!ok) {
    return "Couldn't save photo — your browser's storage may be full. Try deleting an old photo first.";
  }
  return null;
}

export function deleteProgressPhoto(id: string) {
  const list = getProgressPhotos().filter((p) => p.id !== id);
  safeSet(PROGRESS_PHOTOS_KEY, list);
  return list;
}

// --- Measurements ---

export function getMeasurements(): MeasurementEntry[] {
  const list = safeGet<MeasurementEntry[]>(MEASUREMENTS_KEY) ?? [];
  return [...list].sort((a, b) => a.date.localeCompare(b.date));
}

export function addMeasurement(
  entry: Omit<MeasurementEntry, "id" | "date"> & { date?: string }
) {
  const date = entry.date ?? todayISO();
  const list = getMeasurements().filter((m) => m.date !== date);
  list.push({
    id: `meas_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    date,
    waistCm: entry.waistCm,
    chestCm: entry.chestCm,
    hipsCm: entry.hipsCm,
    bicepsCm: entry.bicepsCm,
    thighsCm: entry.thighsCm,
  });
  const sorted = list.sort((a, b) => a.date.localeCompare(b.date));
  safeSet(MEASUREMENTS_KEY, sorted);
  return sorted;
}

export function deleteMeasurement(id: string) {
  const list = getMeasurements().filter((m) => m.id !== id);
  safeSet(MEASUREMENTS_KEY, list);
  return list;
}

// --- Workout History ---

export function getWorkoutHistory(): WorkoutHistoryEntry[] {
  const list = safeGet<WorkoutHistoryEntry[]>(WORKOUT_HISTORY_KEY) ?? [];
  return [...list].sort((a, b) => b.date.localeCompare(a.date));
}

export function addWorkoutHistoryEntry(
  entry: Omit<WorkoutHistoryEntry, "id" | "date"> & { date?: string }
) {
  const list = getWorkoutHistory();
  list.unshift({
    id: `hist_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    date: entry.date ?? todayISO(),
    title: entry.title,
    durationMinutes: entry.durationMinutes,
    notes: entry.notes,
  });
  const sorted = list.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 200);
  safeSet(WORKOUT_HISTORY_KEY, sorted);
  return sorted;
}

export function deleteWorkoutHistoryEntry(id: string) {
  const list = getWorkoutHistory().filter((w) => w.id !== id);
  safeSet(WORKOUT_HISTORY_KEY, list);
  return list;
}
