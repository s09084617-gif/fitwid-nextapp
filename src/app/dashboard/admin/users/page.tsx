import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function formatDate(iso: string | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminUsersPage() {
  const adminClient = createAdminClient();

  if (!adminClient) {
    return (
      <Card>
        <Badge variant="warning" className="mb-3">
          Not Configured
        </Badge>
        <CardTitle>Service role key missing</CardTitle>
        <CardDescription className="mt-2">
          Listing registered users requires the Supabase Admin API, which
          needs a <code>SUPABASE_SERVICE_ROLE_KEY</code> environment
          variable. Add it in Vercel → Project Settings → Environment
          Variables (find it in Supabase → Project Settings → API → service
          role key), then redeploy.
        </CardDescription>
        <p className="text-xs text-danger mt-3">
          This key is extremely sensitive — it bypasses all database
          security rules. Never expose it to the browser or commit it to
          Git.
        </p>
      </Card>
    );
  }

  const { data, error } = await adminClient.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });

  if (error) {
    return (
      <Card>
        <Badge variant="danger" className="mb-3">
          Error
        </Badge>
        <CardTitle>Couldn&apos;t load users</CardTitle>
        <CardDescription className="mt-2">{error.message}</CardDescription>
      </Card>
    );
  }

  const users = data.users.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <Badge variant="success">Registered Users</Badge>
        <span className="text-xs text-muted">{users.length} total</span>
      </div>
      {users.length === 0 ? (
        <p className="text-sm text-muted">No users have signed up yet.</p>
      ) : (
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="text-left text-xs text-muted border-b border-border">
                <th className="px-2 py-2 font-medium">Email</th>
                <th className="px-2 py-2 font-medium">Provider</th>
                <th className="px-2 py-2 font-medium">Joined</th>
                <th className="px-2 py-2 font-medium">Last Sign-In</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border/50">
                  <td className="px-2 py-2">{u.email ?? "—"}</td>
                  <td className="px-2 py-2 text-xs text-muted">
                    {u.app_metadata?.provider ?? "email"}
                  </td>
                  <td className="px-2 py-2 text-xs text-muted">
                    {formatDate(u.created_at)}
                  </td>
                  <td className="px-2 py-2 text-xs text-muted">
                    {formatDate(u.last_sign_in_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
