import { ShieldCheck, Award, Users, Activity } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { CountUp } from "@/components/ui/count-up";
import { BladeDivider } from "@/components/ui/blade-divider";

const trustPoints = [
  {
    icon: Award,
    title: "InBody Certified",
    desc: "Trained on InBody body composition analysis — the same tech used in clinical settings.",
  },
  {
    icon: Users,
    title: "200+ Clients Coached",
    desc: "From complete beginners to competitive athletes, since 2019.",
  },
  {
    icon: ShieldCheck,
    title: "No Crash Protocols",
    desc: "Progressive, science-driven training — no gimmicks, no shortcuts.",
  },
  {
    icon: Activity,
    title: "Real Accountability",
    desc: "Weekly check-ins and direct WhatsApp access — not an automated app.",
  },
];

export function Trust() {
  return (
    <section className="w-full bg-surface/40">
      <BladeDivider />
      <div className="px-6 py-20 sm:py-32">
      <div className="max-w-5xl mx-auto">
        <FadeIn className="text-center mb-16">
          <p className="text-gold tracking-[0.3em] text-xs font-semibold uppercase mb-3">
            Why Trust FitWid
          </p>
          <h2 className="font-display text-4xl sm:text-5xl mb-4">
            Real Credentials, Real Track Record
          </h2>
        </FadeIn>

        <div className="grid sm:grid-cols-4 gap-6 mb-16">
          {trustPoints.map((t, i) => (
            <FadeIn key={t.title} delay={i * 80} className="text-center">
              <div className="h-12 w-12 rounded-full bg-crimson/15 border border-crimson/30 flex items-center justify-center mx-auto mb-4">
                <t.icon size={22} className="text-crimson" />
              </div>
              <p className="font-semibold text-sm mb-1.5">{t.title}</p>
              <p className="text-xs text-muted">{t.desc}</p>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <div className="glass rounded-lg border border-border grid grid-cols-3 divide-x divide-border">
            <div className="px-4 py-6 text-center">
              <p className="font-display text-3xl sm:text-4xl text-gold">
                <CountUp value={7} suffix="+" />
              </p>
              <p className="text-xs text-muted mt-1">Years Coaching</p>
            </div>
            <div className="px-4 py-6 text-center">
              <p className="font-display text-3xl sm:text-4xl text-gold">
                <CountUp value={200} suffix="+" />
              </p>
              <p className="text-xs text-muted mt-1">Clients Transformed</p>
            </div>
            <div className="px-4 py-6 text-center">
              <p className="font-display text-3xl sm:text-4xl text-gold">
                InBody
              </p>
              <p className="text-xs text-muted mt-1">Scan Technology Used</p>
            </div>
          </div>
        </FadeIn>
      </div>
      </div>
    </section>
  );
}
