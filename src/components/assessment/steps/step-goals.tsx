"use client";

import { Flame, Dumbbell, Repeat, TrendingUp, Zap } from "lucide-react";
import { GoalCard } from "@/components/assessment/goal-card";
import type { Goal } from "@/lib/assessment";

const GOALS: { value: Goal; label: string; description: string; icon: typeof Flame }[] = [
  {
    value: "fat_loss",
    label: "Fat Loss",
    description: "Lose fat while keeping the muscle you've already built.",
    icon: Flame,
  },
  {
    value: "muscle_gain",
    label: "Muscle Gain",
    description: "Build size and strength with a calorie surplus.",
    icon: Dumbbell,
  },
  {
    value: "body_recomposition",
    label: "Body Recomposition",
    description: "Lose fat and build muscle at the same time.",
    icon: Repeat,
  },
  {
    value: "strength",
    label: "Strength",
    description: "Get stronger on your main lifts — aesthetics follow.",
    icon: TrendingUp,
  },
  {
    value: "athletic_performance",
    label: "Athletic Performance",
    description: "Power, speed, and conditioning for sport.",
    icon: Zap,
  },
];

interface StepGoalsProps {
  goal: Goal;
  onChange: (goal: Goal) => void;
}

export function StepGoals({ goal, onChange }: StepGoalsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl sm:text-3xl mb-1.5">What&apos;s your goal?</h2>
        <p className="text-sm text-muted">
          This shapes your calories, macros, and workout split.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {GOALS.map((g) => (
          <GoalCard
            key={g.value}
            icon={g.icon}
            label={g.label}
            description={g.description}
            selected={goal === g.value}
            onSelect={() => onChange(g.value)}
          />
        ))}
      </div>
    </div>
  );
}
