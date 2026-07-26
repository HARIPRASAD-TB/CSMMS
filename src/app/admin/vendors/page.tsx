"use client";

import { useCallback, useEffect, useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";

interface VendorRow {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  isBlocked: boolean;
  isApproved: boolean;
  productCount?: number;
}

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<VendorRow[]>([]);

  const load = useCallback(() => {
    Promise.all([
      fetch("/api/admin/users", { credentials: "include" }).then((r) =>
        r.json()
      ),
      fetch("/api/admin/products", { credentials: "include" }).then((r) =>
        r.json()
      ),
    ]).then(([usersData, productsData]) => {
      const products = productsData.products || [];
      const vendorUsers = (usersData.users || []).filter(
        (u: VendorRow) => u.role === "vendor"
      );
      setVendors(
        vendorUsers.map((v: VendorRow) => ({
          ...v,
          _id: String(v._id),
          productCount: products.filter(
            (p: { vendorId: string }) => p.vendorId === String(v._id)
          ).length,
        }))
      );
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function updateVendor(
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

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">Manage Vendors</h1>

      <DataTable
        data={vendors}
        emptyMessage="No vendors registered yet."
        columns={[
          { key: "name", header: "Business / Name", render: (v) => v.name },
          { key: "email", header: "Email", render: (v) => v.email },
          { key: "mobile", header: "Mobile", render: (v) => v.mobile },
          {
            key: "products",
            header: "Products",
            render: (v) => v.productCount ?? 0,
          },
          {
            key: "status",
            header: "Status",
            render: (v) =>
              v.isBlocked ? (
                <StatusBadge status="cancelled" />
              ) : v.isApproved ? (
                <StatusBadge status="completed" />
              ) : (
                <StatusBadge status="pending" />
              ),
          },
          {
            key: "actions",
            header: "Actions",
            render: (v) => (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    updateVendor(v._id, { isBlocked: !v.isBlocked })
                  }
                >
                  {v.isBlocked ? "Unblock" : "Block"}
                </Button>
                {!v.isApproved && (
                  <Button
                    size="sm"
                    onClick={() =>
                      updateVendor(v._id, { isApproved: true })
                    }
                  >
                    Approve
                  </Button>
                )}
              </div>
            ),
          },
        ]}
      />
    </>
  );
}
