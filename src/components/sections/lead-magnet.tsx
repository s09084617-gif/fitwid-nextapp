"use client";

import { useState, type FormEvent } from "react";
import { Download, CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/ui/motion";
import { BladeDivider } from "@/components/ui/blade-divider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { submitLeadMagnetOptIn } from "@/lib/db/user-data";
import { trackEvent } from "@/lib/analytics/events";

const MAGNET_ID = "7day-fat-loss-plan";
const PDF_URL = "/downloads/FitWid_7Day_Fat_Loss_Starter_Plan.pdf";

export function LeadMagnet() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Enter a valid email.");
      return;
    }
    setLoading(true);
    setError(null);
    const err = await submitLeadMagnetOptIn({ email, magnet: MAGNET_ID, source: "homepage" });
    setLoading(false);
    if (err) {
      setError("Something went wrong — try again.");
      return;
    }
    trackEvent("lead_magnet_optin", { magnet: MAGNET_ID });
    setSubmitted(true);
  }

  return (
    <section id="free-guide" className="w-full">
      <BladeDivider />
      <div className="max-w-2xl mx-auto px-6 py-20 sm:py-28">
        <Reveal>
          <div className="rounded-lg border border-gold/30 bg-gold/5 p-8 sm:p-10 text-center">
            <Badge variant="gold" className="mb-4">Free Download</Badge>
            <h2 className="font-display text-3xl sm:text-4xl mb-3">
              Your 7-Day Fat Loss Starter Plan
            </h2>
            <p className="text-muted mb-6 max-w-md mx-auto">
              A real meal outline (Indian food, no fads) plus a beginner
              3-day workout — free, no assessment required.
            </p>

            {submitted ? (
              <a
                href={PDF_URL}
                download
                onClick={() => trackEvent("lead_magnet_downloaded", { magnet: MAGNET_ID })}
                className="inline-flex items-center gap-2 text-success font-medium"
              >
                <CheckCircle2 size={18} /> Click here to download your PDF
              </a>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="flex-1 rounded-md border border-border bg-surface px-4 py-2.5 text-base sm:text-sm text-foreground placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson/50"
                />
                <Button type="submit" disabled={loading}>
                  <Download size={14} /> {loading ? "..." : "Get It Free"}
                </Button>
              </form>
            )}
            {error && <p className="text-sm text-danger mt-3">{error}</p>}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
