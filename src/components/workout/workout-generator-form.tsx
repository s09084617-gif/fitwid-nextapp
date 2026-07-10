"use client";

import { useEffect, useState } from "react";
import { Sparkles, ClipboardCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { MultiToggleGroup } from "@/components/ui/multi-toggle-group";
import { WorkoutPlanDisplay } from "@/components/workout/workout-plan-display";
import { WeeklyScheduleView } from "@/components/workout/weekly-schedule-view";
import { saveWorkout } from "@/lib/db/user-data";
import { getCustomExercises } from "@/lib/db/shared-data";
import { getMyProfileSnapshot, type ProfileSnapshot } from "@/lib/db/user-data";
import {
  generateWorkout,
  generateWeeklySchedule,
  type Goal,
  type Focus,
  type WorkoutPlan,
  type WeeklySchedule,
  MUSCLE_GROUPS_SMALL_TO_BIG,
  MUSCLE_GROUP_LABELS,
} from "@/lib/workout-generator";
import type { Difficulty, Equipment, MuscleGroup } from "@/lib/workout-data";

const EQUIPMENT_OPTIONS: { value: Equipment; label: string }[] = [
  { value: "bodyweight", label: "Bodyweight" },
  { value: "dumbbell", label: "Dumbbells" },
  { value: "barbell", label: "Barbell" },
  { value: "machine", label: "Machines" },
  { value: "bands", label: "Resistance Bands" },
  { value: "kettlebell", label: "Kettlebell" },
];

const HOME_EQUIPMENT: Equipment[] = ["bodyweight", "dumbbell", "bands"];
const GYM_EQUIPMENT: Equipment[] = ["bodyweight", "dumbbell", "barbell", "machine", "bands", "kettlebell"];

const FOCUS_OPTIONS: { value: Focus; label: string }[] = [
  { value: "full_body", label: "Full Body" },
  { value: "upper_body", label: "Upper Body" },
  { value: "lower_body", label: "Lower Body" },
  { value: "push", label: "Push" },
  { value: "pull", label: "Pull" },
  { value: "legs", label: "Legs" },
  { value: "core", label: "Core" },
  { value: "cardio", label: "Cardio" },
];

function mapAssessmentGoal(goal: string): Goal {
  if (goal === "strength") return "strength";
  if (goal === "athletic_performance") return "athletic_performance";
  if (goal === "fat_loss") return "fat_loss";
  return "muscle_gain"; // muscle_gain, body_recomposition, maintain
}

export function WorkoutGeneratorForm() {
  const [goal, setGoal] = useState<Goal>("fat_loss");
  const [experience, setExperience] = useState<Difficulty>("beginner");
  const [equipment, setEquipment] = useState<Equipment[]>(["bodyweight"]);
  const [focus, setFocus] = useState<Focus>("full_body");
  const [focusMode, setFocusMode] = useState<"preset" | "custom">("preset");
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [injuries, setInjuries] = useState("");
  const [mode, setMode] = useState<"single" | "weekly">("single");
  const [daysPerWeek, setDaysPerWeek] = useState(4);

  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [schedule, setSchedule] = useState<WeeklySchedule | null>(null);
  const [savedDayIds, setSavedDayIds] = useState<Set<number>>(new Set());
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customExercises, setCustomExercises] = useState<
    Awaited<ReturnType<typeof getCustomExercises>>
  >([]);
  const [profile, setProfile] = useState<ProfileSnapshot | null>(null);
  const [usingProfile, setUsingProfile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    Promise.all([getCustomExercises(), getMyProfileSnapshot()]).then(([exercises, snapshot]) => {
      setCustomExercises(exercises);
      setProfile(snapshot);
      setMounted(true);
    });
  }, []);

  function applyProfile() {
    if (!profile) return;
    setGoal(mapAssessmentGoal(profile.goal));
    if (profile.experience) setExperience(profile.experience as Difficulty);
    if (profile.equipment && profile.equipment.length > 0) {
      setEquipment(profile.equipment as Equipment[]);
    }
    if (profile.injuries) setInjuries(profile.injuries);
    if (profile.workoutDaysPerWeek) setDaysPerWeek(profile.workoutDaysPerWeek);
    setUsingProfile(true);
  }

  function handleGenerate() {
    if (equipment.length === 0) {
      setError("Select at least one equipment option.");
      return;
    }
    if (focusMode === "custom" && muscleGroups.length === 0) {
      setError("Select at least one muscle to target.");
      return;
    }
    setError(null);
    setSaved(false);
    setSavedDayIds(new Set());

    if (mode === "weekly") {
      setPlan(null);
      setSchedule(
        generateWeeklySchedule(
          { goal, experience, equipment, injuries },
          daysPerWeek,
          customExercises
        )
      );
    } else {
      setSchedule(null);
      setPlan(
        generateWorkout(
          {
            goal,
            experience,
            equipment,
            focus,
            muscleGroups: focusMode === "custom" ? muscleGroups : undefined,
            injuries,
          },
          customExercises
        )
      );
    }
  }

  async function handleSave() {
    if (!plan) return;
    await saveWorkout(plan);
    setSaved(true);
    window.dispatchEvent(new CustomEvent("fitwid:workouts-updated"));
  }

  async function handleSaveDay(dayIndex: number) {
    if (!schedule) return;
    const day = schedule.days[dayIndex];
    await saveWorkout(day.plan);
    setSavedDayIds((prev) => new Set(prev).add(dayIndex));
    window.dispatchEvent(new CustomEvent("fitwid:workouts-updated"));
  }

  return (
    <div className="space-y-6">
      {mounted && profile && !usingProfile && (
        <Card className="border-gold/40 bg-gold/5">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0">
              <ClipboardCheck size={16} className="text-gold" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">Use your Body Assessment data?</p>
              <p className="text-xs text-muted mb-3">
                We found your goal, experience, equipment, and injury notes
                from your last assessment — apply them here instead of
                re-entering everything.
              </p>
              <Button size="sm" variant="gold" onClick={applyProfile}>
                <Sparkles size={14} /> Apply My Assessment Data
              </Button>
            </div>
          </div>
        </Card>
      )}
      {mounted && !profile && (
        <Card>
          <p className="text-sm text-muted">
            You haven&apos;t taken a Body Assessment yet — take one to
            personalize this automatically next time, or just fill in the
            options below manually.
          </p>
        </Card>
      )}
      {usingProfile && (
        <Badge variant="gold">Using your Body Assessment data</Badge>
      )}

      <Card>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMode("single")}
              className={
                mode === "single"
                  ? "rounded-md border border-crimson bg-crimson/15 text-crimson px-3 py-2.5 text-sm font-medium"
                  : "rounded-md border border-border px-3 py-2.5 text-sm font-medium text-muted hover:text-foreground"
              }
            >
              Single Workout
            </button>
            <button
              type="button"
              onClick={() => setMode("weekly")}
              className={
                mode === "weekly"
                  ? "rounded-md border border-crimson bg-crimson/15 text-crimson px-3 py-2.5 text-sm font-medium"
                  : "rounded-md border border-border px-3 py-2.5 text-sm font-medium text-muted hover:text-foreground"
              }
            >
              Weekly Schedule
            </button>
          </div>

          <ToggleGroup
            label="Goal"
            value={goal}
            onChange={setGoal}
            options={[
              { value: "fat_loss", label: "Fat Loss" },
              { value: "muscle_gain", label: "Muscle Gain" },
              { value: "strength", label: "Strength" },
              { value: "athletic_performance", label: "Athletic Performance" },
              { value: "endurance", label: "Endurance" },
            ]}
          />

          <ToggleGroup
            label="Experience"
            value={experience}
            onChange={setExperience}
            options={[
              { value: "beginner", label: "Beginner" },
              { value: "intermediate", label: "Intermediate" },
              { value: "advanced", label: "Advanced" },
            ]}
          />

          {mode === "weekly" && (
            <Select
              label="Workout Days/Week"
              value={String(daysPerWeek)}
              onChange={(e) => setDaysPerWeek(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                <option key={d} value={d}>
                  {d} day{d > 1 ? "s" : ""}/week
                </option>
              ))}
            </Select>
          )}

          <div className="flex flex-col gap-1.5 w-full">
            <span className="text-sm font-medium text-foreground">
              Where are you training?
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setEquipment(HOME_EQUIPMENT)}
                className="rounded-md border border-border bg-surface px-3 py-2.5 text-sm font-medium text-muted hover:text-foreground hover:border-crimson/50 transition"
              >
                🏠 Home
              </button>
              <button
                type="button"
                onClick={() => setEquipment(GYM_EQUIPMENT)}
                className="rounded-md border border-border bg-surface px-3 py-2.5 text-sm font-medium text-muted hover:text-foreground hover:border-crimson/50 transition"
              >
                🏋️ Full Gym
              </button>
            </div>
            <p className="text-[11px] text-muted">
              Quick presets — fine-tune the exact equipment below.
            </p>
          </div>

          <MultiToggleGroup
            label="Available Equipment"
            values={equipment}
            onChange={setEquipment}
            options={EQUIPMENT_OPTIONS}
          />

          {mode === "single" && (
            <div className="flex flex-col gap-1.5 w-full">
              <span className="text-sm font-medium text-foreground">Focus</span>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setFocusMode("preset")}
                  className={
                    focusMode === "preset"
                      ? "rounded-md border border-crimson bg-crimson/15 text-crimson px-3 py-2 text-sm font-medium"
                      : "rounded-md border border-border px-3 py-2 text-sm font-medium text-muted hover:text-foreground"
                  }
                >
                  Preset Category
                </button>
                <button
                  type="button"
                  onClick={() => setFocusMode("custom")}
                  className={
                    focusMode === "custom"
                      ? "rounded-md border border-crimson bg-crimson/15 text-crimson px-3 py-2 text-sm font-medium"
                      : "rounded-md border border-border px-3 py-2 text-sm font-medium text-muted hover:text-foreground"
                  }
                >
                  Pick Muscles
                </button>
              </div>

              {focusMode === "preset" ? (
                <Select value={focus} onChange={(e) => setFocus(e.target.value as Focus)}>
                  {FOCUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              ) : (
                <>
                  <p className="text-[11px] text-muted mb-1">
                    Select any combination — ordered small to big.
                  </p>
                  <MultiToggleGroup
                    label="Target Muscles"
                    values={muscleGroups}
                    onChange={setMuscleGroups}
                    options={MUSCLE_GROUPS_SMALL_TO_BIG.map((m) => ({
                      value: m,
                      label: MUSCLE_GROUP_LABELS[m],
                    }))}
                  />
                </>
              )}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Injuries (optional)
            </label>
            <textarea
              value={injuries}
              onChange={(e) => setInjuries(e.target.value)}
              rows={2}
              placeholder="e.g. Lower back tweak — be careful with deadlifts"
              className="w-full rounded-md border border-border bg-surface px-4 py-2.5 text-base sm:text-sm text-foreground placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson/50"
            />
            <p className="text-[11px] text-muted">
              We&apos;ll softly avoid prioritizing exercises for the area you
              mention — this isn&apos;t a substitute for a coach or
              physio&apos;s judgment.
            </p>
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <Button size="lg" className="w-full" onClick={handleGenerate}>
            Generate {mode === "weekly" ? "Weekly Schedule" : "Workout"}
          </Button>
        </div>
      </Card>

      {plan && (
        <WorkoutPlanDisplay
          plan={plan}
          onSave={handleSave}
          onRegenerate={handleGenerate}
          saved={saved}
        />
      )}

      {schedule && (
        <WeeklyScheduleView
          schedule={schedule}
          onSaveDay={handleSaveDay}
          savedDayIds={savedDayIds}
        />
      )}
    </div>
  );
}
