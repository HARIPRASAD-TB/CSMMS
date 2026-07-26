"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { adminNavItems } from "@/lib/admin-nav";

const chartData = [
  { month: "Jan", bookings: 40, revenue: 240 },
  { month: "Feb", bookings: 55, revenue: 320 },
  { month: "Mar", bookings: 48, revenue: 280 },
  { month: "Apr", bookings: 70, revenue: 410 },
  { month: "May", bookings: 62, revenue: 380 },
  { month: "Jun", bookings: 85, revenue: 520 },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    totalVendors: 0,
    totalRevenue: 0,
    recentBookings: [] as Array<Record<string, unknown>>,
    recentOrders: [] as Array<Record<string, unknown>>,
  });

  useEffect(() => {
    fetch("/api/admin/stats", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => d.stats && setStats(d.stats));
  }, []);

  const tiles = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      color: "text-blue-400",
      href: "/admin/users",
    },
    {
      label: "Total Providers",
      value: stats.totalProviders,
      color: "text-purple-400",
      href: "/admin/providers",
    },
    {
      label: "Total Vendors",
      value: stats.totalVendors,
      color: "text-green-400",
      href: "/admin/vendors",
    },
    {
      label: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      color: "text-accent",
      href: "/admin/orders",
    },
  ];

  return (
    <>
      <h1 className="mb-8 text-2xl font-bold">Dashboard</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t) => (
          <Link
            key={t.label}
            href={t.href}
            className="rounded-xl border border-zinc-800 bg-surface p-6 transition hover:border-accent/40"
          >
            <p className="text-sm text-zinc-400">{t.label}</p>
            <p className={`mt-2 text-3xl font-bold ${t.color}`}>{t.value}</p>
          </Link>
        ))}
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-surface p-6">
          <h3 className="mb-4 font-semibold">Bookings Overview</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#333" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ background: "#1e1e1e" }} />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#facc15"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-surface p-6">
          <h3 className="mb-4 font-semibold">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid stroke="#333" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ background: "#1e1e1e" }} />
              <Bar dataKey="revenue" fill="#facc15" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-surface p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Recent Bookings</h3>
            <Link href="/admin/bookings" className="text-sm text-accent">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentBookings.map((b, i) => (
              <div
                key={i}
                className="flex justify-between border-b border-zinc-800 pb-2 text-sm"
              >
                <span>{String(b.serviceType || "Booking")}</span>
                <StatusBadge status={String(b.status || "pending")} />
              </div>
            ))}
            {!stats.recentBookings.length && (
              <p className="text-sm text-zinc-500">No bookings yet</p>
            )}
          </div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-surface p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Recent Orders</h3>
            <Link href="/admin/orders" className="text-sm text-accent">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentOrders.map((o, i) => (
              <div
                key={i}
                className="flex justify-between border-b border-zinc-800 pb-2 text-sm"
              >
                <span>₹{Number(o.total || 0).toLocaleString()}</span>
                <StatusBadge status={String(o.status || "processing")} />
              </div>
            ))}
            {!stats.recentOrders.length && (
              <p className="text-sm text-zinc-500">No orders yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-surface p-6">
        <h3 className="mb-4 font-semibold">Quick Links</h3>
        <div className="flex flex-wrap gap-3">
          {adminNavItems.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm transition hover:border-accent hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
