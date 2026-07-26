"use client";

import { useCallback, useEffect, useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
interface BookingRow {
  _id: string;
  serviceType: string;
  startDate: string;
  totalAmount: number;
  status: string;
  userId?: { name?: string; email?: string };
  providerId?: { title?: string };
}

const statuses = [
  "pending",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
];

export default function AdminBookingsPage() {
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
    await fetch(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    load();
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Manage Bookings</h1>
        <div className="flex items-center gap-2">
          <label htmlFor="booking-status-filter" className="text-sm text-zinc-400">
            Filter by status
          </label>
          <select
            id="booking-status-filter"
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
        emptyMessage="No bookings found."
        columns={[
          {
            key: "customer",
            header: "Customer",
            render: (b) => b.userId?.name || b.userId?.email || "—",
          },
          {
            key: "provider",
            header: "Provider",
            render: (b) => b.providerId?.title || "—",
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
