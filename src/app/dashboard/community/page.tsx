"use client";

import { useEffect, useState } from "react";
import { Trophy, Medal } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSuccessStories, type SuccessStory } from "@/lib/db/shared-data";
import { getLeaderboard, type LeaderboardEntry } from "./actions";
import { GOAL_LABELS, type TransformationGoal } from "@/lib/transformations-data";
import { SubmitStoryForm } from "@/components/community/submit-story-form";

export default function CommunityPage() {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    Promise.all([getSuccessStories(), getLeaderboard()]).then(([s, l]) => {
      setStories(s);
      setLeaderboard(l);
      setMounted(true);
    });
  }, []);

  if (!mounted) {
    return <div className="h-64 rounded-lg bg-surface-2 animate-pulse" />;
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl mb-2">Community</h1>
        <p className="text-sm text-muted">
          Success stories from real clients, and a leaderboard based on
          workouts logged — no open posting, so no spam or moderation
          headaches.
        </p>
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Trophy size={16} className="text-gold" />
          <Badge variant="gold">Workout Leaderboard</Badge>
        </div>
        {leaderboard.length === 0 ? (
          <p className="text-sm text-muted">No workouts logged yet across any client.</p>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((entry, i) => (
              <div
                key={entry.displayName}
                className={`flex items-center justify-between rounded-md px-3 py-2 text-sm ${
                  entry.isMe ? "bg-crimson/10 border border-crimson/30" : ""
                }`}
              >
                <span className="flex items-center gap-2">
                  {i < 3 ? (
                    <Medal size={14} className={i === 0 ? "text-gold" : i === 1 ? "text-muted" : "text-crimson"} />
                  ) : (
                    <span className="text-muted w-3.5 text-center text-xs">{i + 1}</span>
                  )}
                  {entry.displayName} {entry.isMe && <span className="text-crimson text-xs">(you)</span>}
                </span>
                <span className="text-xs text-muted">{entry.workoutsLogged} workouts</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div>
        <Badge variant="crimson" className="mb-4">Success Stories</Badge>
        {stories.length === 0 ? (
          <Card>
            <CardDescription>No success stories added yet.</CardDescription>
          </Card>
        ) : (
          <div className="space-y-4">
            {stories.map((s) => (
              <Card key={s.id}>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle>{s.clientName}</CardTitle>
                  <Badge variant="gold">{GOAL_LABELS[s.goal as TransformationGoal] ?? s.goal}</Badge>
                </div>
                {s.durationWeeks && (
                  <p className="text-xs text-muted mb-2">{s.durationWeeks} weeks</p>
                )}
                <CardDescription>{s.story}</CardDescription>
              </Card>
            ))}
          </div>
        )}
      </div>

      <SubmitStoryForm />
    </div>
  );
}
