"use client";

import { ImagePlus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";
import { createClient } from "@/lib/supabase/client";

export function StorageUploadField({
  bucket = "school-assets",
  folder = "students",
  onUploaded
}: {
  bucket?: string;
  folder?: string;
  onUploaded: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToast();

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast({ tone: "error", title: "Unsupported file", description: "Please upload a JPG, PNG, or WebP image." });
      return;
    }

    setUploading(true);
    const supabase = createClient();
    const extension = file.name.split(".").pop() || "jpg";
    const path = `${folder}/${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: false
    });

    if (error) {
      setUploading(false);
      showToast({ tone: "error", title: "Upload failed", description: error.message });
      return;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    onUploaded(data.publicUrl);
    setUploading(false);
    showToast({ tone: "success", title: "Photo uploaded", description: "The profile image is ready to save." });
  }

  return (
    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm font-bold text-slate-600 transition hover:border-school-blue hover:bg-school-sky dark:border-white/10 dark:bg-slate-950 dark:text-slate-300">
      <ImagePlus size={18} />
      {uploading ? "Uploading..." : "Upload passport photo"}
      <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
    </label>
  );
}
