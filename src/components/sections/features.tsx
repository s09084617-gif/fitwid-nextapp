import { Activity, LineChart, Utensils, MessagesSquare } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/fade-in";

const features = [
  {
    icon: Activity,
    title: "InBody-Driven Programming",
    desc: "SMM, PBF, ECW/TBW ratio, and VFA guide every programming decision — not just the scale.",
  },
  {
    icon: LineChart,
    title: "Progressive Overload, Tracked",
    desc: "Every session logged and reviewed so your training load moves forward, not sideways.",
  },
  {
    icon: Utensils,
    title: "Diets Built for Real Life",
    desc: "Indian-food-first meal plans that fit your schedule, preferences, and macros.",
  },
  {
    icon: MessagesSquare,
    title: "Direct Coach Access",
    desc: "WhatsApp check-ins with your coach — Azhar, Chiranjeevi, or Ashad — not a chatbot.",
  },
];

export function Features() {
  return (
    <section id="features" className="max-w-5xl mx-auto px-6 py-28 sm:py-32 w-full">
      <FadeIn className="text-center mb-16">
        <p className="text-gold tracking-[0.3em] text-xs font-semibold uppercase mb-3">
          Why FitWid
        </p>
        <h2 className="font-display text-4xl sm:text-5xl mb-4">
          Personalized coaching, powered by real data.
        </h2>
      </FadeIn>
      <div className="grid sm:grid-cols-2 gap-6">
        {features.map((f, i) => (
          <FadeIn key={f.title} delay={i * 80}>
            <Card glass className="flex gap-4 items-start h-full">
              <div className="shrink-0 h-11 w-11 rounded-md bg-crimson/15 border border-crimson/30 flex items-center justify-center">
                <f.icon size={20} className="text-crimson" />
              </div>
              <div>
                <CardTitle>{f.title}</CardTitle>
                <CardDescription>{f.desc}</CardDescription>
              </div>
            </Card>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
