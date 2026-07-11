"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StepProgress } from "@/components/assessment/step-progress";
import { StepPersonal, type PersonalData } from "@/components/assessment/steps/step-personal";
import { StepGoals } from "@/components/assessment/steps/step-goals";
import { StepLifestyle, type LifestyleData } from "@/components/assessment/steps/step-lifestyle";
import { StepHealth, type HealthData } from "@/components/assessment/steps/step-health";
import { StepInBody, type InBodyStepData } from "@/components/assessment/steps/step-inbody";
import { ResultsSummary } from "@/components/assessment/results-summary";
import { FullAssessmentResults } from "@/components/assessment/full-results";
import {
  runAssessment,
  type AssessmentInput,
  type AssessmentResult,
  type Gender,
  type Goal,
  type ActivityLevel,
  type StressLevel,
} from "@/lib/assessment";
import { generateWorkout, type WorkoutPlan, type Goal as WorkoutGoal } from "@/lib/workout-generator";
import { generateMealPlan, type MealPlan } from "@/lib/meal-plan-generator";
import { saveLastAssessment } from "@/lib/db/user-data";
import { trackEvent } from "@/lib/analytics/events";

const STEP_LABELS = ["Personal Details", "Your Goal", "Lifestyle", "Health & Equipment", "InBody (Optional)"];

function mapToWorkoutGoal(goal: Goal): WorkoutGoal {
  if (goal === "strength") return "strength";
  if (goal === "athletic_performance") return "athletic_performance";
  if (goal === "fat_loss") return "fat_loss";
  return "muscle_gain"; // muscle_gain, body_recomposition, maintain all train like hypertrophy
}

interface FormState extends PersonalData, LifestyleData, HealthData {
  goal: Goal;
  useInBody: boolean;
  inbody: InBodyStepData;
}

const initialState: FormState = {
  name: "",
  age: "",
  gender: "male",
  heightCm: "",
  weightKg: "",
  goal: "fat_loss",
  activityLevel: "moderate",
  experience: "beginner",
  workoutDaysPerWeek: "4",
  sleepHours: "7",
  waterIntakeLiters: "3",
  dietTag: "veg",
  injuries: "",
  medicalConditions: [],
  equipment: ["bodyweight"],
  useInBody: false,
  inbody: {
    weightKg: "",
    bmi: "",
    bodyFatPercent: "",
    smmKg: "",
    bmr: "",
    visceralFatLevel: "",
    waistHipRatio: "",
    inbodyScore: "",
  },
};

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -40 : 40, opacity: 0 }),
};

