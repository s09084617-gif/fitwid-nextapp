"use client";

import { useEffect, useState } from "react";
import { Phone, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getMyPhoneNumber, updateMyPhoneNumber } from "@/lib/db/user-data";

export default function SettingsPage() {
  const [phone, setPhone] = useState("");
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    getMyPhoneNumber().then((p) => {
      setPhone(p ?? "");
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
        <p className="text-sm text-muted">Your account preferences.</p>
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
    </div>
  );
}
