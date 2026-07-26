"use client";

import { useCallback, useEffect, useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface BookingRow {
  _id: string;
  serviceType: string;
  startDate: string;
  duration?: string;
  totalAmount: number;
  status: string;
  instructions?: string;
  userId?: { name?: string; email?: string };
}

const statuses = [
  "pending",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
];

export default function ProviderBookingsPage() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [filter, setFilter] = useState("all");

  const load = useCallback(() => {
    const q = filter === "all" ? "" : `?status=${filter}`;
    fetch(`/api/bookings${q}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setBookings(d.bookings || []));
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(bookingId: string, status: string) {
    const res = await fetch(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    if (res.ok) load();
    else alert("Failed to update booking status");
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manage Bookings</h1>
          <p className="mt-1 text-sm text-zinc-400">
            View and update booking requests from customers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label
            htmlFor="provider-booking-filter"
            className="text-sm text-zinc-400"
          >
            Filter by status
          </label>
          <select
            id="provider-booking-filter"
            className="rounded-lg px-3 py-2 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DataTable
        data={bookings}
        emptyMessage="No bookings yet. New customer requests will appear here."
        columns={[
          {
            key: "customer",
            header: "Customer",
            render: (b) => b.userId?.name || b.userId?.email || "—",
          },
          {
            key: "service",
            header: "Service",
            render: (b) => b.serviceType,
          },
          {
            key: "date",
            header: "Start Date",
            render: (b) =>
              b.startDate
                ? new Date(b.startDate).toLocaleDateString()
                : "—",
          },
          {
            key: "duration",
            header: "Duration",
            render: (b) => b.duration || "—",
          },
          {
            key: "amount",
            header: "Amount",
            render: (b) => `₹${b.totalAmount?.toLocaleString()}`,
          },
          {
            key: "status",
            header: "Status",
            render: (b) => <StatusBadge status={b.status} />,
          },
          {
            key: "actions",
            header: "Update Status",
            render: (b) => (
              <select
                className="rounded-lg px-2 py-1 text-xs"
                value={b.status}
                aria-label={`Update status for booking ${b._id}`}
                onChange={(e) => updateStatus(b._id, e.target.value)}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            ),
          },
        ]}
      />
    </>
  );
}
