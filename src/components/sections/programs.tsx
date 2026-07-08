import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BadgeProps } from "@/components/ui/badge";

const programs: {
  title: string;
  desc: string;
  badge: string;
  variant: BadgeProps["variant"];
}[] = [
  {
    title: "Fat Loss + Muscle Retention",
    desc: "Structured deficit programming that protects lean mass while body fat drops.",
    badge: "Program",
    variant: "crimson",
  },
  {
    title: "Lean Muscle Building",
    desc: "Progressive overload blocks designed around your recovery and InBody trends.",
    badge: "Program",
    variant: "gold",
  },
  {
    title: "Online Coaching (FitWid)",
    desc: "Remote check-ins, habit tracking, and diet plans — coached from anywhere.",
    badge: "Online",
    variant: "success",
  },
];

export function Programs() {
  return (
    <section
      id="programs"
      className="border-t border-border bg-surface/40 px-6 py-24"
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-4xl sm:text-5xl text-center mb-4">
          Coaching Programs
        </h2>
        <p className="text-muted text-center max-w-xl mx-auto mb-14">
          Every plan starts with an InBody scan, then gets built around what
          your body actually needs.
        </p>
        <div className="grid sm:grid-cols-3 gap-6">
          {programs.map((p) => (
            <Card key={p.title}>
              <Badge variant={p.variant} className="mb-3">
                {p.badge}
              </Badge>
              <CardTitle>{p.title}</CardTitle>
              <CardDescription>{p.desc}</CardDescription>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
