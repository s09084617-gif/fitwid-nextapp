"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { submitMySuccessStory } from "@/lib/db/user-data";

export function SubmitStoryForm() {
  const [clientName, setClientName] = useState("");
  const [goal, setGoal] = useState("fat_loss");
  const [durationWeeks, setDurationWeeks] = useState("");
  const [story, setStory] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    if (!clientName.trim() || !story.trim()) {
      setError("Please fill in your name and story.");
      return;
    }
    setError(null);
    const err = await submitMySuccessStory({
      clientName: clientName.trim(),
      goal,
      durationWeeks: durationWeeks ? Number(durationWeeks) : undefined,
      story: story.trim(),
    });
    if (err) {
      setError(err);
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Card className="border-success/40 bg-success/5">
        <Badge variant="success" className="mb-2">Submitted</Badge>
        <p className="text-sm text-foreground/90">
          Thanks for sharing! Your story is pending review — it&apos;ll
          appear here once your coach approves it.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <Badge variant="crimson" className="mb-4">Share Your Story</Badge>
      {error && <p className="text-sm text-danger mb-3">{error}</p>}
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <Input label="Your Name" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="e.g. Priya S." />
        <Input label="Duration (weeks, optional)" type="number" value={durationWeeks} onChange={(e) => setDurationWeeks(e.target.value)} placeholder="16" />
      </div>
      <Select label="Primary Goal" value={goal} onChange={(e) => setGoal(e.target.value)} className="mb-4">
        <option value="fat_loss">Fat Loss</option>
        <option value="muscle_gain">Muscle Gain</option>
        <option value="maintain">Maintain</option>
        <option value="athletic_performance">Athletic Performance</option>
      </Select>
      <div className="flex flex-col gap-1.5 mb-4">
        <label className="text-sm font-medium text-foreground">Your Story</label>
        <textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          rows={4}
          placeholder="What changed for you? Be as specific as you'd like."
          className="w-full rounded-md border border-border bg-surface px-4 py-2.5 text-base sm:text-sm text-foreground placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson/50"
        />
      </div>
      <p className="text-[11px] text-muted mb-4">
        Your coach reviews every submission before it&apos;s shown publicly
        — nothing posts automatically.
      </p>
      <Button onClick={handleSubmit}>
        <Send size={14} /> Submit Story
      </Button>
    </Card>
  );
}
