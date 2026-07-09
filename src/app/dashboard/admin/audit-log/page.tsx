"use client";

import { useEffect, useState } from "react";
import { Card, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAuditLog, type AuditEntry } from "./actions";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

export default function AuditLogPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    getAuditLog()
      .then((e) => {
        setEntries(e);
        setMounted(true);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Failed to load");
        setMounted(true);
      });
  }, []);

  if (!mounted) return <div className="h-48 rounded-lg bg-surface-2 animate-pulse" />;

  if (error) {
    return (
      <Card>
        <Badge variant="warning" className="mb-3">Not Configured</Badge>
        <CardDescription>{error}</CardDescription>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <Badge variant="danger">Audit Log</Badge>
        <span className="text-xs text-muted">Last {entries.length} actions</span>
      </div>
      <p className="text-xs text-muted mb-4">
        Logs sensitive admin actions: client plan/note changes, coach
        management, subscription status changes. Not every action in the
        panel is logged yet — this covers the highest-risk ones.
      </p>
      {entries.length === 0 ? (
        <p className="text-sm text-muted">No actions logged yet.</p>
      ) : (
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {entries.map((e) => (
            <div key={e.id} className="rounded-md border border-border px-3 py-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">{e.action}</span>
                <span className="text-xs text-muted">{formatDate(e.createdAt)}</span>
              </div>
              <p className="text-xs text-muted">
                by {e.actorEmail}
                {e.targetType && ` · ${e.targetType}${e.targetId ? ` (${e.targetId.slice(0, 8)}...)` : ""}`}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
