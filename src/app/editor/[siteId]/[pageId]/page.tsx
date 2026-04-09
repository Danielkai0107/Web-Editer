"use client";

import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import { CheckCircle, Copy, ExternalLink, X, AlertCircle } from "lucide-react";
import dynamic from "next/dynamic";

const GrapesEditor = dynamic(
  () => import("@/components/editor/grapesjs-editor"),
  { ssr: false, loading: () => <EditorSkeleton /> }
);

function EditorSkeleton() {
  return (
    <div className="h-screen flex flex-col bg-bg-base">
      <div className="h-12 bg-bg-card border-b border-border animate-pulse" />
      <div className="flex flex-1">
        <div className="w-56 bg-bg-card border-r border-border animate-pulse" />
        <div className="flex-1 bg-bg-base" />
      </div>
    </div>
  );
}

interface PublishResult {
  success: boolean;
  url?: string;
  error?: string;
}

function PublishPopup({
  result,
  onClose,
}: {
  result: PublishResult;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (!result.url) return;
    navigator.clipboard.writeText(result.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative z-10 w-full max-w-md rounded-2xl bg-white border border-[rgba(0,0,0,0.06)] p-6 shadow-xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-[#F0F4FF] transition-colors"
        >
          <X className="w-5 h-5 text-[#8B9BB4]" />
        </button>

        {result.success ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[rgba(52,211,153,0.1)] flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-[#34D399]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#0A0E1A]">{"\u767c\u5e03\u6210\u529f"}</h3>
                <p className="text-sm text-[#4A5568]">{"\u4f60\u7684\u7db2\u7ad9\u5df2\u4e0a\u7dda"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#F8F9FC] rounded-xl p-3 mb-4">
              <input
                readOnly
                value={result.url}
                className="flex-1 bg-transparent text-sm text-[#0A0E1A] font-mono truncate outline-none"
              />
              <button
                onClick={handleCopy}
                className="shrink-0 p-2 rounded-lg hover:bg-white transition-colors"
                title={"\u8907\u88fd\u9023\u7d50"}
              >
                <Copy className={`w-4 h-4 ${copied ? "text-[#34D399]" : "text-[#4A5568]"}`} />
              </button>
            </div>

            {copied && (
              <p className="text-xs text-[#34D399] mb-3">{"\u5df2\u8907\u88fd\u5230\u526a\u8cbc\u7c3f"}</p>
            )}

            <div className="flex gap-2">
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 h-10 px-4 text-sm font-medium text-white bg-[#086CF2] rounded-xl hover:bg-[#086CF2]/90 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                {"\u524d\u5f80\u7db2\u7ad9"}
              </a>
              <button
                onClick={onClose}
                className="flex-1 h-10 px-4 text-sm font-medium text-[#0A0E1A] bg-white border border-[rgba(0,0,0,0.12)] rounded-xl hover:bg-[#F0F4FF] transition-colors"
              >
                {"\u7e7c\u7e8c\u7de8\u8f2f"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[rgba(248,113,113,0.1)] flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-[#F87171]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#0A0E1A]">{"\u767c\u5e03\u5931\u6557"}</h3>
              </div>
            </div>
            <p className="text-sm text-[#F87171] bg-[rgba(248,113,113,0.1)] rounded-xl px-3 py-2 mb-4">
              {result.error}
            </p>
            <button
              onClick={onClose}
              className="w-full h-10 px-4 text-sm font-medium text-[#0A0E1A] bg-white border border-[rgba(0,0,0,0.12)] rounded-xl hover:bg-[#F0F4FF] transition-colors"
            >
              {"\u95dc\u9589"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function EditorPage() {
  const { siteId, pageId } = useParams<{ siteId: string; pageId: string }>();
  const [content, setContent] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publishResult, setPublishResult] = useState<PublishResult | null>(null);
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    async function load() {
      const { data, error: err } = await supabase
        .from("pages")
        .select("content_json")
        .eq("id", pageId)
        .single();

      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
      setContent(data.content_json || {});
      setLoading(false);
    }
    load();
  }, [supabase, pageId]);

  const handleSave = useCallback(
    async (data: Record<string, unknown>) => {
      await supabase
        .from("pages")
        .update({ content_json: data })
        .eq("id", pageId);
    },
    [supabase, pageId]
  );

  const handlePublish = useCallback(async () => {
    const res = await fetch("/api/deploy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteId }),
    });
    const result = await res.json();
    if (!res.ok) {
      setPublishResult({ success: false, error: result.error });
      return;
    }
    setPublishResult({ success: true, url: result.url });
  }, [siteId]);

  if (loading) return <EditorSkeleton />;

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-bg-base">
        <div className="text-center">
          <p className="text-danger mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="text-sm text-accent hover:underline"
          >
            {"\u8fd4\u56de"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <GrapesEditor
        pageId={pageId}
        siteId={siteId}
        initialContent={content || {}}
        onSave={handleSave}
        onPublish={handlePublish}
      />
      {publishResult && (
        <PublishPopup
          result={publishResult}
          onClose={() => setPublishResult(null)}
        />
      )}
    </>
  );
}
