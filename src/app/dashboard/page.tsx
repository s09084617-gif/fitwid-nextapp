import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Belt-and-suspenders: middleware already protects this route,
  // but a direct server-side check keeps the page safe on its own.
  if (!user) {
    redirect("/login?redirectTo=/dashboard");
  }

  const name =
    (user.user_metadata?.full_name as string | undefined) ??
    user.email?.split("@")[0] ??
    "Coach";

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-gold tracking-[0.2em] text-xs font-semibold uppercase mb-1">
              FitWid Dashboard
            </p>
            <h1 className="font-display text-3xl">Welcome, {name}</h1>
          </div>
          <SignOutButton />
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mb-10">
          <Card>
            <Badge variant="crimson" className="mb-3">
              Account
            </Badge>
            <CardTitle>{user.email}</CardTitle>
            <CardDescription>
              Signed in via{" "}
              {user.app_metadata?.provider === "google" ? "Google" : "Email"}
            </CardDescription>
          </Card>
          <Card>
            <Badge variant="gold" className="mb-3">
              Status
            </Badge>
            <CardTitle>Active Client</CardTitle>
            <CardDescription>No program assigned yet.</CardDescription>
          </Card>
          <Card>
            <Badge variant="success" className="mb-3">
              Next Step
            </Badge>
            <CardTitle>Book InBody Scan</CardTitle>
            <CardDescription>
              Get your baseline scan to start programming.
            </CardDescription>
          </Card>
        </div>

        <Card className="mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <Badge variant="crimson" className="mb-2">
              Free Tool
            </Badge>
            <CardTitle>Haven&apos;t done your Body Assessment yet?</CardTitle>
            <CardDescription>
              Get your BMI, BMR, body fat estimate, and a personalized
              nutrition target in under a minute.
            </CardDescription>
          </div>
          <a
            href="/assessment"
            className={buttonVariants({ variant: "primary", size: "md" })}
          >
            Take Assessment
          </a>
        </Card>

        <p className="text-sm text-muted">
          This is a placeholder dashboard. Habit tracking, diet plans, and
          booking will be added in later phases.
        </p>
      </div>
    </main>
  );
}
