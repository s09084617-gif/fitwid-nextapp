export type Gender = "male" | "female";
export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";
export type Goal = "fat_loss" | "muscle_gain" | "maintain";
export type StressLevel = "low" | "medium" | "high";

export interface AssessmentInput {
  gender: Gender;
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: Goal;
  // Optional circumference measurements (cm) for a more accurate
  // body-fat estimate via the US Navy method. Falls back to the
  // BMI-based Deurenberg formula if omitted.
  waistCm?: number;
  neckCm?: number;
  hipCm?: number; // required for females if using Navy method
  // Lifestyle context — used for advisory tips and the safety notice,
  // not for the core BMI/BMR/body-fat math.
  sleepHours?: number;
  stressLevel?: StressLevel;
  medicalConditions?: string[]; // empty/["none"] means no conditions noted
}

export interface MacroBreakdown {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  proteinPerKg: number;
}

export interface RoadmapPhase {
  phase: number;
  weeks: string;
  title: string;
  focus: string[];
  expectedOutcome: string;
}

export interface AssessmentResult {
  bmi: number;
  bmiCategory: "Underweight" | "Normal" | "Overweight" | "Obese";
  bmr: number;
  tdee: number;
  bodyFatPercent: number;
  bodyFatMethod: "navy" | "estimate";
  bodyFatCategory: "Essential" | "Athletes" | "Fitness" | "Acceptable" | "Obese";
  bodyClassification: string;
  fitnessScore: number;
  fitnessLabel: "Needs Improvement" | "Fair" | "Good" | "Excellent";
  macros: MacroBreakdown;
  roadmap: RoadmapPhase[];
  hasMedicalFlag: boolean;
  recommendations: {
    dailyCalories: number;
    proteinGrams: number;
    proteinPerKg: number;
    summary: string;
    suggestedProgram: string;
    tips: string[];
  };
}

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const ACTIVITY_SCORE: Record<ActivityLevel, number> = {
  sedentary: 40,
  light: 60,
  moderate: 75,
  active: 90,
  very_active: 100,
};

function round(n: number, decimals = 1) {
  const factor = 10 ** decimals;
  return Math.round(n * factor) / factor;
}

