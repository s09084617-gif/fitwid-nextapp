/**
 * Minimal Resend wrapper. Returns null on success, or an error message.
 * Does nothing (and tells the caller so) if RESEND_API_KEY isn't set —
 * this repo has no email provider configured yet.
 */
export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
}): Promise<string | null> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress = process.env.EMAIL_FROM_ADDRESS ?? "FitWid <onboarding@resend.dev>";

  if (!apiKey) {
    return "Email not sent — RESEND_API_KEY isn't configured yet.";
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: input.to,
        subject: input.subject,
        html: input.html,
      }),
    });
    if (!response.ok) {
      const text = await response.text();
      return `Resend API error: ${text}`;
    }
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : "Unknown email error";
  }
}
