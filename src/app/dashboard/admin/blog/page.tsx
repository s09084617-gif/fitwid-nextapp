"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addBlogPost, deleteBlogPost, listAllBlogPosts } from "./actions";

interface PostRow {
  id: string;
  slug: string;
  title: string;
  category: string;
  published_at: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ title: "", excerpt: "", content: "", category: "Training" });
  const [saving, setSaving] = useState(false);

  function refresh() {
    listAllBlogPosts().then((p) => setPosts(p as PostRow[]));
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration guard, same pattern used elsewhere
    setMounted(true);
  }, []);

  async function handleAdd() {
    if (!form.title.trim() || !form.content.trim()) return;
    setSaving(true);
    await addBlogPost(form);
    setSaving(false);
    setForm({ title: "", excerpt: "", content: "", category: "Training" });
    refresh();
  }

  async function handleDelete(id: string) {
    await deleteBlogPost(id);
    refresh();
  }

  if (!mounted) return <div className="h-48 rounded-lg bg-surface-2 animate-pulse" />;

  return (
    <div className="space-y-6">
      <Card>
        <Badge variant="crimson" className="mb-4">New Article</Badge>
        <div className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input label="Excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
          <Input label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Content (Markdown)</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={12}
              className="w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-mono"
            />
          </div>
          <Button onClick={handleAdd} disabled={saving}>
            <Plus size={14} /> {saving ? "Publishing…" : "Publish Article"}
          </Button>
        </div>
      </Card>

      <Card>
        <Badge variant="gold" className="mb-4">Published Articles ({posts.length})</Badge>
        <div className="space-y-2">
          {posts.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2.5 text-sm">
              <span>{p.title} <span className="text-muted text-xs">({p.category})</span></span>
              <button onClick={() => handleDelete(p.id)} className="text-muted hover:text-danger p-1" aria-label="Delete article">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
