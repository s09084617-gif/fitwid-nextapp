import { buttonVariants } from "@/components/ui/button";

const stats: [string, string][] = [
  ["200+", "Clients Coached"],
  ["7+", "Years Experience"],
  ["4", "InBody Metrics Tracked"],
  ["100%", "Progressive Overload"],
];

export function Hero() {
  return (
    <section className="flex flex-col">
      <div className="flex flex-col items-center justify-center text-center px-6 py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(200,16,46,0.15),transparent_60%)]" />
        <p className="relative text-gold tracking-[0.3em] text-xs sm:text-sm font-semibold uppercase mb-4">
          I-BLITZ Fitness Club × FitWid
        </p>
        <h1 className="relative font-display text-6xl sm:text-8xl tracking-wide leading-none">
          FIT<span className="text-crimson">WID</span>
        </h1>
        <p className="relative mt-6 max-w-xl text-muted text-base sm:text-lg">
          Science-based, progressive overload coaching — built on InBody data,
          not guesswork.
        </p>
        <div className="relative mt-10 flex flex-col sm:flex-row gap-4">
          <a href="#pricing" className={buttonVariants({ variant: "primary", size: "lg" })}>
            Start Coaching
          </a>
          <a href="#programs" className={buttonVariants({ variant: "outline", size: "lg" })}>
            See Programs
          </a>
        </div>
      </div>

      <div className="border-y border-border bg-surface">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 divide-x divide-border">
          {stats.map(([stat, label]) => (
            <div key={label} className="px-4 py-8 text-center">
              <div className="font-display text-3xl sm:text-4xl text-gold">
                {stat}
              </div>
              <div className="text-xs sm:text-sm text-muted mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
