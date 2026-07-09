"use client";

import { useEffect, useState } from "react";
import { Droplet, Moon, Footprints, Beef, Dumbbell, Brain, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getHabitLogs, upsertHabitLog, todayISO, type HabitLog } from "@/lib/db/user-data";
import { cn } from "@/lib/utils";

const HABITS = [
  { key: "waterMl", label: "Water", unit: "ml", target: 3000, icon: Droplet, color: "text-blue-400" },
  { key: "sleepHours", label: "Sleep", unit: "hrs", target: 7.5, icon: Moon, color: "text-purple-400" },
  { key: "steps", label: "Steps", unit: "", target: 8000, icon: Footprints, color: "text-success" },
  { key: "proteinG", label: "Protein", unit: "g", target: 140, icon: Beef, color: "text-crimson" },
  { key: "meditationMinutes", label: "Meditation", unit: "min", target: 10, icon: Brain, color: "text-gold" },
] as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { weekday: "short", day: "numeric" });
}

export function HabitTracker() {
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [workoutDone, setWorkoutDone] = useState(false);

  useEffect(() => {
    getHabitLogs(14).then((list) => {
      setLogs(list);
      const today = list.find((l) => l.date === todayISO());
      if (today) {
        setWorkoutDone(today.workoutCompleted);
        setForm({
          waterMl: today.waterMl?.toString() ?? "",
          sleepHours: today.sleepHours?.toString() ?? "",
          steps: today.steps?.toString() ?? "",
          proteinG: today.proteinG?.toString() ?? "",
          meditationMinutes: today.meditationMinutes?.toString() ?? "",
        });
      }
      setMounted(true);
    });
  }, []);

  async function handleSave() {
    const updated = await upsertHabitLog({
      waterMl: form.waterMl ? Number(form.waterMl) : undefined,
      sleepHours: form.sleepHours ? Number(form.sleepHours) : undefined,
      steps: form.steps ? Number(form.steps) : undefined,
      proteinG: form.proteinG ? Number(form.proteinG) : undefined,
      meditationMinutes: form.meditationMinutes ? Number(form.meditationMinutes) : undefined,
      workoutCompleted: workoutDone,
    });
    setLogs(updated);
  }

  if (!mounted) {
    return <div className="h-64 rounded-lg bg-surface-2 animate-pulse" />;
  }

  const today = logs.find((l) => l.date === todayISO());
  const recentDays = [...logs].reverse().slice(0, 7);

  return (
    <div className="space-y-6">
      <Card>
        <Badge variant="crimson" className="mb-4">Today&apos;s Habits</Badge>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          {HABITS.map((h) => (
            <Input
              key={h.key}
              label={`${h.label} (${h.unit || "count"})`}
              type="number"
              placeholder={String(h.target)}
              value={form[h.key] ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, [h.key]: e.target.value }))}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setWorkoutDone((v) => !v)}
          className={cn(
            "w-full rounded-md border px-4 py-3 text-sm font-medium transition flex items-center justify-center gap-2 mb-4",
            workoutDone
              ? "border-success bg-success/15 text-success"
              : "border-border text-muted hover:text-foreground"
          )}
        >
          <Dumbbell size={16} />
          {workoutDone ? "Workout Completed Today ✓" : "Mark Workout Completed"}
        </button>
        <Button onClick={handleSave} className="w-full">
          <Check size={16} /> Save Today&apos;s Habits
        </Button>
      </Card>

      <Card>
        <Badge variant="gold" className="mb-4">Last 7 Days</Badge>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="text-left text-xs text-muted border-b border-border">
                <th className="px-2 py-2 font-medium">Day</th>
                {HABITS.map((h) => (
                  <th key={h.key} className="px-2 py-2 font-medium text-center">
                    <h.icon size={14} className={cn("inline", h.color)} />
                  </th>
                ))}
                <th className="px-2 py-2 font-medium text-center">
                  <Dumbbell size={14} className="inline text-crimson" />
                </th>
              </tr>
            </thead>
            <tbody>
              {recentDays.map((day) => (
                <tr key={day.date} className="border-b border-border/50">
                  <td className="px-2 py-2 text-xs text-muted">{formatDate(day.date)}</td>
                  {HABITS.map((h) => (
                    <td key={h.key} className="px-2 py-2 text-center text-xs">
                      {(day[h.key as keyof HabitLog] as number | undefined) ?? "—"}
                    </td>
                  ))}
                  <td className="px-2 py-2 text-center">
                    {day.workoutCompleted ? (
                      <Check size={14} className="inline text-success" />
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {recentDays.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-2 py-6 text-center text-muted text-sm">
                    No habits logged yet — fill in today&apos;s above to start.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {today && (
        <p className="text-xs text-muted text-center">
          Targets shown are general guidelines (water ~3L, sleep ~7.5h,
          steps ~8,000, protein based on your goal) — adjust to what works
          for you.
        </p>
      )}
    </div>
  );
}
