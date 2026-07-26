import {
  LayoutDashboard,
  Users,
  Wrench,
  Store,
  Package,
  Calendar,
  ShoppingBag,
} from "lucide-react";
import type { SidebarItem } from "@/components/layout/DashboardSidebar";

export const adminNavItems: SidebarItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/providers", label: "Providers", icon: Wrench },
  { href: "/admin/vendors", label: "Vendors", icon: Store },
  { href: "/admin/materials", label: "Materials", icon: Package },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
];
