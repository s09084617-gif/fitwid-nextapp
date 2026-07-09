import { createAdminClient } from "@/lib/supabase/admin";

/** Best-effort audit logging for admin actions. Never throws — a failed
 * audit write shouldn't block the actual action. */
export async function logAuditEvent(input: {
  actorEmail: string;
  action: string;
  targetType?: string;
  targetId?: string;
  details?: Record<string, unknown>;
}): Promise<void> {
  try {
    const admin = createAdminClient();
    if (!admin) return;
    await admin.from("audit_log").insert({
      actor_email: input.actorEmail,
      action: input.action,
      target_type: input.targetType ?? null,
      target_id: input.targetId ?? null,
      details: input.details ?? null,
    });
  } catch {
    // Never let audit logging break the actual operation.
  }
}
