"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, ExternalLink } from "lucide-react";
import { isInAppBrowser } from "@/lib/in-app-browser";

export function InAppBrowserWarning() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isInAppBrowser(navigator.userAgent)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- navigator.userAgent is unavailable during SSR; this must run post-hydration
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="mb-4 rounded-md border border-warning/40 bg-warning/5 px-4 py-3 flex items-start gap-2.5">
      <AlertTriangle size={16} className="text-warning shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-medium">Google Sign-In won&apos;t work here</p>
        <p className="text-xs text-muted mt-0.5">
          You&apos;re in Instagram/Facebook&apos;s built-in browser, which
          blocks Google sign-in. Use email/password below, or tap the{" "}
          <ExternalLink size={11} className="inline" /> menu and choose
          &ldquo;Open in Browser&rdquo; first.
        </p>
      </div>
    </div>
  );
}
