"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/ui/fade-in";

const faqs = [
  {
    q: "What is InBody scanning and why does it matter?",
    a: "InBody scanning measures skeletal muscle mass (SMM), body fat percentage (PBF), water balance (ECW/TBW ratio), and visceral fat area (VFA). It shows what's actually changing in your body — muscle vs. fat vs. water — instead of relying on the scale alone.",
  },
  {
    q: "Do I need to visit I-BLITZ in person?",
    a: "No. FitWid is fully remote — programming, check-ins, and diet plans are all delivered online via WhatsApp. In-person InBody scans and 1:1 sessions are available for Bangalore-based clients on the Elite plan.",
  },
  {
    q: "Can I switch plans later?",
    a: "Yes, you can upgrade or downgrade your plan at any time. Changes apply from your next billing cycle.",
  },
  {
    q: "What if I have dietary restrictions?",
    a: "Diet plans are built around Indian foods and adjusted for your preferences, allergies, and restrictions — vegetarian, vegan, and religious fasting periods are all accounted for.",
  },
  {
    q: "How soon will I see results?",
    a: "Most clients see measurable InBody changes (muscle gain or fat loss) within 4–6 weeks, with visible physical changes typically by week 8–12, depending on starting point and consistency.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="border-t border-border px-6 py-28 sm:py-32 bg-surface/40"
    >
      <div className="max-w-3xl mx-auto">
        <FadeIn className="text-center mb-16">
          <p className="text-gold tracking-[0.3em] text-xs font-semibold uppercase mb-3">
            Questions
          </p>
          <h2 className="font-display text-4xl sm:text-5xl mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted">
            Still have questions? Message us directly on WhatsApp.
          </p>
        </FadeIn>
        <div className="space-y-3">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <FadeIn key={item.q} delay={i * 50}>
              <div
                className="rounded-lg border border-border glass overflow-hidden"
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  <span className="font-medium text-sm sm:text-base">
                    {item.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={cn(
                      "shrink-0 text-muted transition-transform",
                      isOpen && "rotate-180 text-crimson"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-300",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-sm text-muted">{item.a}</p>
                  </div>
                </div>
              </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
