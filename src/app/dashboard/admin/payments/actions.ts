"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isAdminEmail(user?.email)) throw new Error("Not authorized");
}

export interface TransactionRow {
  id: string;
  email: string;
  planName: string;
  amountInr: number;
  status: string;
  createdAt: string;
}

export async function listTransactions(): Promise<TransactionRow[]> {
  await assertAdmin();
  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");

  const [txnRes, usersRes, plansRes] = await Promise.all([
    admin.from("transactions").select("*").order("created_at", { ascending: false }).limit(200),
    admin.auth.admin.listUsers({ page: 1, perPage: 200 }),
    admin.from("subscription_plans").select("id, name"),
  ]);

  const emailById = new Map(usersRes.data?.users.map((u) => [u.id, u.email ?? "unknown"]));
  const planNameById = new Map((plansRes.data ?? []).map((p) => [p.id, p.name]));

  return (txnRes.data ?? []).map((t) => ({
    id: t.id,
    email: emailById.get(t.user_id) ?? "unknown",
    planName: planNameById.get(t.plan_id) ?? "Unknown plan",
    amountInr: Number(t.amount_inr),
    status: t.status,
    createdAt: t.created_at,
  }));
}
