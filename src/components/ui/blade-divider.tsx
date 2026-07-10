import { cn } from "@/lib/utils";

/**
 * Signature section-transition motif: a thin line with a single angled
 * cut and a glinting point, echoing the katana in FitWid's brand
 * photography — used as a divider between homepage sections instead of
 * a plain border. Purely decorative (aria-hidden).
 */
export function BladeDivider({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-px w-full", className)} aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-border to-transparent" />
      <svg
        viewBox="0 0 24 24"
        className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 text-gold"
        fill="none"
      >
        <path
          d="M12 2 L14 12 L12 22 L10 12 Z"
          fill="currentColor"
          opacity="0.9"
        />
      </svg>
      <div className="absolute left-1/2 top-1/2 h-px w-16 -translate-x-1/2 -translate-y-1/2 bg-gold/60" />
    </div>
  );
}
