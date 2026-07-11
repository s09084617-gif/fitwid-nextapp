import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { WhyChooseFitwid } from "@/components/sections/why-choose-fitwid";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Features } from "@/components/sections/features";
import { Coach } from "@/components/sections/coach";
import { Philosophy } from "@/components/sections/philosophy";
import { Trust } from "@/components/sections/trust";
import { Programs } from "@/components/sections/programs";
import { Transformations } from "@/components/sections/transformations";
import { Testimonials } from "@/components/sections/testimonials";
import { LeadMagnet } from "@/components/sections/lead-magnet";
import { Pricing } from "@/components/sections/pricing";
import { FAQ } from "@/components/sections/faq";
import { StickyMobileCta } from "@/components/sections/sticky-mobile-cta";
import { FloatingWhatsApp } from "@/components/shared/floating-whatsapp";
import { ExitIntentPopup } from "@/components/shared/exit-intent-popup";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ExerciseGym",
  name: "I-BLITZ Fitness Club",
  alternateName: "FitWid",
  description:
    "Science-based, InBody-driven personal training and online coaching in Bangalore.",
  url: "https://fitwid.fit",
  telephone: "+917015552731",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bangalore",
    addressRegion: "Karnataka",
    addressCountry: "IN",
  },
  priceRange: "₹₹",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="flex-1 flex flex-col pb-16 md:pb-0">
        <Hero />
        <WhyChooseFitwid />
        <HowItWorks />
        <Features />
        <Coach />
        <Philosophy />
        <Trust />
        <Programs />
        <Transformations />
        <Testimonials />
        <LeadMagnet />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
      <StickyMobileCta />
      <FloatingWhatsApp />
      <ExitIntentPopup />
    </>
  );
}
