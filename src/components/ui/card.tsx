import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  lift?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, glass, lift = true, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border border-border p-6 transition-all duration-300 hover:border-crimson/50",
        glass ? "glass" : "bg-surface",
        lift && "hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)]",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export const CardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold text-lg mb-2 text-foreground", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted", className)} {...props} />
));
CardDescription.displayName = "CardDescription";
