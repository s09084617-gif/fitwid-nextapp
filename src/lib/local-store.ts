"use client";

import type { AssessmentResult } from "@/lib/assessment";

const LAST_ASSESSMENT_KEY = "fitwid:lastAssessment";
const WEIGHT_LOG_KEY = "fitwid:weightLog";

export interface WeightEntry {
  date: string; // ISO date, e.g. 2026-07-08
  weightKg: number;
}

export interface StoredAssessment {
  result: AssessmentResult;
  weightKg: number;
  savedAt: string;
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

function safeSet(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage unavailable (private mode, quota, etc) — fail silently
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

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
