"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPrograms, DEFAULT_PROGRAMS, type ProgramCard } from "@/lib/local-store";

export function Programs() {
  const [programs, setPrograms] = useState<ProgramCard[]>(DEFAULT_PROGRAMS);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage on mount (admin-editable content)
    setPrograms(getPrograms());
  }, []);

  return (
    <section
      id="programs"
      className="border-t border-border bg-surface/40 px-6 py-24"
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-4xl sm:text-5xl text-center mb-4">
          Coaching Programs
        </h2>
        <p className="text-muted text-center max-w-xl mx-auto mb-14">
          Every plan starts with an InBody scan, then gets built around what
          your body actually needs.
        </p>
        <div className="grid sm:grid-cols-3 gap-6">
          {programs.map((p) => (
            <Card key={p.id}>
              <Badge variant={p.variant} className="mb-3">
                {p.badge}
              </Badge>
              <CardTitle>{p.title}</CardTitle>
              <CardDescription>{p.desc}</CardDescription>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
