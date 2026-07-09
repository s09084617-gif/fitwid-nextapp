"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Info, AlertCircle, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getWeightLog, getWorkoutHistory, getHabitLogs } from "@/lib/db/user-data";
import { generateInsights, type Insight } from "@/lib/insights";

const SEVERITY_META: Record<Insight["severity"], { icon: typeof Info; variant: "neutral" | "warning" | "danger" }> = {
  info: { icon: Info, variant: "neutral" },
  warning: { icon: AlertTriangle, variant: "warning" },
  attention: { icon: AlertCircle, variant: "danger" },
};

export function InsightsPanel() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    Promise.all([getWeightLog(), getWorkoutHistory(), getHabitLogs(30)]).then(
      ([weightLog, workoutHistory, habitLogs]) => {
        setInsights(
          generateInsights({
            weightLog,
            workoutDates: workoutHistory.map((w) => w.date),
            habitLogs,
          })
        );
        setMounted(true);
      }
    );
  }, []);

  if (!mounted) {
    return <div className="h-48 rounded-lg bg-surface-2 animate-pulse" />;
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={16} className="text-gold" />
        <Badge variant="gold">AI Insights</Badge>
      </div>
      {insights.length === 0 ? (
        <p className="text-sm text-muted">
          Nothing flagged right now — your recent activity looks steady.
        </p>
      ) : (
        <div className="space-y-3">
          {insights.map((insight) => {
            const meta = SEVERITY_META[insight.severity];
            return (
              <div key={insight.id} className="flex items-start gap-3 rounded-md border border-border p-3">
                <meta.icon
                  size={16}
                  className={
                    insight.severity === "attention"
                      ? "text-danger shrink-0 mt-0.5"
                      : insight.severity === "warning"
                      ? "text-warning shrink-0 mt-0.5"
                      : "text-muted shrink-0 mt-0.5"
                  }
                />
                <div>
                  <p className="text-sm font-medium">{insight.title}</p>
                  <p className="text-xs text-muted">{insight.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <p className="text-[11px] text-muted mt-4">
        These are pattern-based observations from your own logged data — not
        a diagnosis. Always talk to your coach or a doctor about anything
        that concerns you.
      </p>
    </Card>
  );
}
