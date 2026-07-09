"use client";

import { useEffect, useState } from "react";
import { Phone, Save, Monitor } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TwoFactorSetup } from "@/components/settings/two-factor-setup";
import { getMyPhoneNumber, updateMyPhoneNumber, getMyLoginSessions, type LoginSession } from "@/lib/db/user-data";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

function parseDevice(userAgent: string | null) {
  if (!userAgent) return "Unknown device";
  if (/iphone/i.test(userAgent)) return "iPhone";
  if (/android/i.test(userAgent)) return "Android device";
  if (/ipad/i.test(userAgent)) return "iPad";
  if (/mac/i.test(userAgent)) return "Mac";
  if (/windows/i.test(userAgent)) return "Windows PC";
  return "Unknown device";
}

export default function SettingsPage() {
  const [phone, setPhone] = useState("");
  const [saved, setSaved] = useState(false);
  const [sessions, setSessions] = useState<LoginSession[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    Promise.all([getMyPhoneNumber(), getMyLoginSessions()]).then(([p, s]) => {
      setPhone(p ?? "");
      setSessions(s);
      setMounted(true);
    });
  }, []);

  async function handleSave() {
    await updateMyPhoneNumber(phone);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!mounted) return <div className="h-32 rounded-lg bg-surface-2 animate-pulse" />;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl mb-2">Settings</h1>
        <p className="text-sm text-muted">Your account preferences and security.</p>
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Phone size={16} className="text-crimson" />
          <Badge variant="crimson">WhatsApp Number</Badge>
        </div>
        <p className="text-xs text-muted mb-4">
          Add your number so your coach can reach you on WhatsApp directly
          for reminders and check-ins.
        </p>
        <div className="flex gap-2">
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            className="flex-1"
          />
          <Button onClick={handleSave}>
            <Save size={14} /> {saved ? "Saved ✓" : "Save"}
          </Button>
        </div>
      </Card>

      <TwoFactorSetup />

      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Monitor size={16} className="text-muted" />
          <Badge variant="neutral">Recent Sign-Ins</Badge>
        </div>
        <p className="text-[11px] text-muted mb-4">
          One entry per browser session — not a complete security audit,
          just a quick way to spot anything unfamiliar.
        </p>
        {sessions.length === 0 ? (
          <p className="text-sm text-muted">No sessions recorded yet.</p>
        ) : (
          <div className="space-y-1.5 max-h-56 overflow-y-auto">
            {sessions.map((s) => (
              <div key={s.id} className="flex items-center justify-between text-sm rounded-md border border-border px-3 py-2">
                <span>{parseDevice(s.userAgent)}</span>
                <span className="text-xs text-muted">{formatDate(s.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
