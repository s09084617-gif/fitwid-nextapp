"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";

const WHATSAPP_NUMBER = "917015552731";

/** The 3 core lead-capture CTAs, reused across every major marketing
 * page: take the free assessment, book a consultation call, or just
 * chat on WhatsApp. Each click is tracked for funnel analysis. */
export function CtaTrio({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col sm:flex-row gap-3 justify-center", className)}>
      <Link
        href="/assessment"
        onClick={() => trackEvent("cta_clicked", { cta: "assessment" })}
        className={buttonVariants({ variant: "primary", size: "lg" })}
      >
        Start Free AI Body Assessment
      </Link>
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I'd like to book a free consultation.")}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("cta_clicked", { cta: "consultation" })}
        className={buttonVariants({ variant: "gold", size: "lg" })}
      >
        Book Free Consultation
      </a>
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("cta_clicked", { cta: "whatsapp" })}
        className={buttonVariants({ variant: "outline", size: "lg" })}
      >
        Chat on WhatsApp
      </a>
    </div>
  );
}
