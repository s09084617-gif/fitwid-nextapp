"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function MotivationCard() {
  const [message, setMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    fetch("/api/ai-coach/motivation")
      .then((r) => r.json())
      .then((data) => {
        setMessage(data.message ?? null);
        setMounted(true);
      })
      .catch(() => setMounted(true));
  }, []);

  if (!mounted) {
    return <div className="h-20 rounded-lg bg-surface-2 animate-pulse" />;
  }

  if (!message) return null;

  return (
    <Card glass>
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-crimson/15 border border-crimson/30 flex items-center justify-center shrink-0">
          <Sparkles size={18} className="text-crimson" />
        </div>
        <div>
          <Badge variant="crimson" className="mb-2">
            For You Today
          </Badge>
          <p className="text-sm text-foreground/90">{message}</p>
        </div>
      </div>
    </Card>
  );
}
