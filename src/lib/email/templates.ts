function baseLayout(bodyHtml: string) {
  return `
  <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 32px 24px;">
    <p style="color: #c9a84c; letter-spacing: 3px; font-size: 11px; text-transform: uppercase; margin: 0 0 16px;">FitWid</p>
    ${bodyHtml}
    <p style="color: #6b6b6b; font-size: 11px; margin-top: 32px;">
      I-BLITZ Fitness Club · Bangalore · <a href="https://wa.me/917015552731" style="color: #cc0000;">WhatsApp us</a>
    </p>
  </div>`;
}

export function welcomeEmail(name: string) {
  return baseLayout(`
    <h1 style="font-size: 24px; margin: 0 0 12px;">Welcome to FitWid, ${name}!</h1>
    <p style="color: #ccc; line-height: 1.6;">
      Your account is ready. Start with the AI Body Assessment to get your
      first workout and nutrition plan — it takes about 3 minutes.
    </p>
  `);
}

export function weeklyReportEmail(stats: { workouts: number; weightChangeKg: number | null }) {
  return baseLayout(`
    <h1 style="font-size: 22px; margin: 0 0 12px;">Your Week in Review</h1>
    <p style="color: #ccc; line-height: 1.6;">
      Workouts logged: <strong>${stats.workouts}</strong><br/>
      Weight change: <strong>${stats.weightChangeKg === null ? "no data" : `${stats.weightChangeKg}kg`}</strong>
    </p>
  `);
}

export function renewalReminderEmail(planName: string, daysLeft: number) {
  return baseLayout(`
    <h1 style="font-size: 22px; margin: 0 0 12px;">Your ${planName} plan renews soon</h1>
    <p style="color: #ccc; line-height: 1.6;">
      Your plan renews in ${daysLeft} day${daysLeft === 1 ? "" : "s"}. Message us on WhatsApp with any questions.
    </p>
  `);
}

export function nutritionUpdateEmail(summary: string) {
  return baseLayout(`
    <h1 style="font-size: 22px; margin: 0 0 12px;">Nutrition Update</h1>
    <p style="color: #ccc; line-height: 1.6;">${summary}</p>
  `);
}
