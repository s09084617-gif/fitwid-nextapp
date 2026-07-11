import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FloatingWhatsApp } from "@/components/shared/floating-whatsapp";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getBlogPostBySlugServer } from "@/lib/db/blog-server";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlugServer(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlugServer(slug);
  if (!post) notFound();

  return (
    <>
      <Navbar />
      <main className="flex-1 px-6 py-16">
        <article className="max-w-2xl mx-auto">
          <Link href="/blog" className="text-xs text-muted hover:text-foreground mb-6 inline-block">
            ← All Guides
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="crimson">{post.category}</Badge>
            <span className="text-xs text-muted">{formatDate(post.publishedAt)}</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl mb-6">{post.title}</h1>
          <div className="prose-fitwid text-sm text-foreground/90 leading-relaxed space-y-4">
            <ReactMarkdown
              components={{
                h1: (props) => <h2 className="font-display text-2xl mt-8 mb-3 text-crimson" {...props} />,
                h2: (props) => <h2 className="font-display text-2xl mt-8 mb-3 text-crimson" {...props} />,
                p: (props) => <p className="text-foreground/90 leading-relaxed" {...props} />,
                a: (props) => <a className="text-crimson underline" {...props} />,
                strong: (props) => <strong className="text-foreground font-semibold" {...props} />,
                ul: (props) => <ul className="list-disc pl-5 space-y-1" {...props} />,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          <div className="mt-12 rounded-lg border border-gold/30 bg-gold/5 p-6 text-center">
            <p className="font-display text-xl mb-2">Ready to apply this?</p>
            <p className="text-sm text-muted mb-4">
              Take the free AI Body Assessment for a plan built around your actual numbers.
            </p>
            <Link href="/assessment" className={buttonVariants({ variant: "primary", size: "lg" })}>
              Start Free Assessment
            </Link>
          </div>
        </article>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
