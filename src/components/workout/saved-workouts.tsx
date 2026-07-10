"use client";

import { useEffect, useState } from "react";
import { Trash2, ChevronDown, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExerciseDetailCard } from "@/components/workout/exercise-detail-card";
import { getSavedWorkouts, deleteWorkout, toggleFavoriteWorkout } from "@/lib/db/user-data";
import type { WorkoutPlan } from "@/lib/workout-generator";
import { cn } from "@/lib/utils";

export function SavedWorkouts() {
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  useEffect(() => {
    function refresh() {
      getSavedWorkouts().then((list) => {
        setWorkouts(list);
        setMounted(true);
      });
    }
    refresh();
    window.addEventListener("fitwid:workouts-updated", refresh);
    return () => window.removeEventListener("fitwid:workouts-updated", refresh);
  }, []);

  function handleDelete(id: string) {
    deleteWorkout(id).then(setWorkouts);
  }

  function handleToggleFavorite(w: WorkoutPlan) {
    toggleFavoriteWorkout(w.id, !w.isFavorite).then(setWorkouts);
  }

  if (!mounted) return null;

  const visible = favoritesOnly ? workouts.filter((w) => w.isFavorite) : workouts;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <Badge variant="gold">Saved Workouts</Badge>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFavoritesOnly((v) => !v)}
            className={cn(
              "text-xs flex items-center gap-1 px-2.5 py-1 rounded-full border transition",
              favoritesOnly ? "border-gold text-gold bg-gold/10" : "border-border text-muted"
            )}
          >
            <Star size={11} className={favoritesOnly ? "fill-gold" : ""} /> Favorites
          </button>
          <span className="text-xs text-muted">{visible.length} shown</span>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-muted">
          {favoritesOnly
            ? "No favorites yet — star a saved workout to pin it here."
            : "No saved workouts yet — generate one above and hit \u201cSave Workout\u201d."}
        </p>
      ) : (
        <div className="space-y-2">
          {visible.map((w) => {
            const isOpen = openId === w.id;
            return (
              <div key={w.id} className="rounded-md border border-border overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : w.id)}
                    className="flex-1 flex items-center justify-between text-left min-w-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{w.title}</p>
                      <p className="text-xs text-muted">
                        {new Date(w.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}{" "}
                        · {w.exercises.length} exercises · ~
                        {w.estimatedMinutes} min
                      </p>
                    </div>
                    <ChevronDown
                      size={16}
                      className={cn(
                        "shrink-0 text-muted transition-transform ml-2",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleFavorite(w)}
                    className="shrink-0 text-muted hover:text-gold transition p-1"
                    aria-label={w.isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Star size={16} className={w.isFavorite ? "fill-gold text-gold" : ""} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(w.id)}
                    className="shrink-0 text-muted hover:text-danger transition p-1"
                    aria-label="Delete workout"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {isOpen && (
                  <div className="border-t border-border px-4 py-3 space-y-2 bg-surface-2/50">
                    {w.exercises.map((we, i) => (
                      <ExerciseDetailCard key={we.exercise.id} we={we} index={i} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
