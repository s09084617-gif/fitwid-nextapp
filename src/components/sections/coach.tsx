import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { BladeDivider } from "@/components/ui/blade-divider";

const credentials = [
  "200+ clients coached to real results",
  "InBody-certified body composition analysis",
  "Specializes in fat loss, lean muscle & body recomposition",
  "Runs I-BLITZ Fitness Club, Bangalore",
];

export function Coach() {
  return (
    <section className="w-full">
      <BladeDivider />
      <div className="px-6 py-20 sm:py-32">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <FadeIn className="relative aspect-[3/4] rounded-lg overflow-hidden border border-border max-w-sm mx-auto md:mx-0">
          <Image
            src="/images/coach-fitwid-wall.webp"
            alt="Coach Sahil Bansal at I-BLITZ Fitness Club"
            fill
            sizes="(max-width: 768px) 90vw, 400px"
            className="object-cover"
            priority
          />
        </FadeIn>
        <FadeIn delay={100}>
          <p className="text-gold tracking-[0.3em] text-xs font-semibold uppercase mb-3">
            Meet Your Coach
          </p>
          <h2 className="font-display text-4xl sm:text-5xl mb-4">
            Sahil Bansal
          </h2>
          <p className="text-muted mb-6">
            Founder of I-BLITZ Fitness Club, a gym in Bangalore, and creator
            of FitWid — the digital coaching platform that brings his
            in-person coaching methodology online. Every program is
            built on real InBody data — not guesswork — so you always know
            exactly what&apos;s changing in your body and why.
          </p>
          <ul className="space-y-3 mb-8">
            {credentials.map((c) => (
              <li key={c} className="flex items-start gap-2.5 text-sm">
                <CheckCircle2 size={18} className="text-crimson shrink-0 mt-0.5" />
                <span className="text-foreground/90">{c}</span>
              </li>
            ))}
          </ul>
          <a
            href="https://wa.me/917015552731"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "primary", size: "lg" })}
          >
            Talk to Sahil
          </a>
        </FadeIn>
      </div>
      </div>
    </section>
  );
}
