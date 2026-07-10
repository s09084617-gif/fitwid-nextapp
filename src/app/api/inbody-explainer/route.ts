import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { classifyInBodyMetrics, type InBodyMetrics } from "@/lib/inbody";

const SYSTEM_PROMPT = `You are the FitWid AI InBody Report Explainer. You explain InBody body-composition scan results to clients in plain, encouraging language.

You will be given: the client's raw metrics, and a deterministic classification (status: low/normal/elevated/high) for each metric that has already been computed against standard reference ranges — you must use these classifications exactly as given, never invent your own ranges or override them.

Structure your explanation as:
1. One encouraging opening line.
2. A short explanation for each metric provided — what it measures, what their number/status means in practice, in plain non-clinical language.
3. One or two concrete, general next-step suggestions tied to what stood out (e.g. "since your visceral fat is elevated, your coach may want to prioritize cardio volume").

Safety rules (never break these):
- You are not a doctor. Never diagnose a medical condition. If a value is "high" or "elevated", frame it as "worth discussing with your coach" — never alarming, never a diagnosis.
- Never recommend a specific calorie target, specific diet, or specific training program — that's the coach's job. General direction only (e.g. "more resistance training" not "add 3 sets of squats").
- Keep it under 200 words total. Short paragraphs, mobile-friendly.
- If ECW/TBW is elevated/high, do not suggest water restriction or diuretics — mention rest/recovery and flag it for the coach.`;

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const { metrics, gender } = body as { metrics: InBodyMetrics; gender: "male" | "female" };

  const classifications = classifyInBodyMetrics(metrics, gender);

  if (classifications.length === 0) {
    return NextResponse.json({ error: "No metrics provided" }, { status: 400 });
  }

  if (!apiKey) {
    // Graceful fallback: return the deterministic classifications with a
    // simple templated summary instead of an AI narrative.
    const fallback = classifications
      .map((c) => `${c.label}: ${c.value}${c.unit} (${c.status}). ${c.note}`)
      .join("\n\n");
    return NextResponse.json({
      explanation: `${fallback}\n\n(AI-generated plain-language summary isn't available yet — this needs ANTHROPIC_API_KEY configured. Talk to your coach about what these numbers mean for your specific goals.)`,
      classifications,
    });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Gender: ${gender}\n\nMetrics and classifications:\n${classifications
              .map((c) => `- ${c.label}: ${c.value}${c.unit} — status: ${c.status}. ${c.note}`)
              .join("\n")}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error (inbody-explainer):", errText);
      return NextResponse.json({ error: "Couldn't generate an explanation right now. Try again shortly." }, { status: 502 });
    }

    const data = await response.json();
    const text = data.content
      ?.filter((c: { type: string }) => c.type === "text")
      .map((c: { text: string }) => c.text)
      .join("\n");

    return NextResponse.json({
      explanation: text ?? "Couldn't generate an explanation — try again.",
      classifications,
    });
  } catch (err) {
    console.error("InBody explainer error:", err);
    return NextResponse.json({ error: "Couldn't generate an explanation right now. Try again shortly." }, { status: 500 });
  }
}
