import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LocalUsageStats } from "@/components/admin/local-usage-stats";

function countRecentSignups(users: { created_at: string }[], sinceMs: number) {
  return users.filter((u) => new Date(u.created_at).getTime() > sinceMs).length;
}

export default async function AdminAnalyticsPage() {
  const adminClient = createAdminClient();
  let totalUsers: number | null = null;
  let newLast7Days: number | null = null;

  if (adminClient) {
    const { data } = await adminClient.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    if (data) {
      totalUsers = data.users.length;
      // eslint-disable-next-line react-hooks/purity -- server component, re-evaluated fresh per request; not a client re-render concern
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      newLast7Days = countRecentSignups(data.users, sevenDaysAgo);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <Card>
          <Badge variant="crimson" className="mb-3">
            Total Users
          </Badge>
          <CardTitle>{totalUsers ?? "—"}</CardTitle>
          <CardDescription>
            {totalUsers === null
              ? "Requires SUPABASE_SERVICE_ROLE_KEY"
              : "Registered accounts"}
          </CardDescription>
        </Card>
        <Card>
          <Badge variant="success" className="mb-3">
            New This Week
          </Badge>
          <CardTitle>{newLast7Days ?? "—"}</CardTitle>
          <CardDescription>Signups in the last 7 days</CardDescription>
        </Card>
      </div>

      <LocalUsageStats />

      <Card>
        <Badge variant="warning" className="mb-3">
          Not Yet Available
        </Badge>
        <CardTitle>Feature-level usage analytics</CardTitle>
        <CardDescription className="mt-2">
          Tracking real usage across all clients (e.g. how many people used
          the Workout Generator this month, most-generated meal plans, etc.)
          requires server-side event logging and a database — there&apos;s
          no event pipeline connected yet. The numbers above are either real
          (user counts, via Supabase) or local-only (this browser&apos;s
          activity).
        </CardDescription>
      </Card>
    </div>
  );
}