export function AssessmentWizard() {
  const [form, setForm] = useState<FormState>(initialState);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);

  useEffect(() => {
    trackEvent("assessment_started");
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }
  function updateInBody<K extends keyof InBodyStepData>(key: K, value: InBodyStepData[K]) {
    setForm((f) => ({ ...f, inbody: { ...f.inbody, [key]: value } }));
  }

  function validateStep(): string | null {
    if (step === 0) {
      const age = Number(form.age);
      const heightCm = Number(form.heightCm);
      const weightKg = Number(form.weightKg);
      if (!form.name.trim()) return "Please enter your name.";
      if (!age || age < 13 || age > 100) return "Age must be between 13 and 100.";
      if (!heightCm || heightCm < 100 || heightCm > 250) return "Height must be between 100cm and 250cm.";
      if (!weightKg || weightKg < 30 || weightKg > 300) return "Weight must be between 30kg and 300kg.";
    }
    if (step === 3 && form.equipment.length === 0) {
      return "Select at least one equipment option.";
    }
    return null;
  }

  function goNext() {
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    if (step === STEP_LABELS.length - 1) {
      handleComplete();
      return;
    }
    setDirection(1);
    setStep((s) => s + 1);
  }

  function goBack() {
    setError(null);
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
  }

  function handleComplete() {
    const hasInBody = Object.values(form.inbody).some((v) => v.trim() !== "");

    const input: AssessmentInput = {
      name: form.name.trim(),
      gender: form.gender as Gender,
      age: Number(form.age),
      heightCm: Number(form.heightCm),
      weightKg: Number(form.weightKg),
      activityLevel: form.activityLevel as ActivityLevel,
      goal: form.goal,
      sleepHours: form.sleepHours ? Number(form.sleepHours) : undefined,
      stressLevel: "medium" as StressLevel,
      workoutDaysPerWeek: form.workoutDaysPerWeek ? Number(form.workoutDaysPerWeek) : undefined,
      waterIntakeLiters: form.waterIntakeLiters ? Number(form.waterIntakeLiters) : undefined,
      medicalConditions: form.medicalConditions,
      injuries: form.injuries,
      experience: form.experience,
      equipment: form.equipment,
      inbody: hasInBody
        ? {
            weightKg: form.inbody.weightKg ? Number(form.inbody.weightKg) : undefined,
            bmi: form.inbody.bmi ? Number(form.inbody.bmi) : undefined,
            bodyFatPercent: form.inbody.bodyFatPercent ? Number(form.inbody.bodyFatPercent) : undefined,
            smmKg: form.inbody.smmKg ? Number(form.inbody.smmKg) : undefined,
            bmr: form.inbody.bmr ? Number(form.inbody.bmr) : undefined,
            visceralFatLevel: form.inbody.visceralFatLevel ? Number(form.inbody.visceralFatLevel) : undefined,
            waistHipRatio: form.inbody.waistHipRatio ? Number(form.inbody.waistHipRatio) : undefined,
            inbodyScore: form.inbody.inbodyScore ? Number(form.inbody.inbodyScore) : undefined,
          }
        : undefined,
    };

    const calculated = runAssessment(input);
    saveLastAssessment(calculated, input.inbody?.weightKg ?? input.weightKg);
    trackEvent("assessment_completed", { goal: form.goal, usedInBody: hasInBody });
    setResult(calculated);
  }

  function handleGenerateWorkout() {
    if (!result) return;
    const workoutPlan = generateWorkout(
      {
        goal: mapToWorkoutGoal(form.goal),
        experience: form.experience,
        equipment: form.equipment,
        focus: "full_body",
      },
    );
    const plan = generateMealPlan(
      {
        calories: result.macros.calories,
        proteinG: result.macros.proteinG,
        carbsG: result.macros.carbsG,
        fatG: result.macros.fatG,
        proteinPerKg: result.macros.proteinPerKg,
      },
      form.dietTag
    );
    trackEvent("workout_saved", { goal: form.goal, source: "assessment" });
    setWorkout(workoutPlan);
    setMealPlan(plan);
  }

  function handleRetake() {
    setForm(initialState);
    setStep(0);
    setResult(null);
    setWorkout(null);
    setMealPlan(null);
  }

  // Full results (workout + meal plan generated) — takes over the page.
  if (result && workout && mealPlan) {
    return (
      <FullAssessmentResults
        result={result}
        workout={workout}
        mealPlan={mealPlan}
        onRetake={handleRetake}
      />
    );
  }

  // Results summary — assessment done, workout not generated yet.
  if (result) {
    return <ResultsSummary result={result} onGenerateWorkout={handleGenerateWorkout} />;
  }

  // Wizard steps.
  return (
    <Card className="overflow-hidden">
      <StepProgress steps={STEP_LABELS} currentStep={step} />

      <div className="relative min-h-[380px]">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            {step === 0 && <StepPersonal data={form} onChange={(key, value) => update(key, value as FormState[typeof key])} />}
            {step === 1 && <StepGoals goal={form.goal} onChange={(g) => update("goal", g)} />}
            {step === 2 && <StepLifestyle data={form} onChange={(key, value) => update(key, value as FormState[typeof key])} />}
            {step === 3 && <StepHealth data={form} onChange={(key, value) => update(key, value as FormState[typeof key])} />}
            {step === 4 && <StepInBody data={form.inbody} onChange={updateInBody} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {error && <p className="text-sm text-danger mt-4">{error}</p>}

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
        <Button
          variant="outline"
          onClick={goBack}
          disabled={step === 0}
          className={step === 0 ? "opacity-0 pointer-events-none" : ""}
        >
          <ChevronLeft size={16} /> Back
        </Button>
        <Button onClick={goNext}>
          {step === STEP_LABELS.length - 1 ? "See My Results" : "Next"}
          {step < STEP_LABELS.length - 1 && <ChevronRight size={16} />}
        </Button>
      </div>
    </Card>
  );
}
