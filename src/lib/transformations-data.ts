export type TransformationGoal = "fat_loss" | "muscle_gain" | "maintain" | "athletic_performance";

export interface Transformation {
  name: string;
  goal: TransformationGoal;
  duration: string;
  durationWeeks: number;
  stat: string;
  image: string;
  quote: string | null;
}

export const TRANSFORMATIONS: Transformation[] = [
  {
    name: "Rahul M.",
    goal: "fat_loss",
    duration: "16 Weeks",
    durationWeeks: 16,
    stat: "+8kg Muscle · −12kg Fat",
    image: "/images/transform-man-tshirt.jpg",
    quote:
      "In 16 weeks I went from 78kg to 70kg while actually gaining muscle. The program was insane — but it worked.",
  },
  {
    name: "Priya S.",
    goal: "fat_loss",
    duration: "20 Weeks",
    durationWeeks: 20,
    stat: "+5kg Muscle · −14kg Fat",
    image: "/images/transform-woman-1.jpg",
    quote:
      "The weekly check-ins, the nutrition guidance, the accountability — it's a whole system.",
  },
  {
    name: "Karan T.",
    goal: "muscle_gain",
    duration: "14 Weeks",
    durationWeeks: 14,
    stat: "+10kg Muscle · −8kg Fat",
    image: "/images/transform-man-tank.jpg",
    quote: null,
  },
];

export const GOAL_LABELS: Record<TransformationGoal, string> = {
  fat_loss: "Fat Loss",
  muscle_gain: "Muscle Gain",
  maintain: "Maintain",
  athletic_performance: "Athletic Performance",
};
