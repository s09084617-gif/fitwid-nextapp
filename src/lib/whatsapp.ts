export type WhatsAppTemplateType =
  | "appointment_reminder"
  | "workout_notification"
  | "progress_checkin"
  | "coach_message";

export function buildWhatsAppTemplate(
  type: WhatsAppTemplateType,
  vars: { name?: string; date?: string; time?: string; custom?: string }
): string {
  const name = vars.name ?? "there";
  switch (type) {
    case "appointment_reminder":
      return `Hi ${name}! Reminder: your session is scheduled for ${vars.date ?? "soon"}${vars.time ? ` at ${vars.time}` : ""}. See you then! — FitWid`;
    case "workout_notification":
      return `Hi ${name}! Your workout for today is ready in the FitWid app — check the Workouts tab when you're set. 💪`;
    case "progress_checkin":
      return `Hi ${name}, checking in — how's this week going? Log your weight/workouts in the app when you get a chance, or just reply here and let me know how you're feeling.`;
    case "coach_message":
      return vars.custom ?? `Hi ${name}, `;
  }
}

/** Normalizes a phone number to the digits-only format wa.me expects.
 * Assumes Indian numbers if no country code is present. */
export function toWaMeLink(phone: string, message: string): string {
  let digits = phone.replace(/[^\d]/g, "");
  if (digits.length === 10) digits = `91${digits}`; // assume India if no country code
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
