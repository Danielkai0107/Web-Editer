"use client";

import { Shell } from "@/components/layout/shell";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import type { Site, Page } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Plus, Pencil, Trash2, ExternalLink, FileText } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

export default function SiteDetailPage() {
  const { siteId } = useParams<{ siteId: string }>();
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();

  const [site, setSite] = useState<Site | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPage, setShowAddPage] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchData = useCallback(async () => {
    const [siteRes, pagesRes] = await Promise.all([
      supabase.from("sites").select("*").eq("id", siteId).single(),
      supabase
        .from("pages")
        .select("*")
        .eq("site_id", siteId)
        .order("created_at", { ascending: true }),
    ]);
    setSite(siteRes.data);
    setPages(pagesRes.data || []);
    setLoading(false);
  }, [supabase, siteId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleAddPage(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    const { error } = await supabase.from("pages").insert({
      site_id: siteId,
      title: newPageTitle,
      slug: newPageSlug,
    });
    if (error) {
      toast(error.message, "error");
      setCreating(false);
      return;
    }
    setShowAddPage(false);
    setNewPageTitle("");
    setNewPageSlug("");
    setCreating(false);
    toast("\u9801\u9762\u5df2\u65b0\u589e", "success");
    fetchData();
  }

  async function handleDeletePage(pageId: string) {
    if (!confirm("\u78ba\u5b9a\u8981\u522a\u9664\u9019\u500b\u9801\u9762\u55ce\uff1f")) return;
    const { error } = await supabase.from("pages").delete().eq("id", pageId);
    if (error) {
      toast(error.message, "error");
      return;
    }
    toast("\u9801\u9762\u5df2\u522a\u9664", "success");
    fetchData();
  }

  if (loading) {
    return (
      <Shell title={"\u8f09\u5165\u4e2d..."}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-bg-card-elevated rounded w-48" />
          <div className="h-4 bg-bg-card-elevated rounded w-96" />
        </div>
      </Shell>
    );
  }

  if (!site) {
    return (
      <Shell title={"\u627e\u4e0d\u5230\u7ad9\u53f0"}>
        <p className="text-text-secondary">{"\u8a72\u7ad9\u53f0\u4e0d\u5b58\u5728\u6216\u5df2\u88ab\u522a\u9664"}</p>
        <Button variant="secondary" className="mt-4" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="w-4 h-4" />
          {"\u8fd4\u56de"}
        </Button>
      </Shell>
    );
  }

  return (
    <Shell title={site.name}>
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          {"\u8fd4\u56de\u7ad9\u53f0\u5217\u8868"}
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{site.name}</h2>
            <p className="text-sm text-text-muted mt-0.5">
              {site.subdomain}.siteforge.tw
            </p>
          </div>
          <Badge variant={site.published ? "success" : "default"}>
            {site.published ? "\u5df2\u767c\u5e03" : "\u8349\u7a3f"}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{"\u9801\u9762"}</CardTitle>
          <Button size="sm" onClick={() => setShowAddPage(true)}>
            <Plus className="w-4 h-4" />
            {"\u65b0\u589e\u9801\u9762"}
          </Button>
        </CardHeader>
        <CardContent>
          {pages.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-10 h-10 text-text-muted mx-auto mb-3" />
              <p className="text-sm text-text-secondary">{"\u9084\u6c92\u6709\u9801\u9762"}</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-sm">{page.title}</p>
                    <p className="text-xs text-text-muted">
                      /{page.slug || ""} &middot; {"\u66f4\u65b0\u65bc"}{" "}
                      {formatDate(page.updated_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/editor/${siteId}/${page.id}`}>
                      <Button variant="secondary" size="sm">
                        <Pencil className="w-3.5 h-3.5" />
                        {"\u7de8\u8f2f"}
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePage(page.id)}
                      className="text-danger hover:bg-danger-bg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        open={showAddPage}
        onClose={() => setShowAddPage(false)}
        title={"\u65b0\u589e\u9801\u9762"}
      >
        <form onSubmit={handleAddPage} className="space-y-4">
          <Input
            id="pageTitle"
            label={"\u9801\u9762\u6a19\u984c"}
            placeholder={"\u4f8b\u5982\uff1a\u95dc\u65bc\u6211\u5011"}
            value={newPageTitle}
            onChange={(e) => setNewPageTitle(e.target.value)}
            required
          />
          <Input
            id="pageSlug"
            label="Slug"
            placeholder="about"
            value={newPageSlug}
            onChange={(e) => setNewPageSlug(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={() => setShowAddPage(false)}>
              {"\u53d6\u6d88"}
            </Button>
            <Button type="submit" loading={creating}>
              {"\u5efa\u7acb"}
            </Button>
          </div>
        </form>
      </Modal>
    </Shell>
  );
}
