"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  getLastAssessment,
  getWeightLog,
  addWeightEntry,
  type StoredAssessment,
  type WeightEntry,
} from "@/lib/db/user-data";

function sampleWeightLog(startWeight = 82): WeightEntry[] {
  const entries: WeightEntry[] = [];
  const today = new Date();
  for (let i = 7; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i * 7);
    entries.push({
      date: d.toISOString().slice(0, 10),
      weightKg: Math.round((startWeight - (7 - i) * 0.4) * 10) / 10,
    });
  }
  return entries;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export function DashboardClient() {
  const [mounted, setMounted] = useState(false);
  const [assessment, setAssessment] = useState<StoredAssessment | null>(null);
  const [weightLog, setWeightLog] = useState<WeightEntry[]>([]);
  const [quickWeight, setQuickWeight] = useState("");

  useEffect(() => {
    Promise.all([getLastAssessment(), getWeightLog()]).then(
      ([assessmentResult, weightLogResult]) => {
        setAssessment(assessmentResult);
        setWeightLog(weightLogResult);
        setMounted(true);
      }
    );
  }, []);

  async function handleLogWeight() {
    const kg = Number(quickWeight);
    if (!kg || kg < 30 || kg > 300) return;
    const updated = await addWeightEntry(kg);
    setWeightLog(updated);
    setQuickWeight("");
  }

  if (!mounted) {
    return (
      <div className="grid sm:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-lg bg-surface-2 animate-pulse" />
        ))}
      </div>
    );
  }

  const hasRealData = weightLog.length > 0;
  const chartData = hasRealData ? weightLog : sampleWeightLog();
  const latestWeight = hasRealData
    ? weightLog[weightLog.length - 1].weightKg
    : null;
  const firstWeight = hasRealData ? weightLog[0].weightKg : null;
  const weightChange =
    latestWeight !== null && firstWeight !== null
      ? Math.round((latestWeight - firstWeight) * 10) / 10
      : null;

  return (
    <div className="space-y-6">
      {/* Progress cards */}
      <div className="grid sm:grid-cols-4 gap-6">
        <Card>
          <Badge variant="crimson" className="mb-3">
            Weight
          </Badge>
          <CardTitle>
            {latestWeight ? `${latestWeight} kg` : "No data"}
          </CardTitle>
          <CardDescription>
            {weightChange !== null
              ? `${weightChange > 0 ? "+" : ""}${weightChange}kg since first log`
              : "Log your weight to start tracking"}
          </CardDescription>
        </Card>
        <Card>
          <Badge variant="gold" className="mb-3">
            Body Fat
          </Badge>
          <CardTitle>
            {assessment
              ? `${assessment.result.bodyFatPercent}%`
              : "No data"}
          </CardTitle>
          <CardDescription>
            {assessment
              ? assessment.result.bodyFatCategory
              : "Take an assessment first"}
          </CardDescription>
        </Card>
        <Card>
          <Badge variant="success" className="mb-3">
            Fitness Score
          </Badge>
          <CardTitle>
            {assessment ? `${assessment.result.fitnessScore}/100` : "No data"}
          </CardTitle>
          <CardDescription>
            {assessment ? assessment.result.fitnessLabel : "Take an assessment first"}
          </CardDescription>
        </Card>
        <Card>
          <Badge variant="neutral" className="mb-3">
            Streak
          </Badge>
          <CardTitle>{Math.min(weightLog.length, 7)} days</CardTitle>
          <CardDescription>Consecutive weigh-ins logged</CardDescription>
        </Card>
      </div>

      {/* Weight chart */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <Badge variant="crimson" className="mb-2">
              Weight Trend
            </Badge>
            <h3 className="font-display text-2xl">
              {hasRealData ? "Your Progress" : "Sample Trend"}
            </h3>
          </div>
          <div className="flex items-end gap-2">
            <Input
              label="Log today's weight (kg)"
              type="number"
              placeholder="78.5"
              value={quickWeight}
              onChange={(e) => setQuickWeight(e.target.value)}
              className="w-36"
            />
            <Button onClick={handleLogWeight}>Log</Button>
          </div>
        </div>

        <div className="h-64 -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                stroke="var(--muted)"
                fontSize={12}
              />
              <YAxis
                domain={["dataMin - 2", "dataMax + 2"]}
                stroke="var(--muted)"
                fontSize={12}
                width={40}
              />
              <Tooltip
                labelFormatter={(label) => formatDate(label as string)}
                formatter={(value) => [`${value} kg`, "Weight"]}
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="weightKg"
                stroke="var(--crimson)"
                strokeWidth={2}
                dot={{ r: 3, fill: "var(--crimson)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {!hasRealData && (
          <p className="text-[11px] text-muted mt-2">
            This is sample data. Log your weight above or take the Body
            Assessment to start your real trend line.
          </p>
        )}
      </Card>
    </div>
  );
}
