import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DauChart } from "@/components/admin/dau-chart";

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
  let growthMetrics: {
    dau: number;
    wau: number;
    assessmentCompletionRate: number;
    workoutCompletionRate: number;
    subscriptionConversionRate: number;
    activeSubscriptionRate: number;
    retentionRate: number;
    dailyActiveTrend: { date: string; count: number }[];
  } | null = null;

  if (admin) {
    const { data } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    // eslint-disable-next-line react-hooks/purity -- server component, re-evaluated fresh per request; not a client re-render concern
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const totalUserCount = data?.users.length ?? 0;

    if (data) {
      totalUsers = totalUserCount;
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
    tableCounts = { weightLogs, assessments, savedWorkouts, savedMealPlans, measurements, workoutHistory };

    // --- Growth metrics ---
    const [sessionsRes, assessmentUsersRes, savedWorkoutUsersRes, workoutHistoryUsersRes, subsRes] =
      await Promise.all([
        admin.from("login_sessions").select("user_id, created_at"),
        admin.from("assessments").select("user_id"),
        admin.from("saved_workouts").select("user_id"),
        admin.from("workout_history").select("user_id"),
        admin.from("user_subscriptions").select("user_id, status"),
      ]);

    const sessions = sessionsRes.data ?? [];
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const dauSet = new Set(
      sessions.filter((s) => new Date(s.created_at).getTime() >= todayStart.getTime()).map((s) => s.user_id)
    );
    const wauSet = new Set(
      sessions.filter((s) => new Date(s.created_at).getTime() >= sevenDaysAgo).map((s) => s.user_id)
    );

    const assessmentUserSet = new Set((assessmentUsersRes.data ?? []).map((r) => r.user_id));
    const savedWorkoutUserSet = new Set((savedWorkoutUsersRes.data ?? []).map((r) => r.user_id));
    const workoutHistoryUserSet = new Set((workoutHistoryUsersRes.data ?? []).map((r) => r.user_id));
    const subs = subsRes.data ?? [];
    const subscribedUserSet = new Set(subs.map((s) => s.user_id));
    const activeSubs = subs.filter((s) => s.status === "active");

    // Retention: of users active >7 days ago, what % are also active in the last 7 days?
    const fourteenDaysAgo = now - 14 * 24 * 60 * 60 * 1000;
    const oldUserIds = new Set(
      sessions.filter((s) => {
        const t = new Date(s.created_at).getTime();
        return t < sevenDaysAgo && t >= fourteenDaysAgo;
      }).map((s) => s.user_id)
    );
    const returningCount = [...oldUserIds].filter((id) => wauSet.has(id)).length;

    // Daily active trend, last 14 days
    const dailyActiveTrend: { date: string; count: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const dayStart = new Date();
      dayStart.setDate(dayStart.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      const count = new Set(
        sessions
          .filter((s) => {
            const t = new Date(s.created_at).getTime();
            return t >= dayStart.getTime() && t < dayEnd.getTime();
          })
          .map((s) => s.user_id)
      ).size;
      dailyActiveTrend.push({ date: dayStart.toISOString().slice(0, 10), count });
    }

    growthMetrics = {
      dau: dauSet.size,
      wau: wauSet.size,
      assessmentCompletionRate: totalUserCount > 0 ? Math.round((assessmentUserSet.size / totalUserCount) * 100) : 0,
      workoutCompletionRate:
        savedWorkoutUserSet.size > 0
          ? Math.round((workoutHistoryUserSet.size / savedWorkoutUserSet.size) * 100)
          : 0,
      subscriptionConversionRate: totalUserCount > 0 ? Math.round((subscribedUserSet.size / totalUserCount) * 100) : 0,
      activeSubscriptionRate: subs.length > 0 ? Math.round((activeSubs.length / subs.length) * 100) : 0,
      retentionRate: oldUserIds.size > 0 ? Math.round((returningCount / oldUserIds.size) * 100) : 0,
      dailyActiveTrend,
    };
  }

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <Card>
          <Badge variant="crimson" className="mb-3">Total Users</Badge>
          <CardTitle>{totalUsers ?? "—"}</CardTitle>
          <CardDescription>
            {totalUsers === null ? "Requires SUPABASE_SERVICE_ROLE_KEY" : "Registered accounts"}
          </CardDescription>
        </Card>
        <Card>
          <Badge variant="success" className="mb-3">New This Week</Badge>
          <CardTitle>{newLast7Days ?? "—"}</CardTitle>
          <CardDescription>Signups in the last 7 days</CardDescription>
        </Card>
      </div>

      {growthMetrics && (
        <>
          <Card>
            <Badge variant="gold" className="mb-4">Active Users</Badge>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <CardTitle className="text-gold">{growthMetrics.dau}</CardTitle>
                <CardDescription>Daily Active Users (today)</CardDescription>
              </div>
              <div>
                <CardTitle className="text-gold">{growthMetrics.wau}</CardTitle>
                <CardDescription>Weekly Active Users (7d)</CardDescription>
              </div>
            </div>
            <DauChart data={growthMetrics.dailyActiveTrend} />
            <p className="text-[11px] text-muted mt-3">
              &ldquo;Active&rdquo; means at least one recorded login session
              — see Settings → Recent Sign-Ins for how that&apos;s captured.
              This undercounts activity slightly since it logs once per
              browser session, not every page view.
            </p>
          </Card>

          <div className="grid sm:grid-cols-2 gap-6">
            <Card>
              <Badge variant="crimson" className="mb-3">Assessment Completion</Badge>
              <CardTitle>{growthMetrics.assessmentCompletionRate}%</CardTitle>
              <CardDescription>of registered users have taken at least one Body Assessment</CardDescription>
            </Card>
            <Card>
              <Badge variant="success" className="mb-3">Workout Follow-Through</Badge>
              <CardTitle>{growthMetrics.workoutCompletionRate}%</CardTitle>
              <CardDescription>of users who generated a workout also logged completing one</CardDescription>
            </Card>
            <Card>
              <Badge variant="gold" className="mb-3">Subscription Conversion</Badge>
              <CardTitle>{growthMetrics.subscriptionConversionRate}%</CardTitle>
              <CardDescription>
                of users requested a plan · {growthMetrics.activeSubscriptionRate}% of those are marked Active
              </CardDescription>
            </Card>
            <Card>
              <Badge variant="warning" className="mb-3">7-Day Retention</Badge>
              <CardTitle>{growthMetrics.retentionRate}%</CardTitle>
              <CardDescription>of users active 7–14 days ago came back in the last 7 days</CardDescription>
            </Card>
          </div>
        </>
      )}

      <Card>
        <Badge variant="gold" className="mb-4">Feature Usage (all users)</Badge>
        {tableCounts ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div><CardTitle className="text-gold">{tableCounts.assessments}</CardTitle><CardDescription>Assessments Taken</CardDescription></div>
            <div><CardTitle className="text-gold">{tableCounts.weightLogs}</CardTitle><CardDescription>Weight Entries Logged</CardDescription></div>
            <div><CardTitle className="text-gold">{tableCounts.savedWorkouts}</CardTitle><CardDescription>Workouts Saved</CardDescription></div>
            <div><CardTitle className="text-gold">{tableCounts.savedMealPlans}</CardTitle><CardDescription>Meal Plans Saved</CardDescription></div>
            <div><CardTitle className="text-gold">{tableCounts.measurements}</CardTitle><CardDescription>Measurements Logged</CardDescription></div>
            <div><CardTitle className="text-gold">{tableCounts.workoutHistory}</CardTitle><CardDescription>Workouts Completed</CardDescription></div>
          </div>
        ) : (
          <p className="text-sm text-muted">Requires <code>SUPABASE_SERVICE_ROLE_KEY</code> to query across all users.</p>
        )}
        <p className="text-[11px] text-muted mt-4">These are real counts across every registered user, pulled directly from the database.</p>
      </Card>

      <Card>
        <Badge variant="warning" className="mb-3">Not Yet Trackable</Badge>
        <CardTitle>Progress photos, and detailed UX behavior</CardTitle>
        <CardDescription className="mt-2">
          Progress photos live in browser localStorage, not the database, so
          they can&apos;t be counted across users. And these numbers show
          *what* happened, not *why* — for &ldquo;where do users get
          confused&rdquo; or session-replay-level detail, you&apos;d want a
          dedicated product analytics tool (e.g. PostHog) layered on top.
          Happy to wire that in if you want it.
        </CardDescription>
      </Card>
    </div>
  );
}
