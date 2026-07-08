"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";
import { DEFAULT_PROGRAMS, type ProgramCard } from "@/lib/db/shared-data";

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isAdminEmail(user?.email)) {
    throw new Error("Not authorized");
  }
}

export async function upsertProgram(program: ProgramCard, sortOrder: number) {
  await assertAdmin();
  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");

  await admin.from("programs").upsert({
    id: program.id,
    title: program.title,
    description: program.desc,
    badge: program.badge,
    variant: program.variant,
    sort_order: sortOrder,
    updated_at: new Date().toISOString(),
  });
  revalidatePath("/");
  revalidatePath("/dashboard/admin/programs");
}

export async function deleteProgram(id: string) {
  await assertAdmin();
  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");

  await admin.from("programs").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/dashboard/admin/programs");
}

export async function resetProgramsToDefaults() {
  await assertAdmin();
  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");

  await admin.from("programs").delete().neq("id", "");
  await admin.from("programs").insert(
    DEFAULT_PROGRAMS.map((p, i) => ({
      id: p.id,
      title: p.title,
      description: p.desc,
      badge: p.badge,
      variant: p.variant,
      sort_order: i + 1,
    }))
  );
  revalidatePath("/");
  revalidatePath("/dashboard/admin/programs");
}
