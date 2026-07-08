import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/fade-in";

const testimonials = [
  {
    quote:
      "Coach Sahil completely changed my approach to training. In 16 weeks I went from 78kg to 70kg while actually gaining muscle. The program was insane — but it worked.",
    name: "Rahul Mehta",
    program: "Fat Loss · Bangalore",
  },
  {
    quote:
      "I've tried 3 other coaches. None of them came close to what Sahil delivers. The weekly check-ins, the nutrition guidance, the accountability — it's a whole system.",
    name: "Priya Sharma",
    program: "Body Recomposition · Online Client",
  },
  {
    quote:
      "First person to actually explain the WHY behind every exercise. My lifts went up 40% in 4 months. I finally feel like I know what I'm doing in the gym.",
    name: "Vikram Nair",
    program: "Strength · Mumbai",
  },
];

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="border-t border-border px-6 py-28 sm:py-32 bg-surface/40"
    >
      <div className="max-w-5xl mx-auto">
        <FadeIn className="text-center mb-16">
          <p className="text-gold tracking-[0.3em] text-xs font-semibold uppercase mb-3">
            Client Voices
          </p>
          <h2 className="font-display text-4xl sm:text-5xl mb-4">
            What Clients Say
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            200+ clients coached — here&apos;s what a few of them told us.
          </p>
        </FadeIn>
        <div className="grid sm:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <FadeIn key={t.name + t.program} delay={i * 80}>
              <Card glass className="flex flex-col h-full">
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
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
