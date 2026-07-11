"use client";

import { createClient } from "@/lib/supabase/client";
import type { Exercise } from "@/lib/workout-data";

export interface ProgramCard {
  id: string;
  title: string;
  desc: string;
  badge: string;
  variant: "crimson" | "gold" | "success";
}

export const DEFAULT_PROGRAMS: ProgramCard[] = [
  {
    id: "fat-loss",
    title: "Fat Loss + Muscle Retention",
    desc: "Structured deficit programming that protects lean mass while body fat drops.",
    badge: "Program",
    variant: "crimson",
  },
  {
    id: "lean-muscle",
    title: "Lean Muscle Building",
    desc: "Progressive overload blocks designed around your recovery and InBody trends.",
    badge: "Program",
    variant: "gold",
  },
  {
    id: "online-coaching",
    title: "Online Coaching (FitWid)",
    desc: "Remote check-ins, habit tracking, and diet plans — coached from anywhere.",
    badge: "Online",
    variant: "success",
  },
];

/** Public read of the shared `programs` table. Falls back to hardcoded
 * defaults if the table doesn't exist yet (migration not run) or the
 * request fails, so the homepage never breaks. */
export async function getPrograms(): Promise<ProgramCard[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("programs")
    .select("id, title, description, badge, variant, sort_order")
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) return DEFAULT_PROGRAMS;

  return data.map((r) => ({
    id: r.id,
    title: r.title,
    desc: r.description,
    badge: r.badge,
    variant: r.variant as ProgramCard["variant"],
  }));
}

/** Public read of the shared `custom_exercises` table (admin-added,
 * merged into the Workout Generator's exercise pool for everyone). */
export async function getCustomExercises(): Promise<Exercise[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("custom_exercises")
    .select("id, name, muscle_group, equipment, difficulty, cue");

  if (error || !data) return [];

  return data.map((r) => ({
    id: r.id,
    name: r.name,
    muscleGroup: r.muscle_group,
    equipment: r.equipment,
    difficulty: r.difficulty,
    cue: r.cue ?? "No cue provided.",
    cues: [r.cue ?? "No cue provided."],
    commonMistakes: [],
    alternatives: [],
    progressionEasier: null,
    progressionHarder: null,
    videoUrl: null,
  })) as Exercise[];
}

export interface SuccessStory {
  id: string;
  clientName: string;
  goal: string;
  durationWeeks: number | null;
  story: string;
  photoUrl: string | null;
  featured: boolean;
}

export async function getSuccessStories(): Promise<SuccessStory[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("success_stories")
    .select("id, client_name, goal, duration_weeks, story, photo_url, featured")
    .eq("status", "approved")
    .order("featured", { ascending: false });

  if (error || !data) return [];

  return data.map((r) => ({
    id: r.id,
    clientName: r.client_name,
    goal: r.goal,
    durationWeeks: r.duration_weeks,
    story: r.story,
    photoUrl: r.photo_url,
    featured: r.featured,
  }));
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string | null;
  publishedAt: string;
}
