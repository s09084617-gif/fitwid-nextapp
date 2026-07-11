"use client";

import { MessageCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics/events";

const WHATSAPP_NUMBER = "917015552731";

export function FloatingWhatsApp() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I'm interested in FitWid.")}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("whatsapp_button_clicked", { source: "floating" })}
      aria-label="Chat on WhatsApp"
      className="fixed z-40 bottom-20 right-4 md:bottom-6 md:right-6 h-14 w-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-black/40 hover:scale-105 transition-transform"
    >
      <MessageCircle size={26} fill="white" strokeWidth={0} />
    </a>
  );
}
