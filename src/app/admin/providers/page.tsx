"use client";

import { useCallback, useEffect, useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";

interface ProviderRow {
  _id: string;
  title: string;
  type: string;
  location: string;
  workerType?: string;
  pricePerDay?: number;
  pricePerSqFt?: number;
  isApproved: boolean;
  isVerified: boolean;
  user?: { name: string; email: string };
}

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<ProviderRow[]>([]);
  const [filter, setFilter] = useState("all");

  const load = useCallback(() => {
    fetch("/api/admin/providers", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setProviders(d.providers || []));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function updateProvider(
    providerId: string,
    patch: { isApproved?: boolean; isVerified?: boolean }
  ) {
    await fetch("/api/admin/providers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ providerId, ...patch }),
    });
    load();
  }

  const filtered =
    filter === "all"
      ? providers
      : providers.filter((p) => p.type === filter);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Manage Providers</h1>
        <div className="flex items-center gap-2">
          <label htmlFor="provider-type-filter" className="text-sm text-zinc-400">
            Filter by type
          </label>
          <select
            id="provider-type-filter"
            className="rounded-lg px-3 py-2 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All types</option>
            <option value="worker">Workers</option>
            <option value="contractor">Contractors</option>
          </select>
        </div>
      </div>

      <DataTable
        data={filtered}
        emptyMessage="No providers found."
        columns={[
          { key: "title", header: "Title", render: (p) => p.title },
          {
            key: "owner",
            header: "Owner",
            render: (p) => p.user?.name || "—",
          },
          {
            key: "type",
            header: "Type",
            render: (p) => (
              <span className="capitalize">
                {p.type}
                {p.workerType ? ` · ${p.workerType}` : ""}
              </span>
            ),
          },
          { key: "location", header: "Location", render: (p) => p.location },
          {
            key: "price",
            header: "Price",
            render: (p) =>
              p.pricePerDay
                ? `₹${p.pricePerDay}/day`
                : p.pricePerSqFt
                  ? `₹${p.pricePerSqFt}/sq.ft`
                  : "—",
          },
          {
            key: "status",
            header: "Status",
            render: (p) => (
              <div className="flex flex-col gap-1">
                <StatusBadge status={p.isApproved ? "completed" : "pending"} />
                {p.isVerified && (
                  <span className="text-xs text-accent">Verified</span>
                )}
              </div>
            ),
          },
          {
            key: "actions",
            header: "Actions",
            render: (p) => (
              <div className="flex flex-wrap gap-2">
                {!p.isApproved && (
                  <Button
                    size="sm"
                    onClick={() =>
                      updateProvider(p._id, { isApproved: true })
                    }
                  >
                    Approve
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    updateProvider(p._id, { isVerified: !p.isVerified })
                  }
                >
                  {p.isVerified ? "Unverify" : "Verify"}
                </Button>
              </div>
            ),
          },
        ]}
      />
    </>
  );
}
