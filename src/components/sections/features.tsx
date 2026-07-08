import { Activity, LineChart, Utensils, MessagesSquare } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

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
    <section id="features" className="max-w-5xl mx-auto px-6 py-24 w-full">
      <h2 className="font-display text-4xl sm:text-5xl text-center mb-4">
        Why FitWid
      </h2>
      <p className="text-muted text-center max-w-xl mx-auto mb-14">
        Coaching built on measurable data, not one-size-fits-all templates.
      </p>
      <div className="grid sm:grid-cols-2 gap-6">
        {features.map((f) => (
          <Card key={f.title} className="flex gap-4 items-start">
            <div className="shrink-0 h-11 w-11 rounded-md bg-crimson/15 border border-crimson/30 flex items-center justify-center">
              <f.icon size={20} className="text-crimson" />
            </div>
            <div>
              <CardTitle>{f.title}</CardTitle>
              <CardDescription>{f.desc}</CardDescription>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
