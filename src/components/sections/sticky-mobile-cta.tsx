import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function StickyMobileCta() {
  return (
    <div
      className="md:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-border px-4 py-3"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <a
        href="/assessment"
        className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full")}
      >
        Start Free Assessment
      </a>
    </div>
  );
}
