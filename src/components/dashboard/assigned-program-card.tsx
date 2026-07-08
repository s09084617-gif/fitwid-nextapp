"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getMyAssignment, type ClientAssignment } from "@/lib/db/user-data";

export function AssignedProgramCard() {
  const [assignment, setAssignment] = useState<ClientAssignment | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    getMyAssignment().then((a) => {
      setAssignment(a);
      setMounted(true);
    });
  }, []);

  if (!mounted) {
    return <div className="h-full min-h-[110px] rounded-lg bg-surface-2 animate-pulse" />;
  }

  return (
    <Card>
      <Badge variant="gold" className="mb-3">
        Status
      </Badge>
      <CardTitle>
        {assignment?.assignedProgram ? "Active Client" : "Active Client"}
      </CardTitle>
      <CardDescription>
        {assignment?.assignedProgram
          ? `Program: ${assignment.assignedProgram}`
          : "No program assigned yet."}
      </CardDescription>
      {assignment?.coachNotes && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-[11px] text-gold uppercase tracking-wide mb-1">
            Note from your coach
          </p>
          <p className="text-sm text-foreground/90">{assignment.coachNotes}</p>
        </div>
      )}
    </Card>
  );
}
