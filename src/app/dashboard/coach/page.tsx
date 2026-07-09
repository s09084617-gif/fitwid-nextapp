import { DailyTip } from "@/components/ai-coach/daily-tip";
import { MotivationCard } from "@/components/ai-coach/motivation-card";
import { CoachChat } from "@/components/ai-coach/coach-chat";

export default function AiCoachPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl mb-2">AI Coach</h1>
        <p className="text-sm text-muted">
          Daily tips, personalized motivation, and Q&amp;A on workouts,
          nutrition, and recovery.
        </p>
      </div>

      <DailyTip />
      <MotivationCard />
      <CoachChat />

      <p className="text-xs text-muted text-center">
        The AI Coach gives general fitness guidance, not medical advice.
        For injuries or health conditions, talk to a doctor.
      </p>
    </div>
  );
}
