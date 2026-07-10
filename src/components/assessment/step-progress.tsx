"use client";

import { motion } from "framer-motion";

interface StepProgressProps {
  steps: string[];
  currentStep: number; // 0-indexed
}

/** Progress bar + step label, shared chrome for the wizard. Mobile-first:
 * shows "Step X of Y — Label" rather than trying to cram every step name
 * into a small screen. */
export function StepProgress({ steps, currentStep }: StepProgressProps) {
  const pct = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-gold">
          Step {currentStep + 1} of {steps.length}
        </span>
        <span className="text-xs text-muted">{steps[currentStep]}</span>
      </div>
      <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-crimson"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
        />
      </div>
    </div>
  );
}