export function calculateBMI(weightKg: number, heightCm: number) {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

export function bmiCategory(bmi: number): AssessmentResult["bmiCategory"] {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

export function calculateBMR(input: AssessmentInput) {
  const { gender, weightKg, heightCm, age } = input;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === "male" ? base + 5 : base - 161;
}

function log10(n: number) {
  return Math.log(n) / Math.LN10;
}

/** US Navy circumference method (metric, cm). Requires waist + neck (+ hip for females). */
function bodyFatNavy(input: AssessmentInput): number | null {
  const { gender, waistCm, neckCm, hipCm, heightCm } = input;
  if (!waistCm || !neckCm) return null;
  if (gender === "male") {
    if (waistCm <= neckCm) return null;
    return (
      495 /
        (1.0324 -
          0.19077 * log10(waistCm - neckCm) +
          0.15456 * log10(heightCm)) -
      450
    );
  }
  if (!hipCm) return null;
  const circumferenceDiff = waistCm + hipCm - neckCm;
  if (circumferenceDiff <= 0) return null;
  return (
    495 /
      (1.29579 -
        0.35004 * log10(circumferenceDiff) +
        0.221 * log10(heightCm)) -
    450
  );
}

/** BMI-based fallback estimate (Deurenberg formula). Less accurate than Navy method. */
function bodyFatDeurenberg(input: AssessmentInput): number {
  const bmi = calculateBMI(input.weightKg, input.heightCm);
  const genderFactor = input.gender === "male" ? 1 : 0;
  return 1.2 * bmi + 0.23 * input.age - 10.8 * genderFactor - 5.4;
}

export function bodyFatCategory(
  bf: number,
  gender: Gender
): AssessmentResult["bodyFatCategory"] {
  const ranges =
    gender === "male"
      ? [
          [0, 6, "Essential"],
          [6, 14, "Athletes"],
          [14, 18, "Fitness"],
          [18, 25, "Acceptable"],
          [25, Infinity, "Obese"],
        ]
      : [
          [0, 14, "Essential"],
          [14, 21, "Athletes"],
          [21, 25, "Fitness"],
          [25, 32, "Acceptable"],
          [32, Infinity, "Obese"],
        ];
  const match = ranges.find(([min, max]) => bf >= (min as number) && bf < (max as number));
  return (match?.[2] as AssessmentResult["bodyFatCategory"]) ?? "Acceptable";
}

function bmiScore(bmi: number) {
  return Math.max(0, 100 - Math.abs(bmi - 22.5) * 8);
}

function bodyFatScore(bf: number, gender: Gender) {
  const target = gender === "male" ? 15 : 23;
  return Math.max(0, 100 - Math.abs(bf - target) * 4);
}

function fitnessLabel(score: number): AssessmentResult["fitnessLabel"] {
  if (score < 40) return "Needs Improvement";
  if (score < 61) return "Fair";
  if (score < 81) return "Good";
  return "Excellent";
}

function buildMacros(
  goal: Goal,
  gender: Gender,
  weightKg: number,
  tdee: number
): MacroBreakdown {
  const GOAL_ADJUSTMENT: Record<Goal, { calorieDelta: number; proteinPerKg: number }> = {
    fat_loss: { calorieDelta: -500, proteinPerKg: 2.0 },
    muscle_gain: { calorieDelta: 300, proteinPerKg: 1.8 },
    maintain: { calorieDelta: 0, proteinPerKg: 1.6 },
  };
  const { calorieDelta, proteinPerKg } = GOAL_ADJUSTMENT[goal];
  const minCalories = gender === "male" ? 1500 : 1200;
  const calories = Math.max(minCalories, Math.round(tdee + calorieDelta));

  const proteinG = Math.round(proteinPerKg * weightKg);
  const proteinCalories = proteinG * 4;
  const remainingCalories = Math.max(0, calories - proteinCalories);
  const carbsG = Math.round((remainingCalories * 0.55) / 4);
  const fatG = Math.round((remainingCalories * 0.45) / 9);

  return { calories, proteinG, carbsG, fatG, proteinPerKg };
}

function buildRoadmap(
  goal: Goal,
  bmiCat: AssessmentResult["bmiCategory"]
): RoadmapPhase[] {
  const phase1Focus =
    goal === "fat_loss"
      ? ["Build the calorie deficit habit", "Learn core lifts with light-moderate weight", "3–4 training sessions/week"]
      : goal === "muscle_gain"
      ? ["Learn core lifts with focus on form", "Establish a consistent surplus", "3–4 training sessions/week"]
      : ["Build consistent training habit", "Dial in daily nutrition routine", "3 sessions/week"];

  const phase2Focus =
    goal === "fat_loss"
      ? ["Increase training volume", "Add conditioning/cardio work", "Tighten up nutrition adherence"]
      : goal === "muscle_gain"
      ? ["Progressive overload — increase working weights", "Add accessory volume", "Track strength PRs"]
      : ["Introduce progressive overload", "Refine macros based on progress", "4 sessions/week"];

  const phase3Focus =
    goal === "fat_loss"
      ? ["Push final phase of fat loss", "Maintain strength with reduced calories", "Reassess with InBody scan"]
      : goal === "muscle_gain"
      ? ["Peak intensity block", "Deload week if needed", "Reassess with InBody scan"]
      : ["Fine-tune based on 8 weeks of data", "Set next 90-day goal", "Reassess with InBody scan"];

  const outcomeCaveat =
    bmiCat === "Obese" || bmiCat === "Overweight"
      ? "Individual results vary with adherence, sleep, and starting point — this is a general guide, not a guarantee."
      : "Individual results vary — use this as a general guide, not a guarantee.";

  return [
    {
      phase: 1,
      weeks: "Weeks 1–4",
      title: "Foundation",
      focus: phase1Focus,
      expectedOutcome: `Focus on adherence over intensity. ${outcomeCaveat}`,
    },
    {
      phase: 2,
      weeks: "Weeks 5–8",
      title: "Progression",
      focus: phase2Focus,
      expectedOutcome:
        "This is where most visible changes start compounding, provided Phase 1 habits held.",
    },
    {
      phase: 3,
      weeks: "Weeks 9–12",
      title: "Intensification",
      focus: phase3Focus,
      expectedOutcome:
        "Reassess with a fresh Body Assessment and InBody scan to set your next 90-day block.",
    },
  ];
}

function buildRecommendations(
  input: AssessmentInput,
  macros: MacroBreakdown,
  bmiCat: AssessmentResult["bmiCategory"],
  bfCat: AssessmentResult["bodyFatCategory"]
): AssessmentResult["recommendations"] {
  const { goal } = input;

  const suggestedProgram =
    goal === "fat_loss"
      ? "Fat Loss + Muscle Retention"
      : goal === "muscle_gain"
      ? "Lean Muscle Building"
      : "Online Coaching (FitWid)";

  const summary =
    goal === "fat_loss"
      ? "A moderate calorie deficit paired with higher protein intake will help you lose fat while protecting the muscle you already have."
      : goal === "muscle_gain"
      ? "A modest calorie surplus with consistent progressive overload is the most reliable path to lean muscle gain without excess fat."
      : "Your goal is maintenance — focus on consistency in training and nutrition rather than aggressive changes.";

  const tips: string[] = [];

  const hasMedicalFlag = !!(
    input.medicalConditions &&
    input.medicalConditions.length > 0 &&
    !input.medicalConditions.every((c) => c.toLowerCase() === "none")
  );
  if (hasMedicalFlag) {
    tips.push(
      "You noted a medical condition — please get clearance from a doctor before starting this or any new training/nutrition program. We haven't tailored anything below for a specific condition."
    );
  }

  if (bmiCat === "Underweight") {
    tips.push(
      "Your BMI is in the underweight range — prioritize a calorie surplus even if your goal is body recomposition."
    );
  }
  if (bmiCat === "Obese" || bfCat === "Obese") {
    tips.push(
      "Start with cardiovascular health and joint-friendly training (walking, cycling, swimming) alongside strength work."
    );
  }
  if (input.activityLevel === "sedentary") {
    tips.push(
      "Your current activity level is low — even adding 20–30 minutes of daily walking will meaningfully improve your results."
    );
  }
  if (input.sleepHours !== undefined && input.sleepHours < 6) {
    tips.push(
      "You're averaging under 6 hours of sleep — poor sleep blunts fat loss, muscle recovery, and hunger regulation. This is worth fixing before anything else."
    );
  }
  if (input.stressLevel === "high") {
    tips.push(
      "You reported high stress — chronic stress raises cortisol, which can stall fat loss and disrupt recovery. Consider adding a daily 10-minute walk or breathing practice."
    );
  }
  tips.push(
    "Get an InBody scan to track real muscle and fat changes — the scale alone won't show the full picture."
  );

  return {
    dailyCalories: macros.calories,
    proteinGrams: macros.proteinG,
    proteinPerKg: macros.proteinPerKg,
    summary,
    suggestedProgram,
    tips,
  };
}

export function runAssessment(input: AssessmentInput): AssessmentResult {
  const bmi = calculateBMI(input.weightKg, input.heightCm);
  const bmr = calculateBMR(input);
  const tdee = bmr * ACTIVITY_MULTIPLIERS[input.activityLevel];

  const navyResult = bodyFatNavy(input);
  const bodyFatPercent = navyResult ?? bodyFatDeurenberg(input);
  const bodyFatMethod: AssessmentResult["bodyFatMethod"] = navyResult
    ? "navy"
    : "estimate";

  const bmiCat = bmiCategory(bmi);
  const bfCat = bodyFatCategory(bodyFatPercent, input.gender);

  const score =
    bmiScore(bmi) * 0.3 +
    bodyFatScore(bodyFatPercent, input.gender) * 0.4 +
    ACTIVITY_SCORE[input.activityLevel] * 0.3;

  const macros = buildMacros(input.goal, input.gender, input.weightKg, tdee);
  const hasMedicalFlag = !!(
    input.medicalConditions &&
    input.medicalConditions.length > 0 &&
    !input.medicalConditions.every((c) => c.toLowerCase() === "none")
  );

  return {
    bmi: round(bmi),
    bmiCategory: bmiCat,
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    bodyFatPercent: round(Math.max(0, bodyFatPercent)),
    bodyFatMethod,
    bodyFatCategory: bfCat,
    bodyClassification: `${bmiCat} BMI · ${bfCat} Body Fat`,
    fitnessScore: Math.round(score),
    fitnessLabel: fitnessLabel(score),
    macros,
    roadmap: buildRoadmap(input.goal, bmiCat),
    hasMedicalFlag,
    recommendations: buildRecommendations(input, macros, bmiCat, bfCat),
  };
}
