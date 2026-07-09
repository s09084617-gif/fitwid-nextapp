"use client";

import { useRef, useState, useEffect } from "react";
import { Send, Dumbbell, Utensils, Battery } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  { icon: Dumbbell, label: "Workout Q&A", prompt: "What's a good way to break through a bench press plateau?" },
  { icon: Utensils, label: "Nutrition Q&A", prompt: "How much protein do I actually need per day?" },
  { icon: Battery, label: "Recovery Advice", prompt: "What should I do on my rest days to recover better?" },
];

export function CoachChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [notConfigured, setNotConfigured] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    const updated: Message[] = [...messages, { role: "user", content: text }];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json();
      if (res.status === 503) {
        setNotConfigured(true);
        setLoading(false);
        return;
      }
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply ?? data.error }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong reaching the AI Coach. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (notConfigured) {
    return (
      <Card>
        <Badge variant="warning" className="mb-3">Not Configured</Badge>
        <p className="text-sm text-muted">
          The AI Coach chat needs an <code>ANTHROPIC_API_KEY</code> environment
          variable to work. Get a key at{" "}
          <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="text-crimson underline">
            console.anthropic.com
          </a>{" "}
          and add it in Vercel → Settings → Environment Variables, then redeploy.
        </p>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-[500px]">
      <Badge variant="crimson" className="mb-3 w-fit">Ask the Coach</Badge>

      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-4">
          <p className="text-sm text-muted text-center mb-2">
            Ask about workouts, nutrition, or recovery.
          </p>
          <div className="grid gap-2 w-full max-w-sm">
            {QUICK_PROMPTS.map((q) => (
              <button
                key={q.label}
                onClick={() => sendMessage(q.prompt)}
                className="flex items-center gap-2 rounded-md border border-border px-3 py-2.5 text-sm text-left hover:border-crimson/50 transition"
              >
                <q.icon size={16} className="text-crimson shrink-0" />
                {q.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-3 py-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-lg px-3.5 py-2.5 text-sm ${
              m.role === "user"
                ? "bg-crimson/15 border border-crimson/30 ml-auto"
                : "bg-surface-2 border border-border"
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="bg-surface-2 border border-border rounded-lg px-3.5 py-2.5 text-sm text-muted max-w-[85%]">
            Thinking…
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="flex gap-2 pt-3 border-t border-border mt-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about training, nutrition, or recovery..."
          className="flex-1 rounded-md border border-border bg-surface px-4 py-2.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson/50"
        />
        <Button type="submit" disabled={loading || !input.trim()}>
          <Send size={16} />
        </Button>
      </form>
    </Card>
  );
}
