"use client";

import { useEffect } from "react";
import { recordLoginSession } from "@/lib/db/user-data";
import { createClient } from "@/lib/supabase/client";
import { identifyUser } from "@/lib/analytics/events";

/** Records one login_sessions row per browser tab session (not every
 * page navigation) — a lightweight device-activity log, not a full
 * auth audit trail. Also identifies the user to PostHog (no-op if
 * analytics isn't configured), so retention/cohort views work. */
export function SessionRecorder() {
  useEffect(() => {
    const key = "fitwid:session-recorded";
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    recordLoginSession();

    createClient()
      .auth.getUser()
      .then(({ data }) => {
        if (data.user) identifyUser(data.user.id, data.user.email);
      });
  }, []);
  return null;
}
