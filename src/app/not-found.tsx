import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FloatingWhatsApp } from "@/components/shared/floating-whatsapp";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center min-h-[60vh]">
        <p className="font-display text-8xl text-crimson mb-4">404</p>
        <h1 className="font-display text-3xl mb-3">Page Not Found</h1>
        <p className="text-muted max-w-sm mb-8">
          This page doesn&apos;t exist — but your transformation still can.
          Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/" className={buttonVariants({ variant: "outline", size: "lg" })}>
            Back to Home
          </Link>
          <Link href="/assessment" className={buttonVariants({ variant: "primary", size: "lg" })}>
            Start Free Assessment
          </Link>
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
