import { Badge } from "@/components/ui/badge";

const transformations = [
  { name: "Client A", duration: "16 weeks", stat: "-8.2% Body Fat" },
  { name: "Client B", duration: "12 weeks", stat: "+3.1kg SMM" },
  { name: "Client C", duration: "20 weeks", stat: "-11kg, VFA normalized" },
];

export function Transformations() {
  return (
    <section id="transformations" className="max-w-5xl mx-auto px-6 py-24 w-full">
      <h2 className="font-display text-4xl sm:text-5xl text-center mb-4">
        Real Transformations
      </h2>
      <p className="text-muted text-center max-w-xl mx-auto mb-14">
        Every result backed by before/after InBody scans — not just photos.
      </p>
      <div className="grid sm:grid-cols-3 gap-6">
        {transformations.map((t) => (
          <div
            key={t.name}
            className="rounded-lg overflow-hidden border border-border bg-surface"
          >
            <div className="aspect-[3/4] bg-[linear-gradient(160deg,var(--surface-2),var(--background))] flex items-center justify-center relative">
              <span className="font-display text-2xl text-muted/50 tracking-wide">
                Before / After
              </span>
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
      <p className="text-center text-xs text-muted mt-8">
        Photo placeholders shown — swap in real client before/after images
        (with consent) before launch.
      </p>
    </section>
  );
}
