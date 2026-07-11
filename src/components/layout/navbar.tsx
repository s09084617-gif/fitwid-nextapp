"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/assessment", label: "Assessment" },
  { href: "#features", label: "Features" },
  { href: "#programs", label: "Programs" },
  { href: "#transformations", label: "Transformations" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
        <a href="#" className="shrink-0">
          <Logo size="sm" />
        </a>

        <ul className="hidden lg:flex items-center gap-6 text-sm text-muted">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="hover:text-foreground transition">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />
          <a
            href="/login"
            className="text-sm text-muted hover:text-foreground transition px-2"
          >
            Log In
          </a>
          <a
            href="/signup"
            className={buttonVariants({ variant: "gold", size: "sm" })}
          >
            Sign Up
          </a>
          <a
            href="https://wa.me/917015552731"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "primary", size: "sm" })}
          >
            Book a Call
          </a>
        </div>

        <button
          type="button"
          className="lg:hidden p-2 text-foreground"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <div
        className={cn(
          "lg:hidden overflow-hidden border-t border-border transition-[max-height] duration-300",
          open ? "max-h-[32rem]" : "max-h-0"
        )}
      >
        <ul className="flex flex-col px-6 py-4 gap-4 text-sm text-muted">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="hover:text-foreground transition"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="flex items-center justify-between pt-2">
            <ThemeToggle />
            <a
              href="/login"
              className="text-sm text-muted hover:text-foreground transition"
              onClick={() => setOpen(false)}
            >
              Log In
            </a>
          </li>
          <li className="flex flex-col gap-3 pt-2">
            <a
              href="/signup"
              className={buttonVariants({ variant: "gold", size: "sm", className: "w-full" })}
              onClick={() => setOpen(false)}
            >
              Sign Up
            </a>
            <a
              href="https://wa.me/917015552731"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "primary", size: "sm", className: "w-full" })}
            >
              Book a Call
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
