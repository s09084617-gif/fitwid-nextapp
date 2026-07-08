import Image from "next/image";
import { Badge } from "@/components/ui/badge";

const transformations = [
  {
    name: "Rahul M.",
    duration: "16 Weeks",
    stat: "+8kg Muscle · −12kg Fat",
    image: "/images/transform-man-tshirt.jpg",
  },
  {
    name: "Priya S.",
    duration: "20 Weeks",
    stat: "+5kg Muscle · −14kg Fat",
    image: "/images/transform-woman-1.jpg",
  },
  {
    name: "Karan T.",
    duration: "14 Weeks",
    stat: "+10kg Muscle · −8kg Fat",
    image: "/images/transform-man-tank.jpg",
  },
];

export function Transformations() {
  return (
    <section id="transformations" className="max-w-5xl mx-auto px-6 py-24 w-full">
      <h2 className="font-display text-4xl sm:text-5xl text-center mb-4">
        Real Transformations
      </h2>
      <p className="text-muted text-center max-w-xl mx-auto mb-14">
        200+ transformations and counting. Every result backed by real
        InBody progress — not just photos.
      </p>
      <div className="grid sm:grid-cols-3 gap-6">
        {transformations.map((t) => (
          <div
            key={t.name}
            className="rounded-lg overflow-hidden border border-border bg-surface"
          >
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
            <div className="p-4">
              <p className="font-semibold">{t.name}</p>
              <p className="text-sm text-crimson font-medium">{t.stat}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
