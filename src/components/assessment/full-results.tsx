import Link from "next/link";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { WorkoutPlanDisplay } from "@/components/workout/workout-plan-display";
import { MealPlanDisplay } from "@/components/nutrition/meal-plan-display";
import type { AssessmentResult } from "@/lib/assessment";
import type { WorkoutPlan } from "@/lib/workout-generator";
import type { MealPlan } from "@/lib/meal-plan-generator";
import { cn } from "@/lib/utils";

function scoreColor(score: number) {
  if (score < 40) return "text-danger";
  if (score < 61) return "text-warning";
  if (score < 81) return "text-gold";
  return "text-success";
}

export function FullAssessmentResults({
  result,
  workout,
  mealPlan,
  onRetake,
}: {
  result: AssessmentResult;
  workout: WorkoutPlan;
  mealPlan: MealPlan;
  onRetake: () => void;
}) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference * (1 - result.fitnessScore / 100);

  return (
    <div className="space-y-8">
      {result.hasMedicalFlag && (
        <Card className="border-warning/40 bg-warning/5 flex items-start gap-3">
          <AlertTriangle size={20} className="text-warning shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm mb-1">
              Please get medical clearance first
            </p>
            <p className="text-sm text-muted">
              You noted a medical condition. This assessment is general
              fitness guidance, not medical advice — talk to a doctor before
              starting the plan below, especially given what you shared.
            </p>
          </div>
        </Card>
      )}

      {/* Score */}
      <Card className="flex flex-col sm:flex-row items-center gap-8">
        <div className="relative h-32 w-32 shrink-0">
          <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
            <circle cx="60" cy="60" r="54" fill="none" stroke="var(--border)" strokeWidth="10" />
            <circle
              cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="10"
              strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
              className={scoreColor(result.fitnessScore)}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-3xl">{result.fitnessScore}</span>
            <span className="text-[10px] text-muted uppercase tracking-wide">/ 100</span>
          </div>
        </div>
        <div className="text-center sm:text-left">
          <Badge
            variant={
              result.fitnessScore < 40 ? "danger" : result.fitnessScore < 61 ? "warning" : result.fitnessScore < 81 ? "gold" : "success"
            }
            className="mb-2"
          >
            {result.fitnessLabel}
          </Badge>
          <h3 className="font-display text-2xl mb-1">Your Fitness Score</h3>
          <p className="text-sm text-muted max-w-sm">{result.bodyClassification}</p>
        </div>
      </Card>

      {/* Metrics grid */}
      <div className="grid sm:grid-cols-2 gap-6">
        <Card>
          <Badge variant="crimson" className="mb-3">BMI</Badge>
          <CardTitle>{result.bmi} — {result.bmiCategory}</CardTitle>
          <CardDescription>Body Mass Index (weight / height²)</CardDescription>
        </Card>
        <Card>
          <Badge variant="gold" className="mb-3">Body Fat</Badge>
          <CardTitle>{result.bodyFatPercent}% — {result.bodyFatCategory}</CardTitle>
          <CardDescription>
            {result.bodyFatMethod === "navy" ? "US Navy circumference method" : "BMI-based estimate — add waist/neck measurements for accuracy"}
          </CardDescription>
        </Card>
        <Card>
          <Badge variant="neutral" className="mb-3">BMR</Badge>
          <CardTitle>{result.bmr} kcal/day</CardTitle>
          <CardDescription>Calories your body burns at complete rest</CardDescription>
        </Card>
        <Card>
          <Badge variant="success" className="mb-3">TDEE</Badge>
          <CardTitle>{result.tdee} kcal/day</CardTitle>
          <CardDescription>Total daily energy expenditure, including activity</CardDescription>
        </Card>
      </div>

      {/* Macros */}
      <Card>
        <Badge variant="crimson" className="mb-4">Daily Nutrition Target</Badge>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="font-display text-3xl text-gold">{result.macros.calories}</p>
            <p className="text-xs text-muted">kcal / day</p>
          </div>
          <div>
            <p className="font-display text-3xl">{result.macros.proteinG}g</p>
            <p className="text-xs text-muted">Protein</p>
          </div>
          <div>
            <p className="font-display text-3xl">{result.macros.carbsG}g</p>
            <p className="text-xs text-muted">Carbs</p>
          </div>
          <div>
            <p className="font-display text-3xl">{result.macros.fatG}g</p>
            <p className="text-xs text-muted">Fat</p>
          </div>
        </div>
      </Card>

      {/* 90-Day Roadmap */}
      <Card>
        <Badge variant="gold" className="mb-4">Your 90-Day Roadmap</Badge>
        <div className="space-y-4">
          {result.roadmap.map((phase) => (
            <div key={phase.phase} className="rounded-md border border-border p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-sm">
                  Phase {phase.phase}: {phase.title}
                </p>
                <span className="text-xs text-muted">{phase.weeks}</span>
              </div>
              <ul className="space-y-1 mb-3">
                {phase.focus.map((f) => (
                  <li key={f} className="text-xs text-foreground/80 flex items-start gap-1.5">
                    <CheckCircle2 size={12} className="text-crimson shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-muted italic">{phase.expectedOutcome}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Recommendations / tips */}
      <Card>
        <Badge variant="crimson" className="mb-3">Personalized Guidance</Badge>
        <h3 className="font-display text-2xl mb-2">Recommendations</h3>
        <p className="text-sm text-foreground/90 mb-5">{result.recommendations.summary}</p>
        <ul className="space-y-2 mb-6">
          {result.recommendations.tips.map((tip) => (
            <li key={tip} className="text-sm text-muted flex gap-2 items-start">
              <span className="text-crimson mt-0.5">•</span>
              {tip}
            </li>
          ))}
        </ul>
        <Link
          href="/#pricing"
          className={buttonVariants({ variant: "primary", size: "md" })}
        >
          Start &ldquo;{result.recommendations.suggestedProgram}&rdquo;
        </Link>
      </Card>

      {/* Workout recommendation */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gold mb-3">
          Your Recommended Starting Workout
        </p>
        <WorkoutPlanDisplay plan={workout} />
      </div>

      {/* Nutrition recommendation */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gold mb-3">
          Your Recommended Meal Plan
        </p>
        <MealPlanDisplay plan={mealPlan} />
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={onRetake}
          className={cn(buttonVariants({ variant: "outline", size: "md" }))}
        >
          Retake Assessment
        </button>
      </div>

      <p className="text-xs text-muted text-center">
        This is an algorithm-based estimate for guidance only, not a medical
        diagnosis. For precise body composition, book an InBody scan at
        I-BLITZ.{" "}
        <Link href="/signup" className="text-crimson hover:underline">
          Sign up
        </Link>{" "}
        to save this assessment and access the full Workout Generator,
        Nutrition, and Progress tools.
      </p>
    </div>
  );
}
