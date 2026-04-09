"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { X, Upload, Image as ImageIcon, Check } from "lucide-react";

interface MediaFile {
  name: string;
  url: string;
}

interface MediaPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export default function MediaPickerModal({
  open,
  onClose,
  onSelect,
}: MediaPickerModalProps) {
  const [tab, setTab] = useState<"library" | "upload">("library");
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const fetchMedia = useCallback(async () => {
    setLoading(true);
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
          url: supabase.storage
            .from("media")
            .getPublicUrl(`${user.id}/${f.name}`).data.publicUrl,
        }));
      setFiles(mediaFiles);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    if (open) {
      fetchMedia();
      setSelected(null);
    }
  }, [open, fetchMedia]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setUploading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    let lastUrl = "";
    for (const file of Array.from(fileList)) {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const path = `${user.id}/${fileName}`;

      const { error } = await supabase.storage.from("media").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

      if (!error) {
        lastUrl = supabase.storage.from("media").getPublicUrl(path).data
          .publicUrl;
      }
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    await fetchMedia();

    if (lastUrl) {
      setSelected(lastUrl);
      setTab("library");
    }
  }

  function handleConfirm() {
    if (selected) {
      onSelect(selected);
      onClose();
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative z-10 w-full max-w-2xl max-h-[80vh] rounded-2xl bg-white border border-[rgba(0,0,0,0.06)] shadow-xl mx-4 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-[rgba(0,0,0,0.06)]">
          <div className="flex gap-1">
            <button
              onClick={() => setTab("library")}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                tab === "library"
                  ? "bg-[#086CF2] text-white"
                  : "text-[#4A5568] hover:bg-[#F0F4FF]"
              }`}
            >
              {"\u5a92\u9ad4\u5eab"}
            </button>
            <button
              onClick={() => setTab("upload")}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                tab === "upload"
                  ? "bg-[#086CF2] text-white"
                  : "text-[#4A5568] hover:bg-[#F0F4FF]"
              }`}
            >
              {"\u4e0a\u50b3"}
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#F0F4FF] transition-colors"
          >
            <X className="w-5 h-5 text-[#8B9BB4]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 min-h-[300px]">
          {tab === "library" && (
            <>
              {loading ? (
                <div className="grid grid-cols-4 gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-xl bg-[#F0F4FF] animate-pulse"
                    />
                  ))}
                </div>
              ) : files.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <ImageIcon className="w-12 h-12 text-[#8B9BB4] mb-3" />
                  <p className="text-sm text-[#4A5568]">
                    {"\u9084\u6c92\u6709\u5716\u7247\uff0c\u8acb\u5148\u4e0a\u50b3"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {files.map((file) => (
                    <button
                      key={file.name}
                      onClick={() => setSelected(file.url)}
                      className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        selected === file.url
                          ? "border-[#086CF2] ring-2 ring-[#086CF2]/20"
                          : "border-transparent hover:border-[#086CF2]/30"
                      }`}
                    >
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                      {selected === file.url && (
                        <div className="absolute inset-0 bg-[#086CF2]/20 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-[#086CF2] flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === "upload" && (
            <div className="flex flex-col items-center justify-center py-12">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleUpload}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full max-w-sm border-2 border-dashed border-[rgba(0,0,0,0.12)] rounded-2xl p-12 text-center cursor-pointer hover:border-[#086CF2] hover:bg-[#F0F4FF]/50 transition-colors"
              >
                <Upload className="w-10 h-10 text-[#8B9BB4] mx-auto mb-3" />
                <p className="text-sm font-medium text-[#0A0E1A] mb-1">
                  {"\u9ede\u64ca\u6216\u62d6\u66f3\u4e0a\u50b3\u5716\u7247"}
                </p>
                <p className="text-xs text-[#8B9BB4]">
                  {"\u652f\u63f4 JPG, PNG, WebP"}
                </p>
              </div>
              {uploading && (
                <p className="text-sm text-[#086CF2] mt-4 animate-pulse">
                  {"\u4e0a\u50b3\u4e2d..."}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 p-4 border-t border-[rgba(0,0,0,0.06)]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[#4A5568] bg-white border border-[rgba(0,0,0,0.12)] rounded-xl hover:bg-[#F8F9FC] transition-colors"
          >
            {"\u53d6\u6d88"}
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selected}
            className="px-4 py-2 text-sm font-medium text-white bg-[#086CF2] rounded-xl hover:bg-[#086CF2]/90 transition-colors disabled:opacity-40"
          >
            {"\u78ba\u8a8d\u9078\u53d6"}
          </button>
        </div>
      </div>
    </div>
  );
}
