import Link from "next/link";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { AssessmentResult } from "@/lib/assessment";
import { cn } from "@/lib/utils";

function scoreColor(score: number) {
  if (score < 40) return "text-danger";
  if (score < 61) return "text-warning";
  if (score < 81) return "text-gold";
  return "text-success";
}

export function AssessmentResults({
  result,
  onRetake,
}: {
  result: AssessmentResult;
  onRetake: () => void;
}) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference * (1 - result.fitnessScore / 100);

  return (
    <div className="space-y-8">
      {/* Score */}
      <Card className="flex flex-col sm:flex-row items-center gap-8">
        <div className="relative h-32 w-32 shrink-0">
          <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="var(--border)"
              strokeWidth="10"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className={scoreColor(result.fitnessScore)}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-3xl">{result.fitnessScore}</span>
            <span className="text-[10px] text-muted uppercase tracking-wide">
              / 100
            </span>
          </div>
        </div>
        <div className="text-center sm:text-left">
          <Badge
            variant={
              result.fitnessScore < 40
                ? "danger"
                : result.fitnessScore < 61
                ? "warning"
                : result.fitnessScore < 81
                ? "gold"
                : "success"
            }
            className="mb-2"
          >
            {result.fitnessLabel}
          </Badge>
          <h3 className="font-display text-2xl mb-1">Your Fitness Score</h3>
          <p className="text-sm text-muted max-w-sm">
            Calculated from your BMI, estimated body fat, and activity level.
          </p>
        </div>
      </Card>

      {/* Metrics grid */}
      <div className="grid sm:grid-cols-2 gap-6">
        <Card>
          <Badge variant="crimson" className="mb-3">
            BMI
          </Badge>
          <CardTitle>
            {result.bmi} — {result.bmiCategory}
          </CardTitle>
          <CardDescription>Body Mass Index (weight / height²)</CardDescription>
        </Card>
        <Card>
          <Badge variant="gold" className="mb-3">
            Body Fat
          </Badge>
          <CardTitle>
            {result.bodyFatPercent}% — {result.bodyFatCategory}
          </CardTitle>
          <CardDescription>
            {result.bodyFatMethod === "navy"
              ? "US Navy circumference method"
              : "BMI-based estimate — add waist/neck measurements for accuracy"}
          </CardDescription>
        </Card>
        <Card>
          <Badge variant="neutral" className="mb-3">
            BMR
          </Badge>
          <CardTitle>{result.bmr} kcal/day</CardTitle>
          <CardDescription>
            Calories your body burns at complete rest
          </CardDescription>
        </Card>
        <Card>
          <Badge variant="success" className="mb-3">
            TDEE
          </Badge>
          <CardTitle>{result.tdee} kcal/day</CardTitle>
          <CardDescription>
            Total daily energy expenditure, including activity
          </CardDescription>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <Badge variant="crimson" className="mb-3">
          Personalized Plan
        </Badge>
        <h3 className="font-display text-2xl mb-2">Recommendations</h3>
        <p className="text-sm text-foreground/90 mb-5">
          {result.recommendations.summary}
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="rounded-md border border-border p-4">
            <p className="text-xs text-muted mb-1">Daily Calorie Target</p>
            <p className="font-display text-2xl text-gold">
              {result.recommendations.dailyCalories} kcal
            </p>
          </div>
          <div className="rounded-md border border-border p-4">
            <p className="text-xs text-muted mb-1">
              Protein Target ({result.recommendations.proteinPerKg}g/kg)
            </p>
            <p className="font-display text-2xl text-gold">
              {result.recommendations.proteinGrams}g / day
            </p>
          </div>
        </div>
        <ul className="space-y-2 mb-6">
          {result.recommendations.tips.map((tip) => (
            <li
              key={tip}
              className="text-sm text-muted flex gap-2 items-start"
            >
              <span className="text-crimson mt-0.5">•</span>
              {tip}
            </li>
          ))}
        </ul>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/#pricing"
            className={buttonVariants({ variant: "primary", size: "md" })}
          >
            Start &ldquo;{result.recommendations.suggestedProgram}&rdquo;
          </Link>
          <button
            type="button"
            onClick={onRetake}
            className={cn(buttonVariants({ variant: "outline", size: "md" }))}
          >
            Retake Assessment
          </button>
        </div>
      </Card>

      <p className="text-xs text-muted text-center">
        This is an estimate for guidance only, not a medical diagnosis. For
        precise body composition, book an InBody scan at I-BLITZ.
      </p>
    </div>
  );
}
