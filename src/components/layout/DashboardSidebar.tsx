"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HardHat, LucideIcon } from "lucide-react";

export interface SidebarItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface DashboardSidebarProps {
  title: string;
  items: SidebarItem[];
}

export function DashboardSidebar({ title, items }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-zinc-800 bg-surface p-4">
      <div className="mb-8 flex items-center gap-2 px-2 font-bold">
        <HardHat className="h-6 w-6 text-accent" />
        {title}
      </div>
      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                active
                  ? "bg-accent/15 text-accent"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
