import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FloatingWhatsApp } from "@/components/shared/floating-whatsapp";
import { BmiCalculatorWidget } from "@/components/tools/bmi-calculator-widget";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "What Is BMI? Complete Guide + Free BMI Calculator",
  description:
    "Calculate your BMI instantly with our free calculator, and learn what your number actually means — including where BMI falls short as a health metric.",
};

const FAQS = [
  {
    q: "Is BMI the same as body fat percentage?",
    a: "No. BMI only uses height and weight — it can't tell the difference between muscle and fat. Two people with identical BMI can have very different body compositions. Body fat percentage (measured via InBody scan, calipers, or other methods) is a more direct measure of how much of your weight is fat versus lean mass.",
  },
  {
    q: "Why does BMI say I'm overweight when I'm clearly muscular?",
    a: "This is BMI's most common blind spot. Muscle is denser than fat, so a muscular person can weigh more for their height without carrying excess fat — and BMI has no way to see that difference. If this sounds like you, your body fat % is a far more useful number than your BMI.",
  },
  {
    q: "What's a healthy BMI range?",
    a: "For most adults, 18.5–24.9 is classified as the \"normal\" range, 25–29.9 as overweight, and 30+ as obese, per WHO and CDC standards. These ranges were developed from population-level data and are a starting point for conversation, not a precise individual diagnosis.",
  },
  {
    q: "Does BMI work the same for everyone?",
    a: "Not quite. BMI thresholds were developed primarily on data from certain populations and don't fully account for differences across ethnicities, age groups, or body types. Some research suggests South Asian populations may face higher health risks at lower BMI thresholds than the standard cutoffs suggest — worth discussing with a doctor if you're in that category.",
  },
  {
    q: "Should I rely on BMI alone to track my progress?",
    a: "No — pair it with something that reflects body composition, like body fat %, waist circumference, or progress photos. Someone doing a fat-loss-plus-muscle-gain program (body recomposition) might see their BMI barely move while their body changes significantly, because they're losing fat and gaining muscle at the same time.",
  },
];

export default function BmiCalculatorPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 px-6 py-16">
        <article className="max-w-2xl mx-auto">
          <Badge variant="crimson" className="mb-4">Calculators</Badge>
          <h1 className="font-display text-4xl sm:text-5xl mb-6">
            What Is BMI? Complete Guide + Free BMI Calculator
          </h1>

          {/* 1. Direct answer */}
          <p className="text-lg text-foreground/90 leading-relaxed mb-10">
            <strong>BMI (Body Mass Index)</strong> is a number calculated from your height and
            weight that classifies you into a weight category — underweight, normal, overweight,
            or obese. It&apos;s calculated as weight (kg) divided by height (m) squared. BMI is a
            useful, free, instant screening tool at a population level, but it doesn&apos;t measure
            body fat or muscle directly, so it can be misleading for muscular or very lean
            individuals.
          </p>

          {/* Calculator widget */}
          <div className="mb-12">
            <BmiCalculatorWidget />
          </div>

          {/* 2. Why it matters */}
          <h2 className="font-display text-2xl mb-3 text-crimson">Why BMI Matters</h2>
          <p className="text-foreground/90 leading-relaxed mb-6">
            BMI became the global standard screening tool because it&apos;s cheap, fast, and requires
            nothing more than a scale and a measuring tape — no lab equipment, no specialist. At a
            population level, higher BMI categories correlate with higher risk of conditions like
            type 2 diabetes, heart disease, and certain cancers. That&apos;s why doctors use it as a
            first-pass screening question, not a final diagnosis. It gives you and your doctor a
            starting point for a more detailed conversation about your actual health.
          </p>

          {/* 3. Benefits */}
          <h2 className="font-display text-2xl mb-3 text-crimson">Benefits of Knowing Your BMI</h2>
          <ul className="space-y-2 mb-6 text-foreground/90">
            <li>• Free, instant baseline — no equipment or appointment needed</li>
            <li>• A useful starting conversation with your doctor or coach</li>
            <li>• Tracks broad trends over time (rising, falling, stable)</li>
            <li>• Widely understood — every doctor, coach, and health app speaks this language</li>
          </ul>

          {/* 4. How to calculate */}
          <h2 className="font-display text-2xl mb-3 text-crimson">How to Calculate BMI</h2>
          <p className="text-foreground/90 leading-relaxed mb-3">
            The formula is straightforward:
          </p>
          <div className="rounded-md bg-surface-2 border border-border p-4 mb-6 font-mono text-sm">
            BMI = weight (kg) ÷ [height (m)]²
          </div>
          <p className="text-foreground/90 leading-relaxed mb-6">
            For example, someone who weighs 75kg and is 1.75m tall: 75 ÷ (1.75 × 1.75) = 75 ÷
            3.0625 = <strong>24.5</strong>. You don&apos;t need to do this by hand — use the calculator
            above, which also handles imperial units (feet/inches, pounds).
          </p>

          {/* 5. Common mistakes */}
          <h2 className="font-display text-2xl mb-3 text-crimson">Common Mistakes</h2>
          <ul className="space-y-2 mb-6 text-foreground/90">
            <li>
              <strong>Treating BMI as a diagnosis.</strong> It&apos;s a screening tool, not a
              measurement of your actual health or body composition.
            </li>
            <li>
              <strong>Ignoring muscle mass.</strong> Athletes and lifters routinely land in
              &ldquo;overweight&rdquo; or &ldquo;obese&rdquo; BMI categories despite very low body fat.
            </li>
            <li>
              <strong>Not accounting for age or population differences.</strong> Standard
              thresholds don&apos;t perfectly apply to every group — check with a doctor if you&apos;re
              unsure how it applies to you.
            </li>
            <li>
              <strong>Chasing a BMI number instead of a real goal.</strong> &ldquo;Lower my body fat %&rdquo;
              or &ldquo;get stronger&rdquo; are more actionable goals than &ldquo;lower my BMI.&rdquo;
            </li>
          </ul>

          {/* 6. FAQ */}
          <h2 className="font-display text-2xl mb-4 text-crimson">Frequently Asked Questions</h2>
          <div className="space-y-5 mb-10">
            {FAQS.map((f) => (
              <div key={f.q}>
                <p className="font-semibold mb-1.5">{f.q}</p>
                <p className="text-sm text-muted leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>

          {/* 7. References */}
          <h2 className="font-display text-xl mb-3 text-gold">References</h2>
          <ul className="text-xs text-muted space-y-1 mb-10">
            <li>World Health Organization (WHO) — BMI classification standards</li>
            <li>Centers for Disease Control and Prevention (CDC) — Adult BMI guidance</li>
          </ul>

          {/* 8 & 9. Related tool + CTA */}
          <div className="rounded-lg border border-gold/30 bg-gold/5 p-8 text-center">
            <p className="font-display text-2xl mb-2">Want the Full Picture?</p>
            <p className="text-sm text-muted mb-6 max-w-md mx-auto">
              BMI is one number. Your free AI Body Assessment gives you body fat %, BMR, calorie
              and macro targets, and a workout + meal plan built around your actual body — in
              about 3 minutes.
            </p>
            <Link href="/assessment" className={buttonVariants({ variant: "primary", size: "lg" })}>
              Start Free AI Body Assessment
            </Link>
          </div>
        </article>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
