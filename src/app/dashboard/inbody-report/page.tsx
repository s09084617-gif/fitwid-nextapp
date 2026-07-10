"use client";

import { useEffect, useState } from "react";
import { InBodyExplainer } from "@/components/inbody/inbody-explainer";
import { getMyInBodyReports, type InBodyReport } from "@/lib/db/user-data";
import { Card, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function InBodyReportPage() {
  const [history, setHistory] = useState<InBodyReport[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getMyInBodyReports().then((h) => {
      setHistory(h);
      setMounted(true);
      setShowForm(h.length === 0);
    });
  }, []);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl mb-2">InBody Report</h1>
        <p className="text-sm text-muted">
          Enter your scan results any time you get a new InBody reading at
          I-BLITZ, and get an instant explanation of what changed.
        </p>
      </div>

      {!mounted ? (
        <div className="h-48 rounded-lg bg-surface-2 animate-pulse" />
      ) : showForm ? (
        <InBodyExplainer onDone={() => { setShowForm(false); getMyInBodyReports().then(setHistory); }} />
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full rounded-md border border-crimson/40 bg-crimson/5 px-4 py-3 text-sm font-medium text-crimson hover:bg-crimson/10 transition"
        >
          + Log a New InBody Scan
        </button>
      )}

      {history.length > 0 && (
        <Card>
          <Badge variant="gold" className="mb-4">Past Reports ({history.length})</Badge>
          <div className="space-y-3">
            {history.map((r) => (
              <div key={r.id} className="rounded-md border border-border p-3">
                <p className="text-xs text-muted mb-1">{formatDate(r.reportDate)}</p>
                <div className="flex flex-wrap gap-3 text-xs text-foreground/80 mb-2">
                  {r.weightKg && <span>{r.weightKg}kg</span>}
                  {r.pbfPercent && <span>PBF {r.pbfPercent}%</span>}
                  {r.smmKg && <span>SMM {r.smmKg}kg</span>}
                  {r.vfaCm2 && <span>VFA {r.vfaCm2}cm²</span>}
                  {r.ecwTbwRatio && <span>ECW/TBW {r.ecwTbwRatio}</span>}
                </div>
                {r.aiExplanation && (
                  <CardDescription className="text-xs whitespace-pre-line">{r.aiExplanation}</CardDescription>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
