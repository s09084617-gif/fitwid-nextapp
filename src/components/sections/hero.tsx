"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

const stats: { value: string; label: string }[] = [
  { value: "200+", label: "Clients Coached" },
  { value: "07", label: "Years Experience" },
  { value: "04", label: "InBody Metrics Tracked" },
  { value: "100%", label: "Progressive Overload" },
];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] } },
};

export function Hero() {
  return (
    <section className="flex flex-col">
      <div className="relative min-h-[100svh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Background photo — blurred cover fill behind, full uncropped
            image on top, so the complete photo is always visible instead
            of being cropped to fill the frame. */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-collage.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            aria-hidden="true"
            className="object-cover object-center scale-110 blur-2xl opacity-60"
          />
          <Image
            src="/images/hero-collage.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-contain object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/60" />
          <div className="absolute inset-0 bg-background/30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_45%,rgba(10,10,10,0.7),transparent_70%)]" />
        </div>

        {/* Ambient red glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(204,0,0,0.3),transparent_60%)] animate-pulse [animation-duration:4s]" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={container}
          className="relative z-10 max-w-3xl"
        >
          <motion.p
            variants={item}
            className="text-gold tracking-[0.3em] text-xs sm:text-sm font-semibold uppercase mb-6"
          >
            I-BLITZ Fitness Club × FitWid
          </motion.p>

          <motion.h1
            variants={item}
            className="font-display text-[2.75rem] leading-[1.05] sm:text-7xl tracking-wide mb-6 [text-shadow:0_2px_20px_rgba(0,0,0,0.8)]"
          >
            Transform Your Body with{" "}
            <span className="font-logo text-crimson tracking-normal">
              Science
            </span>
            , Not Guesswork
          </motion.h1>

          <motion.p
            variants={item}
            className="max-w-xl mx-auto text-muted text-base sm:text-lg mb-10"
          >
            Personalized workouts, nutrition, and InBody-driven coaching.
          </motion.p>

          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="/assessment"
              className={buttonVariants({ variant: "primary", size: "lg" })}
            >
              Start Free AI Body Assessment
            </a>
            <a
              href="#transformations"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              View Transformations
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <ChevronDown size={20} className="text-muted animate-bounce [animation-duration:2s]" />
        </motion.div>
      </div>

      <div className="border-y border-border glass">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 divide-x divide-border">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="px-4 py-8 text-center"
            >
              <div className="font-mono font-bold text-2xl sm:text-3xl text-gold tabular-nums">
                {s.value}
              </div>
              <div className="text-[11px] sm:text-xs text-muted mt-1.5 uppercase tracking-wide">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
