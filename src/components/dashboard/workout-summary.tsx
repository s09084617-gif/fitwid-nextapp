import { Dumbbell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Placeholder weekly workout log — replace once session logging exists.
const sessions = [
  { day: "Mon", type: "Push (Chest/Shoulders/Triceps)", duration: "62 min", done: true },
  { day: "Tue", type: "Rest", duration: "—", done: true },
  { day: "Wed", type: "Pull (Back/Biceps)", duration: "58 min", done: true },
  { day: "Thu", type: "Legs", duration: "—", done: false },
  { day: "Fri", type: "Upper Body", duration: "—", done: false },
];

export function WorkoutSummary() {
  const completed = sessions.filter((s) => s.done && s.type !== "Rest").length;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <Badge variant="gold">This Week&apos;s Workouts</Badge>
        <span className="text-xs text-muted">{completed}/3 sessions done</span>
      </div>
      <ul className="space-y-3">
        {sessions.map((s) => (
          <li key={s.day} className="flex items-center gap-3">
            <div
              className={`h-8 w-8 rounded-md flex items-center justify-center shrink-0 ${
                s.type === "Rest"
                  ? "bg-surface-2 text-muted"
                  : s.done
                  ? "bg-success/15 text-success"
                  : "bg-surface-2 text-muted"
              }`}
            >
              <Dumbbell size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{s.type}</p>
              <p className="text-xs text-muted">{s.day}</p>
            </div>
            <span className="text-xs text-muted shrink-0">{s.duration}</span>
          </li>
        ))}
      </ul>
      <p className="text-[11px] text-muted mt-4">
        Sample data — workout logging isn&apos;t connected yet.
      </p>
    </Card>
  );
}
