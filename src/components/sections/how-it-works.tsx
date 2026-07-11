"use client";

import { ClipboardCheck, ScanLine, Dumbbell, TrendingUp, ArrowRight } from "lucide-react";
import { RevealStagger, RevealItem, Reveal } from "@/components/ui/motion";
import { BladeDivider } from "@/components/ui/blade-divider";
import { CtaTrio } from "@/components/shared/cta-trio";

const STEPS = [
  {
    icon: ClipboardCheck,
    step: "01",
    title: "Complete the Free AI Body Assessment",
    desc: "Answer a few questions about your body, goals, and lifestyle — takes about 3 minutes.",
  },
  {
    icon: ScanLine,
    step: "02",
    title: "Get Your Body Analysis Instantly",
    desc: "BMI, body fat %, fitness score, and full macro breakdown — calculated the moment you finish.",
  },
  {
    icon: Dumbbell,
    step: "03",
    title: "Receive Your Personalized Plan",
    desc: "A workout built around your equipment and goal, plus an Indian meal plan matched to your macros.",
  },
  {
    icon: TrendingUp,
    step: "04",
    title: "Track Progress With Coach Support",
    desc: "Log your progress, ask your AI Coach anytime, and stay accountable with real coach check-ins.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full bg-surface/40">
      <BladeDivider />
      <div className="max-w-5xl mx-auto px-6 py-20 sm:py-32">
        <Reveal className="text-center mb-14 sm:mb-16">
          <p className="text-gold tracking-[0.3em] text-xs font-semibold uppercase mb-3">
            How It Works
          </p>
          <h2 className="font-display text-4xl sm:text-5xl max-w-xl mx-auto">
            From sign-up to results, in four steps.
          </h2>
        </Reveal>

        <RevealStagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {STEPS.map((s, i) => (
            <RevealItem key={s.step} className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-11 w-11 rounded-full bg-crimson/15 border border-crimson/30 flex items-center justify-center shrink-0">
                  <s.icon size={18} className="text-crimson" />
                </div>
                <span className="font-mono text-2xl text-border">{s.step}</span>
              </div>
              <h3 className="font-display text-lg mb-2 tracking-wide">{s.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{s.desc}</p>
              {i < STEPS.length - 1 && (
                <ArrowRight
                  size={16}
                  className="hidden lg:block absolute top-5 -right-5 text-border"
                />
              )}
            </RevealItem>
          ))}
        </RevealStagger>

        <Reveal className="text-center">
          <CtaTrio />
        </Reveal>
      </div>
    </section>
  );
}
