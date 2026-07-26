"use client";

import { useCallback, useEffect, useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";

interface ProductRow {
  _id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  stock: number;
  isApproved: boolean;
  vendor?: { name: string };
}

export default function AdminMaterialsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);

  const load = useCallback(() => {
    fetch("/api/admin/products", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleApprove(productId: string, isApproved: boolean) {
    await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ productId, isApproved }),
    });
    load();
  }

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">Manage Materials</h1>

      <DataTable
        data={products}
        emptyMessage="No products listed."
        columns={[
          { key: "name", header: "Product", render: (p) => p.name },
          { key: "category", header: "Category", render: (p) => p.category },
          {
            key: "vendor",
            header: "Vendor",
            render: (p) => p.vendor?.name || "—",
          },
          {
            key: "price",
            header: "Price",
            render: (p) => `₹${p.price.toLocaleString()}/${p.unit}`,
          },
          { key: "stock", header: "Stock", render: (p) => p.stock },
          {
            key: "status",
            header: "Status",
            render: (p) => (
              <StatusBadge status={p.isApproved ? "completed" : "pending"} />
            ),
          },
          {
            key: "actions",
            header: "Actions",
            render: (p) => (
              <Button
                size="sm"
                variant={p.isApproved ? "outline" : "primary"}
                onClick={() => toggleApprove(p._id, !p.isApproved)}
              >
                {p.isApproved ? "Unlist" : "Approve"}
              </Button>
            ),
          },
        ]}
      />
    </>
  );
}
