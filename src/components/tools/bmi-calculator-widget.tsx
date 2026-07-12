"use client";

import { useState } from "react";
import Link from "next/link";
import { Calculator } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { buttonVariants } from "@/components/ui/button";
import { calculateBMI, bmiCategory } from "@/lib/assessment";
import { trackEvent } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";

const CATEGORY_COLOR: Record<string, string> = {
  Underweight: "text-warning",
  Normal: "text-success",
  Overweight: "text-warning",
  Obese: "text-danger",
};

type Units = "metric" | "imperial";

export function BmiCalculatorWidget() {
  const [units, setUnits] = useState<Units>("metric");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weightLb, setWeightLb] = useState("");
  const [result, setResult] = useState<{ bmi: number; category: string } | null>(null);

  function handleCalculate() {
    let h: number, w: number;
    if (units === "metric") {
      h = Number(heightCm);
      w = Number(weightKg);
    } else {
      const totalInches = Number(heightFt) * 12 + Number(heightIn || 0);
      h = totalInches * 2.54;
      w = Number(weightLb) * 0.453592;
    }
    if (!h || !w || h <= 0 || w <= 0) return;

    const bmi = calculateBMI(w, h);
    const category = bmiCategory(bmi);
    setResult({ bmi: Math.round(bmi * 10) / 10, category });
    trackEvent("tool_used", { tool: "bmi_calculator" });
  }

  return (
    <Card className="border-crimson/30">
      <div className="flex items-center gap-2 mb-5">
        <Calculator size={18} className="text-crimson" />
        <Badge variant="crimson">Free BMI Calculator</Badge>
      </div>

      <ToggleGroup
        label="Units"
        value={units}
        onChange={setUnits}
        options={[
          { value: "metric", label: "Metric (kg/cm)" },
          { value: "imperial", label: "Imperial (lb/ft-in)" },
        ]}
      />

      <div className="grid grid-cols-2 gap-4 mt-4 mb-5">
        {units === "metric" ? (
          <>
            <Input label="Height (cm)" type="number" placeholder="175" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
            <Input label="Weight (kg)" type="number" placeholder="75" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2 col-span-2 sm:col-span-1">
              <Input label="Height (ft)" type="number" placeholder="5" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} />
              <Input label="Height (in)" type="number" placeholder="9" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} />
            </div>
            <Input label="Weight (lb)" type="number" placeholder="165" value={weightLb} onChange={(e) => setWeightLb(e.target.value)} />
          </>
        )}
      </div>

      <button onClick={handleCalculate} className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full")}>
        Calculate My BMI
      </button>

      {result && (
        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted uppercase tracking-wide mb-1">Your BMI</p>
          <p className="font-display text-5xl mb-2">{result.bmi}</p>
          <p className={cn("text-lg font-semibold mb-4", CATEGORY_COLOR[result.category])}>
            {result.category}
          </p>
          <p className="text-xs text-muted mb-4 max-w-xs mx-auto">
            BMI alone doesn&apos;t account for muscle mass or where you carry fat. For your real
            body fat %, muscle mass, and a plan built around your actual numbers:
          </p>
          <Link
            href="/assessment"
            onClick={() => trackEvent("cta_clicked", { cta: "assessment", source: "bmi_calculator" })}
            className={cn(buttonVariants({ variant: "gold", size: "md" }))}
          >
            Get Your Full Body Assessment — Free
          </Link>
        </div>
      )}
    </Card>
  );
}
