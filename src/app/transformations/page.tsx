"use client";

import { useState } from "react";
import Image from "next/image";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { TRANSFORMATIONS, GOAL_LABELS, type TransformationGoal } from "@/lib/transformations-data";

const GOALS: (TransformationGoal | "all")[] = ["all", "fat_loss", "muscle_gain", "maintain", "athletic_performance"];

export default function TransformationsGalleryPage() {
  const [filter, setFilter] = useState<TransformationGoal | "all">("all");
  const [sortBy, setSortBy] = useState<"recent" | "duration">("recent");

  let filtered = TRANSFORMATIONS.filter((t) => filter === "all" || t.goal === filter);
  filtered = [...filtered].sort((a, b) =>
    sortBy === "duration" ? b.durationWeeks - a.durationWeeks : 0
  );

  return (
    <>
      <Navbar />
      <main className="flex-1 px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-gold tracking-[0.3em] text-xs font-semibold uppercase mb-3">
              Real Results
            </p>
            <h1 className="font-display text-4xl sm:text-5xl mb-4">
              Transformation Gallery
            </h1>
            <p className="text-muted max-w-lg mx-auto">
              Every transformation here is a real FitWid client, tracked
              with real InBody data — not just before/after photos.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
            <div className="flex flex-wrap gap-2">
              {GOALS.map((g) => (
                <button
                  key={g}
                  onClick={() => setFilter(g)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium border transition ${
                    filter === g
                      ? "border-crimson bg-crimson/15 text-crimson"
                      : "border-border text-muted hover:text-foreground"
                  }`}
                >
                  {g === "all" ? "All Goals" : GOAL_LABELS[g]}
                </button>
              ))}
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "recent" | "duration")}
              className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-foreground"
            >
              <option value="recent">Sort: Featured</option>
              <option value="duration">Sort: Longest Program</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <p className="text-center text-muted py-16">
              No transformations yet for this goal — check back soon.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {filtered.map((t) => (
                <div
                  key={t.name}
                  className="rounded-lg overflow-hidden border border-border bg-surface hover:border-crimson/50 transition"
                >
                  <div className="aspect-square relative">
                    <Image
                      src={t.image}
                      alt={`${t.name} before and after transformation`}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge variant="gold">{t.duration}</Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge variant="crimson">{GOAL_LABELS[t.goal]}</Badge>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-crimson font-medium mb-3">{t.stat}</p>
                    {t.quote && (
                      <p className="text-xs text-muted italic">&ldquo;{t.quote}&rdquo;</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center">
            <p className="text-sm text-muted mb-4">
              Ready to write your own story?
            </p>
            <a
              href="https://wa.me/917015552731"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "primary", size: "lg" })}
            >
              Start Your Transformation
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
