import Image from "next/image";
import { FadeIn } from "@/components/ui/fade-in";

const PILLARS = ["Discipline", "Consistency", "Transformation"];

export function Philosophy() {
  return (
    <section className="border-t border-border px-6 py-28 sm:py-32 bg-surface/40">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <FadeIn className="order-2 md:order-1">
          <p className="text-gold tracking-[0.3em] text-xs font-semibold uppercase mb-3">
            Our Philosophy
          </p>
          <h2 className="font-display text-4xl sm:text-5xl mb-6 leading-tight">
            Fitness Is The Way
          </h2>
          <div className="flex flex-wrap gap-3 mb-6">
            {PILLARS.map((p) => (
              <span
                key={p}
                className="rounded-full border border-gold/40 bg-gold/5 px-4 py-1.5 text-sm font-medium text-gold"
              >
                {p}
              </span>
            ))}
          </div>
          <p className="text-muted max-w-md">
            This isn&apos;t a slogan on our wall — it&apos;s how every
            program at I-BLITZ is built. No shortcuts, no fads. Just the
            discipline to show up, the consistency to keep showing up, and
            the transformation that follows when you do.
          </p>
        </FadeIn>
        <FadeIn delay={100} className="order-1 md:order-2 relative aspect-[3/4] rounded-lg overflow-hidden border border-border max-w-sm mx-auto">
          <Image
            src="/images/coach-fitwid-kneeling.png"
            alt="FitWid — Discipline, Consistency, Transformation"
            fill
            sizes="(max-width: 768px) 90vw, 400px"
            className="object-cover"
          />
        </FadeIn>
      </div>
    </section>
  );
}
