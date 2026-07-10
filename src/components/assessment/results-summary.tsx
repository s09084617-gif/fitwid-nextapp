"use client";

import { motion } from "framer-motion";
import { Sparkles, Activity, Flame, Target, TrendingUp, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AssessmentResult } from "@/lib/assessment";

interface StatTileProps {
  icon: typeof Activity;
  label: string;
  value: string;
  sub?: string;
}

function StatTile({ icon: Icon, label, value, sub }: StatTileProps) {
  return (
    <Card lift={false} className="text-center py-6">
      <div className="h-10 w-10 rounded-full bg-crimson/15 border border-crimson/30 flex items-center justify-center mx-auto mb-3">
        <Icon size={18} className="text-crimson" />
      </div>
      <p className="font-display text-3xl">{value}</p>
      <p className="text-xs text-muted uppercase tracking-wide mt-1">{label}</p>
      {sub && <p className="text-[11px] text-muted mt-1">{sub}</p>}
    </Card>
  );
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function ResultsSummary({
  result,
  onGenerateWorkout,
}: {
  result: AssessmentResult;
  onGenerateWorkout: () => void;
}) {
  return (
    <motion.div initial="hidden" animate="visible" variants={container} className="space-y-6">
      <motion.div variants={item} className="text-center">
        <Badge variant="gold" className="mb-3">
          <Sparkles size={12} /> Assessment Complete
        </Badge>
        <h2 className="font-display text-3xl sm:text-4xl mb-2">
          {result.clientName ? `${result.clientName}, here's where you stand` : "Here's where you stand"}
        </h2>
        <p className="text-muted text-sm max-w-md mx-auto">{result.recommendations.summary}</p>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatTile icon={Activity} label="BMI" value={String(result.bmi)} sub={result.bmiCategory} />
        <StatTile icon={Flame} label="BMR" value={`${result.bmr}`} sub="kcal/day" />
        <StatTile icon={Award} label="Fitness Score" value={String(result.fitnessScore)} sub={result.fitnessLabel} />
        <StatTile icon={Target} label="Body Fat %" value={`${result.bodyFatPercent}%`} sub={result.bodyFatCategory} />
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <Badge variant="crimson" className="mb-4">Body Classification</Badge>
          <p className="font-display text-2xl mb-1">{result.bodyClassification}</p>
        </Card>
      </motion.div>

      <motion.div variants={item} className="grid sm:grid-cols-2 gap-4">
        <Card>
          <Badge variant="gold" className="mb-3">Daily Calories (maintenance)</Badge>
          <p className="font-display text-3xl text-gold">{result.tdee} <span className="text-sm text-muted font-sans">kcal</span></p>
        </Card>
        <Card>
          <Badge variant="crimson" className="mb-3">Recommended Calories</Badge>
          <p className="font-display text-3xl text-crimson">{result.recommendations.dailyCalories} <span className="text-sm text-muted font-sans">kcal</span></p>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <Badge variant="neutral" className="mb-4">Macro Split</Badge>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="font-display text-2xl">{result.macros.proteinG}g</p>
              <p className="text-xs text-muted">Protein</p>
            </div>
            <div>
              <p className="font-display text-2xl">{result.macros.carbsG}g</p>
              <p className="text-xs text-muted">Carbs</p>
            </div>
            <div>
              <p className="font-display text-2xl">{result.macros.fatG}g</p>
              <p className="text-xs text-muted">Fat</p>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={item} className="grid sm:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-gold" />
            <Badge variant="gold">Recommended Program</Badge>
          </div>
          <p className="font-semibold text-lg">{result.recommendations.suggestedProgram}</p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Activity size={16} className="text-crimson" />
            <Badge variant="crimson">Recommended Split</Badge>
          </div>
          <p className="font-semibold text-lg">{result.recommendedSplit}</p>
        </Card>
      </motion.div>

      {(result.smmKg || result.visceralFatLevel || result.waistHipRatio || result.inbodyScore) && (
        <motion.div variants={item}>
          <Card>
            <Badge variant="neutral" className="mb-4">From Your InBody Scan</Badge>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {result.smmKg && (
                <div><p className="font-display text-xl">{result.smmKg}kg</p><p className="text-[11px] text-muted">Muscle Mass</p></div>
              )}
              {result.visceralFatLevel && (
                <div><p className="font-display text-xl">{result.visceralFatLevel}</p><p className="text-[11px] text-muted">Visceral Fat</p></div>
              )}
              {result.waistHipRatio && (
                <div><p className="font-display text-xl">{result.waistHipRatio}</p><p className="text-[11px] text-muted">Waist-Hip Ratio</p></div>
              )}
              {result.inbodyScore && (
                <div><p className="font-display text-xl">{result.inbodyScore}</p><p className="text-[11px] text-muted">InBody Score</p></div>
              )}
            </div>
          </Card>
        </motion.div>
      )}

      <motion.div variants={item} className="pt-2">
        <Button size="lg" className="w-full" onClick={onGenerateWorkout}>
          Generate My Workout
        </Button>
      </motion.div>
    </motion.div>
  );
}
