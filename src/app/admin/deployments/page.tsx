"use client";

import { Shell } from "@/components/layout/shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import type { Deployment } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { ExternalLink, AlertCircle } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

interface DeploymentWithSite extends Deployment {
  sites: { name: string; subdomain: string } | null;
}

export default function AdminDeploymentsPage() {
  const [deployments, setDeployments] = useState<DeploymentWithSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedError, setExpandedError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchDeployments = useCallback(async () => {
    const { data } = await supabase
      .from("deployments")
      .select("*, sites(name, subdomain)")
      .order("created_at", { ascending: false })
      .limit(50);
    setDeployments((data as DeploymentWithSite[]) || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchDeployments();
  }, [fetchDeployments]);

  const statusVariant = (status: string) => {
    switch (status) {
      case "success":
        return "success" as const;
      case "failed":
        return "danger" as const;
      case "building":
        return "accent" as const;
      default:
        return "default" as const;
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case "success":
        return "\u6210\u529f";
      case "failed":
        return "\u5931\u6557";
      case "building":
        return "\u5efa\u7f6e\u4e2d";
      default:
        return "\u7b49\u5f85\u4e2d";
    }
  };

  return (
    <Shell title={"\u90e8\u7f72\u7d00\u9304"} variant="admin">
      <div className="mb-6">
        <h2 className="text-xl font-bold">{"\u90e8\u7f72\u7d00\u9304"}</h2>
        <p className="text-sm text-text-secondary mt-1">
          {"\u67e5\u770b\u6240\u6709\u7ad9\u53f0\u7684\u90e8\u7f72\u72c0\u614b"}
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse h-16" />
          ))}
        </div>
      ) : deployments.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-text-secondary">{"\u9084\u6c92\u6709\u90e8\u7f72\u7d00\u9304"}</p>
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-base">
                  <th className="text-left font-medium text-text-muted px-4 py-3">{"\u7ad9\u53f0"}</th>
                  <th className="text-left font-medium text-text-muted px-4 py-3">{"\u72c0\u614b"}</th>
                  <th className="text-left font-medium text-text-muted px-4 py-3">{"\u9023\u7d50"}</th>
                  <th className="text-left font-medium text-text-muted px-4 py-3">{"\u6642\u9593"}</th>
                  <th className="text-left font-medium text-text-muted px-4 py-3">{"\u932f\u8aa4"}</th>
                </tr>
              </thead>
              <tbody>
                {deployments.map((d) => (
                  <tr key={d.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium">{d.sites?.name || "-"}</p>
                      <p className="text-xs text-text-muted">{d.sites?.subdomain || "-"}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant(d.status)}>{statusLabel(d.status)}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      {d.preview_url ? (
                        <a
                          href={d.preview_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-accent hover:underline text-xs"
                        >
                          {"\u67e5\u770b"} <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-text-muted text-xs">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-text-muted text-xs">
                      {formatDate(d.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      {d.error_log ? (
                        <button
                          onClick={() =>
                            setExpandedError(expandedError === d.id ? null : d.id)
                          }
                          className="inline-flex items-center gap-1 text-danger text-xs hover:underline"
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                          {"\u67e5\u770b\u932f\u8aa4"}
                        </button>
                      ) : (
                        <span className="text-text-muted text-xs">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {expandedError && (
        <Card className="mt-4 bg-danger-bg border-danger/20">
          <div className="flex items-start justify-between mb-2">
            <p className="text-sm font-semibold text-danger">{"\u932f\u8aa4\u8a73\u60c5"}</p>
            <button
              onClick={() => setExpandedError(null)}
              className="text-xs text-text-muted hover:text-text-primary"
            >
              {"\u95dc\u9589"}
            </button>
          </div>
          <pre className="text-xs text-danger font-mono whitespace-pre-wrap break-all">
            {deployments.find((d) => d.id === expandedError)?.error_log}
          </pre>
        </Card>
      )}
    </Shell>
  );
}
