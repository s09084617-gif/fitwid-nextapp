"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isAdminEmail(user?.email)) throw new Error("Not authorized");
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function addBlogPost(input: {
  title: string;
  excerpt: string;
  content: string;
  category: string;
}) {
  await assertAdmin();
  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");

  await admin.from("blog_posts").insert({
    slug: slugify(input.title),
    title: input.title,
    excerpt: input.excerpt,
    content: input.content,
    category: input.category,
  });
  revalidatePath("/blog");
  revalidatePath("/dashboard/admin/blog");
}

export async function deleteBlogPost(id: string) {
  await assertAdmin();
  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");
  await admin.from("blog_posts").delete().eq("id", id);
  revalidatePath("/blog");
  revalidatePath("/dashboard/admin/blog");
}

export async function listAllBlogPosts() {
  await assertAdmin();
  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");
  const { data } = await admin.from("blog_posts").select("id, slug, title, category, published_at").order("published_at", { ascending: false });
  return data ?? [];
}
