"use client";

import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { adminNavItems } from "@/lib/admin-nav";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-73px)] flex-1">
      <DashboardSidebar title="Admin Panel" items={adminNavItems} />
      <div className="flex-1 overflow-auto p-8">{children}</div>
    </div>
  );
}
