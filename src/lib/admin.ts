// Simple email-allowlist admin check. There's no roles table yet (no
// database beyond Supabase auth), so admin access is gated by email
// address. Add your own email here, or set ADMIN_EMAILS in Vercel env
// vars as a comma-separated list to override without a redeploy.
const DEFAULT_ADMIN_EMAILS = ["s09084617@gmail.com"];

export function getAdminEmails(): string[] {
  const fromEnv = process.env.NEXT_PUBLIC_ADMIN_EMAILS;
  if (fromEnv) {
    return fromEnv.split(",").map((e) => e.trim().toLowerCase());
  }
  return DEFAULT_ADMIN_EMAILS.map((e) => e.toLowerCase());
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
}

/** Server-only: checks if a user is the owner OR a coach/assistant added
 * via the coaches table. Import this only in server components/actions —
 * it needs the request-scoped Supabase client to look up the caller's own
 * coaches row (RLS allows reading your own row with the anon/user client,
 * no service role needed for a self-lookup). */
export async function getMyCoachRole(
  userId: string | null | undefined
): Promise<"owner" | "coach" | "assistant" | null> {
  if (!userId) return null;
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase.from("coaches").select("role").eq("user_id", userId).maybeSingle();
  return data?.role ?? null;
}
