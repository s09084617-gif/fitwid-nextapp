"use client";

import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/motion";
import { BladeDivider } from "@/components/ui/blade-divider";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    price: "₹3,999",
    period: "/month",
    desc: "For clients getting started with structured training.",
    features: [
      "Custom workout program",
      "Monthly InBody review",
      "WhatsApp support (48h)",
    ],
    featured: false,
  },
  {
    name: "Coached",
    price: "₹7,999",
    period: "/month",
    desc: "Full coaching with weekly accountability.",
    features: [
      "Everything in Starter",
      "Weekly check-ins",
      "Custom diet plan",
      "Priority WhatsApp support",
    ],
    featured: true,
  },
  {
    name: "1:1 Elite",
    price: "₹14,999",
    period: "/month",
    desc: "Direct coach access with in-person + online hybrid.",
    features: [
      "Everything in Coached",
      "In-person sessions (I-BLITZ)",
      "Bi-weekly InBody scans",
      "Direct coach phone access",
    ],
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="w-full">
      <BladeDivider />
      <div className="max-w-5xl mx-auto px-6 py-20 sm:py-32">
        <Reveal className="text-center mb-14 sm:mb-16">
          <p className="text-gold tracking-[0.3em] text-xs font-semibold uppercase mb-3">
            Investment
          </p>
          <h2 className="font-display text-4xl sm:text-5xl mb-4">
            Coaching Plans
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            Simple monthly pricing. Cancel or switch plans anytime.
          </p>
        </Reveal>
        <RevealStagger className="grid sm:grid-cols-3 gap-6 items-start">
          {plans.map((p) => (
            <RevealItem key={p.name} className="h-full">
              <div
                className={cn(
                  "rounded-lg border p-6 flex flex-col relative h-full transition-all duration-300 hover:-translate-y-1",
                  p.featured
                    ? "border-crimson glass shadow-[0_0_0_1px_rgba(204,0,0,0.4)] sm:scale-[1.03]"
                    : "border-border glass hover:border-crimson/50"
                )}
              >
                {p.featured && (
                  <Badge variant="crimson" className="absolute -top-3 left-6">
                    Most Popular
                  </Badge>
                )}
                <h3 className="font-display text-2xl mb-1 tracking-wide">{p.name}</h3>
                <p className="text-sm text-muted mb-4">{p.desc}</p>
                <div className="mb-6">
                  <span className="font-mono font-bold text-3xl sm:text-4xl text-gold tabular-nums">
                    {p.price}
                  </span>
                  <span className="text-sm text-muted">{p.period}</span>
                </div>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check size={16} className="text-crimson shrink-0 mt-0.5" />
                      <span className="text-foreground/90">{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="https://wa.me/917015552731"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({
                    variant: p.featured ? "primary" : "outline",
                    className: "w-full",
                  })}
                >
                  Get Started
                </a>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
