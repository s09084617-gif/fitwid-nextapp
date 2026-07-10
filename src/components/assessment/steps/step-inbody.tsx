"use client";

import { Activity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export interface InBodyStepData {
  weightKg: string;
  bmi: string;
  bodyFatPercent: string;
  smmKg: string;
  bmr: string;
  visceralFatLevel: string;
  waistHipRatio: string;
  inbodyScore: string;
}

interface StepInBodyProps {
  data: InBodyStepData;
  onChange: <K extends keyof InBodyStepData>(key: K, value: InBodyStepData[K]) => void;
}

export function StepInBody({ data, onChange }: StepInBodyProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Activity size={18} className="text-crimson" />
        <h2 className="font-display text-2xl sm:text-3xl">Got an InBody scan?</h2>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="gold">Optional</Badge>
        <p className="text-sm text-muted">
          If you&apos;ve had a scan at I-BLITZ or elsewhere, enter it here for
          more accurate results. Skip it and we&apos;ll estimate instead.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Weight (kg)" type="number" placeholder="78" value={data.weightKg} onChange={(e) => onChange("weightKg", e.target.value)} />
        <Input label="BMI" type="number" placeholder="24.5" value={data.bmi} onChange={(e) => onChange("bmi", e.target.value)} />
        <Input label="Body Fat %" type="number" placeholder="18" value={data.bodyFatPercent} onChange={(e) => onChange("bodyFatPercent", e.target.value)} />
        <Input label="Skeletal Muscle Mass (kg)" type="number" placeholder="32" value={data.smmKg} onChange={(e) => onChange("smmKg", e.target.value)} />
        <Input label="BMR (kcal)" type="number" placeholder="1650" value={data.bmr} onChange={(e) => onChange("bmr", e.target.value)} />
        <Input label="Visceral Fat Level" type="number" placeholder="8" value={data.visceralFatLevel} onChange={(e) => onChange("visceralFatLevel", e.target.value)} />
        <Input label="Waist-Hip Ratio" type="number" placeholder="0.85" value={data.waistHipRatio} onChange={(e) => onChange("waistHipRatio", e.target.value)} />
        <Input label="InBody Score" type="number" placeholder="82" value={data.inbodyScore} onChange={(e) => onChange("inbodyScore", e.target.value)} />
      </div>
    </div>
  );
}
