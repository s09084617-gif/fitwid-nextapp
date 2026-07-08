import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-display text-4xl mb-2">Terms & Conditions</h1>
          <p className="text-xs text-muted mb-10">Last updated: July 2026</p>

          <div className="space-y-6 text-sm text-foreground/90 leading-relaxed">
            <section>
              <h2 className="font-semibold text-base mb-2">
                Coaching Services
              </h2>
              <p className="text-muted">
                FitWid and I-BLITZ Fitness Club provide fitness coaching,
                nutrition guidance, and progress tracking tools. Coaching
                plans are billed monthly and can be cancelled or switched at
                any time, effective from the next billing cycle.
              </p>
            </section>
            <section>
              <h2 className="font-semibold text-base mb-2">
                Not Medical Advice
              </h2>
              <p className="text-muted">
                Body Assessment results, calorie/macro calculations, and
                generated workout or meal plans are estimates for general
                fitness guidance only — not medical advice. Consult a doctor
                before starting any new exercise or diet program, especially
                if you have an existing health condition.
              </p>
            </section>
            <section>
              <h2 className="font-semibold text-base mb-2">
                Assumption of Risk
              </h2>
              <p className="text-muted">
                Exercise carries inherent risk of injury. By using our
                workout programs, you acknowledge this risk and confirm
                you&apos;re physically able to participate in the activities
                recommended.
              </p>
            </section>
            <section>
              <h2 className="font-semibold text-base mb-2">Payments</h2>
              <p className="text-muted">
                Coaching sign-ups are currently arranged manually via
                WhatsApp. Pricing shown on this site is subject to change;
                confirmed pricing is agreed upon before your first payment.
              </p>
            </section>
            <section>
              <h2 className="font-semibold text-base mb-2">Contact</h2>
              <p className="text-muted">
                Questions about these terms? Reach us at{" "}
                <a
                  href="https://wa.me/917015552731"
                  className="text-crimson hover:underline"
                >
                  +91 70155 52731
                </a>{" "}
                on WhatsApp.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
