"use client";

import { useEffect, useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  EXERCISES,
  type MuscleGroup,
  type Equipment,
  type Difficulty,
  type Exercise,
} from "@/lib/workout-data";
import { getCustomExercises } from "@/lib/db/shared-data";
import { addCustomExerciseAction, deleteCustomExerciseAction } from "./actions";

const MUSCLE_GROUPS: MuscleGroup[] = [
  "chest", "back", "shoulders", "biceps", "triceps",
  "quads", "hamstrings", "glutes", "calves", "core", "cardio",
];
const EQUIPMENT_OPTIONS: Equipment[] = [
  "bodyweight", "dumbbell", "barbell", "machine", "bands", "kettlebell",
];
const DIFFICULTIES: Difficulty[] = ["beginner", "intermediate", "advanced"];

export default function AdminExercisesPage() {
  const [custom, setCustom] = useState<Exercise[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    muscleGroup: "chest" as MuscleGroup,
    equipment: "bodyweight" as Equipment,
    difficulty: "beginner" as Difficulty,
    cue: "",
  });

  useEffect(() => {
    getCustomExercises().then((list) => {
      setCustom(list);
      setMounted(true);
    });
  }, []);

  function refresh() {
    getCustomExercises().then(setCustom);
  }

  function handleAdd() {
    if (!form.name.trim()) return;
    const exercise: Exercise = {
      id: `custom_${Date.now()}`,
      name: form.name.trim(),
      muscleGroup: form.muscleGroup,
      equipment: form.equipment,
      difficulty: form.difficulty,
      cue: form.cue.trim() || "No cue provided.",
    };
    setError(null);
    startTransition(async () => {
      try {
        await addCustomExerciseAction(exercise);
        refresh();
        setForm({ ...form, name: "", cue: "" });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to add");
      }
    });
  }

  function handleDelete(id: string) {
    setError(null);
    startTransition(async () => {
      try {
        await deleteCustomExerciseAction(id);
        refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to delete");
      }
    });
  }

  if (!mounted) {
    return <div className="h-48 rounded-lg bg-surface-2 animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <Badge variant="crimson" className="mb-4">
          Add Custom Exercise
        </Badge>
        <p className="text-xs text-muted mb-4">
          Custom exercises are saved to the shared database and merged into
          the Workout Generator&apos;s pool for every user, alongside the
          built-in {EXERCISES.length} exercises.
        </p>
        {error && <p className="text-sm text-danger mb-4">{error}</p>}
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <Input
            label="Exercise Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Cable Face Pull"
          />
          <Input
            label="Coaching Cue"
            value={form.cue}
            onChange={(e) => setForm({ ...form, cue: e.target.value })}
            placeholder="e.g. Pull to eye level, squeeze rear delts"
          />
        </div>
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <Select
            label="Muscle Group"
            value={form.muscleGroup}
            onChange={(e) =>
              setForm({ ...form, muscleGroup: e.target.value as MuscleGroup })
            }
          >
            {MUSCLE_GROUPS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>
          <Select
            label="Equipment"
            value={form.equipment}
            onChange={(e) =>
              setForm({ ...form, equipment: e.target.value as Equipment })
            }
          >
            {EQUIPMENT_OPTIONS.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </Select>
          <Select
            label="Difficulty"
            value={form.difficulty}
            onChange={(e) =>
              setForm({ ...form, difficulty: e.target.value as Difficulty })
            }
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </Select>
        </div>
        <Button onClick={handleAdd} disabled={isPending}>
          Add Exercise
        </Button>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <Badge variant="gold">Custom Exercises</Badge>
          <span className="text-xs text-muted">{custom.length} added</span>
        </div>
        {custom.length === 0 ? (
          <p className="text-sm text-muted">
            No custom exercises yet — the generator uses the built-in{" "}
            {EXERCISES.length}-exercise library.
          </p>
        ) : (
          <div className="space-y-2">
            {custom.map((ex) => (
              <div
                key={ex.id}
                className="flex items-center justify-between rounded-md border border-border px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium">{ex.name}</p>
                  <p className="text-xs text-muted">
                    {ex.muscleGroup} · {ex.equipment} · {ex.difficulty}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(ex.id)}
                  className="text-muted hover:text-danger transition p-1"
                  aria-label="Delete exercise"
                  disabled={isPending}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
