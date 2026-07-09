"use client";

import { useEffect, useState, useTransition } from "react";
import { Trash2, CheckCircle2, StickyNote, AlertTriangle, ClipboardList, CalendarClock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  getCoachNotes,
  addCoachNote,
  resolveCoachNote,
  deleteCoachNote,
  type CoachNote,
} from "@/app/dashboard/admin/clients/coach-notes-actions";

const TYPE_META: Record<CoachNote["noteType"], { label: string; icon: typeof StickyNote; variant: "neutral" | "success" | "danger" | "warning" }> = {
  private: { label: "Private Note", icon: StickyNote, variant: "neutral" },
  session_summary: { label: "Session Summary", icon: ClipboardList, variant: "success" },
  injury: { label: "Injury History", icon: AlertTriangle, variant: "danger" },
  followup: { label: "Follow-Up", icon: CalendarClock, variant: "warning" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function CoachNotesPanel({ clientUserId }: { clientUserId: string }) {
  const [notes, setNotes] = useState<CoachNote[]>([]);
  const [noteType, setNoteType] = useState<CoachNote["noteType"]>("private");
  const [content, setContent] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    getCoachNotes(clientUserId).then((n) => {
      setNotes(n);
      setMounted(true);
    });
  }, [clientUserId]);

  function refresh() {
    getCoachNotes(clientUserId).then(setNotes);
  }

  function handleAdd() {
    if (!content.trim()) return;
    startTransition(async () => {
      await addCoachNote(clientUserId, {
        noteType,
        content: content.trim(),
        followUpDate: noteType === "followup" && followUpDate ? followUpDate : undefined,
      });
      setContent("");
      setFollowUpDate("");
      refresh();
    });
  }

  function handleResolve(id: string) {
    startTransition(async () => {
      await resolveCoachNote(id);
      refresh();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteCoachNote(id);
      refresh();
    });
  }

  if (!mounted) {
    return <div className="h-48 rounded-lg bg-surface-2 animate-pulse" />;
  }

  return (
    <Card>
      <Badge variant="danger" className="mb-2">
        Private Coach Notes
      </Badge>
      <p className="text-[11px] text-muted mb-4">
        These are never visible to the client — separate from the
        client-facing &ldquo;Coach Notes&rdquo; field above.
      </p>

      <div className="grid sm:grid-cols-[160px_1fr] gap-3 mb-3">
        <Select label="Type" value={noteType} onChange={(e) => setNoteType(e.target.value as CoachNote["noteType"])}>
          <option value="private">Private Note</option>
          <option value="session_summary">Session Summary</option>
          <option value="injury">Injury History</option>
          <option value="followup">Follow-Up</option>
        </Select>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={2}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson/50"
          />
        </div>
      </div>
      {noteType === "followup" && (
        <input
          type="date"
          value={followUpDate}
          onChange={(e) => setFollowUpDate(e.target.value)}
          className="mb-3 rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
        />
      )}
      <Button size="sm" onClick={handleAdd} disabled={isPending}>
        Add Note
      </Button>

      <div className="mt-5 space-y-2 max-h-72 overflow-y-auto">
        {notes.map((n) => {
          const meta = TYPE_META[n.noteType];
          return (
            <div key={n.id} className="rounded-md border border-border p-3">
              <div className="flex items-center justify-between mb-1.5">
                <Badge variant={meta.variant}>
                  <meta.icon size={10} className="mr-1" /> {meta.label}
                </Badge>
                <div className="flex items-center gap-2">
                  {n.noteType === "followup" && !n.resolved && (
                    <button onClick={() => handleResolve(n.id)} className="text-muted hover:text-success">
                      <CheckCircle2 size={14} />
                    </button>
                  )}
                  <button onClick={() => handleDelete(n.id)} className="text-muted hover:text-danger">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-foreground/90">{n.content}</p>
              <p className="text-[11px] text-muted mt-1">
                {formatDate(n.createdAt)}
                {n.followUpDate && ` · Follow up: ${formatDate(n.followUpDate)}`}
                {n.resolved && " · Resolved ✓"}
              </p>
            </div>
          );
        })}
        {notes.length === 0 && <p className="text-sm text-muted">No notes yet for this client.</p>}
      </div>
    </Card>
  );
}
