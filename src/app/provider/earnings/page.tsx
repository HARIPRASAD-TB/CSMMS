"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DataTable } from "@/components/admin/DataTable";

interface EarningsData {
  totalEarnings: number;
  pendingEarnings: number;
  thisMonthEarnings: number;
  completedCount: number;
  monthlyChart: Array<{ month: string; amount: number }>;
  recentEarnings: Array<{
    _id: string;
    serviceType: string;
    startDate: string;
    totalAmount: number;
    userId?: { name?: string };
  }>;
}

export default function ProviderEarningsPage() {
  const [earnings, setEarnings] = useState<EarningsData | null>(null);

  useEffect(() => {
    fetch("/api/provider/earnings", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => d.earnings && setEarnings(d.earnings));
  }, []);

  if (!earnings) {
    return <p className="text-zinc-500">Loading earnings...</p>;
  }

  const tiles = [
    {
      label: "Total Earnings",
      value: `₹${earnings.totalEarnings.toLocaleString()}`,
      hint: "From completed bookings",
    },
    {
      label: "This Month",
      value: `₹${earnings.thisMonthEarnings.toLocaleString()}`,
      hint: "Completed this month",
    },
    {
      label: "Pending",
      value: `₹${earnings.pendingEarnings.toLocaleString()}`,
      hint: "Confirmed & in progress",
    },
    {
      label: "Completed Jobs",
      value: String(earnings.completedCount),
      hint: "Total finished bookings",
    },
  ];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Earnings</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Track your income from completed and active bookings
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t) => (
          <div
            key={t.label}
            className="rounded-xl border border-zinc-800 bg-surface p-6"
          >
            <p className="text-sm text-zinc-400">{t.label}</p>
            <p className="mt-2 text-2xl font-bold text-accent">{t.value}</p>
            <p className="mt-1 text-xs text-zinc-500">{t.hint}</p>
          </div>
        ))}
      </div>

      <div className="mb-8 rounded-xl border border-zinc-800 bg-surface p-6">
        <h3 className="mb-4 font-semibold">Earnings Trend (Last 6 Months)</h3>
        {earnings.monthlyChart.some((m) => m.amount > 0) ? (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={earnings.monthlyChart}>
              <CartesianGrid stroke="#333" />
              <XAxis dataKey="month" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip
                contentStyle={{ background: "#1e1e1e", border: "1px solid #333" }}
                formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Earnings"]}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#facc15"
                strokeWidth={2}
                dot={{ fill: "#facc15" }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="py-8 text-center text-zinc-500">
            No completed bookings yet. Earnings will appear here once jobs are
            marked completed.
          </p>
        )}
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Recent Completed Earnings</h3>
        <DataTable
          data={earnings.recentEarnings}
          emptyMessage="No completed bookings with earnings yet."
          columns={[
            {
              key: "customer",
              header: "Customer",
              render: (b) => b.userId?.name || "Customer",
            },
            {
              key: "service",
              header: "Service",
              render: (b) => b.serviceType,
            },
            {
              key: "date",
              header: "Date",
              render: (b) =>
                b.startDate
                  ? new Date(b.startDate).toLocaleDateString()
                  : "—",
            },
            {
              key: "amount",
              header: "Earned",
              render: (b) => (
                <span className="font-semibold text-accent">
                  ₹{b.totalAmount?.toLocaleString()}
                </span>
              ),
            },
          ]}
        />
      </div>
    </>
  );
}
