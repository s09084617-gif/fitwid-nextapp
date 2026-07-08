import { Camera, MessageCircle } from "lucide-react";

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Features", href: "#features" },
      { label: "Programs", href: "#programs" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "I-BLITZ Fitness Club", href: "#" },
      { label: "About Coaches", href: "#" },
      { label: "Testimonials", href: "#testimonials" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border px-6 pt-16 pb-8">
      <div className="max-w-5xl mx-auto grid sm:grid-cols-4 gap-10">
        <div className="sm:col-span-2">
          <p className="font-display text-2xl tracking-wide mb-3">
            FIT<span className="text-crimson">WID</span>
          </p>
          <p className="text-sm text-muted max-w-xs mb-4">
            Science-based coaching from I-BLITZ Fitness Club, Bangalore.
            Data-driven programming, real accountability.
          </p>
          <div className="flex gap-3">
            <a
              href="https://instagram.com/sahil_r_fitness"
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 w-9 rounded-full border border-border flex items-center justify-center text-muted hover:text-gold hover:border-gold/40 transition"
              aria-label="Instagram"
            >
              <Camera size={16} />
            </a>
            <a
              href="https://wa.me/917015552731"
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 w-9 rounded-full border border-border flex items-center justify-center text-muted hover:text-crimson hover:border-crimson/40 transition"
              aria-label="WhatsApp"
            >
              <MessageCircle size={16} />
            </a>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-sm font-semibold mb-3">{col.title}</p>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-muted hover:text-foreground transition"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto mt-12 pt-6 border-t border-border text-center text-xs text-muted">
        © {new Date().getFullYear()} FitWid · I-BLITZ Fitness Club, Bangalore
      </div>
    </footer>
  );
}
