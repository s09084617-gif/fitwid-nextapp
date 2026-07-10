export interface InBodyMetrics {
  weightKg?: number;
  smmKg?: number; // Skeletal Muscle Mass
  pbfPercent?: number; // Percent Body Fat
  vfaCm2?: number; // Visceral Fat Area
  ecwTbwRatio?: number; // Extracellular / Total Body Water ratio
}

export type MetricStatus = "low" | "normal" | "elevated" | "high" | "unknown";

export interface MetricClassification {
  label: string;
  value: number;
  unit: string;
  status: MetricStatus;
  note: string;
}

/** Deterministic classification against standard InBody reference ranges.
 * The AI explainer narrates these — it doesn't invent its own ranges. */
export function classifyInBodyMetrics(
  metrics: InBodyMetrics,
  gender: "male" | "female"
): MetricClassification[] {
  const results: MetricClassification[] = [];

  if (metrics.pbfPercent !== undefined) {
    const pbf = metrics.pbfPercent;
    const ranges =
      gender === "male"
        ? { low: 10, normal: 20, elevated: 25 }
        : { low: 18, normal: 28, elevated: 33 };
    let status: MetricStatus = "normal";
    if (pbf < ranges.low) status = "low";
    else if (pbf <= ranges.normal) status = "normal";
    else if (pbf <= ranges.elevated) status = "elevated";
    else status = "high";
    results.push({
      label: "Percent Body Fat",
      value: pbf,
      unit: "%",
      status,
      note: `Reference (${gender}): under ${ranges.low}% is low, up to ${ranges.normal}% is typical, above ${ranges.elevated}% is high.`,
    });
  }

  if (metrics.vfaCm2 !== undefined) {
    const vfa = metrics.vfaCm2;
    let status: MetricStatus = "normal";
    if (vfa < 100) status = "normal";
    else if (vfa < 130) status = "elevated";
    else status = "high";
    results.push({
      label: "Visceral Fat Area",
      value: vfa,
      unit: "cm²",
      status,
      note: "Under 100cm² is the standard healthy threshold; above 100cm² is associated with higher metabolic risk regardless of overall body fat %.",
    });
  }

  if (metrics.ecwTbwRatio !== undefined) {
    const ratio = metrics.ecwTbwRatio;
    let status: MetricStatus = "normal";
    if (ratio <= 0.38) status = "normal";
    else if (ratio <= 0.4) status = "elevated";
    else status = "high";
    results.push({
      label: "ECW/TBW Ratio",
      value: ratio,
      unit: "",
      status,
      note: "Roughly 0.36-0.38 is typical. Higher values can indicate water retention, inflammation, or overtraining/inadequate recovery — it's a trend to watch, not a one-time diagnosis.",
    });
  }

  if (metrics.smmKg !== undefined && metrics.weightKg) {
    const smmPercent = (metrics.smmKg / metrics.weightKg) * 100;
    let status: MetricStatus = "normal";
    const threshold = gender === "male" ? 40 : 33;
    if (smmPercent < threshold - 3) status = "low";
    else if (smmPercent < threshold + 5) status = "normal";
    else status = "elevated"; // "elevated" here just means notably muscular, not a concern
    results.push({
      label: "Skeletal Muscle Mass",
      value: metrics.smmKg,
      unit: "kg",
      status,
      note: `That's about ${smmPercent.toFixed(1)}% of your bodyweight as skeletal muscle.`,
    });
  }

  return results;
}
