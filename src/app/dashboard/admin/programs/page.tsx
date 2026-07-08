"use client";

import { useEffect, useState, useTransition } from "react";
import { Trash2, Plus, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getPrograms, type ProgramCard } from "@/lib/db/shared-data";
import {
  upsertProgram,
  deleteProgram,
  resetProgramsToDefaults,
} from "./actions";

const VARIANTS: ProgramCard["variant"][] = ["crimson", "gold", "success"];

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<ProgramCard[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPrograms().then((p) => {
      setPrograms(p);
      setMounted(true);
    });
  }, []);

  function refresh() {
    getPrograms().then(setPrograms);
  }

  function updateField(id: string, field: keyof ProgramCard, value: string) {
    const updated = programs.map((p) =>
      p.id === id ? { ...p, [field]: value } : p
    );
    setPrograms(updated);
  }

  function handleSave(program: ProgramCard, index: number) {
    setError(null);
    startTransition(async () => {
      try {
        await upsertProgram(program, index + 1);
        refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to save");
      }
    });
  }

  function handleAdd() {
    const newProgram: ProgramCard = {
      id: `program_${Date.now()}`,
      title: "New Program",
      desc: "Describe what this program includes.",
      badge: "Program",
      variant: "crimson",
    };
    setError(null);
    startTransition(async () => {
      try {
        await upsertProgram(newProgram, programs.length + 1);
        refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to add");
      }
    });
  }

  function handleDelete(id: string) {
    setError(null);
    startTransition(async () => {
      try {
        await deleteProgram(id);
        refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to delete");
      }
    });
  }

  function handleReset() {
    setError(null);
    startTransition(async () => {
      try {
        await resetProgramsToDefaults();
        refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to reset");
      }
    });
  }

  if (!mounted) {
    return <div className="h-48 rounded-lg bg-surface-2 animate-pulse" />;
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <Badge variant="crimson">Homepage Programs</Badge>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset} disabled={isPending}>
            <RotateCcw size={14} /> Reset to Defaults
          </Button>
          <Button size="sm" onClick={handleAdd} disabled={isPending}>
            <Plus size={14} /> Add Program
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted mb-2">
        Edits here update the &ldquo;Coaching Programs&rdquo; section on the
        homepage for every visitor — saved to the shared database, not just
        this browser.
      </p>
      {error && <p className="text-sm text-danger mb-4">{error}</p>}

      <div className="space-y-4">
        {programs.map((p, i) => (
          <div key={p.id} className="rounded-md border border-border p-4">
            <div className="grid sm:grid-cols-2 gap-3 mb-3">
              <Input
                label="Title"
                value={p.title}
                onChange={(e) => updateField(p.id, "title", e.target.value)}
              />
              <Input
                label="Badge Text"
                value={p.badge}
                onChange={(e) => updateField(p.id, "badge", e.target.value)}
              />
            </div>
            <div className="mb-3">
              <Input
                label="Description"
                value={p.desc}
                onChange={(e) => updateField(p.id, "desc", e.target.value)}
              />
            </div>
            <div className="flex items-end justify-between gap-3">
              <div className="w-40">
                <Select
                  label="Badge Color"
                  value={p.variant}
                  onChange={(e) =>
                    updateField(p.id, "variant", e.target.value)
                  }
                >
                  {VARIANTS.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSave(p, i)}
                  disabled={isPending}
                >
                  Save
                </Button>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id)}
                  className="text-muted hover:text-danger transition p-2"
                  aria-label="Delete program"
                  disabled={isPending}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
