"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

/**
 * Initializes PostHog once on mount. No-ops entirely if
 * NEXT_PUBLIC_POSTHOG_KEY isn't set — safe to ship without the key
 * configured. Autocapture (clicks, pageviews) is on by default, which is
 * what surfaces "where do users get confused / which features do they
 * ignore" — the events in analytics/events.ts add cleaner funnel points
 * on top of that raw data.
 */
export function PostHogProvider() {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key || posthog.__loaded) return;
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      capture_pageview: true,
      capture_pageleave: true,
      person_profiles: "identified_only",
    });
  }, []);

  return null;
}
