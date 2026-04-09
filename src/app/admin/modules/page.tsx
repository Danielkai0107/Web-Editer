"use client";

import { Shell } from "@/components/layout/shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import type { Module } from "@/lib/types";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

const CATEGORIES = [
  { value: "navbar", label: "\u5c0e\u822a\u5217" },
  { value: "hero", label: "Hero" },
  { value: "feature", label: "Feature" },
  { value: "gallery", label: "Gallery" },
  { value: "cta", label: "CTA" },
  { value: "footer", label: "Footer" },
  { value: "other", label: "\u5176\u4ed6" },
];

export default function AdminModulesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Module | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "hero",
    html: "",
    css: "",
    js: "",
  });

  const supabase = createClient();
  const { toast } = useToast();

  const fetchModules = useCallback(async () => {
    const { data } = await supabase
      .from("modules")
      .select("*")
      .order("created_at", { ascending: false });
    setModules(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  function openCreate() {
    setEditing(null);
    setForm({ name: "", category: "hero", html: "", css: "", js: "" });
    setShowForm(true);
  }

  function openEdit(mod: Module) {
    setEditing(mod);
    setForm({
      name: mod.name,
      category: mod.category,
      html: mod.html,
      css: mod.css,
      js: mod.js,
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    if (editing) {
      const { error } = await supabase
        .from("modules")
        .update(form)
        .eq("id", editing.id);
      if (error) {
        toast(error.message, "error");
      } else {
        toast("\u6a21\u7d44\u5df2\u66f4\u65b0", "success");
      }
    } else {
      const { error } = await supabase.from("modules").insert(form);
      if (error) {
        toast(error.message, "error");
      } else {
        toast("\u6a21\u7d44\u5df2\u5efa\u7acb", "success");
      }
    }

    setSaving(false);
    setShowForm(false);
    fetchModules();
  }

  async function toggleActive(mod: Module) {
    const { error } = await supabase
      .from("modules")
      .update({ is_active: !mod.is_active })
      .eq("id", mod.id);
    if (error) {
      toast(error.message, "error");
      return;
    }
    toast(mod.is_active ? "\u5df2\u505c\u7528" : "\u5df2\u555f\u7528", "success");
    fetchModules();
  }

  async function handleDelete(id: string) {
    if (!confirm("\u78ba\u5b9a\u8981\u522a\u9664\u9019\u500b\u6a21\u7d44\u55ce\uff1f")) return;
    const { error } = await supabase.from("modules").delete().eq("id", id);
    if (error) {
      toast(error.message, "error");
      return;
    }
    toast("\u6a21\u7d44\u5df2\u522a\u9664", "success");
    fetchModules();
  }

  return (
    <Shell title={"\u6a21\u7d44\u7ba1\u7406"} variant="admin">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">{"\u6a21\u7d44\u7ba1\u7406"}</h2>
          <p className="text-sm text-text-secondary mt-1">
            {"\u7ba1\u7406 Section Library \u4e2d\u7684\u6240\u6709\u6a21\u7d44"}
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" />
          {"\u65b0\u589e\u6a21\u7d44"}
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse h-20" />
          ))}
        </div>
      ) : modules.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-text-secondary">{"\u9084\u6c92\u6709\u6a21\u7d44"}</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {modules.map((mod) => (
            <Card key={mod.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{mod.name}</p>
                    <Badge>{mod.category}</Badge>
                    <Badge variant={mod.is_active ? "success" : "default"}>
                      {mod.is_active ? "\u555f\u7528" : "\u505c\u7528"}
                    </Badge>
                  </div>
                  <p className="text-xs text-text-muted mt-1">
                    HTML: {mod.html.length} chars &middot; CSS: {mod.css.length} chars
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleActive(mod)}
                  className="p-2 rounded-lg hover:bg-bg-card-elevated transition-colors"
                  title={mod.is_active ? "\u505c\u7528" : "\u555f\u7528"}
                >
                  {mod.is_active ? (
                    <ToggleRight className="w-5 h-5 text-success" />
                  ) : (
                    <ToggleLeft className="w-5 h-5 text-text-muted" />
                  )}
                </button>
                <button
                  onClick={() => openEdit(mod)}
                  className="p-2 rounded-lg hover:bg-bg-card-elevated transition-colors"
                >
                  <Pencil className="w-4 h-4 text-text-secondary" />
                </button>
                <button
                  onClick={() => handleDelete(mod.id)}
                  className="p-2 rounded-lg hover:bg-danger-bg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-danger" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editing ? "\u7de8\u8f2f\u6a21\u7d44" : "\u65b0\u589e\u6a21\u7d44"}
        className="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="modName"
              label={"\u6a21\u7d44\u540d\u7a31"}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="modCategory" className="text-sm font-medium text-text-primary">
                {"\u5206\u985e"}
              </label>
              <select
                id="modCategory"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="h-10 rounded-[var(--radius-input)] border bg-bg-card px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/30"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">HTML</label>
            <textarea
              value={form.html}
              onChange={(e) => setForm({ ...form, html: e.target.value })}
              rows={6}
              className="w-full rounded-[var(--radius-input)] border bg-bg-card px-3 py-2 text-sm font-mono text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/30 resize-y"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">CSS</label>
            <textarea
              value={form.css}
              onChange={(e) => setForm({ ...form, css: e.target.value })}
              rows={4}
              className="w-full rounded-[var(--radius-input)] border bg-bg-card px-3 py-2 text-sm font-mono text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/30 resize-y"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">JS</label>
            <textarea
              value={form.js}
              onChange={(e) => setForm({ ...form, js: e.target.value })}
              rows={3}
              className="w-full rounded-[var(--radius-input)] border bg-bg-card px-3 py-2 text-sm font-mono text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/30 resize-y"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={() => setShowForm(false)}>
              {"\u53d6\u6d88"}
            </Button>
            <Button type="submit" loading={saving}>
              {editing ? "\u66f4\u65b0" : "\u5efa\u7acb"}
            </Button>
          </div>
        </form>
      </Modal>
    </Shell>
  );
}
