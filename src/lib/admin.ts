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
