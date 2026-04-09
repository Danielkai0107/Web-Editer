"use client";

import { cn } from "@/lib/utils";
import { Menu, Shield } from "lucide-react";

interface TopbarProps {
  title: string;
  sidebarCollapsed: boolean;
  onMenuClick: () => void;
}

export function Topbar({ title, sidebarCollapsed, onMenuClick }: TopbarProps) {
  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-[var(--spacing-topbar)] bg-bg-card/80 backdrop-blur-sm border-b border-border flex items-center px-4 transition-all duration-200",
        "max-lg:left-0",
        sidebarCollapsed
          ? "lg:left-[var(--spacing-sidebar-collapsed)]"
          : "lg:left-[var(--spacing-sidebar)]"
      )}
    >
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-[var(--radius-input)] hover:bg-bg-card-elevated transition-colors mr-2"
      >
        <Menu className="w-5 h-5 text-text-secondary" />
      </button>

      <h1 className="text-sm font-semibold text-text-primary truncate">{title}</h1>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success-bg text-xs font-medium text-emerald-700">
          <Shield className="w-3.5 h-3.5" />
          <span>\u5b89\u5168\u9023\u7dda</span>
        </div>
      </div>
    </header>
  );
}
