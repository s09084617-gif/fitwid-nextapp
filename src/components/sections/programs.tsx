"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/ui/fade-in";
import { getPrograms, DEFAULT_PROGRAMS, type ProgramCard } from "@/lib/db/shared-data";

export function Programs() {
  const [programs, setPrograms] = useState<ProgramCard[]>(DEFAULT_PROGRAMS);

  useEffect(() => {
    getPrograms().then(setPrograms);
  }, []);

  return (
    <section
      id="programs"
      className="border-t border-border bg-surface/40 px-6 py-28 sm:py-32"
    >
      <div className="max-w-5xl mx-auto">
        <FadeIn className="text-center mb-16">
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
        </FadeIn>
        <div className="grid sm:grid-cols-3 gap-6">
          {programs.map((p, i) => (
            <FadeIn key={p.id} delay={i * 80}>
              <Card glass className="h-full">
                <Badge variant={p.variant} className="mb-3">
                  {p.badge}
                </Badge>
                <CardTitle>{p.title}</CardTitle>
                <CardDescription>{p.desc}</CardDescription>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
