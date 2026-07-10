import Image from "next/image";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: { markPx: 28, text: "text-xl", gap: "gap-2" },
  md: { markPx: 36, text: "text-2xl sm:text-3xl", gap: "gap-2.5" },
  lg: { markPx: 44, text: "text-3xl sm:text-4xl", gap: "gap-3" },
} as const;

export function Logo({
  size = "md",
  className,
}: {
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const s = SIZES[size];
  return (
    <span className={cn("inline-flex items-center", s.gap, className)}>
      <Image
        src="/images/fitwid-logo.jpg"
        alt="FitWid"
        width={s.markPx}
        height={s.markPx}
        className="rounded-md shrink-0"
      />
      <span
        className={cn(
          "font-logo tracking-wide leading-none [text-shadow:0_0_18px_rgba(204,0,0,0.35)]",
          s.text
        )}
      >
        FIT<span className="text-crimson">WID</span>
      </span>
    </span>
  );
}
