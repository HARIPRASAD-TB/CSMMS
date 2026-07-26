"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";

interface ProductFormData {
  name: string;
  category: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  image: string;
  features: string;
}

const empty: ProductFormData = {
  name: "",
  category: "Cement",
  description: "",
  price: 0,
  unit: "unit",
  stock: 0,
  image: "",
  features: "",
};

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  editId?: string;
  initial?: {
    name?: string;
    category?: string;
    description?: string;
    price?: number;
    unit?: string;
    stock?: number;
    image?: string;
    features?: string[] | string;
  };
}

const inputClass = "w-full rounded-lg px-4 py-2.5";

export function ProductFormModal({
  open,
  onClose,
  onSaved,
  editId,
  initial,
}: ProductFormModalProps) {
  const [form, setForm] = useState<ProductFormData>(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && initial) {
      setForm({
        name: initial.name || "",
        category: initial.category || "Cement",
        description: initial.description || "",
        price: initial.price || 0,
        unit: initial.unit || "unit",
        stock: initial.stock || 0,
        image: initial.image || "",
        features: Array.isArray(initial.features)
          ? initial.features.join(", ")
          : initial.features || "",
      });
    } else if (open && !editId) {
      setForm(empty);
    }
  }, [open, initial, editId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = editId ? `/api/products/${editId}` : "/api/products";
    const method = editId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Save failed");
      return;
    }

    onSaved();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editId ? "Edit Product" : "Add Product"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <FormField label="Product Name" required>
          {(id) => (
            <input
              id={id}
              required
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          )}
        </FormField>

        <FormField label="Category" required>
          {(id) => (
            <select
              id={id}
              className={inputClass}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {[
                "Cement",
                "Bricks",
                "Steel",
                "Wood",
                "Tiles",
                "Doors & Windows",
              ].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </FormField>

        <FormField label="Description">
          {(id) => (
            <textarea
              id={id}
              rows={3}
              className={inputClass}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          )}
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Price (₹)" required>
            {(id) => (
              <input
                id={id}
                type="number"
                required
                min={0}
                className={inputClass}
                value={form.price || ""}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
              />
            )}
          </FormField>

          <FormField label="Unit" required hint="e.g. bag, piece, ton">
            {(id) => (
              <input
                id={id}
                required
                className={inputClass}
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
              />
            )}
          </FormField>
        </div>

        <FormField label="Stock Quantity" required>
          {(id) => (
            <input
              id={id}
              type="number"
              required
              min={0}
              className={inputClass}
              value={form.stock || ""}
              onChange={(e) =>
                setForm({ ...form, stock: Number(e.target.value) })
              }
            />
          )}
        </FormField>

        <FormField
          label="Image URL"
          hint="Paste a public image link (no upload required)"
        >
          {(id) => (
            <input
              id={id}
              type="url"
              className={inputClass}
              placeholder="https://images.unsplash.com/photo-..."
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />
          )}
        </FormField>

        <FormField label="Key Features" hint="Separate multiple features with commas">
          {(id) => (
            <input
              id={id}
              className={inputClass}
              placeholder="High Strength, ISI Certified"
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
            />
          )}
        </FormField>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : editId ? "Update" : "Create"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
