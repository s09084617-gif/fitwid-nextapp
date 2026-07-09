import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/send";
import { welcomeEmail } from "@/lib/email/templates";

// Currently only supports "welcome" — extend as needed once an email
// provider is actually configured.
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { type } = await request.json();
  if (type !== "welcome") {
    return NextResponse.json({ error: "Unsupported email type" }, { status: 400 });
  }

  const name = (user.user_metadata?.full_name as string | undefined) ?? "there";
  const error = await sendEmail({
    to: user.email!,
    subject: "Welcome to FitWid",
    html: welcomeEmail(name),
  });

  if (error) {
    // Not configured yet — don't fail the request, just report it.
    return NextResponse.json({ sent: false, reason: error });
  }
  return NextResponse.json({ sent: true });
}
