import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { Coach } from "@/components/sections/coach";
import { Trust } from "@/components/sections/trust";
import { Programs } from "@/components/sections/programs";
import { Transformations } from "@/components/sections/transformations";
import { Testimonials } from "@/components/sections/testimonials";
import { Pricing } from "@/components/sections/pricing";
import { FAQ } from "@/components/sections/faq";
import { StickyMobileCta } from "@/components/sections/sticky-mobile-cta";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col pb-16 md:pb-0">
        <Hero />
        <Features />
        <Coach />
        <Trust />
        <Programs />
        <Transformations />
        <Testimonials />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
      <StickyMobileCta />
    </>
  );
}
