import { buttonVariants } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const programs = [
  {
    title: "Fat Loss + Muscle Retention",
    desc: "Structured deficit programming that protects lean mass while body fat drops.",
    badge: "Program" as const,
    variant: "crimson" as const,
  },
  {
    title: "Lean Muscle Building",
    desc: "Progressive overload blocks designed around your recovery and InBody trends.",
    badge: "Program" as const,
    variant: "gold" as const,
  },
  {
    title: "Online Coaching (FitWid)",
    desc: "Remote check-ins, habit tracking, and diet plans — coached from anywhere.",
    badge: "Online" as const,
    variant: "success" as const,
  },
];

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 relative overflow-hidden">
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
          <a href="#programs" className={buttonVariants({ variant: "primary", size: "lg" })}>
            Start Coaching
          </a>
          <a href="#contact" className={buttonVariants({ variant: "outline", size: "lg" })}>
            Talk to a Coach
          </a>
        </div>
      </section>

      {/* Metrics strip */}
      <section className="border-y border-border bg-surface">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 divide-x divide-border">
          {[
            ["200+", "Clients Coached"],
            ["7+", "Years Experience"],
            ["4", "InBody Metrics Tracked"],
            ["100%", "Progressive Overload"],
          ].map(([stat, label]) => (
            <div key={label} className="px-4 py-8 text-center">
              <div className="font-display text-3xl sm:text-4xl text-gold">
                {stat}
              </div>
              <div className="text-xs sm:text-sm text-muted mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Programs */}
      <section id="programs" className="max-w-5xl mx-auto px-6 py-24 w-full">
        <h2 className="font-display text-4xl sm:text-5xl text-center mb-4">
          Coaching Programs
        </h2>
        <p className="text-muted text-center max-w-xl mx-auto mb-14">
          Every plan starts with an InBody scan — SMM, PBF, ECW/TBW ratio, VFA
          — then gets built around what your body actually needs.
        </p>
        <div className="grid sm:grid-cols-3 gap-6">
          {programs.map((p) => (
            <Card key={p.title}>
              <Badge variant={p.variant} className="mb-3">
                {p.badge}
              </Badge>
              <CardTitle>{p.title}</CardTitle>
              <CardDescription>{p.desc}</CardDescription>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact / CTA */}
      <section
        id="contact"
        className="border-t border-border px-6 py-20 text-center"
      >
        <h2 className="font-display text-3xl sm:text-4xl mb-4">
          Ready to train with data, not guesswork?
        </h2>
        <a
          href="https://wa.me/917015552731"
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "gold", size: "lg", className: "mt-4" })}
        >
          Message on WhatsApp
        </a>
      </section>

      <footer className="border-t border-border py-8 text-center text-muted text-xs">
        © {new Date().getFullYear()} FitWid · I-BLITZ Fitness Club, Bangalore
      </footer>
    </main>
  );
}
