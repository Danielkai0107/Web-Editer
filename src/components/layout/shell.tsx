"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Sidebar, MobileDrawer } from "./sidebar";
import { Topbar } from "./topbar";

interface ShellProps {
  title: string;
  children: React.ReactNode;
  variant?: "dashboard" | "admin";
}

export function Shell({ title, children, variant = "dashboard" }: ShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <div className="hidden lg:block">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} variant={variant} />
      </div>

      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} variant={variant} />

      <Topbar
        title={title}
        sidebarCollapsed={collapsed}
        onMenuClick={() => setMobileOpen(true)}
      />

      <main
        className={cn(
          "pt-[var(--spacing-topbar)] min-h-screen transition-all duration-200",
          "max-lg:ml-0",
          collapsed
            ? "lg:ml-[var(--spacing-sidebar-collapsed)]"
            : "lg:ml-[var(--spacing-sidebar)]"
        )}
      >
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
