"use client";

import { Activity, LineChart, Utensils, MessagesSquare } from "lucide-react";
import { RevealStagger, RevealItem, Reveal } from "@/components/ui/motion";
import { BladeDivider } from "@/components/ui/blade-divider";

const features = [
  {
    icon: Activity,
    tag: "SMM · PBF · VFA",
    title: "InBody-Driven Programming",
    desc: "Skeletal muscle mass, body fat %, water balance, and visceral fat guide every programming decision — not just the scale.",
  },
  {
    icon: LineChart,
    tag: "LOGGED WEEKLY",
    title: "Progressive Overload, Tracked",
    desc: "Every session logged and reviewed so your training load moves forward, not sideways.",
  },
  {
    icon: Utensils,
    tag: "INDIAN-FOOD-FIRST",
    title: "Diets Built for Real Life",
    desc: "Meal plans that fit your schedule, preferences, and macros — not a generic template.",
  },
  {
    icon: MessagesSquare,
    tag: "< 48H RESPONSE",
    title: "Direct Coach Access",
    desc: "WhatsApp check-ins with your coach — Azhar, Chiranjeevi, or Ashad — not a chatbot.",
  },
];

export function Features() {
  return (
    <section id="features" className="w-full">
      <BladeDivider />
      <div className="max-w-5xl mx-auto px-6 py-20 sm:py-32">
        <Reveal className="mb-14 sm:mb-16">
          <p className="text-gold tracking-[0.3em] text-xs font-semibold uppercase mb-3">
            Why FitWid
          </p>
          <h2 className="font-display text-4xl sm:text-5xl max-w-lg">
            Personalized coaching, powered by real data.
          </h2>
        </Reveal>

        <RevealStagger className="grid sm:grid-cols-2 gap-px bg-border rounded-lg overflow-hidden border border-border">
          {features.map((f) => (
            <RevealItem key={f.title} className="bg-background p-7 sm:p-8">
              <div className="flex items-center justify-between mb-5">
                <div className="h-11 w-11 rounded-md bg-crimson/15 border border-crimson/30 flex items-center justify-center">
                  <f.icon size={20} className="text-crimson" />
                </div>
                <span className="font-mono text-[10px] tracking-wider text-steel">
                  {f.tag}
                </span>
              </div>
              <h3 className="font-display text-xl mb-2 tracking-wide">{f.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
