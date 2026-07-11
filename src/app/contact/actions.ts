"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitContactForm(input: {
  name: string;
  phone: string;
  email: string;
  goal?: string;
}): Promise<string | null> {
  if (!input.name.trim() || !input.phone.trim() || !input.email.trim()) {
    return "Please fill in your name, phone, and email.";
  }
  const supabase = await createClient();
  const { error } = await supabase.from("contact_submissions").insert({
    name: input.name.trim(),
    phone: input.phone.trim(),
    email: input.email.trim(),
    goal: input.goal?.trim() || null,
  });
  if (error) return "Something went wrong — try WhatsApp instead.";
  return null;
}
