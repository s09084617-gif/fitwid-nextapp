import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Placeholder daily nutrition data — replace with real logging once
// a food-tracking backend exists.
const consumed = 1450;
const target = 2100;
const macros = [
  { label: "Protein", grams: 132, target: 160, color: "bg-crimson" },
  { label: "Carbs", grams: 140, target: 220, color: "bg-gold" },
  { label: "Fat", grams: 42, target: 60, color: "bg-success" },
];

export function CaloriesCard() {
  const pct = Math.min(100, Math.round((consumed / target) * 100));
  const circumference = 2 * Math.PI * 46;
  const offset = circumference * (1 - pct / 100);

  return (
    <Card>
      <Badge variant="crimson" className="mb-4">
        Today&apos;s Calories
      </Badge>
      <div className="flex items-center gap-6 mb-6">
        <div className="relative h-24 w-24 shrink-0">
          <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="var(--border)"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="var(--crimson)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-xl">{pct}%</span>
          </div>
        </div>
        <div>
          <p className="font-display text-2xl text-gold">
            {consumed.toLocaleString()}{" "}
            <span className="text-sm text-muted font-sans">
              / {target.toLocaleString()} kcal
            </span>
          </p>
          <p className="text-xs text-muted mt-1">
            {target - consumed} kcal remaining today
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {macros.map((m) => {
          const macroPct = Math.min(100, Math.round((m.grams / m.target) * 100));
          return (
            <div key={m.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-foreground/80">{m.label}</span>
                <span className="text-muted">
                  {m.grams}g / {m.target}g
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${m.color}`}
                  style={{ width: `${macroPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[11px] text-muted mt-4">
        Sample data — food logging isn&apos;t connected yet.
      </p>
    </Card>
  );
}
