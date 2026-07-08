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
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAssessmentHistory } from "@/lib/db/user-data";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function BodyFatHistory() {
  const [data, setData] = useState<{ date: string; bodyFat: number }[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    getAssessmentHistory().then((history) => {
      setData(
        history.map((a) => ({
          date: a.savedAt,
          bodyFat: a.result.bodyFatPercent,
        }))
      );
      setMounted(true);
    });
  }, []);

  if (!mounted) {
    return <div className="h-48 rounded-lg bg-surface-2 animate-pulse" />;
  }

  return (
    <Card>
      <Badge variant="gold" className="mb-4">
        Body Fat % Over Time
      </Badge>
      {data.length === 0 ? (
        <p className="text-sm text-muted">
          No assessments yet — take a Body Assessment to start tracking your
          body fat % over time.
        </p>
      ) : data.length === 1 ? (
        <p className="text-sm text-muted">
          Latest: <span className="text-foreground font-medium">{data[0].bodyFat}%</span>.
          Take another assessment later to see the trend.
        </p>
      ) : (
        <div className="h-56 -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tickFormatter={formatDate} stroke="var(--muted)" fontSize={12} />
              <YAxis
                domain={["dataMin - 2", "dataMax + 2"]}
                stroke="var(--muted)"
                fontSize={12}
                width={40}
              />
              <Tooltip
                labelFormatter={(label) => formatDate(label as string)}
                formatter={(value) => [`${value}%`, "Body Fat"]}
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="bodyFat"
                stroke="var(--gold)"
                strokeWidth={2}
                dot={{ r: 3, fill: "var(--gold)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
