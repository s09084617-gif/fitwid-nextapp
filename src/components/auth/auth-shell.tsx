import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/layout/logo";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
      <Image
        src="/images/coach-fitwid-walking.webp"
        alt=""
        fill
        aria-hidden="true"
        sizes="100vw"
        className="object-cover object-top opacity-[0.14] pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(200,16,46,0.12),transparent_60%)]" />
      <Link href="/" className="relative mb-8">
        <Logo size="lg" />
      </Link>
      <div className="relative w-full max-w-sm rounded-lg border border-border bg-surface p-8">
        <h1 className="font-display text-2xl mb-1">{title}</h1>
        {subtitle && <p className="text-sm text-muted mb-6">{subtitle}</p>}
        {!subtitle && <div className="mb-6" />}
        {children}
      </div>
      {footer && (
        <p className="relative mt-6 text-sm text-muted">{footer}</p>
      )}
    </main>
  );
}
