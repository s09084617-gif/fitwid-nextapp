"use client";

import { useEffect, useState } from "react";
import { Copy, Check, Gift } from "lucide-react";
import { Card, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getMyReferralCode, getMyReferrals, type ReferralSignup } from "@/lib/db/user-data";

export default function ReferralsPage() {
  const [code, setCode] = useState<string | null>(null);
  const [referrals, setReferrals] = useState<ReferralSignup[]>([]);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    Promise.all([getMyReferralCode(), getMyReferrals()]).then(([c, r]) => {
      setCode(c);
      setReferrals(r);
      setMounted(true);
    });
  }, []);

  const link = code && typeof window !== "undefined"
    ? `${window.location.origin}/signup?ref=${code}`
    : "";

  function handleCopy() {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!mounted) {
    return <div className="h-48 rounded-lg bg-surface-2 animate-pulse" />;
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl mb-2">Referral Program</h1>
        <p className="text-sm text-muted">
          Share your link — when someone signs up through it, it&apos;s
          tracked here.
        </p>
      </div>

      <Card>
        <Badge variant="gold" className="mb-4">Your Referral Link</Badge>
        <div className="flex gap-2">
          <input
            readOnly
            value={link}
            className="flex-1 rounded-md border border-border bg-surface px-4 py-2.5 text-sm text-foreground"
          />
          <button
            onClick={handleCopy}
            className="rounded-md border border-border px-4 flex items-center gap-2 text-sm hover:border-crimson/50 transition"
          >
            {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Gift size={16} className="text-crimson" />
          <Badge variant="crimson">Rewards</Badge>
        </div>
        <CardDescription>
          Referral tracking is real — every signup through your link shows
          up below. Reward amounts (free sessions, discounts, etc.) are set
          by your coach, so ask FitWid directly about current referral
          rewards.
        </CardDescription>
      </Card>

      <Card>
        <Badge variant="success" className="mb-4">
          Your Referrals ({referrals.length})
        </Badge>
        {referrals.length === 0 ? (
          <p className="text-sm text-muted">
            No referrals yet — share your link above to get started.
          </p>
        ) : (
          <div className="space-y-2">
            {referrals.map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2.5 text-sm">
                <span>{r.referredEmail ?? "New signup"}</span>
                <Badge variant={r.status === "granted" ? "success" : r.status === "denied" ? "danger" : "neutral"}>
                  {r.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
