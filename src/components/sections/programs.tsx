"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RevealStagger, RevealItem, Reveal } from "@/components/ui/motion";
import { BladeDivider } from "@/components/ui/blade-divider";
import { getPrograms, DEFAULT_PROGRAMS, type ProgramCard } from "@/lib/db/shared-data";

export function Programs() {
  const [programs, setPrograms] = useState<ProgramCard[]>(DEFAULT_PROGRAMS);

  useEffect(() => {
    getPrograms().then(setPrograms);
  }, []);

  return (
    <section id="programs" className="w-full bg-surface/40">
      <BladeDivider />
      <div className="max-w-5xl mx-auto px-6 py-20 sm:py-32">
        <Reveal className="text-center mb-14 sm:mb-16">
          <p className="text-gold tracking-[0.3em] text-xs font-semibold uppercase mb-3">
            Choose Your Path
          </p>
          <h2 className="font-display text-4xl sm:text-5xl mb-4">
            Coaching Programs
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            Every plan starts with an InBody scan, then gets built around
            what your body actually needs.
          </p>
        </Reveal>
        <RevealStagger className="grid sm:grid-cols-3 gap-6">
          {programs.map((p) => (
            <RevealItem key={p.id}>
              <Card
                glass
                className="h-full transition-all duration-300 hover:-translate-y-1 hover:border-crimson/40"
              >
                <Badge variant={p.variant} className="mb-3">
                  {p.badge}
                </Badge>
                <CardTitle>{p.title}</CardTitle>
                <CardDescription>{p.desc}</CardDescription>
              </Card>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
