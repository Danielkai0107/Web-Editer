"use client";

import { Shell } from "@/components/layout/shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { useEffect, useState, useCallback } from "react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<(Profile & { site_count: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (profiles) {
      const withCounts = await Promise.all(
        profiles.map(async (p) => {
          const { count } = await supabase
            .from("sites")
            .select("*", { count: "exact", head: true })
            .eq("user_id", p.id);
          return { ...p, site_count: count || 0 };
        })
      );
      setUsers(withCounts);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function handlePlanChange(userId: string, newPlan: string) {
    const { error } = await supabase
      .from("profiles")
      .update({ plan: newPlan })
      .eq("id", userId);
    if (error) {
      toast(error.message, "error");
      return;
    }
    toast("\u65b9\u6848\u5df2\u66f4\u65b0", "success");
    fetchUsers();
  }

  const planBadgeVariant = (plan: string) => {
    if (plan === "pro") return "gold" as const;
    if (plan === "basic") return "accent" as const;
    return "default" as const;
  };

  return (
    <Shell title={"\u7528\u6236\u7ba1\u7406"} variant="admin">
      <div className="mb-6">
        <h2 className="text-xl font-bold">{"\u7528\u6236\u7ba1\u7406"}</h2>
        <p className="text-sm text-text-secondary mt-1">
          {"\u67e5\u770b\u8207\u7ba1\u7406\u6240\u6709\u7528\u6236"}
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse h-16" />
          ))}
        </div>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-base">
                  <th className="text-left font-medium text-text-muted px-4 py-3">Email</th>
                  <th className="text-left font-medium text-text-muted px-4 py-3">{"\u65b9\u6848"}</th>
                  <th className="text-left font-medium text-text-muted px-4 py-3">{"\u89d2\u8272"}</th>
                  <th className="text-left font-medium text-text-muted px-4 py-3">{"\u7ad9\u53f0\u6578"}</th>
                  <th className="text-left font-medium text-text-muted px-4 py-3">{"\u8a3b\u518a\u6642\u9593"}</th>
                  <th className="text-left font-medium text-text-muted px-4 py-3">{"\u64cd\u4f5c"}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium">{u.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={planBadgeVariant(u.plan)}>
                        {u.plan.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={u.role === "admin" ? "danger" : "default"}>
                        {u.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-mono">{u.site_count}</td>
                    <td className="px-4 py-3 text-text-muted">{formatDate(u.created_at)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={u.plan}
                        onChange={(e) => handlePlanChange(u.id, e.target.value)}
                        className="h-8 rounded-[var(--radius-input)] border bg-bg-card px-2 text-xs focus:outline-none focus:ring-2 focus:ring-accent/30"
                      >
                        <option value="free">Free</option>
                        <option value="basic">Basic</option>
                        <option value="pro">Pro</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </Shell>
  );
}
