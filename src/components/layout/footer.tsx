"use client";

import Link from "next/link";
import { Camera, MessageCircle, MapPin } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { BladeDivider } from "@/components/ui/blade-divider";
import { Reveal } from "@/components/ui/motion";

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Features", href: "#features" },
      { label: "Programs", href: "#programs" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
      { label: "Blog", href: "/blog" },
      { label: "BMI Calculator", href: "/tools/bmi-calculator" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Meet the Coach", href: "#" },
      { label: "Transformations", href: "#transformations" },
      { label: "Testimonials", href: "#testimonials" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Refund Policy", href: "/refund-policy" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="w-full">
      <BladeDivider />
      <div className="px-6 pt-16 pb-8">
        <Reveal>
          <div className="max-w-5xl mx-auto grid sm:grid-cols-5 gap-10">
            <div className="sm:col-span-2">
              <div className="mb-3">
                <Logo size="sm" />
              </div>
              <p className="text-sm text-muted max-w-xs mb-4">
                Science-based coaching from I-BLITZ Fitness Club, Bangalore.
                Data-driven programming, real accountability.
              </p>
              <div className="space-y-1.5 mb-4 text-sm text-muted">
                <a
                  href="https://wa.me/917015552731"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-foreground transition"
                >
                  <MessageCircle size={14} /> +91 70155 52731
                </a>
                <p className="flex items-center gap-2">
                  <MapPin size={14} /> Bangalore, India
                </p>
              </div>
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
                  {col.links.map((l) =>
                    l.href.startsWith("/") ? (
                      <li key={l.label}>
                        <Link
                          href={l.href}
                          className="text-sm text-muted hover:text-foreground transition"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ) : (
                      <li key={l.label}>
                        <a
                          href={l.href}
                          className="text-sm text-muted hover:text-foreground transition"
                        >
                          {l.label}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="max-w-5xl mx-auto mt-12 pt-6 border-t border-border text-center text-xs text-muted font-mono">
          © {new Date().getFullYear()} FitWid · I-BLITZ Fitness Club, Bangalore
        </div>
      </div>
    </footer>
  );
}
