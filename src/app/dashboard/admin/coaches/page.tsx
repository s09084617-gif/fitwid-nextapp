"use client";

import { useEffect, useState, useTransition } from "react";
import { Trash2, UserPlus } from "lucide-react";
import { Card, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { listCoaches, addCoachByEmail, removeCoach, type CoachInfo } from "./actions";

export default function AdminCoachesPage() {
  const [coaches, setCoaches] = useState<CoachInfo[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"coach" | "assistant">("coach");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    listCoaches()
      .then((c) => {
        setCoaches(c);
        setMounted(true);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Failed to load");
        setMounted(true);
      });
  }, []);

  function refresh() {
    listCoaches().then(setCoaches);
  }

  function handleAdd() {
    if (!email.trim()) return;
    setError(null);
    startTransition(async () => {
      try {
        await addCoachByEmail(email.trim(), role);
        setEmail("");
        refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to add coach");
      }
    });
  }

  function handleRemove(userId: string) {
    startTransition(async () => {
      await removeCoach(userId);
      refresh();
    });
  }

  if (!mounted) return <div className="h-48 rounded-lg bg-surface-2 animate-pulse" />;

  return (
    <div className="space-y-6">
      <Card>
        <Badge variant="warning" className="mb-3">Owner-Only</Badge>
        <CardDescription>
          Add coaches by email (they must have already signed up). Coaches
          you add here get scoped access — this is additive on top of your
          existing owner access, not a full permissions rewrite of every
          admin tab.
        </CardDescription>
      </Card>

      <Card>
        <Badge variant="crimson" className="mb-4">Add a Coach</Badge>
        {error && <p className="text-sm text-danger mb-3">{error}</p>}
        <div className="grid sm:grid-cols-[1fr_140px_auto] gap-3">
          <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="coach@example.com" />
          <Select label="Role" value={role} onChange={(e) => setRole(e.target.value as "coach" | "assistant")}>
            <option value="coach">Coach</option>
            <option value="assistant">Assistant</option>
          </Select>
          <div className="flex items-end">
            <Button onClick={handleAdd} disabled={isPending} className="w-full">
              <UserPlus size={14} /> Add
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <Badge variant="gold" className="mb-4">Coaches ({coaches.length})</Badge>
        {coaches.length === 0 ? (
          <p className="text-sm text-muted">No additional coaches added yet — you&apos;re the only admin.</p>
        ) : (
          <div className="space-y-2">
            {coaches.map((c) => (
              <div key={c.userId} className="flex items-center justify-between rounded-md border border-border px-3 py-2.5 text-sm">
                <div>
                  <p className="font-medium">{c.email}</p>
                  <p className="text-xs text-muted">{c.role} · {c.clientCount} assigned clients</p>
                </div>
                <button onClick={() => handleRemove(c.userId)} className="text-muted hover:text-danger p-1" aria-label="Remove coach">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
