import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";
import { Badge } from "@/components/ui/badge";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // The parent /dashboard layout already requires login; this adds an
  // email-allowlist check on top since there's no roles table yet.
  if (!isAdminEmail(user?.email)) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="gold" className="mb-2">
          Admin Only
        </Badge>
        <h1 className="font-display text-3xl">Admin Panel</h1>
      </div>
      <AdminNav />
      {children}
    </div>
  );
}
