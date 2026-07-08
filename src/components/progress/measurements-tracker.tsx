"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  getMeasurements,
  addMeasurement,
  deleteMeasurement,
  type MeasurementEntry,
} from "@/lib/local-store";

const FIELDS: { key: keyof MeasurementEntry; label: string }[] = [
  { key: "waistCm", label: "Waist (cm)" },
  { key: "chestCm", label: "Chest (cm)" },
  { key: "hipsCm", label: "Hips (cm)" },
  { key: "bicepsCm", label: "Biceps (cm)" },
  { key: "thighsCm", label: "Thighs (cm)" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export function MeasurementsTracker() {
  const [entries, setEntries] = useState<MeasurementEntry[]>([]);
  const [form, setForm] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage on mount
    setEntries(getMeasurements());
    setMounted(true);
  }, []);

  function handleSave() {
    const parsed: Record<string, number | undefined> = {};
    for (const f of FIELDS) {
      const raw = form[f.key];
      parsed[f.key] = raw ? Number(raw) : undefined;
    }
    if (Object.values(parsed).every((v) => v === undefined)) return;
    const updated = addMeasurement(parsed);
    setEntries(updated);
    setForm({});
  }

  function handleDelete(id: string) {
    setEntries(deleteMeasurement(id));
  }

  if (!mounted) {
    return <div className="h-48 rounded-lg bg-surface-2 animate-pulse" />;
  }

  const latest = entries[entries.length - 1];
  const previous = entries[entries.length - 2];

  return (
    <Card>
      <Badge variant="gold" className="mb-4">
        Body Measurements
      </Badge>

      <div className="grid sm:grid-cols-5 gap-4 mb-4">
        {FIELDS.map((f) => (
          <Input
            key={f.key}
            label={f.label}
            type="number"
            placeholder="—"
            value={form[f.key] ?? ""}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, [f.key]: e.target.value }))
            }
          />
        ))}
      </div>
      <Button onClick={handleSave} className="w-full sm:w-auto">
        Log Measurements
      </Button>

      {entries.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          {latest && (
            <div className="grid sm:grid-cols-5 gap-4 mb-6">
              {FIELDS.map((f) => {
                const currentVal = latest[f.key] as number | undefined;
                const prevVal = previous?.[f.key] as number | undefined;
                const delta =
                  currentVal !== undefined && prevVal !== undefined
                    ? Math.round((currentVal - prevVal) * 10) / 10
                    : null;
                return (
                  <div key={f.key}>
                    <p className="text-xs text-muted">{f.label}</p>
                    <p className="font-display text-xl text-gold">
                      {currentVal ?? "—"}
                    </p>
                    {delta !== null && (
                      <p
                        className={`text-xs ${
                          delta > 0 ? "text-warning" : delta < 0 ? "text-success" : "text-muted"
                        }`}
                      >
                        {delta > 0 ? "+" : ""}
                        {delta} since last
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="space-y-1.5 max-h-56 overflow-y-auto">
            {[...entries].reverse().map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between text-sm rounded-md border border-border px-3 py-2"
              >
                <span className="text-muted shrink-0">
                  {formatDate(entry.date)}
                </span>
                <span className="text-xs text-foreground/80 flex-1 text-center truncate px-2">
                  {FIELDS.filter((f) => entry[f.key] !== undefined)
                    .map((f) => `${f.label.split(" ")[0]}: ${entry[f.key]}`)
                    .join(" · ") || "—"}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(entry.id)}
                  className="text-muted hover:text-danger transition p-1 shrink-0"
                  aria-label="Delete entry"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
