import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FloatingWhatsApp } from "@/components/shared/floating-whatsapp";
import { Badge } from "@/components/ui/badge";
import { getBlogPostsServer } from "@/lib/db/blog-server";

export const metadata = {
  title: "Fitness & Nutrition Guides",
  description: "Real, practical guides on training, nutrition, and getting started — from FitWid and I-BLITZ Fitness Club.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default async function BlogListPage() {
  const posts = await getBlogPostsServer();

  return (
    <>
      <Navbar />
      <main className="flex-1 px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gold tracking-[0.3em] text-xs font-semibold uppercase mb-3">
              Resources
            </p>
            <h1 className="font-display text-4xl sm:text-5xl mb-4">
              Fitness & Nutrition Guides
            </h1>
            <p className="text-muted max-w-lg mx-auto">
              Real, practical guides — no fads, no fluff.
            </p>
          </div>

          {posts.length === 0 ? (
            <p className="text-center text-muted">No articles published yet — check back soon.</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block rounded-lg border border-border bg-surface p-6 hover:border-crimson/40 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="crimson">{post.category}</Badge>
                    <span className="text-xs text-muted">{formatDate(post.publishedAt)}</span>
                  </div>
                  <h2 className="font-display text-2xl mb-2">{post.title}</h2>
                  <p className="text-sm text-muted">{post.excerpt}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
