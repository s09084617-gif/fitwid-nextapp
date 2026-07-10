"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/motion";
import { BladeDivider } from "@/components/ui/blade-divider";
import { buttonVariants } from "@/components/ui/button";
import { TRANSFORMATIONS } from "@/lib/transformations-data";

export function Transformations() {
  return (
    <section id="transformations" className="w-full">
      <BladeDivider />
      <div className="max-w-5xl mx-auto px-6 py-20 sm:py-32">
        <Reveal className="text-center mb-14 sm:mb-16">
          <p className="text-gold tracking-[0.3em] text-xs font-semibold uppercase mb-3">
            Client Results
          </p>
          <h2 className="font-display text-4xl sm:text-5xl mb-4">
            Real People. Real Results.
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            200+ transformations and counting. Every result backed by real
            InBody progress — not just photos.
          </p>
        </Reveal>
        <RevealStagger className="grid sm:grid-cols-3 gap-6">
          {TRANSFORMATIONS.map((t) => (
            <RevealItem key={t.name}>
              <div className="group rounded-lg overflow-hidden border border-border bg-surface transition-all duration-300 hover:border-crimson/50 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)] h-full flex flex-col">
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={t.image}
                    alt={`${t.name} before and after transformation`}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="gold">{t.duration}</Badge>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <p className="font-semibold">{t.name}</p>
                  <p className="font-mono text-xs text-crimson font-medium mb-3 tracking-wide">
                    {t.stat}
                  </p>
                  {t.quote && (
                    <p className="text-xs text-muted italic flex-1">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
        <Reveal delay={0.15} className="text-center mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/transformations" className={buttonVariants({ variant: "outline", size: "lg" })}>
            View Full Gallery
          </Link>
          <a
            href="https://wa.me/917015552731"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "primary", size: "lg" })}
          >
            Start Your Transformation
          </a>
        </Reveal>
      </div>
    </section>
  );
}
