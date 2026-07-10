/**
 * Provider-agnostic LLM call. Tries Anthropic first (higher quality,
 * pay-per-use) if ANTHROPIC_API_KEY is set; otherwise falls back to
 * OpenRouter's free-tier Llama model if OPENROUTER_API_KEY is set.
 * Returns null (not an error) if neither is configured, so callers can
 * show their own "not configured" message.
 */

export interface LLMMessage {
  role: "user" | "assistant";
  content: string;
}

export interface LLMResult {
  text: string;
  provider: "anthropic" | "openrouter";
}

/** OpenRouter's own auto-router — picks whichever free model is actually
 * available right now, instead of being stuck on one specific model
 * whose backend provider might be temporarily congested/rate-limited. */
const OPENROUTER_FREE_MODEL = "openrouter/free";

export async function callLLM(input: {
  system: string;
  messages: LLMMessage[];
  maxTokens?: number;
}): Promise<LLMResult | { error: string } | null> {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openrouterKey = process.env.OPENROUTER_API_KEY;

  if (anthropicKey) {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-5",
          max_tokens: input.maxTokens ?? 500,
          system: input.system,
          messages: input.messages,
        }),
      });
      if (!response.ok) {
        const errText = await response.text();
        console.error("Anthropic API error:", errText);
        return { error: "The AI is having trouble responding right now. Try again shortly." };
      }
      const data = await response.json();
      const text = data.content
        ?.filter((c: { type: string }) => c.type === "text")
        .map((c: { text: string }) => c.text)
        .join("\n");
      return { text: text ?? "Couldn't generate a response.", provider: "anthropic" };
    } catch (err) {
      console.error("Anthropic call failed:", err);
      return { error: "The AI is having trouble responding right now. Try again shortly." };
    }
  }

  if (openrouterKey) {
    async function callOpenRouter() {
      return fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openrouterKey}`,
        },
        body: JSON.stringify({
          model: OPENROUTER_FREE_MODEL,
          max_tokens: input.maxTokens ?? 500,
          messages: [{ role: "system", content: input.system }, ...input.messages],
        }),
      });
    }

    try {
      let response = await callOpenRouter();

      // Free-tier models occasionally get rate-limited upstream — the
      // error is explicitly transient, so one short retry is worth it
      // before giving up and telling the user to try again themselves.
      if (response.status === 429) {
        await new Promise((r) => setTimeout(r, 2000));
        response = await callOpenRouter();
      }

      if (!response.ok) {
        const errText = await response.text();
        console.error("OpenRouter API error:", errText);
        return { error: "The AI is having trouble responding right now. Try again shortly." };
      }
      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;
      return { text: text ?? "Couldn't generate a response.", provider: "openrouter" };
    } catch (err) {
      console.error("OpenRouter call failed:", err);
      return { error: "The AI is having trouble responding right now. Try again shortly." };
    }
  }

  return null; // neither provider configured
}
