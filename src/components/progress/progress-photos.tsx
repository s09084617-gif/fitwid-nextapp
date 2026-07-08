"use client";

import { useEffect, useRef, useState } from "react";
import { Trash2, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { resizeImageFile } from "@/lib/image-resize";
import {
  getProgressPhotos,
  addProgressPhoto,
  deleteProgressPhoto,
  type ProgressPhoto,
} from "@/lib/local-store";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ProgressPhotos() {
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage on mount
    setPhotos(getProgressPhotos());
    setMounted(true);
  }, []);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const dataUrl = await resizeImageFile(file);
      const failMessage = addProgressPhoto(dataUrl);
      if (failMessage) {
        setError(failMessage);
      } else {
        setPhotos(getProgressPhotos());
      }
    } catch {
      setError("Couldn't process that image. Try a different photo.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleDelete(id: string) {
    setPhotos(deleteProgressPhoto(id));
  }

  if (!mounted) {
    return <div className="h-48 rounded-lg bg-surface-2 animate-pulse" />;
  }

  const oldest = photos[photos.length - 1];
  const newest = photos[0];

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <Badge variant="crimson">Progress Photos</Badge>
        <span className="text-xs text-muted">{photos.length}/20</span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        variant="outline"
        className="w-full mb-2"
        onClick={() => inputRef.current?.click()}
        disabled={uploading || photos.length >= 20}
      >
        <Upload size={16} />
        {uploading ? "Processing…" : "Upload Photo"}
      </Button>
      {error && <p className="text-sm text-danger mb-2">{error}</p>}
      <p className="text-[11px] text-muted mb-6">
        Photos are compressed and stored only in this browser — they are not
        uploaded anywhere and won&apos;t sync across devices.
      </p>

      {photos.length === 0 ? (
        <p className="text-sm text-muted">No progress photos yet.</p>
      ) : (
        <>
          {oldest && newest && oldest.id !== newest.id && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs text-muted mb-1.5">
                  Earliest — {formatDate(oldest.date)}
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element -- local base64 data URLs, not remote images */}
                <img
                  src={oldest.dataUrl}
                  alt="Earliest progress photo"
                  className="w-full rounded-md border border-border object-cover aspect-[3/4]"
                />
              </div>
              <div>
                <p className="text-xs text-muted mb-1.5">
                  Latest — {formatDate(newest.date)}
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element -- local base64 data URLs, not remote images */}
                <img
                  src={newest.dataUrl}
                  alt="Latest progress photo"
                  className="w-full rounded-md border border-crimson/50 object-cover aspect-[3/4]"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {photos.map((p) => (
              <div key={p.id} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element -- local base64 data URLs, not remote images */}
                <img
                  src={p.dataUrl}
                  alt={`Progress photo from ${formatDate(p.date)}`}
                  className="w-full aspect-square object-cover rounded-md border border-border"
                />
                <button
                  type="button"
                  onClick={() => handleDelete(p.id)}
                  className="absolute top-1 right-1 h-6 w-6 rounded-full bg-background/80 flex items-center justify-center text-muted hover:text-danger transition"
                  aria-label="Delete photo"
                >
                  <Trash2 size={12} />
                </button>
                <p className="text-[10px] text-muted mt-1 text-center">
                  {formatDate(p.date)}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
