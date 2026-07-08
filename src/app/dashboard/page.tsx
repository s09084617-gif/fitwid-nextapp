import { createClient } from "@/lib/supabase/server";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { CaloriesCard } from "@/components/dashboard/calories-card";
import { WorkoutSummary } from "@/components/dashboard/workout-summary";
import { QuickActions } from "@/components/dashboard/quick-actions";

export default async function DashboardOverviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <Card>
          <Badge variant="crimson" className="mb-3">
            Account
          </Badge>
          <CardTitle>{user?.email}</CardTitle>
          <CardDescription>
            Signed in via{" "}
            {user?.app_metadata?.provider === "google" ? "Google" : "Email"}
          </CardDescription>
        </Card>
        <Card>
          <Badge variant="gold" className="mb-3">
            Status
          </Badge>
          <CardTitle>Active Client</CardTitle>
          <CardDescription>No program assigned yet.</CardDescription>
        </Card>
      </div>

      <DashboardClient />

      <div className="grid sm:grid-cols-2 gap-6">
        <CaloriesCard />
        <WorkoutSummary />
      </div>

      <QuickActions />

      <p className="text-xs text-muted text-center pt-2">
        Weight tracking is saved locally in your browser for now. Full
        server-side sync is planned for a later phase.
      </p>
    </div>
  );
}
