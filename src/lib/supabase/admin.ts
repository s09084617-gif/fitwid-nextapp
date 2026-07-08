import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only admin client using the service role key — required to list
 * users via the Supabase Auth Admin API. NEVER import this in a client
 * component; the service role key must never reach the browser.
 *
 * Returns null if SUPABASE_SERVICE_ROLE_KEY isn't configured, so callers
 * can degrade gracefully instead of crashing (env vars are optional here
 * since most of the app works fine without them).
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) return null;

  return createSupabaseClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
