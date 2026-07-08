"use client";

// Progress photos are the one piece of data still stored in localStorage.
// Everything else (weight log, assessments, saved workouts/meal plans,
// measurements, workout history, programs, custom exercises) now lives in
// Supabase — see src/lib/db/user-data.ts and src/lib/db/shared-data.ts.
//
// Photos stay local because moving them to a real backend needs Supabase
// Storage (a file bucket), which hasn't been set up yet — base64 images
// don't belong in Postgres rows at any meaningful scale.

const PROGRESS_PHOTOS_KEY = "fitwid:progressPhotos";

export interface ProgressPhoto {
  id: string;
  date: string;
  dataUrl: string;
  note?: string;
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
    return false;
  }
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

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
