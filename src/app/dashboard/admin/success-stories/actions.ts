"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isAdminEmail(user?.email)) {
    throw new Error("Not authorized");
  }
}

export async function addSuccessStory(input: {
  clientName: string;
  goal: string;
  durationWeeks: number | null;
  story: string;
  featured: boolean;
}) {
  await assertAdmin();
  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");

  await admin.from("success_stories").insert({
    client_name: input.clientName,
    goal: input.goal,
    duration_weeks: input.durationWeeks,
    story: input.story,
    featured: input.featured,
  });
  revalidatePath("/dashboard/community");
  revalidatePath("/dashboard/admin/success-stories");
}

export async function deleteSuccessStory(id: string) {
  await assertAdmin();
  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");

  await admin.from("success_stories").delete().eq("id", id);
  revalidatePath("/dashboard/community");
  revalidatePath("/dashboard/admin/success-stories");
}
