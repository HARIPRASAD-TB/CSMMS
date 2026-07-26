"use client";

import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { providerNavItems } from "@/lib/provider-nav";

export function ProviderShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-73px)] flex-1">
      <DashboardSidebar title="Provider Panel" items={providerNavItems} />
      <div className="flex-1 overflow-auto p-8">{children}</div>
    </div>
  );
}
