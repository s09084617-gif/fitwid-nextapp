"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getWeightLog, getAssessmentHistory, getWorkoutHistory } from "@/lib/db/user-data";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function ChartCard({
  title,
  badgeVariant,
  color,
  data,
  dataKey,
  yLabel,
  emptyText,
  formatter,
}: {
  title: string;
  badgeVariant: "crimson" | "gold" | "success" | "neutral" | "warning";
  color: string;
  data: { date: string; value: number }[];
  dataKey: string;
  yLabel: string;
  emptyText: string;
  formatter?: (v: number) => string;
}) {
  return (
    <Card>
      <Badge variant={badgeVariant} className="mb-4">
        {title}
      </Badge>
      {data.length < 2 ? (
        <p className="text-sm text-muted">{emptyText}</p>
      ) : (
        <div className="h-52 -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tickFormatter={formatDate} stroke="var(--muted)" fontSize={11} />
              <YAxis
                domain={["dataMin - 2", "dataMax + 2"]}
                stroke="var(--muted)"
                fontSize={11}
                width={38}
              />
              <Tooltip
                labelFormatter={(l) => formatDate(l as string)}
                formatter={(v) => [formatter ? formatter(v as number) : v, yLabel]}
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={{ r: 3, fill: color }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}

export function AnalyticsCharts() {
  const [weightData, setWeightData] = useState<{ date: string; value: number }[]>([]);
  const [bodyFatData, setBodyFatData] = useState<{ date: string; value: number }[]>([]);
  const [muscleMassData, setMuscleMassData] = useState<{ date: string; value: number }[]>([]);
  const [calorieData, setCalorieData] = useState<{ date: string; value: number }[]>([]);
  const [adherenceData, setAdherenceData] = useState<{ week: string; count: number }[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    Promise.all([getWeightLog(), getAssessmentHistory(), getWorkoutHistory()]).then(
      ([weightLog, assessments, workoutHistory]) => {
        setWeightData(weightLog.map((w) => ({ date: w.date, value: w.weightKg })));

        setBodyFatData(
          assessments.map((a) => ({ date: a.savedAt, value: a.result.bodyFatPercent }))
        );

        setMuscleMassData(
          assessments.map((a) => ({
            date: a.savedAt,
            value: Math.round(a.weightKg * (1 - a.result.bodyFatPercent / 100) * 10) / 10,
          }))
        );

        setCalorieData(
          assessments.map((a) => ({ date: a.savedAt, value: a.result.macros.calories }))
        );

        // Workout adherence: count workouts per ISO week over the last 8 weeks
        const weekBuckets = new Map<string, number>();
        const now = new Date();
        for (let i = 7; i >= 0; i--) {
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - i * 7);
          const label = weekStart.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
          weekBuckets.set(label, 0);
        }
        const bucketKeys = Array.from(weekBuckets.keys());
        for (const w of workoutHistory) {
          const workoutDate = new Date(w.date);
          const daysAgo = Math.floor((now.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));
          const weekIndex = 7 - Math.floor(daysAgo / 7);
          if (weekIndex >= 0 && weekIndex < bucketKeys.length) {
            const key = bucketKeys[weekIndex];
            weekBuckets.set(key, (weekBuckets.get(key) ?? 0) + 1);
          }
        }
        setAdherenceData(Array.from(weekBuckets.entries()).map(([week, count]) => ({ week, count })));

        setMounted(true);
      }
    );
  }, []);

  if (!mounted) {
    return (
      <div className="grid sm:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-64 rounded-lg bg-surface-2 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <ChartCard
          title="Weight"
          badgeVariant="crimson"
          color="var(--crimson)"
          data={weightData}
          dataKey="value"
          yLabel="Weight"
          emptyText="Log weight at least twice to see a trend."
          formatter={(v) => `${v} kg`}
        />
        <ChartCard
          title="Body Fat %"
          badgeVariant="gold"
          color="var(--gold)"
          data={bodyFatData}
          dataKey="value"
          yLabel="Body Fat"
          emptyText="Take at least 2 Body Assessments to see a trend."
          formatter={(v) => `${v}%`}
        />
        <ChartCard
          title="Muscle Mass (estimated)"
          badgeVariant="success"
          color="var(--success)"
          data={muscleMassData}
          dataKey="value"
          yLabel="Lean Mass"
          emptyText="Take at least 2 Body Assessments to see a trend."
          formatter={(v) => `${v} kg`}
        />
        <ChartCard
          title="Calorie Target"
          badgeVariant="warning"
          color="var(--warning)"
          data={calorieData}
          dataKey="value"
          yLabel="Calories"
          emptyText="Take at least 2 Body Assessments to see a trend."
          formatter={(v) => `${v} kcal`}
        />
      </div>

      <Card>
        <Badge variant="neutral" className="mb-4">
          Workout Adherence (last 8 weeks)
        </Badge>
        <div className="h-52 -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={adherenceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="week" stroke="var(--muted)" fontSize={11} />
              <YAxis stroke="var(--muted)" fontSize={11} width={30} allowDecimals={false} />
              <Tooltip
                formatter={(v) => [`${v} workouts`, "Logged"]}
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="count" fill="var(--crimson)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <p className="text-xs text-muted text-center">
        Muscle Mass is estimated (weight × (1 − body fat %)) from your Body
        Assessments — not a direct InBody measurement. Calorie Target
        reflects your calculated target at each assessment, not actual food
        logged, since food intake isn&apos;t tracked yet.
      </p>
    </div>
  );
}
