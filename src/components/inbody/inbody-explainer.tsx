"use client";

import { useState } from "react";
import { Sparkles, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { saveInBodyReport } from "@/lib/db/user-data";
import type { MetricClassification } from "@/lib/inbody";

const STATUS_COLOR: Record<string, string> = {
  low: "text-warning",
  normal: "text-success",
  elevated: "text-warning",
  high: "text-danger",
  unknown: "text-muted",
};

interface InBodyExplainerProps {
  onDone?: () => void;
  onSkip?: () => void;
}

export function InBodyExplainer({ onDone, onSkip }: InBodyExplainerProps) {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [weightKg, setWeightKg] = useState("");
  const [smmKg, setSmmKg] = useState("");
  const [pbfPercent, setPbfPercent] = useState("");
  const [vfaCm2, setVfaCm2] = useState("");
  const [ecwTbwRatio, setEcwTbwRatio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [classifications, setClassifications] = useState<MetricClassification[]>([]);
  const [saved, setSaved] = useState(false);

  const hasAnyMetric = weightKg || smmKg || pbfPercent || vfaCm2 || ecwTbwRatio;

  async function handleSubmit() {
    if (!hasAnyMetric) {
      setError("Enter at least one number from your InBody report.");
      return;
    }
    setError(null);
    setLoading(true);

    const metrics = {
      weightKg: weightKg ? Number(weightKg) : undefined,
      smmKg: smmKg ? Number(smmKg) : undefined,
      pbfPercent: pbfPercent ? Number(pbfPercent) : undefined,
      vfaCm2: vfaCm2 ? Number(vfaCm2) : undefined,
      ecwTbwRatio: ecwTbwRatio ? Number(ecwTbwRatio) : undefined,
    };

    try {
      const res = await fetch("/api/inbody-explainer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metrics, gender }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setLoading(false);
        return;
      }
      setExplanation(data.explanation);
      setClassifications(data.classifications ?? []);
      await saveInBodyReport({ ...metrics, aiExplanation: data.explanation });
      setSaved(true);
    } catch {
      setError("Couldn't reach the explainer — check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (explanation) {
    return (
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-gold" />
          <Badge variant="gold">Your InBody Explained</Badge>
          {saved && <Badge variant="success">Saved</Badge>}
        </div>

        {classifications.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            {classifications.map((c) => (
              <div key={c.label} className="rounded-md border border-border p-2.5">
                <p className="text-xs text-muted">{c.label}</p>
                <p className={`text-sm font-semibold ${STATUS_COLOR[c.status]}`}>
                  {c.value}{c.unit} · {c.status}
                </p>
              </div>
            ))}
          </div>
        )}

        <p className="text-sm text-foreground/90 whitespace-pre-line mb-4">{explanation}</p>
        <p className="text-[11px] text-muted mb-4">
          Saved to your Progress history. This is general education, not a
          diagnosis — bring any concerns to your coach.
        </p>
        {onDone && (
          <Button onClick={onDone} className="w-full">
            Continue
          </Button>
        )}
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-2">
        <Activity size={16} className="text-crimson" />
        <Badge variant="crimson">Enter Your InBody Report</Badge>
      </div>
      <p className="text-xs text-muted mb-4">
        Got a physical InBody scan from I-BLITZ? Enter what&apos;s on it and
        get an instant plain-language explanation of what your numbers mean.
      </p>

      <ToggleGroup
        label="Gender (for reference ranges)"
        value={gender}
        onChange={setGender}
        options={[
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
        ]}
      />

      <div className="grid sm:grid-cols-2 gap-4 mt-4 mb-4">
        <Input label="Weight (kg)" type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} placeholder="70" />
        <Input label="Skeletal Muscle Mass (kg)" type="number" value={smmKg} onChange={(e) => setSmmKg(e.target.value)} placeholder="30" />
        <Input label="Percent Body Fat (%)" type="number" value={pbfPercent} onChange={(e) => setPbfPercent(e.target.value)} placeholder="18" />
        <Input label="Visceral Fat Area (cm²)" type="number" value={vfaCm2} onChange={(e) => setVfaCm2(e.target.value)} placeholder="80" />
        <Input label="ECW/TBW Ratio" type="number" value={ecwTbwRatio} onChange={(e) => setEcwTbwRatio(e.target.value)} placeholder="0.38" />
      </div>

      {error && <p className="text-sm text-danger mb-3">{error}</p>}

      <div className="flex flex-col sm:flex-row gap-2">
        <Button onClick={handleSubmit} disabled={loading} className="flex-1">
          {loading ? "Explaining..." : "Explain My Report"}
        </Button>
        {onSkip && (
          <Button variant="outline" onClick={onSkip} className="flex-1">
            I don&apos;t have my report yet
          </Button>
        )}
      </div>
    </Card>
  );
}
