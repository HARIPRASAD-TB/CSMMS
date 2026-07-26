"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StarRating } from "@/components/ui/StarRating";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";

export default function ProviderDashboardPage() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    active: 0,
    completed: 0,
    totalEarnings: 0,
    upcomingBookings: [] as Array<Record<string, unknown>>,
    recentReviews: [] as Array<{
      rating: number;
      comment: string;
      userId?: { name?: string };
    }>,
  });

  useEffect(() => {
    fetch("/api/provider/stats", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => d.stats && setStats(d.stats));
  }, []);

  const tiles = [
    { label: "Total Bookings", value: stats.totalBookings },
    { label: "Active", value: stats.active },
    { label: "Completed", value: stats.completed },
    {
      label: "Total Earnings",
      value: `₹${stats.totalEarnings.toLocaleString()}`,
    },
  ];

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Provider Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Overview of your bookings, earnings, and reviews
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/provider/bookings">
            <Button size="sm" variant="outline">
              Manage Bookings
            </Button>
          </Link>
          <Link href="/provider/earnings">
            <Button size="sm">View Earnings</Button>
          </Link>
        </div>
      </div>

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
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Upcoming Bookings</h3>
            <Link
              href="/provider/bookings"
              className="text-sm text-accent hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {stats.upcomingBookings.slice(0, 5).map((b, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-zinc-800 pb-3 last:border-0"
              >
                <div>
                  <p className="font-medium">{String(b.serviceType)}</p>
                  <p className="text-xs text-zinc-500">
                    {b.startDate
                      ? new Date(String(b.startDate)).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-accent">
                    ₹{Number(b.totalAmount || 0).toLocaleString()}
                  </p>
                  <StatusBadge status={String(b.status)} />
                </div>
              </div>
            ))}
            {!stats.upcomingBookings.length && (
              <p className="py-4 text-zinc-500">No upcoming bookings</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-surface p-6">
          <h3 className="mb-4 font-semibold">Recent Reviews</h3>
          <div className="space-y-4">
            {stats.recentReviews.map((r, i) => (
              <div key={i} className="border-b border-zinc-800 pb-3 last:border-0">
                <p className="font-medium">{r.userId?.name || "Customer"}</p>
                <StarRating rating={r.rating} size={14} />
                <p className="mt-1 text-sm text-zinc-400">{r.comment}</p>
              </div>
            ))}
            {!stats.recentReviews.length && (
              <p className="text-sm text-zinc-500">No reviews yet</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
