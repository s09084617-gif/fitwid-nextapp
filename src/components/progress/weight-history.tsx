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
import { Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getWeightLog, addWeightEntry, deleteWeightEntry, todayISO } from "@/lib/db/user-data";
import type { WeightEntry } from "@/lib/db/user-data";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export function WeightHistory() {
  const [log, setLog] = useState<WeightEntry[]>([]);
  const [quickWeight, setQuickWeight] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    getWeightLog().then((l) => {
      setLog(l);
      setMounted(true);
    });
  }, []);

  async function handleLog() {
    const kg = Number(quickWeight);
    if (!kg || kg < 30 || kg > 300) return;
    setLog(await addWeightEntry(kg));
    setQuickWeight("");
  }

  async function handleDelete(date: string) {
    setLog(await deleteWeightEntry(date));
  }

  if (!mounted) {
    return <div className="h-48 rounded-lg bg-surface-2 animate-pulse" />;
  }

  const sorted = [...log].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <Badge variant="crimson">Weight Tracking</Badge>
        <div className="flex items-end gap-2">
          <Input
            label={`Log weight for ${formatDate(todayISO())} (kg)`}
            type="number"
            placeholder="78.5"
            value={quickWeight}
            onChange={(e) => setQuickWeight(e.target.value)}
            className="w-40"
          />
          <Button onClick={handleLog}>Log</Button>
        </div>
      </div>

      {log.length === 0 ? (
        <p className="text-sm text-muted">
          No weight logged yet — enter today&apos;s weight above to start
          your trend line.
        </p>
      ) : (
        <>
          <div className="h-56 -ml-4 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={log}>
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

          <div className="max-h-64 overflow-y-auto space-y-1.5">
            {sorted.map((entry) => (
              <div
                key={entry.date}
                className="flex items-center justify-between text-sm rounded-md border border-border px-3 py-2"
              >
                <span className="text-muted">{formatDate(entry.date)}</span>
                <span className="font-medium">{entry.weightKg} kg</span>
                <button
                  type="button"
                  onClick={() => handleDelete(entry.date)}
                  className="text-muted hover:text-danger transition p-1"
                  aria-label="Delete entry"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
