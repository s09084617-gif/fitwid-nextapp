"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GoalCardProps {
  icon: LucideIcon;
  label: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}

/** A single selectable goal card — reused across the Goals step. Built as
 * its own component so it's easy to reuse anywhere else a goal picker is
 * needed (e.g. a future re-assessment flow). */
export function GoalCard({ icon: Icon, label, description, selected, onSelect }: GoalCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative w-full text-left rounded-xl border p-5 transition-colors duration-200",
        selected
          ? "border-crimson bg-crimson/10"
          : "border-border bg-surface hover:border-crimson/40"
      )}
    >
      <div
        className={cn(
          "h-11 w-11 rounded-lg flex items-center justify-center mb-3 transition-colors",
          selected ? "bg-crimson text-white" : "bg-surface-2 text-muted"
        )}
      >
        <Icon size={20} />
      </div>
      <p className={cn("font-semibold mb-1", selected ? "text-crimson" : "text-foreground")}>
        {label}
      </p>
      <p className="text-xs text-muted leading-relaxed">{description}</p>
      {selected && (
        <motion.div
          layoutId="goal-selected-indicator"
          className="absolute top-4 right-4 h-2.5 w-2.5 rounded-full bg-crimson"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  );
}
