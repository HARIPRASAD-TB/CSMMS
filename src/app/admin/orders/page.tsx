"use client";

import { useCallback, useEffect, useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface OrderRow {
  _id: string;
  total: number;
  status: string;
  paymentMethod: string;
  deliveryAddress?: string;
  createdAt?: string;
  userId?: { name?: string; email?: string };
  items?: { name: string; quantity: number }[];
}

const statuses = [
  "processing",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [filter, setFilter] = useState("all");

  const load = useCallback(() => {
    fetch("/api/orders", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        const list = d.orders || [];
        setOrders(
          filter === "all"
            ? list
            : list.filter((o: OrderRow) => o.status === filter)
        );
      });
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(orderId: string, status: string) {
    await fetch(`/api/orders/${orderId}`, {
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
        <h1 className="text-2xl font-bold">Manage Orders</h1>
        <div className="flex items-center gap-2">
          <label htmlFor="order-status-filter" className="text-sm text-zinc-400">
            Filter by status
          </label>
          <select
            id="order-status-filter"
            className="rounded-lg px-3 py-2 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
          <option value="all">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
          </select>
        </div>
      </div>

      <DataTable
        data={orders}
        emptyMessage="No orders found."
        columns={[
          {
            key: "customer",
            header: "Customer",
            render: (o) => o.userId?.name || o.userId?.email || "—",
          },
          {
            key: "items",
            header: "Items",
            render: (o) =>
              o.items?.map((i) => `${i.name} ×${i.quantity}`).join(", ") ||
              "—",
          },
          {
            key: "total",
            header: "Total",
            render: (o) => `₹${o.total?.toLocaleString()}`,
          },
          {
            key: "payment",
            header: "Payment",
            render: (o) => (
              <span className="uppercase">{o.paymentMethod}</span>
            ),
          },
          {
            key: "status",
            header: "Status",
            render: (o) => <StatusBadge status={o.status} />,
          },
          {
            key: "date",
            header: "Date",
            render: (o) =>
              o.createdAt
                ? new Date(o.createdAt).toLocaleDateString()
                : "—",
          },
          {
            key: "actions",
            header: "Update Status",
            render: (o) => (
              <select
                className="rounded-lg px-2 py-1 text-xs"
                value={o.status}
                aria-label={`Update status for order ${o._id}`}
                onChange={(e) => updateStatus(o._id, e.target.value)}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
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
