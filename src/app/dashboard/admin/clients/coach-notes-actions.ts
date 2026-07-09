"use server";

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

export interface CoachNote {
  id: string;
  noteType: "private" | "session_summary" | "injury" | "followup";
  content: string;
  followUpDate: string | null;
  resolved: boolean;
  createdAt: string;
}

export async function getCoachNotes(clientUserId: string): Promise<CoachNote[]> {
  await assertAdmin();
  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");

  const { data } = await admin
    .from("coach_notes")
    .select("*")
    .eq("client_user_id", clientUserId)
    .order("created_at", { ascending: false });

  return (data ?? []).map((r) => ({
    id: r.id,
    noteType: r.note_type,
    content: r.content,
    followUpDate: r.follow_up_date,
    resolved: r.resolved,
    createdAt: r.created_at,
  }));
}

export async function addCoachNote(
  clientUserId: string,
  input: { noteType: CoachNote["noteType"]; content: string; followUpDate?: string }
): Promise<void> {
  await assertAdmin();
  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");

  await admin.from("coach_notes").insert({
    client_user_id: clientUserId,
    note_type: input.noteType,
    content: input.content,
    follow_up_date: input.followUpDate ?? null,
  });
}

export async function resolveCoachNote(id: string): Promise<void> {
  await assertAdmin();
  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");

  await admin.from("coach_notes").update({ resolved: true }).eq("id", id);
}

export async function deleteCoachNote(id: string): Promise<void> {
  await assertAdmin();
  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");

  await admin.from("coach_notes").delete().eq("id", id);
}
