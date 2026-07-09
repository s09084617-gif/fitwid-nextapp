import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function fallbackMessage(stats: {
  workoutsThisWeek: number;
  weightChangeKg: number | null;
  streak: number;
}): string {
  if (stats.streak >= 3) {
    return `${stats.streak}-day streak! That consistency is exactly what drives results — keep showing up.`;
  }
  if (stats.workoutsThisWeek > 0) {
    return `You've logged ${stats.workoutsThisWeek} workout${stats.workoutsThisWeek > 1 ? "s" : ""} this week. Small consistent effort beats occasional intensity — keep going.`;
  }
  if (stats.weightChangeKg !== null && stats.weightChangeKg < 0) {
    return `You're trending in the right direction on the scale. Trust the process and keep logging your data.`;
  }
  return "Every session you show up for is a vote for the person you're becoming. Let's get after it today.";
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoIso = weekAgo.toISOString().slice(0, 10);

  const [workoutHistory, weightLog] = await Promise.all([
    supabase
      .from("workout_history")
      .select("log_date")
      .eq("user_id", user.id)
      .order("log_date", { ascending: false }),
    supabase
      .from("weight_logs")
      .select("log_date, weight_kg")
      .eq("user_id", user.id)
      .order("log_date", { ascending: true }),
  ]);

  const allDates = (workoutHistory.data ?? []).map((w) => w.log_date);
  const workoutsThisWeek = allDates.filter((d) => d >= weekAgoIso).length;

  // Simple current-streak calc (consecutive days, most recent = today or yesterday)
  const uniqueDays = Array.from(new Set(allDates)).sort();
  let streak = 0;
  if (uniqueDays.length > 0) {
    const dayMs = 24 * 60 * 60 * 1000;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastDay = new Date(uniqueDays[uniqueDays.length - 1]);
    lastDay.setHours(0, 0, 0, 0);
    const gap = Math.round((today.getTime() - lastDay.getTime()) / dayMs);
    if (gap <= 1) {
      streak = 1;
      for (let i = uniqueDays.length - 1; i > 0; i--) {
        const prev = new Date(uniqueDays[i - 1]).getTime();
        const curr = new Date(uniqueDays[i]).getTime();
        if (curr - prev === dayMs) streak += 1;
        else break;
      }
    }
  }

  const weights = weightLog.data ?? [];
  const weightChangeKg =
    weights.length >= 2
      ? Math.round((Number(weights[weights.length - 1].weight_kg) - Number(weights[0].weight_kg)) * 10) / 10
      : null;

  const stats = { workoutsThisWeek, weightChangeKg, streak };

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ message: fallbackMessage(stats), source: "template" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 100,
        system:
          "You write one short, genuine motivational message (max 2 sentences) for a fitness app user based on their real stats. Be specific to their numbers, not generic. No emojis, no exclamation-mark overload. Sound like a good coach, not a hype account.",
        messages: [
          {
            role: "user",
            content: `Workouts logged this week: ${stats.workoutsThisWeek}. Current workout streak: ${stats.streak} days. Weight change since they started logging: ${stats.weightChangeKg === null ? "no data yet" : `${stats.weightChangeKg}kg`}.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ message: fallbackMessage(stats), source: "template" });
    }

    const data = await response.json();
    const text = data.content
      ?.filter((c: { type: string }) => c.type === "text")
      .map((c: { text: string }) => c.text)
      .join(" ");

    return NextResponse.json({ message: text || fallbackMessage(stats), source: "ai" });
  } catch {
    return NextResponse.json({ message: fallbackMessage(stats), source: "template" });
  }
}
