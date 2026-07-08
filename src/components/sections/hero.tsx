import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { CountUp } from "@/components/ui/count-up";

const stats: { value: number; suffix: string; label: string }[] = [
  { value: 200, suffix: "+", label: "Clients Coached" },
  { value: 7, suffix: "+", label: "Years Experience" },
  { value: 4, suffix: "", label: "InBody Metrics Tracked" },
  { value: 100, suffix: "%", label: "Progressive Overload" },
];

export function Hero() {
  return (
    <section className="flex flex-col">
      <div className="relative min-h-[100svh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Background photo */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-collage.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/60" />
          <div className="absolute inset-0 bg-background/30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_45%,rgba(10,10,10,0.7),transparent_70%)]" />
        </div>

        {/* Animated red glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(204,0,0,0.3),transparent_60%)] animate-pulse [animation-duration:4s]" />

        <div className="relative z-10 max-w-3xl">
          <p className="text-gold tracking-[0.3em] text-xs sm:text-sm font-semibold uppercase mb-6">
            I-BLITZ Fitness Club × FitWid
          </p>
          <h1 className="font-display text-5xl sm:text-7xl tracking-wide leading-[1.05] mb-6 [text-shadow:0_2px_20px_rgba(0,0,0,0.8)]">
            Transform Your Body with{" "}
            <span className="text-crimson">Science</span>, Not Guesswork
          </h1>
          <p className="max-w-xl mx-auto text-muted text-base sm:text-lg mb-10">
            Personalized workouts, nutrition, and InBody-driven coaching.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/assessment"
              className={buttonVariants({ variant: "primary", size: "lg" })}
            >
              Start Free Assessment
            </a>
            <a
              href="#transformations"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              View Transformations
            </a>
          </div>
        </div>
      </div>

      <div className="border-y border-border glass">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 divide-x divide-border">
          {stats.map((s) => (
            <div key={s.label} className="px-4 py-8 text-center">
              <div className="font-display text-3xl sm:text-4xl text-gold">
                <CountUp value={s.value} suffix={s.suffix} />
              </div>
              <div className="text-xs sm:text-sm text-muted mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
