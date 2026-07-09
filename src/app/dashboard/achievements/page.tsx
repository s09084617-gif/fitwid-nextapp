import { AchievementsPanel } from "@/components/gamification/achievements-panel";

export default function AchievementsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl mb-2">Achievements</h1>
        <p className="text-sm text-muted">
          XP, levels, badges, and this month&apos;s challenge — earned from
          your real activity.
        </p>
      </div>
      <AchievementsPanel />
    </div>
  );
}
