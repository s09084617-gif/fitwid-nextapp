"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExerciseDetail } from "@/components/exercises/exercise-detail";
import { EXERCISES, type Exercise, type MuscleGroup, type Equipment, type Difficulty } from "@/lib/workout-data";
import { getCustomExercises } from "@/lib/db/shared-data";

const MUSCLE_GROUPS: (MuscleGroup | "all")[] = [
  "all", "chest", "back", "shoulders", "biceps", "triceps",
  "quads", "hamstrings", "glutes", "calves", "core", "cardio",
];
const EQUIPMENT_OPTIONS: (Equipment | "all")[] = [
  "all", "bodyweight", "dumbbell", "barbell", "machine", "bands", "kettlebell",
];
const DIFFICULTY_OPTIONS: (Difficulty | "all")[] = ["all", "beginner", "intermediate", "advanced"];

const DIFFICULTY_VARIANT = {
  beginner: "success",
  intermediate: "gold",
  advanced: "danger",
} as const;

export function ExerciseLibrary() {
  const [query, setQuery] = useState("");
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup | "all">("all");
  const [equipment, setEquipment] = useState<Equipment | "all">("all");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [customExercises, setCustomExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    getCustomExercises().then(setCustomExercises);
  }, []);

  const allExercises = useMemo(
    () => [...EXERCISES, ...customExercises],
    [customExercises]
  );

  const filtered = useMemo(() => {
    return allExercises.filter((e) => {
      const matchesQuery = e.name.toLowerCase().includes(query.toLowerCase());
      const matchesMuscle = muscleGroup === "all" || e.muscleGroup === muscleGroup;
      const matchesEquipment = equipment === "all" || e.equipment === equipment;
      const matchesDifficulty = difficulty === "all" || e.difficulty === difficulty;
      return matchesQuery && matchesMuscle && matchesEquipment && matchesDifficulty;
    });
  }, [allExercises, query, muscleGroup, equipment, difficulty]);

  const selected = allExercises.find((e) => e.id === selectedId);

  if (selected) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setSelectedId(null)}
          className="text-sm text-crimson font-medium mb-4 flex items-center gap-1"
        >
          <X size={14} /> Back to library
        </button>
        <ExerciseDetail exercise={selected} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search exercises..."
            className="w-full rounded-md border border-border bg-surface pl-9 pr-4 py-2.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson/50"
          />
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-[11px] text-muted uppercase tracking-wide mb-1.5">Muscle Group</p>
            <div className="flex flex-wrap gap-1.5">
              {MUSCLE_GROUPS.map((mg) => (
                <button
                  key={mg}
                  onClick={() => setMuscleGroup(mg)}
                  className={`rounded-full px-3 py-1 text-xs font-medium border transition ${
                    muscleGroup === mg
                      ? "border-crimson bg-crimson/15 text-crimson"
                      : "border-border text-muted hover:text-foreground"
                  }`}
                >
                  {mg === "all" ? "All" : mg}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] text-muted uppercase tracking-wide mb-1.5">Equipment</p>
            <div className="flex flex-wrap gap-1.5">
              {EQUIPMENT_OPTIONS.map((eq) => (
                <button
                  key={eq}
                  onClick={() => setEquipment(eq)}
                  className={`rounded-full px-3 py-1 text-xs font-medium border transition ${
                    equipment === eq
                      ? "border-gold bg-gold/15 text-gold"
                      : "border-border text-muted hover:text-foreground"
                  }`}
                >
                  {eq === "all" ? "All" : eq}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] text-muted uppercase tracking-wide mb-1.5">Difficulty</p>
            <div className="flex flex-wrap gap-1.5">
              {DIFFICULTY_OPTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`rounded-full px-3 py-1 text-xs font-medium border transition ${
                    difficulty === d
                      ? "border-success bg-success/15 text-success"
                      : "border-border text-muted hover:text-foreground"
                  }`}
                >
                  {d === "all" ? "All" : d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <p className="text-xs text-muted">{filtered.length} exercises</p>

      <div className="grid sm:grid-cols-2 gap-3">
        {filtered.map((ex) => (
          <button
            key={ex.id}
            onClick={() => setSelectedId(ex.id)}
            className="text-left rounded-lg border border-border bg-surface p-4 transition-all duration-300 hover:border-crimson/50 hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={DIFFICULTY_VARIANT[ex.difficulty]}>{ex.difficulty}</Badge>
              <Badge variant="neutral">{ex.equipment}</Badge>
            </div>
            <p className="font-semibold text-sm mb-1">{ex.name}</p>
            <p className="text-xs text-muted">{ex.cue}</p>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted col-span-2 text-center py-8">
            No exercises match your filters.
          </p>
        )}
      </div>
    </div>
  );
}
