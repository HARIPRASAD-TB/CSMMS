"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { ImageSlider } from "@/components/ui/ImageSlider";
import { DetailModal, type DetailItem } from "@/components/ui/DetailModal";
import { ProductFormModal } from "@/components/forms/ProductFormModal";
import { useAuth } from "@/context/AuthContext";
import { useAddToCart } from "@/lib/use-add-to-cart";
import { productToCartItem } from "@/lib/cart-helpers";
import {
  canManageProducts,
  canEditProduct,
} from "@/lib/permissions";

interface Product {
  _id: string;
  vendorId: string;
  name: string;
  category: string;
  description?: string;
  price: number;
  unit: string;
  stock?: number;
  image: string;
  features?: string[];
  rating: number;
}

const categories = [
  "All",
  "Cement",
  "Bricks",
  "Steel",
  "Wood",
  "Tiles",
  "Doors & Windows",
];

export default function MaterialsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("popular");
  const [detail, setDetail] = useState<DetailItem | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const addToCart = useAddToCart("/materials");

  const load = useCallback(() => {
    const params = new URLSearchParams({ sort });
    if (category !== "All") params.set("category", category);
    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((d) =>
        setProducts(
          (d.products || []).map((p: Product) => ({
            ...p,
            vendorId: String(p.vendorId),
          }))
        )
      );
  }, [category, sort]);

  useEffect(() => {
    load();
  }, [load]);

  function openDetail(p: Product) {
    setDetail({ kind: "product", ...p });
  }

  function handleEdit(item: DetailItem) {
    if (item.kind !== "product") return;
    const p = products.find((x) => x._id === item._id);
    if (p) {
      setEditProduct(p);
      setFormOpen(true);
      setDetail(null);
    }
  }

  async function handleDelete(id: string, kind: DetailItem["kind"]) {
    if (kind !== "product" || !confirm("Delete this product?")) return;
    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      setDetail(null);
      load();
    } else {
      alert("Delete failed");
    }
  }

  const canAdd = canManageProducts(user?.role ?? null);

  return (
    <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8">
      <aside className="hidden w-56 shrink-0 space-y-2 lg:block">
        <h3 className="mb-4 font-semibold">Categories</h3>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
              category === c
                ? "bg-accent/15 text-accent"
                : "text-zinc-400 hover:bg-white/5"
            }`}
          >
            {c}
          </button>
        ))}
      </aside>

      <div className="flex-1">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Material Marketplace</h1>
          <div className="flex items-center gap-3">
            <select
              className="rounded-lg px-3 py-2 text-sm"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="popular">Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            {canAdd && (
              <Button
                size="sm"
                onClick={() => {
                  setEditProduct(null);
                  setFormOpen(true);
                }}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Product
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => {
            const editable =
              user && canEditProduct(user.role, user._id, p.vendorId);
            return (
              <div
                key={p._id}
                className="overflow-hidden rounded-xl border border-zinc-800 bg-surface"
              >
                <button
                  type="button"
                  className="block w-full"
                  onClick={() => openDetail(p)}
                >
                  <ImageSlider
                    images={p.image ? [p.image] : []}
                    alt={p.name}
                    height="h-44"
                  />
                </button>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold hover:text-accent">{p.name}</h3>
                    {editable && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditProduct(p);
                          setFormOpen(true);
                        }}
                        className="text-zinc-400 hover:text-accent"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <StarRating rating={p.rating} size={14} />
                  <p className="mt-2 text-lg font-bold text-accent">
                    ₹{p.price.toLocaleString()}/{p.unit}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button
                      className="flex-1"
                      size="sm"
                      onClick={() => openDetail(p)}
                      variant="outline"
                    >
                      Details
                    </Button>
                    <Button
                      className="flex-1"
                      size="sm"
                      onClick={() => addToCart(productToCartItem(p))}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <DetailModal
        item={detail}
        onClose={() => setDetail(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        canEdit={
          !!detail &&
          detail.kind === "product" &&
          !!user &&
          canEditProduct(
            user.role,
            user._id,
            products.find((p) => p._id === detail._id)?.vendorId || ""
          )
        }
        onAddToCart={(product) => {
          if (product.kind === "product") {
            addToCart(productToCartItem(product));
          }
        }}
      />

      <ProductFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditProduct(null);
        }}
        onSaved={load}
        editId={editProduct?._id}
        initial={editProduct || undefined}
      />
    </div>
  );
}
