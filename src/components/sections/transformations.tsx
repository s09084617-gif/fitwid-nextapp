import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/ui/fade-in";
import { buttonVariants } from "@/components/ui/button";

const transformations = [
  {
    name: "Rahul M.",
    duration: "16 Weeks",
    stat: "+8kg Muscle · −12kg Fat",
    image: "/images/transform-man-tshirt.jpg",
    quote:
      "In 16 weeks I went from 78kg to 70kg while actually gaining muscle. The program was insane — but it worked.",
  },
  {
    name: "Priya S.",
    duration: "20 Weeks",
    stat: "+5kg Muscle · −14kg Fat",
    image: "/images/transform-woman-1.jpg",
    quote:
      "The weekly check-ins, the nutrition guidance, the accountability — it's a whole system.",
  },
  {
    name: "Karan T.",
    duration: "14 Weeks",
    stat: "+10kg Muscle · −8kg Fat",
    image: "/images/transform-man-tank.jpg",
    quote: null,
  },
];

export function Transformations() {
  return (
    <section id="transformations" className="max-w-5xl mx-auto px-6 py-28 sm:py-32 w-full">
      <FadeIn className="text-center mb-16">
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
      </FadeIn>
      <div className="grid sm:grid-cols-3 gap-6">
        {transformations.map((t, i) => (
          <FadeIn key={t.name} delay={i * 100}>
            <div className="rounded-lg overflow-hidden border border-border bg-surface transition-all duration-300 hover:border-crimson/50 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)] h-full flex flex-col">
              <div className="aspect-square relative">
                <Image
                  src={t.image}
                  alt={`${t.name} before and after transformation`}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="gold">{t.duration}</Badge>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm text-crimson font-medium mb-3">
                  {t.stat}
                </p>
                {t.quote && (
                  <p className="text-xs text-muted italic flex-1">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                )}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
      <FadeIn className="text-center mt-12">
        <a
          href="https://wa.me/917015552731"
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Start Your Transformation
        </a>
      </FadeIn>
    </section>
  );
}
