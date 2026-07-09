"use client";

import { useState } from "react";
import { Download, DatabaseBackup } from "lucide-react";
import { Card, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { exportAllData } from "./actions";

export default function AdminBackupPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleExport() {
    setLoading(true);
    setError(null);
    try {
      const json = await exportAllData();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fitwid-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <DatabaseBackup size={16} className="text-crimson" />
          <Badge variant="crimson">Manual Backup</Badge>
        </div>
        <CardDescription className="mb-4">
          Downloads a full JSON export of every app table (programs,
          exercises, all client data across weight/workouts/assessments/etc,
          coaches, subscriptions). This is a manual safety net — it doesn&apos;t
          replace real automated backups.
        </CardDescription>
        {error && <p className="text-sm text-danger mb-3">{error}</p>}
        <Button onClick={handleExport} disabled={loading}>
          <Download size={14} /> {loading ? "Exporting…" : "Download Full Backup (JSON)"}
        </Button>
      </Card>

      <Card>
        <Badge variant="warning" className="mb-3">For Real Automated Backups</Badge>
        <CardDescription>
          Supabase&apos;s <strong>Pro plan</strong> includes daily automated
          backups and Point-in-Time Recovery (PITR), which is what you
          actually want for production data safety — this manual export is
          a supplement, not a replacement. Check Supabase → Project Settings
          → Add-ons → Backups.
        </CardDescription>
      </Card>
    </div>
  );
}
