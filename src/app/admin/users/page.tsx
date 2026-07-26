"use client";

import { useCallback, useEffect, useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";

interface UserRow {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  isBlocked: boolean;
  isApproved: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [filter, setFilter] = useState("all");

  const load = useCallback(() => {
    fetch("/api/admin/users", { credentials: "include" })
      .then((r) => r.json())
      .then((d) =>
        setUsers(
          (d.users || []).map((u: UserRow) => ({
            ...u,
            _id: String(u._id),
          }))
        )
      );
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function updateUser(
    userId: string,
    patch: { isBlocked?: boolean; isApproved?: boolean }
  ) {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ userId, ...patch }),
    });
    load();
  }

  const filtered =
    filter === "all" ? users : users.filter((u) => u.role === filter);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <div className="flex items-center gap-2">
          <label htmlFor="user-role-filter" className="text-sm text-zinc-400">
            Filter by role
          </label>
          <select
            id="user-role-filter"
            className="rounded-lg px-3 py-2 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
          <option value="all">All roles</option>
          <option value="user">Customers</option>
          <option value="worker">Workers</option>
          <option value="contractor">Contractors</option>
          <option value="vendor">Vendors</option>
          <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      <DataTable
        data={filtered}
        emptyMessage="No users found."
        columns={[
          { key: "name", header: "Name", render: (u) => u.name },
          { key: "email", header: "Email", render: (u) => u.email },
          { key: "mobile", header: "Mobile", render: (u) => u.mobile },
          {
            key: "role",
            header: "Role",
            render: (u) => (
              <span className="capitalize text-accent">{u.role}</span>
            ),
          },
          {
            key: "status",
            header: "Status",
            render: (u) =>
              u.isBlocked ? (
                <StatusBadge status="cancelled" />
              ) : u.isApproved ? (
                <StatusBadge status="completed" />
              ) : (
                <StatusBadge status="pending" />
              ),
          },
          {
            key: "actions",
            header: "Actions",
            render: (u) =>
              u.role !== "admin" ? (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      updateUser(u._id, { isBlocked: !u.isBlocked })
                    }
                  >
                    {u.isBlocked ? "Unblock" : "Block"}
                  </Button>
                  {!u.isApproved && (
                    <Button
                      size="sm"
                      onClick={() =>
                        updateUser(u._id, { isApproved: true })
                      }
                    >
                      Approve
                    </Button>
                  )}
                </div>
              ) : (
                <span className="text-zinc-500">—</span>
              ),
          },
        ]}
      />
    </>
  );
}
