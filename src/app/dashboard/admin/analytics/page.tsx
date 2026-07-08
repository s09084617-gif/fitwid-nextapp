import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function countRecentSignups(users: { created_at: string }[], sinceMs: number) {
  return users.filter((u) => new Date(u.created_at).getTime() > sinceMs).length;
}

async function tableCount(
  admin: NonNullable<ReturnType<typeof createAdminClient>>,
  table: string
) {
  const { count } = await admin
    .from(table)
    .select("*", { count: "exact", head: true });
  return count ?? 0;
}

export default async function AdminAnalyticsPage() {
  const admin = createAdminClient();
  let totalUsers: number | null = null;
  let newLast7Days: number | null = null;
  let tableCounts: Record<string, number> | null = null;

  if (admin) {
    const { data } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    if (data) {
      totalUsers = data.users.length;
      // eslint-disable-next-line react-hooks/purity -- server component, re-evaluated fresh per request; not a client re-render concern
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      newLast7Days = countRecentSignups(data.users, sevenDaysAgo);
    }

    const [weightLogs, assessments, savedWorkouts, savedMealPlans, measurements, workoutHistory] =
      await Promise.all([
        tableCount(admin, "weight_logs"),
        tableCount(admin, "assessments"),
        tableCount(admin, "saved_workouts"),
        tableCount(admin, "saved_meal_plans"),
        tableCount(admin, "measurements"),
        tableCount(admin, "workout_history"),
      ]);
    tableCounts = {
      weightLogs,
      assessments,
      savedWorkouts,
      savedMealPlans,
      measurements,
      workoutHistory,
    };
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

      <Card>
        <Badge variant="gold" className="mb-4">
          Feature Usage (all users)
        </Badge>
        {tableCounts ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <CardTitle className="text-gold">{tableCounts.assessments}</CardTitle>
              <CardDescription>Assessments Taken</CardDescription>
            </div>
            <div>
              <CardTitle className="text-gold">{tableCounts.weightLogs}</CardTitle>
              <CardDescription>Weight Entries Logged</CardDescription>
            </div>
            <div>
              <CardTitle className="text-gold">{tableCounts.savedWorkouts}</CardTitle>
              <CardDescription>Workouts Saved</CardDescription>
            </div>
            <div>
              <CardTitle className="text-gold">{tableCounts.savedMealPlans}</CardTitle>
              <CardDescription>Meal Plans Saved</CardDescription>
            </div>
            <div>
              <CardTitle className="text-gold">{tableCounts.measurements}</CardTitle>
              <CardDescription>Measurements Logged</CardDescription>
            </div>
            <div>
              <CardTitle className="text-gold">{tableCounts.workoutHistory}</CardTitle>
              <CardDescription>Workouts Completed</CardDescription>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted">
            Requires <code>SUPABASE_SERVICE_ROLE_KEY</code> to query across
            all users.
          </p>
        )}
        <p className="text-[11px] text-muted mt-4">
          These are real counts across every registered user, pulled
          directly from the database.
        </p>
      </Card>

      <Card>
        <Badge variant="warning" className="mb-3">
          Not Yet Trackable
        </Badge>
        <CardTitle>Progress photos</CardTitle>
        <CardDescription className="mt-2">
          Progress photos are still stored per-device (browser
          localStorage), not in the database, so there&apos;s no way to
          count them across users yet. Moving photos to Supabase Storage
          would enable that.
        </CardDescription>
      </Card>
    </div>
  );
}
