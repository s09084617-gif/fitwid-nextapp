"use client";

import { useEffect, useState } from "react";
import { Trash2, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  getPersonalRecords,
  addPersonalRecord,
  deletePersonalRecord,
  type PersonalRecord,
} from "@/lib/db/user-data";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function PersonalRecords() {
  const [records, setRecords] = useState<PersonalRecord[]>([]);
  const [mounted, setMounted] = useState(false);
  const [exerciseName, setExerciseName] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [reps, setReps] = useState("");

  useEffect(() => {
    getPersonalRecords().then((list) => {
      setRecords(list);
      setMounted(true);
    });
  }, []);

  async function handleAdd() {
    if (!exerciseName.trim()) return;
    const updated = await addPersonalRecord({
      exerciseName: exerciseName.trim(),
      weightKg: weightKg ? Number(weightKg) : undefined,
      reps: reps ? Number(reps) : undefined,
    });
    setRecords(updated);
    setExerciseName("");
    setWeightKg("");
    setReps("");
  }

  async function handleDelete(id: string) {
    setRecords(await deletePersonalRecord(id));
  }

  if (!mounted) {
    return <div className="h-48 rounded-lg bg-surface-2 animate-pulse" />;
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <Badge variant="gold">Personal Records</Badge>
        <span className="text-xs text-muted">{records.length} logged</span>
      </div>

      <div className="grid sm:grid-cols-[1fr_auto_auto_auto] gap-3 mb-6">
        <Input
          label="Exercise"
          placeholder="e.g. Bench Press"
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
        />
        <Input
          label="Weight (kg)"
          type="number"
          placeholder="80"
          value={weightKg}
          onChange={(e) => setWeightKg(e.target.value)}
          className="w-full sm:w-28"
        />
        <Input
          label="Reps"
          type="number"
          placeholder="5"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          className="w-full sm:w-24"
        />
        <div className="flex items-end">
          <Button onClick={handleAdd} className="w-full sm:w-auto">
            Add PR
          </Button>
        </div>
      </div>

      {records.length === 0 ? (
        <p className="text-sm text-muted">
          No personal records yet — log your first PR above.
        </p>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {records.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-3 rounded-md border border-border px-3 py-2.5"
            >
              <div className="h-8 w-8 rounded-md bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0">
                <Award size={14} className="text-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{r.exerciseName}</p>
                <p className="text-xs text-muted">
                  {[
                    r.weightKg ? `${r.weightKg}kg` : null,
                    r.reps ? `${r.reps} reps` : null,
                  ]
                    .filter(Boolean)
                    .join(" × ")}
                  {" · "}
                  {formatDate(r.date)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(r.id)}
                className="text-muted hover:text-danger transition p-1 shrink-0"
                aria-label="Delete PR"
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
