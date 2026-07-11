"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { trackEvent } from "@/lib/analytics/events";

const STORAGE_KEY = "fitwid:exit-intent-shown";

/** Desktop-only exit-intent popup — fires once per session when the
 * mouse moves toward the top of the viewport (about to leave for the
 * tab bar/close button), offering the free assessment as a last nudge.
 * Skipped entirely on touch devices, where "mouse leaving the page"
 * isn't a meaningful signal. */
export function ExitIntentPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return; // touch device
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY <= 0 && !sessionStorage.getItem(STORAGE_KEY)) {
        sessionStorage.setItem(STORAGE_KEY, "1");
        setShow(true);
        trackEvent("exit_intent_shown");
      }
    }

    // Small delay before arming, so it doesn't fire on page-load jitter.
    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 4000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  function handleClose() {
    setShow(false);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-6 hidden md:flex"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-sm w-full rounded-lg border border-border bg-background p-8 text-center"
          >
            <button
              onClick={handleClose}
              aria-label="Close"
              className="absolute top-4 right-4 text-muted hover:text-foreground"
            >
              <X size={18} />
            </button>
            <div className="flex justify-center mb-5">
              <Logo size="sm" />
            </div>
            <h3 className="font-display text-2xl mb-2">Before you go —</h3>
            <p className="text-sm text-muted mb-6">
              Take the free AI Body Assessment. 3 minutes for your BMI, body
              fat %, and a starter workout and meal plan, no strings attached.
            </p>
            <a
              href="/assessment"
              onClick={() => trackEvent("cta_clicked", { cta: "assessment", source: "exit_intent" })}
              className={`${buttonVariants({ variant: "primary", size: "lg" })} w-full`}
            >
              Start Free Assessment
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
