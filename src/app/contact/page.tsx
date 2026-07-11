import { Mail, Camera, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FloatingWhatsApp } from "@/components/shared/floating-whatsapp";
import { ContactForm } from "./contact-form";

const CONTACT_OPTIONS = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+91 70155 52731",
    href: "https://wa.me/917015552731",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@fitwid.fit",
    href: "mailto:hello@fitwid.fit",
  },
  {
    icon: Camera,
    label: "Instagram",
    value: "@sahil_r_fitness",
    href: "https://instagram.com/sahil_r_fitness",
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 px-6 py-16">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-10">
            <p className="text-gold tracking-[0.3em] text-xs font-semibold uppercase mb-3">
              Get In Touch
            </p>
            <h1 className="font-display text-4xl sm:text-5xl mb-4">Contact Us</h1>
            <p className="text-muted">
              Questions about coaching, pricing, or anything else? Reach out
              directly or send a quick message below.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-10">
            {CONTACT_OPTIONS.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-border bg-surface p-4 text-center hover:border-crimson/40 transition-colors"
              >
                <c.icon size={20} className="text-crimson mx-auto mb-2" />
                <p className="text-xs font-medium">{c.label}</p>
                <p className="text-[11px] text-muted mt-0.5 break-all">{c.value}</p>
              </a>
            ))}
          </div>

          <ContactForm />
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
