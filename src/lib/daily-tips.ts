export const DAILY_TIPS: string[] = [
  "Protein at every meal helps preserve muscle, especially in a calorie deficit. Aim for 25-40g per meal.",
  "Progressive overload doesn't always mean more weight — more reps, better form, or shorter rest all count.",
  "Sleep under 6 hours consistently blunts fat loss and muscle recovery more than almost any other single factor.",
  "You don't need to feel sore to know a workout worked. Soreness is a poor progress indicator.",
  "Water intake affects strength and endurance more than most people realize — even 2% dehydration hurts performance.",
  "Consistency at 80% beats perfection at 100% for two weeks then quitting.",
  "Warming up isn't optional at higher intensities — 5 minutes now saves weeks of injury recovery later.",
  "Your first rep should never be your heaviest of the day unless it's a max-effort test — build up gradually.",
  "Tracking your workouts (even roughly) makes progressive overload measurable instead of guesswork.",
  "Carbs aren't the enemy — timing them around training can improve performance and recovery.",
  "A 10-minute walk after meals measurably improves blood sugar control and digestion.",
  "Strength plateaus are usually a recovery problem, not a training problem. Check sleep and calories first.",
  "Stretching cold muscles does little — save static stretching for after your session, not before.",
  "The best workout program is the one you'll actually do consistently for 3+ months.",
  "Body recomposition (losing fat + gaining muscle at once) is real, but slow. Give it 3-6 months minimum.",
  "Alcohol doesn't just add calories — it measurably impairs muscle protein synthesis for up to 24 hours.",
  "Grip strength is one of the best predictors of overall health markers as you age — don't skip it.",
  "Your body fat % matters more than your weight for how you actually look and perform.",
  "Deload weeks (reduced volume/intensity) aren't a step backward — they're what makes the next block possible.",
  "Most people underestimate their calorie intake by 20-30%. Weighing food for 2 weeks is eye-opening.",
  "Compound lifts (squat, deadlift, press, row) give more return on time than isolation work for most goals.",
  "Recovery isn't just rest days — it's sleep, protein, hydration, and stress management working together.",
  "If a movement hurts (sharp, joint pain) vs. burns (muscle fatigue), those are very different signals. Listen.",
  "Small, sustainable habits compound. A 200-calorie daily deficit for a year outperforms a 1000-calorie crash diet.",
  "Your nervous system needs recovery too — that's why max-effort lifts need more rest between sets than hypertrophy work.",
  "Fiber intake (25-35g/day) is one of the most underrated levers for satiety during a fat loss phase.",
  "Muscle memory is real — regaining lost muscle after a break is much faster than building it the first time.",
  "The 'afterburn effect' from cardio is real but small — don't rely on it to offset a poor diet.",
  "Training to failure occasionally is fine; doing it every set accelerates burnout and injury risk.",
  "Cortisol from chronic stress can stall fat loss even with perfect training and diet — manage stress deliberately.",
];

export function getDailyTip(date: Date = new Date()): string {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return DAILY_TIPS[dayOfYear % DAILY_TIPS.length];
}
