"use client";

import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { StatusBadge } from "@/components/ui/StatusBadge";

const sidebarItems = [
  { href: "/vendor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vendor/dashboard", label: "Products", icon: Package },
  { href: "/vendor/dashboard", label: "Orders", icon: ShoppingBag },
  { href: "/vendor/dashboard", label: "Sales", icon: TrendingUp },
];

const salesData = [
  { month: "Jan", sales: 45 },
  { month: "Feb", sales: 62 },
  { month: "Mar", sales: 58 },
  { month: "Apr", sales: 78 },
  { month: "May", sales: 85 },
  { month: "Jun", sales: 95 },
];

export default function VendorDashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    totalRevenue: 0,
    recentOrders: [] as Array<Record<string, unknown>>,
    topProducts: [] as Array<{ name: string; reviewCount: number }>,
  });

  useEffect(() => {
    fetch("/api/vendor/stats")
      .then((r) => r.json())
      .then((d) => d.stats && setStats(d.stats));
  }, []);

  const tiles = [
    { label: "Total Products", value: stats.totalProducts },
    { label: "Total Orders", value: stats.totalOrders },
    { label: "Total Sales", value: stats.totalSales },
    {
      label: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
    },
  ];

  return (
    <div className="flex flex-1">
      <DashboardSidebar title="Vendor Panel" items={sidebarItems} />
      <div className="flex-1 p-8">
        <h1 className="mb-8 text-2xl font-bold">Vendor Dashboard</h1>
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((t) => (
            <div
              key={t.label}
              className="rounded-xl border border-zinc-800 bg-surface p-6"
            >
              <p className="text-sm text-zinc-400">{t.label}</p>
              <p className="mt-2 text-2xl font-bold text-accent">{t.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-surface p-6">
            <h3 className="mb-4 font-semibold">Recent Orders</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-700 text-left text-zinc-400">
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((o, i) => (
                    <tr key={i} className="border-b border-zinc-800">
                      <td className="py-3">
                        ₹{Number(o.total || 0).toLocaleString()}
                      </td>
                      <td>
                        {o.createdAt
                          ? new Date(String(o.createdAt)).toLocaleDateString()
                          : "—"}
                      </td>
                      <td>
                        <StatusBadge status={String(o.status || "processing")} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-zinc-800 bg-surface p-6">
              <h3 className="mb-4 font-semibold">Sales Overview</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={salesData}>
                  <CartesianGrid stroke="#333" />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip contentStyle={{ background: "#1e1e1e" }} />
                  <Bar dataKey="sales" fill="#facc15" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-surface p-6">
              <h3 className="mb-4 font-semibold">Top Selling Products</h3>
              <ul className="space-y-2">
                {stats.topProducts.map((p, i) => (
                  <li
                    key={i}
                    className="flex justify-between border-b border-zinc-800 py-2 text-sm"
                  >
                    <span>{p.name}</span>
                    <span className="text-zinc-500">{p.reviewCount} reviews</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
