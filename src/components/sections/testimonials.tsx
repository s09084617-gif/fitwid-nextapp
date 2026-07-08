import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";

const testimonials = [
  {
    quote:
      "The InBody tracking changed everything for me — I finally understood why the scale wasn't moving even though I was losing fat.",
    name: "Client, Bangalore",
    program: "Fat Loss Program, 4 months",
  },
  {
    quote:
      "Coach checked in every single week without fail. That accountability is the reason I actually finished the program.",
    name: "Client, Bangalore",
    program: "Online Coaching, 6 months",
  },
  {
    quote:
      "Diet plan actually used food I eat at home. No random Western meal plan I'd never stick to.",
    name: "Client, Bangalore",
    program: "Lean Muscle Program, 5 months",
  },
];

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="border-t border-border px-6 py-24 bg-surface/40"
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-4xl sm:text-5xl text-center mb-4">
          What Clients Say
        </h2>
        <p className="text-muted text-center max-w-xl mx-auto mb-14">
          200+ clients coached — here&apos;s what a few of them told us.
        </p>
        <div className="grid sm:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <Card key={t.name + t.program} className="flex flex-col">
              <div className="flex gap-0.5 mb-3 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="text-sm text-foreground/90 flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted">{t.program}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
