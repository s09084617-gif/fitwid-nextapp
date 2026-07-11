"use client";

import { useEffect, useState } from "react";
import { Users, ClipboardCheck, AlertCircle, TrendingUp, IndianRupee } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCoachDashboard, type CoachDashboardData } from "./actions";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function CoachDashboardPage() {
  const [data, setData] = useState<CoachDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    getCoachDashboard()
      .then((d) => {
        setData(d);
        setMounted(true);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Failed to load");
        setMounted(true);
      });
  }, []);

  if (!mounted) {
    return <div className="h-48 rounded-lg bg-surface-2 animate-pulse" />;
  }

  if (error || !data) {
    return (
      <Card>
        <Badge variant="warning" className="mb-3">Not Configured</Badge>
        <CardTitle>Couldn&apos;t load coach dashboard</CardTitle>
        <CardDescription className="mt-2">{error}</CardDescription>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-6">
        <Card>
          <div className="h-10 w-10 rounded-full bg-crimson/15 border border-crimson/30 flex items-center justify-center mb-3">
            <Users size={18} className="text-crimson" />
          </div>
          <CardTitle>{data.activeClientsCount}</CardTitle>
          <CardDescription>Active Clients</CardDescription>
        </Card>
        <Card>
          <div className="h-10 w-10 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center mb-3">
            <ClipboardCheck size={18} className="text-gold" />
          </div>
          <CardTitle>{data.newAssessmentsThisWeek.length}</CardTitle>
          <CardDescription>New Assessments (7d)</CardDescription>
        </Card>
        <Card>
          <div className="h-10 w-10 rounded-full bg-warning/15 border border-warning/30 flex items-center justify-center mb-3">
            <AlertCircle size={18} className="text-warning" />
          </div>
          <CardTitle>{data.pendingCheckIns.length}</CardTitle>
          <CardDescription>Pending Check-Ins</CardDescription>
        </Card>
      </div>

      <Card>
        <div className="flex items-center gap-3 mb-4">
          <IndianRupee size={18} className="text-muted" />
          {data.revenue && data.revenue.paidCount > 0 ? (
            <Badge variant="success">Revenue Overview</Badge>
          ) : (
            <Badge variant="warning">Revenue Overview — No Payments Yet</Badge>
          )}
        </div>
        {data.revenue && data.revenue.paidCount > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="font-display text-2xl text-gold">₹{data.revenue.totalInr.toLocaleString("en-IN")}</p>
              <CardDescription>Total collected (all time)</CardDescription>
            </div>
            <div>
              <p className="font-display text-2xl">₹{data.revenue.last30DaysInr.toLocaleString("en-IN")}</p>
              <CardDescription>Last 30 days</CardDescription>
            </div>
          </div>
        ) : (
          <CardDescription>
            Razorpay is wired up (see the Payments tab for setup), but no
            client has completed a payment yet — this fills in
            automatically once they do.
          </CardDescription>
        )}
      </Card>

      <Card>
        <Badge variant="warning" className="mb-4">
          Pending Check-Ins (no workout logged in 7+ days)
        </Badge>
        {data.pendingCheckIns.length === 0 ? (
          <p className="text-sm text-muted">Everyone&apos;s checked in recently. 🎉</p>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {data.pendingCheckIns.map((c) => (
              <div
                key={c.email}
                className="flex items-center justify-between rounded-md border border-border px-3 py-2.5"
              >
                <span className="text-sm">{c.email}</span>
                <span className="text-xs text-muted">
                  {c.daysSince === null
                    ? "Never logged a workout"
                    : `${c.daysSince} days since last workout`}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-success" />
          <Badge variant="success">Most Engaged Clients</Badge>
        </div>
        {data.mostEngaged.length === 0 ? (
          <p className="text-sm text-muted">No workout logs yet across any client.</p>
        ) : (
          <div className="space-y-2">
            {data.mostEngaged.map((c, i) => (
              <div key={c.email} className="flex items-center justify-between text-sm">
                <span>
                  <span className="text-muted mr-2">#{i + 1}</span>
                  {c.email}
                </span>
                <span className="text-xs text-muted">{c.workoutsLogged} workouts logged</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <Badge variant="gold" className="mb-4">New Assessments This Week</Badge>
        {data.newAssessmentsThisWeek.length === 0 ? (
          <p className="text-sm text-muted">No new assessments in the last 7 days.</p>
        ) : (
          <div className="space-y-2">
            {data.newAssessmentsThisWeek.map((a, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span>{a.email}</span>
                <span className="text-xs text-muted">{formatDate(a.date)}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
