"use client";

import { createClient } from "@/lib/supabase/client";

export interface StoredFile {
  name: string;
  path: string;
  sizeBytes: number;
  createdAt: string;
}

async function requireUserId(): Promise<string | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function listMyFiles(): Promise<StoredFile[]> {
  const userId = await requireUserId();
  if (!userId) return [];
  const supabase = createClient();
  const { data, error } = await supabase.storage.from("documents").list(userId, {
    sortBy: { column: "created_at", order: "desc" },
  });
  if (error || !data) return [];
  return data
    .filter((f) => f.name !== ".emptyFolderPlaceholder")
    .map((f) => ({
      name: f.name,
      path: `${userId}/${f.name}`,
      sizeBytes: f.metadata?.size ?? 0,
      createdAt: f.created_at ?? "",
    }));
}

export async function uploadFile(file: File): Promise<string | null> {
  const userId = await requireUserId();
  if (!userId) return "Not signed in.";
  const supabase = createClient();
  const path = `${userId}/${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from("documents").upload(path, file);
  if (error) return error.message;
  return null;
}

export async function deleteFile(path: string): Promise<void> {
  const supabase = createClient();
  await supabase.storage.from("documents").remove([path]);
}

export async function getFileUrl(path: string): Promise<string | null> {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUrl(path, 60 * 5); // 5 minute signed link
  if (error || !data) return null;
  return data.signedUrl;
}
