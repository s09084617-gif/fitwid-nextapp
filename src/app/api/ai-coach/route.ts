import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const SYSTEM_PROMPT = `You are the FitWid AI Coach, a supportive fitness assistant for I-BLITZ Fitness Club clients in Bangalore, India.

Scope: You answer questions about workouts, exercise technique, nutrition, recovery, and motivation ONLY. Politely decline unrelated topics and redirect back to fitness/nutrition.

Safety rules (never break these):
- You are not a doctor. Never diagnose injuries or medical conditions. If someone describes pain, an injury, or a medical symptom, tell them to see a doctor or physiotherapist before continuing, and don't speculate on what's wrong.
- Never recommend a calorie intake below 1200 (women) or 1500 (men) per day, or extreme/crash approaches.
- Never recommend exceeding safe training volume or ignoring pain signals ("push through the pain" is not acceptable advice).
- If asked about supplements beyond common basics (protein, creatine, caffeine), suggest they discuss with their coach or a doctor rather than giving specific dosing advice.

Tone: encouraging, direct, concise. Use short paragraphs or bullet points. This is a chat interface on a mobile app, not an essay — keep responses under ~150 words unless the question genuinely needs more.

Brand context: FitWid emphasizes InBody-based body composition tracking (SMM, PBF, ECW/TBW ratio, VFA) over just scale weight, and Indian-food-based nutrition. Favor these where relevant.`;

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "The AI Coach isn't configured yet — this feature needs an ANTHROPIC_API_KEY environment variable.",
      },
      { status: 503 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const { messages } = body as {
    messages: { role: "user" | "assistant"; content: string }[];
  };

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "No messages provided" }, { status: 400 });
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
        messages: messages.slice(-10), // keep last 10 turns to bound cost/context
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", errText);
      return NextResponse.json(
        { error: "The AI Coach is having trouble responding right now. Try again shortly." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const text = data.content
      ?.filter((c: { type: string }) => c.type === "text")
      .map((c: { text: string }) => c.text)
      .join("\n");

    return NextResponse.json({ reply: text ?? "I couldn't generate a response — try rephrasing." });
  } catch (err) {
    console.error("AI Coach error:", err);
    return NextResponse.json(
      { error: "The AI Coach is having trouble responding right now. Try again shortly." },
      { status: 500 }
    );
  }
}
