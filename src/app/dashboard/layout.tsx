import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail, getMyCoachRole } from "@/lib/admin";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Welcome } from "@/components/dashboard/welcome";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { SessionRecorder } from "@/components/settings/session-recorder";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Belt-and-suspenders: middleware already protects /dashboard/*,
  // but a direct server-side check keeps every page safe on its own.
  if (!user) {
    redirect("/login?redirectTo=/dashboard");
  }

  const name =
    (user.user_metadata?.full_name as string | undefined) ??
    user.email?.split("@")[0] ??
    "Coach";

  const isOwner = isAdminEmail(user.email);
  const coachRole = isOwner ? "owner" : await getMyCoachRole(user.id);

  return (
    <main className="min-h-screen px-6 py-10">
      <SessionRecorder />
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Welcome name={name} />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <SignOutButton />
          </div>
        </div>

        <DashboardNav isAdmin={!!coachRole} />

        {children}
      </div>
    </main>
  );
}
