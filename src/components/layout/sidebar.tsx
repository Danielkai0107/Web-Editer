"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Image,
  CreditCard,
  LogOut,
  ChevronLeft,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface NavGroup {
  title?: string;
  items: NavItem[];
}

const dashboardNav: NavGroup[] = [
  {
    items: [
      { label: "\u7ad9\u53f0\u7ba1\u7406", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
      { label: "\u5a92\u9ad4\u5eab", href: "/dashboard/media", icon: <Image className="w-5 h-5" /> },
    ],
  },
  {
    title: "\u5e33\u6236",
    items: [
      { label: "\u65b9\u6848\u8207\u5e33\u55ae", href: "/dashboard/billing", icon: <CreditCard className="w-5 h-5" /> },
    ],
  },
];

const adminNav: NavGroup[] = [
  {
    items: [
      { label: "\u6a21\u7d44\u7ba1\u7406", href: "/admin/modules", icon: <FileText className="w-5 h-5" /> },
      { label: "\u7528\u6236\u7ba1\u7406", href: "/admin/users", icon: <Users className="w-5 h-5" /> },
      { label: "\u90e8\u7f72\u7d00\u9304", href: "/admin/deployments", icon: <Shield className="w-5 h-5" /> },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  variant?: "dashboard" | "admin";
}

export function Sidebar({ collapsed, onToggle, variant = "dashboard" }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const navGroups = variant === "admin" ? adminNav : dashboardNav;
  const [email, setEmail] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setEmail(user?.email ?? null);
    });
  }, [supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-bg-card border-r border-border transition-all duration-200",
        collapsed ? "w-[var(--spacing-sidebar-collapsed)]" : "w-[var(--spacing-sidebar)]"
      )}
    >
      <div className="flex items-center gap-3 px-5 h-[var(--spacing-topbar)] border-b border-border shrink-0">
        <div className="w-8 h-8 rounded-[var(--radius-input)] bg-accent flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">SF</span>
        </div>
        {!collapsed && <span className="font-semibold text-text-primary text-sm">SiteForge</span>}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navGroups.map((group, gi) => (
          <div key={gi} className="mb-4">
            {group.title && !collapsed && (
              <p className="px-3 mb-2 text-xs font-medium text-text-muted uppercase tracking-wider">
                {group.title}
              </p>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-input)] text-sm transition-colors relative",
                        isActive
                          ? "bg-bg-card-elevated text-accent font-medium"
                          : "text-text-secondary hover:bg-bg-card-elevated hover:text-text-primary"
                      )}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-accent rounded-r-full" />
                      )}
                      {item.icon}
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-3 space-y-1">
        {!collapsed && email && (
          <div className="px-3 py-2">
            <p className="text-xs text-text-muted truncate">{email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-[var(--radius-input)] text-sm text-danger hover:bg-danger-bg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>{"\u767b\u51fa"}</span>}
        </button>
        <button
          onClick={onToggle}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-[var(--radius-input)] text-sm text-text-secondary hover:bg-bg-card-elevated transition-colors"
        >
          <ChevronLeft className={cn("w-5 h-5 transition-transform", collapsed && "rotate-180")} />
          {!collapsed && <span>{"\u6536\u5408"}</span>}
        </button>
      </div>
    </aside>
  );
}

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  variant?: "dashboard" | "admin";
}

export function MobileDrawer({ open, onClose, variant = "dashboard" }: MobileDrawerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const navGroups = variant === "admin" ? adminNav : dashboardNav;
  const [email, setEmail] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setEmail(user?.email ?? null);
    });
  }, [supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <aside
        className="absolute left-0 top-0 bottom-0 w-[var(--spacing-sidebar)] bg-bg-card border-r"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-5 h-[var(--spacing-topbar)] border-b shrink-0">
          <div className="w-8 h-8 rounded-[var(--radius-input)] bg-accent flex items-center justify-center">
            <span className="text-white font-bold text-sm">SF</span>
          </div>
          <span className="font-semibold text-text-primary text-sm">SiteForge</span>
        </div>
        <nav className="py-4 px-3">
          {navGroups.map((group, gi) => (
            <div key={gi} className="mb-4">
              {group.title && (
                <p className="px-3 mb-2 text-xs font-medium text-text-muted uppercase tracking-wider">
                  {group.title}
                </p>
              )}
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-input)] text-sm transition-colors relative",
                          isActive
                            ? "bg-bg-card-elevated text-accent font-medium"
                            : "text-text-secondary hover:bg-bg-card-elevated hover:text-text-primary"
                        )}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-accent rounded-r-full" />
                        )}
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t p-3 space-y-1">
          {email && (
            <div className="px-3 py-2">
              <p className="text-xs text-text-muted truncate">{email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-[var(--radius-input)] text-sm text-danger hover:bg-danger-bg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>{"\u767b\u51fa"}</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
