"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import { Card, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllClientInsights, type ClientInsights } from "./actions";
import type { Insight } from "@/lib/insights";

const SEVERITY_ICON: Record<Insight["severity"], typeof Info> = {
  info: Info,
  warning: AlertTriangle,
  attention: AlertCircle,
};

export default function AdminInsightsPage() {
  const [clients, setClients] = useState<ClientInsights[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    getAllClientInsights()
      .then((c) => {
        setClients(c);
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
    <div className="space-y-6">
      <Card>
        <Badge variant="gold" className="mb-2">Clients Needing Attention</Badge>
        <CardDescription>
          Automatically detected across all clients: missed workouts,
          plateaus, rapid weight changes, adherence drops, and recovery
          flags. Sorted by urgency.
        </CardDescription>
      </Card>

      {clients.length === 0 ? (
        <Card>
          <CardDescription>No flags across any client right now.</CardDescription>
        </Card>
      ) : (
        clients.map((c) => (
          <Card key={c.email}>
            <p className="text-sm font-semibold mb-3">{c.email}</p>
            <div className="space-y-2">
              {c.insights.map((insight) => {
                const Icon = SEVERITY_ICON[insight.severity];
                return (
                  <div key={insight.id} className="flex items-start gap-2.5 text-sm">
                    <Icon
                      size={14}
                      className={
                        insight.severity === "attention"
                          ? "text-danger shrink-0 mt-0.5"
                          : insight.severity === "warning"
                          ? "text-warning shrink-0 mt-0.5"
                          : "text-muted shrink-0 mt-0.5"
                      }
                    />
                    <div>
                      <p className="font-medium">{insight.title}</p>
                      <p className="text-xs text-muted">{insight.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
