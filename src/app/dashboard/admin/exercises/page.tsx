"use client";

import { useEffect, useState } from "react";
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
import {
  getCustomExercises,
  addCustomExercise,
  deleteCustomExercise,
} from "@/lib/local-store";

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
  const [form, setForm] = useState({
    name: "",
    muscleGroup: "chest" as MuscleGroup,
    equipment: "bodyweight" as Equipment,
    difficulty: "beginner" as Difficulty,
    cue: "",
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage on mount
    setCustom(getCustomExercises());
    setMounted(true);
  }, []);

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
    setCustom(addCustomExercise(exercise));
    setForm({ ...form, name: "", cue: "" });
  }

  function handleDelete(id: string) {
    setCustom(deleteCustomExercise(id));
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
          Custom exercises are merged into the Workout Generator&apos;s pool
          in this browser — they show up alongside the built-in{" "}
          {EXERCISES.length} exercises when generating workouts.
        </p>
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
        <Button onClick={handleAdd}>Add Exercise</Button>
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
