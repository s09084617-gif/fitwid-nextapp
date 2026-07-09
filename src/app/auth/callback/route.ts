import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/send";
import { welcomeEmail } from "@/lib/email/templates";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Best-effort welcome email for genuinely new signups (confirmed
      // within the last 10 minutes). Never blocks the redirect — if
      // RESEND_API_KEY isn't set, sendEmail() just reports that.
      if (user?.email && user.created_at) {
        const ageMs = Date.now() - new Date(user.created_at).getTime();
        if (ageMs < 10 * 60 * 1000) {
          const name = (user.user_metadata?.full_name as string | undefined) ?? "there";
          sendEmail({
            to: user.email,
            subject: "Welcome to FitWid",
            html: welcomeEmail(name),
          }).catch(() => {});
        }
      }

      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
  }

  return NextResponse.redirect(
    `${origin}/login?error=Could not authenticate. Please try again.`
  );
}
