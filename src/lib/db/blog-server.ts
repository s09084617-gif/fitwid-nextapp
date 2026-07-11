// Server-side blog data access — used by the /blog pages, which are
// Server Components so the content is in the initial HTML for SEO
// crawlers (the whole point of having a blog). The client-side
// equivalents in shared-data.ts use the browser Supabase client and
// aren't suitable here.
import { createClient } from "@/lib/supabase/server";
import type { BlogPost } from "@/lib/db/shared-data";

export async function getBlogPostsServer(): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, content, category, cover_image, published_at")
    .eq("published", true)
    .order("published_at", { ascending: false });
  if (error || !data) return [];
  return data.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    content: r.content,
    category: r.category,
    coverImage: r.cover_image,
    publishedAt: r.published_at,
  }));
}

export async function getBlogPostBySlugServer(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, content, category, cover_image, published_at")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error || !data) return null;
  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    category: data.category,
    coverImage: data.cover_image,
    publishedAt: data.published_at,
  };
}
