"use client";

import { useEffect, useState } from "react";
import { Trash2, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSavedWorkouts, deleteWorkout } from "@/lib/local-store";
import type { WorkoutPlan } from "@/lib/workout-generator";
import { cn } from "@/lib/utils";

export function SavedWorkouts() {
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    function refresh() {
      setWorkouts(getSavedWorkouts());
    }
    refresh();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration guard, same pattern as ThemeToggle/DashboardClient
    setMounted(true);
    window.addEventListener("fitwid:workouts-updated", refresh);
    return () => window.removeEventListener("fitwid:workouts-updated", refresh);
  }, []);

  function handleDelete(id: string) {
    setWorkouts(deleteWorkout(id));
  }

  if (!mounted) return null;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <Badge variant="gold">Saved Workouts</Badge>
        <span className="text-xs text-muted">{workouts.length} saved</span>
      </div>

      {workouts.length === 0 ? (
        <p className="text-sm text-muted">
          No saved workouts yet — generate one above and hit &ldquo;Save
          Workout&rdquo;.
        </p>
      ) : (
        <div className="space-y-2">
          {workouts.map((w) => {
            const isOpen = openId === w.id;
            return (
              <div
                key={w.id}
                className="rounded-md border border-border overflow-hidden"
              >
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
                      <div
                        key={we.exercise.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-foreground/90">
                          {i + 1}. {we.exercise.name}
                        </span>
                        <span className="text-muted text-xs shrink-0 ml-2">
                          {we.sets} × {we.reps}
                        </span>
                      </div>
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
