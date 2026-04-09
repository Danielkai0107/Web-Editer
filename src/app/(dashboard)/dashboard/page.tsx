"use client";

import { Shell } from "@/components/layout/shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import type { Site } from "@/lib/types";
import { formatDate, generateSubdomain } from "@/lib/utils";
import { Plus, ExternalLink, Pencil, Trash2, Globe } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

export default function DashboardPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSubdomain, setNewSubdomain] = useState("");
  const [creating, setCreating] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();

  const fetchSites = useCallback(async () => {
    const { data } = await supabase
      .from("sites")
      .select("*")
      .order("created_at", { ascending: false });
    setSites(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: site, error } = await supabase
      .from("sites")
      .insert({
        user_id: user.id,
        name: newName,
        subdomain: newSubdomain || generateSubdomain(newName),
      })
      .select()
      .single();

    if (error) {
      toast(error.message, "error");
      setCreating(false);
      return;
    }

    const { error: pageError } = await supabase.from("pages").insert({
      site_id: site.id,
      title: "\u9996\u9801",
      slug: "",
    });

    if (pageError) {
      toast(pageError.message, "error");
    }

    setShowCreate(false);
    setNewName("");
    setNewSubdomain("");
    setCreating(false);
    toast("\u7ad9\u53f0\u5efa\u7acb\u6210\u529f", "success");
    fetchSites();
  }

  async function handleDelete(siteId: string) {
    if (!confirm("\u78ba\u5b9a\u8981\u522a\u9664\u9019\u500b\u7ad9\u53f0\u55ce\uff1f\u6b64\u64cd\u4f5c\u7121\u6cd5\u5fa9\u539f\u3002")) return;
    const { error } = await supabase.from("sites").delete().eq("id", siteId);
    if (error) {
      toast(error.message, "error");
      return;
    }
    toast("\u7ad9\u53f0\u5df2\u522a\u9664", "success");
    fetchSites();
  }

  return (
    <Shell title={"\u7ad9\u53f0\u7ba1\u7406"}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">{"\u6211\u7684\u7ad9\u53f0"}</h2>
          <p className="text-sm text-text-secondary mt-1">
            {"\u7ba1\u7406\u4f60\u7684\u6240\u6709\u7db2\u7ad9"}
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4" />
          {"\u65b0\u589e\u7ad9\u53f0"}
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-4 bg-bg-card-elevated rounded w-2/3 mb-3" />
              <div className="h-3 bg-bg-card-elevated rounded w-1/2 mb-6" />
              <div className="h-8 bg-bg-card-elevated rounded w-full" />
            </Card>
          ))}
        </div>
      ) : sites.length === 0 ? (
        <Card className="text-center py-12">
          <Globe className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">{"\u9084\u6c92\u6709\u7ad9\u53f0"}</h3>
          <p className="text-sm text-text-secondary mb-6">
            {"\u5efa\u7acb\u4f60\u7684\u7b2c\u4e00\u500b\u7db2\u7ad9\uff0c\u53ea\u9700\u5e7e\u5206\u9418"}
          </p>
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="w-4 h-4" />
            {"\u65b0\u589e\u7ad9\u53f0"}
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sites.map((site) => (
            <Card key={site.id} className="group hover:border-border-strong transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-text-primary">{site.name}</h3>
                  <p className="text-xs text-text-muted mt-0.5">
                    {site.subdomain}.siteforge.tw
                  </p>
                </div>
                <Badge variant={site.published ? "success" : "default"}>
                  {site.published ? "\u5df2\u767c\u5e03" : "\u8349\u7a3f"}
                </Badge>
              </div>

              <p className="text-xs text-text-muted mb-4">
                {"\u66f4\u65b0\u65bc"} {formatDate(site.updated_at)}
              </p>

              <div className="flex items-center gap-2">
                <Link href={`/dashboard/sites/${site.id}`} className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full">
                    <Pencil className="w-3.5 h-3.5" />
                    {"\u7ba1\u7406"}
                  </Button>
                </Link>
                {site.published && (
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(site.id)}
                  className="text-danger hover:bg-danger-bg"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title={"\u65b0\u589e\u7ad9\u53f0"}
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            id="siteName"
            label={"\u7ad9\u53f0\u540d\u7a31"}
            placeholder={"\u4f8b\u5982\uff1a\u6211\u7684\u54c1\u724c\u5b98\u7db2"}
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value);
              if (!newSubdomain) {
                setNewSubdomain(generateSubdomain(e.target.value));
              }
            }}
            required
          />
          <Input
            id="subdomain"
            label={"\u5b50\u7db2\u57df"}
            placeholder="my-brand"
            value={newSubdomain}
            onChange={(e) => setNewSubdomain(e.target.value)}
          />
          <p className="text-xs text-text-muted">
            {"\u4f60\u7684\u7db2\u7ad9\u5c07\u53ef\u900f\u904e"}{" "}
            <span className="font-mono text-text-secondary">
              {newSubdomain || "your-site"}.siteforge.tw
            </span>{" "}
            {"\u5b58\u53d6"}
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={() => setShowCreate(false)}>
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
