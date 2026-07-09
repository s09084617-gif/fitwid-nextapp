"use client";

import { useEffect, useState } from "react";
import { Dumbbell, Moon, Phone, Trash2, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import {
  getCalendarEvents,
  addCalendarEvent,
  deleteCalendarEvent,
  getWorkoutHistory,
  todayISO,
  type CalendarEvent,
  type WorkoutHistoryEntry,
} from "@/lib/db/user-data";
import { cn } from "@/lib/utils";

function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function WorkoutCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [pastWorkouts, setPastWorkouts] = useState<WorkoutHistoryEntry[]>([]);
  const [mounted, setMounted] = useState(false);
  const [restDate, setRestDate] = useState(todayISO());
  const [ptDate, setPtDate] = useState(todayISO());
  const [ptTime, setPtTime] = useState("18:00");
  const [ptNotes, setPtNotes] = useState("");

  const rangeStart = todayISO();
  const rangeEnd = addDays(todayISO(), 13);

  useEffect(() => {
    Promise.all([getCalendarEvents(rangeStart, rangeEnd), getWorkoutHistory()]).then(
      ([evts, history]) => {
        setEvents(evts);
        setPastWorkouts(history);
        setMounted(true);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAddRestDay() {
    const updated = await addCalendarEvent({ date: restDate, type: "rest", title: "Rest Day" });
    setEvents(updated.filter((e) => e.date >= rangeStart && e.date <= rangeEnd));
  }

  async function handleBookSession() {
    const updated = await addCalendarEvent({
      date: ptDate,
      type: "pt_session",
      title: `PT Session request — ${ptTime}`,
      notes: ptNotes,
      status: "pending",
    });
    setEvents(updated.filter((e) => e.date >= rangeStart && e.date <= rangeEnd));

    const message = encodeURIComponent(
      `Hi! I'd like to book a PT session on ${ptDate} at ${ptTime}.${ptNotes ? ` Note: ${ptNotes}` : ""}`
    );
    window.open(`https://wa.me/917015552731?text=${message}`, "_blank");
    setPtNotes("");
  }

  async function handleDelete(id: string) {
    const updated = await deleteCalendarEvent(id);
    setEvents(updated.filter((e) => e.date >= rangeStart && e.date <= rangeEnd));
  }

  if (!mounted) {
    return <div className="h-64 rounded-lg bg-surface-2 animate-pulse" />;
  }

  const days = Array.from({ length: 14 }, (_, i) => addDays(todayISO(), i));
  const workoutDates = new Set(pastWorkouts.map((w) => w.date));

  return (
    <div className="space-y-6">
      <Card>
        <Badge variant="crimson" className="mb-4">Next 14 Days</Badge>
        <div className="space-y-1.5">
          {days.map((date) => {
            const dayEvents = events.filter((e) => e.date === date);
            const hadWorkout = workoutDates.has(date);
            return (
              <div
                key={date}
                className="flex items-center gap-3 rounded-md border border-border px-3 py-2.5"
              >
                <span className="text-xs text-muted w-24 shrink-0">{formatDate(date)}</span>
                <div className="flex-1 flex flex-wrap gap-1.5">
                  {hadWorkout && (
                    <Badge variant="success">
                      <Dumbbell size={10} className="mr-1" /> Workout logged
                    </Badge>
                  )}
                  {dayEvents.map((e) => (
                    <span key={e.id} className="inline-flex items-center gap-1">
                      <Badge
                        variant={
                          e.type === "rest" ? "gold" : e.status === "pending" ? "warning" : "crimson"
                        }
                      >
                        {e.type === "rest" ? (
                          <Moon size={10} className="mr-1" />
                        ) : (
                          <Phone size={10} className="mr-1" />
                        )}
                        {e.type === "rest" ? "Rest Day" : e.title}
                      </Badge>
                      <button onClick={() => handleDelete(e.id)} aria-label="Remove">
                        <Trash2 size={12} className="text-muted hover:text-danger" />
                      </button>
                    </span>
                  ))}
                  {!hadWorkout && dayEvents.length === 0 && (
                    <span className="text-xs text-muted">—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <Badge variant="gold" className="mb-4">Mark a Rest Day</Badge>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            label="Date"
            type="date"
            value={restDate}
            onChange={(e) => setRestDate(e.target.value)}
          />
          <div className="flex items-end">
            <Button onClick={handleAddRestDay} className="w-full sm:w-auto">
              <Plus size={14} /> Add Rest Day
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <Badge variant="success" className="mb-2">Book a PT Session</Badge>
        <p className="text-xs text-muted mb-4">
          This sends a request to your coach on WhatsApp and saves it here
          as pending — it&apos;s a request, not an automatic confirmation.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <Input label="Date" type="date" value={ptDate} onChange={(e) => setPtDate(e.target.value)} />
          <Input label="Time" type="time" value={ptTime} onChange={(e) => setPtTime(e.target.value)} />
        </div>
        <Input
          label="Notes (optional)"
          placeholder="e.g. Want to focus on deadlift form"
          value={ptNotes}
          onChange={(e) => setPtNotes(e.target.value)}
          className="mb-4"
        />
        <button
          onClick={handleBookSession}
          className={cn(buttonVariants({ variant: "primary", size: "md" }), "w-full")}
        >
          Request Session via WhatsApp
        </button>
      </Card>
    </div>
  );
}
