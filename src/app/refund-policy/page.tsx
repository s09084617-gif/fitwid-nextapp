import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FloatingWhatsApp } from "@/components/shared/floating-whatsapp";

export default function RefundPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-display text-4xl mb-2">Refund Policy</h1>
          <p className="text-xs text-muted mb-10">Last updated: July 2026</p>

          <div className="space-y-6 text-sm text-foreground/90 leading-relaxed">
            <section>
              <h2 className="font-semibold text-base mb-2">Coaching Plans</h2>
              <p className="text-muted">
                If you&apos;re unsatisfied with your coaching plan, contact
                us within 7 days of your first payment for a full refund,
                provided you haven&apos;t yet received a personalized
                workout or meal plan from your coach. Once a personalized
                plan has been delivered, refunds are considered on a
                case-by-case basis.
              </p>
            </section>
            <section>
              <h2 className="font-semibold text-base mb-2">Subscription Renewals</h2>
              <p className="text-muted">
                Monthly, quarterly, and annual plans renew automatically.
                If you cancel before a renewal date, you won&apos;t be
                charged for the next cycle — but we don&apos;t offer partial
                refunds for time already used within a paid cycle.
              </p>
            </section>
            <section>
              <h2 className="font-semibold text-base mb-2">InBody Scans & In-Person Sessions</h2>
              <p className="text-muted">
                Individual InBody scans and one-off personal training
                sessions booked at I-BLITZ are non-refundable once
                completed, but can be rescheduled free of charge with at
                least 4 hours&apos; notice.
              </p>
            </section>
            <section>
              <h2 className="font-semibold text-base mb-2">How to Request a Refund</h2>
              <p className="text-muted">
                Message us on WhatsApp or email hello@fitwid.fit with your
                name and payment details. We aim to respond within 48 hours.
              </p>
            </section>
            <section>
              <h2 className="font-semibold text-base mb-2">A Note on This Page</h2>
              <p className="text-muted">
                This is a general template, not a substitute for legal
                advice specific to your business. Review it with a lawyer
                before relying on it for real transactions, and update the
                specifics (refund windows, exceptions) to match your actual
                policies.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
