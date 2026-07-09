/** Detects known in-app browsers (Instagram, Facebook, TikTok, LinkedIn)
 * that block Google OAuth for security reasons. Google's sign-in flow
 * fails silently or shows "This browser may not be secure" inside these —
 * email/password login still works fine, so we don't block the whole app,
 * just warn before Google sign-in specifically. */
export function isInAppBrowser(userAgent: string): boolean {
  return /Instagram|FBAN|FBAV|FB_IAB|TikTok|Line\/|LinkedInApp/i.test(userAgent);
}
