"use client";

import { useEffect } from "react";
import { recordLoginSession } from "@/lib/db/user-data";

/** Records one login_sessions row per browser tab session (not every
 * page navigation) — a lightweight device-activity log, not a full
 * auth audit trail. */
export function SessionRecorder() {
  useEffect(() => {
    const key = "fitwid:session-recorded";
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    recordLoginSession();
  }, []);
  return null;
}
