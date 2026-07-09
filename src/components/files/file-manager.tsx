"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, FileText, Trash2, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listMyFiles, uploadFile, deleteFile, getFileUrl, type StoredFile } from "@/lib/db/file-manager";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function FileManager() {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    listMyFiles().then((f) => {
      setFiles(f);
      setMounted(true);
    });
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("File too large — 10MB max.");
      return;
    }
    setUploading(true);
    setError(null);
    const err = await uploadFile(file);
    setUploading(false);
    if (err) {
      setError(err);
    } else {
      setFiles(await listMyFiles());
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleDelete(path: string) {
    await deleteFile(path);
    setFiles(await listMyFiles());
  }

  async function handleDownload(path: string) {
    const url = await getFileUrl(path);
    if (url) window.open(url, "_blank");
  }

  if (!mounted) {
    return <div className="h-48 rounded-lg bg-surface-2 animate-pulse" />;
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <Badge variant="crimson">Your Documents</Badge>
        <span className="text-xs text-muted">{files.length} files</span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.heic"
        className="hidden"
        onChange={handleUpload}
      />
      <Button
        variant="outline"
        className="w-full mb-2"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        <Upload size={16} /> {uploading ? "Uploading…" : "Upload File (InBody report, blood test, PDF)"}
      </Button>
      {error && <p className="text-sm text-danger mb-4">{error}</p>}
      <p className="text-[11px] text-muted mb-6">
        PDFs and images up to 10MB. Stored privately — only you and your
        coach can access these.
      </p>

      {files.length === 0 ? (
        <p className="text-sm text-muted">No files uploaded yet.</p>
      ) : (
        <div className="space-y-2">
          {files.map((f) => (
            <div key={f.path} className="flex items-center gap-3 rounded-md border border-border px-3 py-2.5">
              <FileText size={16} className="text-crimson shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{f.name.replace(/^\d+-/, "")}</p>
                <p className="text-xs text-muted">
                  {formatSize(f.sizeBytes)} · {formatDate(f.createdAt)}
                </p>
              </div>
              <button onClick={() => handleDownload(f.path)} className="text-muted hover:text-foreground p-1">
                <Download size={14} />
              </button>
              <button onClick={() => handleDelete(f.path)} className="text-muted hover:text-danger p-1">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
