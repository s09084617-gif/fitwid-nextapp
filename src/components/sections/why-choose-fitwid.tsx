"use client";

import { ClipboardCheck, Dumbbell, Utensils, MessageCircle, TrendingUp, Sprout } from "lucide-react";
import { RevealStagger, RevealItem, Reveal } from "@/components/ui/motion";
import { BladeDivider } from "@/components/ui/blade-divider";

const REASONS = [
  {
    icon: ClipboardCheck,
    title: "AI Body Assessment",
    desc: "Free 3-minute assessment gives you your BMI, body fat %, and full macro breakdown — no guesswork.",
  },
  {
    icon: Dumbbell,
    title: "Customized Workout Plans",
    desc: "Built around your goal, experience, and whatever equipment you actually have — home or gym.",
  },
  {
    icon: Utensils,
    title: "Personalized Meal Plans",
    desc: "Real Indian food, real macros — not a generic diet template that ignores how you actually eat.",
  },
  {
    icon: MessageCircle,
    title: "Real Coach Support",
    desc: "Direct access to your actual coach — not a chatbot pretending to care about your progress.",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    desc: "Weight, body fat, measurements, and photos — charted over time so you can see what's working.",
  },
  {
    icon: Sprout,
    title: "Beginner-Friendly",
    desc: "Never stepped in a gym before? Every plan scales to your actual starting point, not an assumed one.",
  },
];

export function WhyChooseFitwid() {
  return (
    <section id="why-fitwid" className="w-full">
      <BladeDivider />
      <div className="max-w-5xl mx-auto px-6 py-20 sm:py-32">
        <Reveal className="text-center mb-14 sm:mb-16">
          <p className="text-gold tracking-[0.3em] text-xs font-semibold uppercase mb-3">
            Why Choose FitWid
          </p>
          <h2 className="font-display text-4xl sm:text-5xl max-w-2xl mx-auto">
            Everything you need, nothing you don&apos;t.
          </h2>
        </Reveal>

        <RevealStagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {REASONS.map((r) => (
            <RevealItem
              key={r.title}
              className="rounded-lg border border-border bg-surface p-6 hover:border-crimson/40 transition-colors"
            >
              <div className="h-11 w-11 rounded-md bg-crimson/15 border border-crimson/30 flex items-center justify-center mb-4">
                <r.icon size={20} className="text-crimson" />
              </div>
              <h3 className="font-display text-lg mb-2 tracking-wide">{r.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{r.desc}</p>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
