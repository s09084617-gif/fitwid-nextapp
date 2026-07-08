import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme/theme-toggle";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-16">
      <h2 className="font-display text-3xl mb-6 text-foreground">{title}</h2>
      {children}
    </section>
  );
}

const swatches = [
  { name: "Crimson", varName: "--crimson", className: "bg-crimson" },
  { name: "Gold", varName: "--gold", className: "bg-gold" },
  { name: "Background", varName: "--background", className: "bg-background border border-border" },
  { name: "Surface", varName: "--surface", className: "bg-surface border border-border" },
  { name: "Surface 2", varName: "--surface-2", className: "bg-surface-2 border border-border" },
  { name: "Foreground", varName: "--foreground", className: "bg-foreground" },
  { name: "Muted", varName: "--muted", className: "bg-muted" },
  { name: "Success", varName: "--success", className: "bg-success" },
  { name: "Warning", varName: "--warning", className: "bg-warning" },
  { name: "Danger", varName: "--danger", className: "bg-danger" },
];

export default function DesignSystemPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16 w-full">
      <div className="flex items-center justify-between mb-12">
        <div>
          <p className="text-gold tracking-[0.3em] text-xs font-semibold uppercase mb-2">
            FitWid
          </p>
          <h1 className="font-display text-5xl">Design System</h1>
        </div>
        <ThemeToggle />
      </div>

      <Section title="Colors">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {swatches.map((s) => (
            <div key={s.name}>
              <div className={`h-16 w-full rounded-md mb-2 ${s.className}`} />
              <p className="text-sm font-medium">{s.name}</p>
              <p className="text-xs text-muted">{s.varName}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography">
        <div className="space-y-4">
          <div>
            <p className="font-display text-5xl">Bebas Neue Display</p>
            <p className="text-xs text-muted mt-1">
              font-display — headings, hero text, stat numbers
            </p>
          </div>
          <div>
            <p className="font-sans text-lg">
              Inter — body copy, UI labels, forms
            </p>
            <p className="text-xs text-muted mt-1">font-sans — default body font</p>
          </div>
        </div>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary">Primary</Button>
          <Button variant="gold">Gold</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
        <div className="flex flex-wrap gap-4 items-center mt-4">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
        </div>
      </Section>

      <Section title="Badges">
        <div className="flex flex-wrap gap-3">
          <Badge variant="crimson">Crimson</Badge>
          <Badge variant="gold">Gold</Badge>
          <Badge variant="success">Active</Badge>
          <Badge variant="warning">Pending</Badge>
          <Badge variant="danger">Overdue</Badge>
          <Badge variant="neutral">Neutral</Badge>
        </div>
      </Section>

      <Section title="Inputs">
        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl">
          <Input label="Full Name" placeholder="Sahil Bansal" />
          <Input label="Email" type="email" placeholder="you@fitwid.fit" />
          <Input label="Phone" placeholder="+91 70155 52731" />
          <Input
            label="Weight (kg)"
            type="number"
            error="This field is required"
          />
        </div>
      </Section>

      <Section title="Cards">
        <div className="grid sm:grid-cols-3 gap-6">
          <Card>
            <Badge variant="crimson" className="mb-3">
              Program
            </Badge>
            <CardTitle>Fat Loss + Muscle Retention</CardTitle>
            <CardDescription>
              Structured deficit programming that protects lean mass while
              body fat drops.
            </CardDescription>
          </Card>
          <Card>
            <Badge variant="gold" className="mb-3">
              Program
            </Badge>
            <CardTitle>Lean Muscle Building</CardTitle>
            <CardDescription>
              Progressive overload blocks designed around your recovery and
              InBody trends.
            </CardDescription>
          </Card>
          <Card>
            <Badge variant="success" className="mb-3">
              Online
            </Badge>
            <CardTitle>FitWid Coaching</CardTitle>
            <CardDescription>
              Remote check-ins, habit tracking, and diet plans — coached from
              anywhere.
            </CardDescription>
          </Card>
        </div>
      </Section>
    </main>
  );
}
