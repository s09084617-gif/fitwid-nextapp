import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold tracking-wide transition disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson/50",
  {
    variants: {
      variant: {
        primary: "bg-crimson text-white hover:bg-crimson-hover",
        gold: "bg-gold text-black hover:bg-gold-hover",
        outline:
          "border border-gold/40 text-gold hover:bg-gold/10 bg-transparent",
        ghost: "text-foreground hover:bg-surface-2 bg-transparent",
        danger: "bg-danger text-white hover:brightness-110",
      },
      size: {
        sm: "px-4 py-2.5 text-sm",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
