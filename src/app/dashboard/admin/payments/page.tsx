"use client";

import { useEffect, useState } from "react";
import { CreditCard, IndianRupee } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { listTransactions, type TransactionRow } from "./actions";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminPaymentsPage() {
  const [transactions, setTransactions] = useState<TransactionRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    listTransactions()
      .then((t) => {
        setTransactions(t);
        setMounted(true);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Failed to load");
        setMounted(true);
      });
  }, []);

  if (!mounted) return <div className="h-48 rounded-lg bg-surface-2 animate-pulse" />;

  if (error || transactions === null) {
    return (
      <Card>
        <div className="flex items-center gap-4 mb-4">
          <div className="h-12 w-12 rounded-md bg-warning/15 border border-warning/30 flex items-center justify-center shrink-0">
            <CreditCard size={20} className="text-warning" />
          </div>
          <div>
            <Badge variant="warning" className="mb-1">Not Configured</Badge>
            <CardTitle>{error}</CardTitle>
          </div>
        </div>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <div className="flex items-center gap-4 mb-4">
          <div className="h-12 w-12 rounded-md bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0">
            <CreditCard size={20} className="text-gold" />
          </div>
          <div>
            <Badge variant="gold" className="mb-1">Ready — No Payments Yet</Badge>
            <CardTitle>Razorpay is wired up, waiting on its first transaction</CardTitle>
          </div>
        </div>
        <CardDescription>
          If clients are seeing &ldquo;Request This Plan&rdquo; instead of
          &ldquo;Pay Now&rdquo; on their Billing page, set{" "}
          <code>RAZORPAY_KEY_ID</code> and <code>RAZORPAY_KEY_SECRET</code>{" "}
          in Vercel and redeploy.
        </CardDescription>
      </Card>
    );
  }

  const totalPaid = transactions.filter((t) => t.status === "paid").reduce((s, t) => s + t.amountInr, 0);

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center gap-2 mb-2">
          <IndianRupee size={16} className="text-gold" />
          <Badge variant="gold">Total Collected</Badge>
        </div>
        <p className="font-display text-3xl">₹{totalPaid.toLocaleString("en-IN")}</p>
      </Card>

      <Card>
        <Badge variant="crimson" className="mb-4">Transactions ({transactions.length})</Badge>
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {transactions.map((t) => (
            <div key={t.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2.5 text-sm">
              <div>
                <p className="font-medium">{t.email}</p>
                <p className="text-xs text-muted">{t.planName} · {formatDate(t.createdAt)}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">₹{t.amountInr.toLocaleString("en-IN")}</p>
                <Badge variant={t.status === "paid" ? "success" : t.status === "failed" ? "danger" : "neutral"}>
                  {t.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
