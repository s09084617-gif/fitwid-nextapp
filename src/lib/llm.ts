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

/**
 * Some free-tier models (routed to via OpenRouter's auto-router) are
 * "reasoning" models that narrate their thinking process as plain text
 * instead of returning just the final answer — e.g. "We need to write a
 * message... probably something like: 'X'". This is a real, observed
 * failure mode, not theoretical. Strip it defensively:
 * 1. Remove explicit <think>...</think>-style blocks some models use.
 * 2. If the text still reads like reasoning (contains "we need to",
 *    "probably something like", etc.) and there's a quoted string near
 *    the end, extract just the quote — that's almost always the actual
 *    intended answer.
 */
function stripReasoningLeak(text: string): string {
  let cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

  const reasoningMarkers = /\b(we need to|i need to|probably something like|that's one sentence|let me|i should|the user wants)\b/i;
  if (reasoningMarkers.test(cleaned)) {
    const quoted = cleaned.match(/["“]([^"”]{15,300})["”]/);
    if (quoted) {
      cleaned = quoted[1].trim();
    }
  }
  return cleaned;
}

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
      if (!text) {
        console.error("Anthropic returned no usable text:", JSON.stringify(data));
        return { error: "The AI didn't return a usable response. Try rephrasing your question." };
      }
      return { text, provider: "anthropic" };
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
      const rawText = data.choices?.[0]?.message?.content;
      if (!rawText) {
        console.error("OpenRouter returned no usable text:", JSON.stringify(data));
        return { error: "The AI didn't return a usable response. Try rephrasing your question." };
      }
      const text = stripReasoningLeak(rawText);
      if (!text) {
        console.error("OpenRouter response was only reasoning, nothing extractable:", rawText);
        return { error: "The AI didn't return a usable response. Try rephrasing your question." };
      }
      return { text, provider: "openrouter" };
    } catch (err) {
      console.error("OpenRouter call failed:", err);
      return { error: "The AI is having trouble responding right now. Try again shortly." };
    }
  }

  return null; // neither provider configured
}
