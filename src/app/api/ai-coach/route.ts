import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { callLLM } from "@/lib/llm";

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

  const result = await callLLM({
    system: SYSTEM_PROMPT,
    messages: messages.slice(-10), // keep last 10 turns to bound cost/context
    maxTokens: 500,
  });

  if (result === null) {
    return NextResponse.json(
      {
        error:
          "The AI Coach isn't configured yet — set ANTHROPIC_API_KEY or OPENROUTER_API_KEY (free tier) as an environment variable.",
      },
      { status: 503 }
    );
  }
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  return NextResponse.json({ reply: result.text });
}
