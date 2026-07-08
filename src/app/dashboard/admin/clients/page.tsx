"use client";

import { useEffect, useState, useTransition } from "react";
import { Search, User, Download, Save } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getPrograms, type ProgramCard } from "@/lib/db/shared-data";
import {
  listClients,
  getClientProgress,
  getClientAssignment,
  upsertClientAssignment,
  getClientExportData,
  type ClientSummary,
  type ClientProgress,
} from "./actions";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [programs, setPrograms] = useState<ProgramCard[]>([]);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [progress, setProgress] = useState<ClientProgress | null>(null);
  const [assignedProgram, setAssignedProgram] = useState("");
  const [coachNotes, setCoachNotes] = useState("");
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    Promise.all([listClients(), getPrograms()])
      .then(([c, p]) => {
        setClients(c);
        setPrograms(p);
        setMounted(true);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Failed to load clients");
        setMounted(true);
      });
  }, []);

  function selectClient(id: string) {
    setSelectedId(id);
    setSaved(false);
    setError(null);
    startTransition(async () => {
      try {
        const [p, a] = await Promise.all([getClientProgress(id), getClientAssignment(id)]);
        setProgress(p);
        setAssignedProgram(a.assignedProgram);
        setCoachNotes(a.coachNotes);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load client details");
      }
    });
  }

  function handleSaveAssignment() {
    if (!selectedId) return;
    setError(null);
    startTransition(async () => {
      try {
        await upsertClientAssignment(selectedId, assignedProgram, coachNotes);
        setSaved(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to save");
      }
    });
  }

  async function handleExport() {
    if (!selectedId) return;
    const data = await getClientExportData(selectedId);
    const rows: string[][] = [
      ["Client Report:", data.email],
      [],
      ["Weight Log"],
      ["Date", "Weight (kg)"],
      ...data.weightLogs.map((w) => [w.date, String(w.weightKg)]),
      [],
      ["Workout History"],
      ["Date", "Title", "Duration (min)"],
      ...data.workoutHistory.map((w) => [String(w.log_date), String(w.title), String(w.duration_minutes ?? "")]),
      [],
      ["Personal Records"],
      ["Date", "Exercise", "Weight (kg)", "Reps"],
      ...data.personalRecords.map((p) => [
        String(p.log_date),
        String(p.exercise_name),
        String(p.weight_kg ?? ""),
        String(p.reps ?? ""),
      ]),
    ];
    downloadCsv(`${data.email}-report.csv`, rows);
  }

  const filtered = clients.filter((c) => c.email.toLowerCase().includes(query.toLowerCase()));
  const selected = clients.find((c) => c.id === selectedId);

  if (!mounted) {
    return <div className="h-48 rounded-lg bg-surface-2 animate-pulse" />;
  }

  if (error && clients.length === 0) {
    return (
      <Card>
        <Badge variant="warning" className="mb-3">Not Configured</Badge>
        <CardTitle>Couldn&apos;t load clients</CardTitle>
        <CardDescription className="mt-2">{error}</CardDescription>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-[280px_1fr] gap-6">
      {/* Client list */}
      <Card className="h-fit">
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients..."
            className="w-full rounded-md border border-border bg-surface pl-9 pr-4 py-2.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson/50"
          />
        </div>
        <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => selectClient(c.id)}
              className={`w-full text-left rounded-md px-3 py-2.5 text-sm transition ${
                selectedId === c.id
                  ? "bg-crimson/15 text-crimson border border-crimson/30"
                  : "text-muted hover:text-foreground border border-transparent"
              }`}
            >
              <p className="truncate font-medium">{c.email}</p>
              <p className="text-xs opacity-70">Joined {formatDate(c.joined)}</p>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-muted text-center py-6">No clients found.</p>
          )}
        </div>
      </Card>

      {/* Client detail */}
      <div className="space-y-6">
        {!selected ? (
          <Card>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <User size={32} className="text-muted mb-3" />
              <p className="text-sm text-muted">Select a client to view their details.</p>
            </div>
          </Card>
        ) : (
          <>
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Badge variant="crimson" className="mb-2">Client</Badge>
                  <CardTitle>{selected.email}</CardTitle>
                  <CardDescription>
                    Joined {formatDate(selected.joined)} · Last active {formatDate(selected.lastSignIn)}
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download size={14} /> Export CSV
                </Button>
              </div>

              {progress && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border">
                  <div>
                    <p className="font-display text-2xl text-gold">
                      {progress.latestWeightKg ?? "—"}
                    </p>
                    <p className="text-xs text-muted">Latest Weight (kg)</p>
                  </div>
                  <div>
                    <p className="font-display text-2xl">{progress.latestBodyFat ?? "—"}</p>
                    <p className="text-xs text-muted">Latest Body Fat %</p>
                  </div>
                  <div>
                    <p className="font-display text-2xl">{progress.latestFitnessScore ?? "—"}</p>
                    <p className="text-xs text-muted">Fitness Score</p>
                  </div>
                  <div>
                    <p className="font-display text-2xl">{progress.workoutsLoggedCount}</p>
                    <p className="text-xs text-muted">Workouts Logged</p>
                  </div>
                  <div>
                    <p className="font-display text-2xl">{progress.weightEntryCount}</p>
                    <p className="text-xs text-muted">Weight Entries</p>
                  </div>
                  <div>
                    <p className="font-display text-2xl">{progress.measurementsCount}</p>
                    <p className="text-xs text-muted">Measurements Logged</p>
                  </div>
                  <div>
                    <p className="font-display text-2xl">{progress.prCount}</p>
                    <p className="text-xs text-muted">Personal Records</p>
                  </div>
                  <div>
                    <p className="font-display text-2xl">{progress.savedWorkoutsCount}</p>
                    <p className="text-xs text-muted">Saved Workouts</p>
                  </div>
                </div>
              )}
            </Card>

            <Card>
              <Badge variant="gold" className="mb-4">Assign Plan & Notes</Badge>
              {error && <p className="text-sm text-danger mb-3">{error}</p>}
              <div className="space-y-4">
                <Select
                  label="Assigned Program"
                  value={assignedProgram}
                  onChange={(e) => setAssignedProgram(e.target.value)}
                >
                  <option value="">No program assigned</option>
                  {programs.map((p) => (
                    <option key={p.id} value={p.title}>
                      {p.title}
                    </option>
                  ))}
                </Select>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Coach Notes (visible to this client on their dashboard)
                  </label>
                  <textarea
                    value={coachNotes}
                    onChange={(e) => setCoachNotes(e.target.value)}
                    rows={4}
                    placeholder="e.g. Great progress this week — let's increase your squat volume next block."
                    className="w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson/50"
                  />
                </div>
                <Button onClick={handleSaveAssignment} disabled={isPending}>
                  <Save size={14} /> {saved ? "Saved ✓" : "Save & Send Update"}
                </Button>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
