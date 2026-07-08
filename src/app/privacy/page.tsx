import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 px-6 py-16">
        <div className="max-w-2xl mx-auto prose-sm">
          <h1 className="font-display text-4xl mb-2">Privacy Policy</h1>
          <p className="text-xs text-muted mb-10">Last updated: July 2026</p>

          <div className="space-y-6 text-sm text-foreground/90 leading-relaxed">
            <section>
              <h2 className="font-semibold text-base mb-2">
                What We Collect
              </h2>
              <p className="text-muted">
                When you sign up, use the Body Assessment, Workout Generator,
                or Nutrition tools, we collect the information you enter
                (email, age, height, weight, fitness goals) to provide the
                service. If you sign in with Google, we receive your name,
                email, and profile photo from your Google account.
              </p>
            </section>
            <section>
              <h2 className="font-semibold text-base mb-2">
                How We Use It
              </h2>
              <p className="text-muted">
                Your data is used to generate personalized workouts, meal
                plans, and progress tracking within your account. We do not
                sell your personal data to third parties.
              </p>
            </section>
            <section>
              <h2 className="font-semibold text-base mb-2">
                Where It&apos;s Stored
              </h2>
              <p className="text-muted">
                Account data and fitness records are stored securely via
                Supabase. Progress photos are currently stored only in your
                own browser&apos;s local storage and are not uploaded to our
                servers.
              </p>
            </section>
            <section>
              <h2 className="font-semibold text-base mb-2">Your Rights</h2>
              <p className="text-muted">
                You can request access to, correction of, or deletion of
                your personal data at any time by messaging us on WhatsApp.
              </p>
            </section>
            <section>
              <h2 className="font-semibold text-base mb-2">Contact</h2>
              <p className="text-muted">
                Questions about this policy? Reach us at{" "}
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
