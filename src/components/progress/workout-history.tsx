"use client";

import { useEffect, useState } from "react";
import { Trash2, Dumbbell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  getWorkoutHistory,
  addWorkoutHistoryEntry,
  deleteWorkoutHistoryEntry,
  type WorkoutHistoryEntry,
} from "@/lib/local-store";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function WorkoutHistory() {
  const [history, setHistory] = useState<WorkoutHistoryEntry[]>([]);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage on mount
    setHistory(getWorkoutHistory());
    setMounted(true);
  }, []);

  function handleLog() {
    if (!title.trim()) return;
    const updated = addWorkoutHistoryEntry({
      title: title.trim(),
      durationMinutes: duration ? Number(duration) : undefined,
    });
    setHistory(updated);
    setTitle("");
    setDuration("");
  }

  function handleDelete(id: string) {
    setHistory(deleteWorkoutHistoryEntry(id));
  }

  if (!mounted) {
    return <div className="h-48 rounded-lg bg-surface-2 animate-pulse" />;
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <Badge variant="success">Workout History</Badge>
        <span className="text-xs text-muted">
          {history.length} sessions logged
        </span>
      </div>

      <div className="grid sm:grid-cols-[1fr_auto_auto] gap-3 mb-6">
        <Input
          label="Workout completed"
          placeholder="e.g. Push Day, Leg Day, 5K Run"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          label="Duration (min)"
          type="number"
          placeholder="45"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full sm:w-28"
        />
        <div className="flex items-end">
          <Button onClick={handleLog} className="w-full sm:w-auto">
            Log
          </Button>
        </div>
      </div>

      {history.length === 0 ? (
        <p className="text-sm text-muted">
          No workouts logged yet. Finished one from the Workout Generator?
          Log it here to build your history.
        </p>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {history.map((h) => (
            <div
              key={h.id}
              className="flex items-center gap-3 rounded-md border border-border px-3 py-2.5"
            >
              <div className="h-8 w-8 rounded-md bg-success/15 border border-success/30 flex items-center justify-center shrink-0">
                <Dumbbell size={14} className="text-success" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{h.title}</p>
                <p className="text-xs text-muted">
                  {formatDate(h.date)}
                  {h.durationMinutes ? ` · ${h.durationMinutes} min` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(h.id)}
                className="text-muted hover:text-danger transition p-1 shrink-0"
                aria-label="Delete entry"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
