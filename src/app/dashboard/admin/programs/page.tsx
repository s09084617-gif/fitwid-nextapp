"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  getPrograms,
  savePrograms,
  resetPrograms,
  type ProgramCard,
} from "@/lib/local-store";

const VARIANTS: ProgramCard["variant"][] = ["crimson", "gold", "success"];

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<ProgramCard[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage on mount
    setPrograms(getPrograms());
    setMounted(true);
  }, []);

  function updateField(id: string, field: keyof ProgramCard, value: string) {
    const updated = programs.map((p) =>
      p.id === id ? { ...p, [field]: value } : p
    );
    setPrograms(updated);
    savePrograms(updated);
  }

  function handleAdd() {
    const newProgram: ProgramCard = {
      id: `program_${Date.now()}`,
      title: "New Program",
      desc: "Describe what this program includes.",
      badge: "Program",
      variant: "crimson",
    };
    const updated = [...programs, newProgram];
    setPrograms(updated);
    savePrograms(updated);
  }

  function handleDelete(id: string) {
    const updated = programs.filter((p) => p.id !== id);
    setPrograms(updated);
    savePrograms(updated);
  }

  function handleReset() {
    setPrograms(resetPrograms());
  }

  if (!mounted) {
    return <div className="h-48 rounded-lg bg-surface-2 animate-pulse" />;
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <Badge variant="crimson">Homepage Programs</Badge>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw size={14} /> Reset to Defaults
          </Button>
          <Button size="sm" onClick={handleAdd}>
            <Plus size={14} /> Add Program
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted mb-6">
        Edits here update the &ldquo;Coaching Programs&rdquo; section on the
        homepage — but only in this browser, since there&apos;s no shared
        database yet. To make changes visible to all visitors, this would
        need a real backend.
      </p>

      <div className="space-y-4">
        {programs.map((p) => (
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
              <button
                type="button"
                onClick={() => handleDelete(p.id)}
                className="text-muted hover:text-danger transition p-2"
                aria-label="Delete program"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
