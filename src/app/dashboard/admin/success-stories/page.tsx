"use client";

import { useEffect, useState, useTransition } from "react";
import { Trash2, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getSuccessStories, type SuccessStory } from "@/lib/db/shared-data";
import { addSuccessStory, deleteSuccessStory } from "./actions";

export default function AdminSuccessStoriesPage() {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    clientName: "",
    goal: "fat_loss",
    durationWeeks: "",
    story: "",
    featured: false,
  });

  useEffect(() => {
    getSuccessStories().then((list) => {
      setStories(list);
      setMounted(true);
    });
  }, []);

  function refresh() {
    getSuccessStories().then(setStories);
  }

  function handleAdd() {
    if (!form.clientName.trim() || !form.story.trim()) return;
    setError(null);
    startTransition(async () => {
      try {
        await addSuccessStory({
          clientName: form.clientName.trim(),
          goal: form.goal,
          durationWeeks: form.durationWeeks ? Number(form.durationWeeks) : null,
          story: form.story.trim(),
          featured: form.featured,
        });
        refresh();
        setForm({ clientName: "", goal: "fat_loss", durationWeeks: "", story: "", featured: false });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to add");
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteSuccessStory(id);
      refresh();
    });
  }

  if (!mounted) {
    return <div className="h-48 rounded-lg bg-surface-2 animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <Badge variant="crimson" className="mb-4">Add Success Story</Badge>
        {error && <p className="text-sm text-danger mb-3">{error}</p>}
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <Input
            label="Client Name"
            value={form.clientName}
            onChange={(e) => setForm({ ...form, clientName: e.target.value })}
            placeholder="e.g. Ananya K."
          />
          <Input
            label="Duration (weeks)"
            type="number"
            value={form.durationWeeks}
            onChange={(e) => setForm({ ...form, durationWeeks: e.target.value })}
            placeholder="16"
          />
        </div>
        <Select
          label="Goal"
          value={form.goal}
          onChange={(e) => setForm({ ...form, goal: e.target.value })}
          className="mb-4"
        >
          <option value="fat_loss">Fat Loss</option>
          <option value="muscle_gain">Muscle Gain</option>
          <option value="maintain">Maintain</option>
          <option value="athletic_performance">Athletic Performance</option>
        </Select>
        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-sm font-medium text-foreground">Story</label>
          <textarea
            value={form.story}
            onChange={(e) => setForm({ ...form, story: e.target.value })}
            rows={4}
            placeholder="Write the client's story..."
            className="w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson/50"
          />
        </div>
        <Button onClick={handleAdd} disabled={isPending}>
          <Plus size={14} /> Add Story
        </Button>
      </Card>

      <Card>
        <Badge variant="gold" className="mb-4">Existing Stories ({stories.length})</Badge>
        <div className="space-y-2">
          {stories.map((s) => (
            <div key={s.id} className="flex items-start justify-between rounded-md border border-border p-3">
              <div>
                <p className="text-sm font-medium">{s.clientName}</p>
                <p className="text-xs text-muted line-clamp-2">{s.story}</p>
              </div>
              <button onClick={() => handleDelete(s.id)} className="text-muted hover:text-danger p-1 shrink-0" aria-label="Delete story">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {stories.length === 0 && <p className="text-sm text-muted">No stories yet.</p>}
        </div>
      </Card>
    </div>
  );
}
