"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- standard next-themes hydration guard
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className={cn("h-9 w-16 rounded-full bg-surface-2", className)} />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative h-9 w-16 rounded-full border border-border bg-surface-2 transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson/50",
        className
      )}
    >
      <span
        className={cn(
          "absolute top-1 left-1 h-7 w-7 rounded-full bg-crimson transition-transform flex items-center justify-center text-[10px] text-white",
          isDark && "translate-x-7"
        )}
      >
        {isDark ? "🌙" : "☀️"}
      </span>
    </button>
  );
}
