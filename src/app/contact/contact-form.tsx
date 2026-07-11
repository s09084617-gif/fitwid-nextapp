"use client";

import { useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics/events";
import { submitContactForm } from "./actions";

export function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [goal, setGoal] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const err = await submitContactForm({ name, phone, email, goal });
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    trackEvent("form_submitted", { form: "contact" });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Card className="border-success/40 bg-success/5 text-center py-10">
        <p className="font-display text-2xl mb-2">Thanks, {name.split(" ")[0]}!</p>
        <p className="text-sm text-muted">
          We&apos;ll reach out within 24 hours. Want a faster reply?{" "}
          <a href="https://wa.me/917015552731" target="_blank" rel="noopener noreferrer" className="text-crimson underline">
            Message us on WhatsApp
          </a>
          .
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required />
        <Input label="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" required />
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
        <Input label="Goal (optional)" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g. Fat loss, muscle gain..." />
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Sending…" : "Send Message"}
        </Button>
      </form>
    </Card>
  );
}
