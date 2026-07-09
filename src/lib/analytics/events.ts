"use client";

import posthog from "posthog-js";

/** Safe no-op if PostHog isn't configured or hasn't loaded yet. */
export function trackEvent(name: string, properties?: Record<string, unknown>) {
  try {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
    posthog.capture(name, properties);
  } catch {
    // Analytics failures should never break the app.
  }
}

/** Links PostHog's anonymous session to the real user once known — needed
 * for retention/cohort analysis across sessions and devices. */
export function identifyUser(userId: string, email?: string) {
  try {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
    posthog.identify(userId, email ? { email } : undefined);
  } catch {
    // Analytics failures should never break the app.
  }
}
