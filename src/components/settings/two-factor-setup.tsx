"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, ShieldOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function TwoFactorSetup() {
  const [enrolled, setEnrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.mfa.listFactors().then(({ data }) => {
      setEnrolled((data?.totp.length ?? 0) > 0);
      setMounted(true);
    });
  }, []);

  async function handleStartEnroll() {
    setError(null);
    const supabase = createClient();
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp" });
    if (error) {
      setError(error.message);
      return;
    }
    setQrCode(data.totp.qr_code);
    setFactorId(data.id);
  }

  async function handleVerify() {
    if (!factorId) return;
    setError(null);
    const supabase = createClient();
    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
    if (challengeError) {
      setError(challengeError.message);
      return;
    }
    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code,
    });
    if (verifyError) {
      setError(verifyError.message);
      return;
    }
    setSuccess(true);
    setEnrolled(true);
    setQrCode(null);
  }

  async function handleDisable() {
    const supabase = createClient();
    const { data } = await supabase.auth.mfa.listFactors();
    const factor = data?.totp[0];
    if (factor) {
      await supabase.auth.mfa.unenroll({ factorId: factor.id });
      setEnrolled(false);
    }
  }

  if (!mounted) return <div className="h-32 rounded-lg bg-surface-2 animate-pulse" />;

  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        {enrolled ? <ShieldCheck size={16} className="text-success" /> : <ShieldOff size={16} className="text-muted" />}
        <Badge variant={enrolled ? "success" : "neutral"}>
          Two-Factor Authentication {enrolled ? "Enabled" : "Disabled"}
        </Badge>
      </div>

      {enrolled ? (
        <div>
          <p className="text-sm text-muted mb-4">
            Your account requires a code from your authenticator app at login.
          </p>
          <Button variant="outline" size="sm" onClick={handleDisable}>
            Disable 2FA
          </Button>
        </div>
      ) : qrCode ? (
        <div className="space-y-4">
          <p className="text-sm text-muted">
            Scan this QR code with an authenticator app (Google Authenticator, Authy, etc.), then enter the 6-digit code.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element -- Supabase returns an inline SVG data URI, not a remote/optimizable image */}
          <img src={qrCode} alt="2FA setup QR code" className="w-40 h-40 bg-white rounded-md p-2" />
          <div className="flex gap-2">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              maxLength={6}
              className="w-32"
            />
            <Button onClick={handleVerify}>Verify & Enable</Button>
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
        </div>
      ) : (
        <div>
          <p className="text-sm text-muted mb-4">
            Add an extra layer of security — you&apos;ll need a code from
            your phone in addition to your password to log in.
          </p>
          {error && <p className="text-sm text-danger mb-3">{error}</p>}
          {success && <p className="text-sm text-success mb-3">2FA enabled ✓</p>}
          <Button onClick={handleStartEnroll}>Set Up 2FA</Button>
        </div>
      )}
    </Card>
  );
}
