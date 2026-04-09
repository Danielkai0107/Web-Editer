"use client";

import { Shell } from "@/components/layout/shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import { Upload, Trash2, Image as ImageIcon, Copy } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";

interface MediaFile {
  name: string;
  url: string;
  created_at: string | null;
}

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const { toast } = useToast();

  const fetchMedia = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase.storage.from("media").list(user.id, {
      sortBy: { column: "created_at", order: "desc" },
    });

    if (data) {
      const mediaFiles: MediaFile[] = data
        .filter((f) => f.name !== ".emptyFolderPlaceholder")
        .map((f) => ({
          name: f.name,
          url: supabase.storage.from("media").getPublicUrl(`${user.id}/${f.name}`).data.publicUrl,
          created_at: f.created_at,
        }));
      setFiles(mediaFiles);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setUploading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    for (const file of Array.from(fileList)) {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const path = `${user.id}/${fileName}`;

      const { error } = await supabase.storage.from("media").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

      if (error) {
        toast(`${file.name} \u4e0a\u50b3\u5931\u6557: ${error.message}`, "error");
      }
    }

    toast("\u4e0a\u50b3\u5b8c\u6210", "success");
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    fetchMedia();
  }

  async function handleDelete(fileName: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.storage.from("media").remove([`${user.id}/${fileName}`]);
    if (error) {
      toast(error.message, "error");
      return;
    }
    toast("\u5df2\u522a\u9664", "success");
    fetchMedia();
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    toast("\u5df2\u8907\u88fd\u9023\u7d50", "success");
  }

  return (
    <Shell title={"\u5a92\u9ad4\u5eab"}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">{"\u5a92\u9ad4\u5eab"}</h2>
          <p className="text-sm text-text-secondary mt-1">
            {"\u7ba1\u7406\u4f60\u4e0a\u50b3\u7684\u6240\u6709\u5716\u7247"}
          </p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
          <Button onClick={() => fileInputRef.current?.click()} loading={uploading}>
            <Upload className="w-4 h-4" />
            {"\u4e0a\u50b3\u5716\u7247"}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-square rounded-[var(--radius-card)] bg-bg-card-elevated animate-pulse" />
          ))}
        </div>
      ) : files.length === 0 ? (
        <Card className="text-center py-12">
          <ImageIcon className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">{"\u9084\u6c92\u6709\u5716\u7247"}</h3>
          <p className="text-sm text-text-secondary mb-6">
            {"\u4e0a\u50b3\u5716\u7247\u4f86\u5728\u7db2\u7ad9\u4e2d\u4f7f\u7528"}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {files.map((file) => (
            <div
              key={file.name}
              className="group relative aspect-square rounded-[var(--radius-card)] overflow-hidden border bg-bg-card"
            >
              <img
                src={file.url}
                alt={file.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => copyUrl(file.url)}
                  className="p-2 bg-white rounded-[var(--radius-input)] shadow-sm hover:bg-gray-100 transition-colors"
                  title={"\u8907\u88fd\u9023\u7d50"}
                >
                  <Copy className="w-4 h-4 text-text-primary" />
                </button>
                <button
                  onClick={() => handleDelete(file.name)}
                  className="p-2 bg-white rounded-[var(--radius-input)] shadow-sm hover:bg-gray-100 transition-colors"
                  title={"\u522a\u9664"}
                >
                  <Trash2 className="w-4 h-4 text-danger" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Shell>
  );
}
