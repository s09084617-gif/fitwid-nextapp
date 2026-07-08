import { CreditCard } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminPaymentsPage() {
  return (
    <Card>
      <div className="flex items-center gap-4 mb-4">
        <div className="h-12 w-12 rounded-md bg-warning/15 border border-warning/30 flex items-center justify-center shrink-0">
          <CreditCard size={20} className="text-warning" />
        </div>
        <div>
          <Badge variant="warning" className="mb-1">
            Not Connected
          </Badge>
          <CardTitle>Payments aren&apos;t set up yet</CardTitle>
        </div>
      </div>

      <CardDescription className="mb-4">
        The original plan calls for Razorpay integration (per the FitWid
        PRD), but no payment gateway is connected — there&apos;s no way to
        collect payments, view transactions, or manage subscriptions through
        the site yet.
      </CardDescription>

      <div className="rounded-md border border-border p-4 space-y-2">
        <p className="text-sm font-medium">To enable payments, you&apos;d need:</p>
        <ul className="text-sm text-muted space-y-1.5 list-disc list-inside">
          <li>A Razorpay account with live/test API keys</li>
          <li>
            <code>RAZORPAY_KEY_ID</code> and{" "}
            <code>RAZORPAY_KEY_SECRET</code> added to Vercel environment
            variables
          </li>
          <li>A checkout flow wired to the Pricing section</li>
          <li>A webhook endpoint to record successful payments</li>
          <li>A database table to store transaction/subscription records</li>
        </ul>
      </div>

      <p className="text-xs text-muted mt-4">
        Until this is built, coaching sign-ups are handled manually via
        WhatsApp (the &ldquo;Book a Call&rdquo; and pricing CTAs).
      </p>
    </Card>
  );
}
