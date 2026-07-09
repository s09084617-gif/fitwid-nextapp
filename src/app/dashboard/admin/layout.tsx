import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail, getMyCoachRole } from "@/lib/admin";
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

  const isOwner = isAdminEmail(user?.email);
  const coachRole = isOwner ? "owner" : await getMyCoachRole(user?.id);

  // The parent /dashboard layout already requires login; this adds an
  // owner-allowlist OR coaches-table check on top.
  if (!isOwner && !coachRole) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="gold" className="mb-2">
          {isOwner ? "Admin Only" : "Coach Access"}
        </Badge>
        <h1 className="font-display text-3xl">Admin Panel</h1>
      </div>
      <AdminNav isOwner={isOwner} />
      {children}
    </div>
  );
}
