"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";
import type { Exercise } from "@/lib/workout-data";

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isAdminEmail(user?.email)) {
    throw new Error("Not authorized");
  }
}

export async function addCustomExerciseAction(exercise: Exercise) {
  await assertAdmin();
  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");

  await admin.from("custom_exercises").insert({
    id: exercise.id,
    name: exercise.name,
    muscle_group: exercise.muscleGroup,
    equipment: exercise.equipment,
    difficulty: exercise.difficulty,
    cue: exercise.cue,
  });
  revalidatePath("/dashboard/admin/exercises");
  revalidatePath("/dashboard/workouts");
}

export async function deleteCustomExerciseAction(id: string) {
  await assertAdmin();
  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");

  await admin.from("custom_exercises").delete().eq("id", id);
  revalidatePath("/dashboard/admin/exercises");
  revalidatePath("/dashboard/workouts");
}
