import {
  LayoutDashboard,
  Calendar,
  DollarSign,
  User,
} from "lucide-react";
import type { SidebarItem } from "@/components/layout/DashboardSidebar";

export const providerNavItems: SidebarItem[] = [
  { href: "/provider/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/provider/bookings", label: "Bookings", icon: Calendar },
  { href: "/provider/earnings", label: "Earnings", icon: DollarSign },
  { href: "/profile", label: "Profile", icon: User },
];
