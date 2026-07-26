"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { useAddToCart } from "@/lib/use-add-to-cart";
import { productToCartItem } from "@/lib/cart-helpers";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  image: string;
  features: string[];
  rating: number;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const addToCart = useAddToCart(`/materials/${id}`);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((d) => setProduct(d.product));
  }, [id]);

  if (!product) {
    return <p className="py-20 text-center text-zinc-500">Loading...</p>;
  }

  function handleAddToCart(goToCheckout = false) {
    const added = addToCart(productToCartItem(product!, qty));
    if (added && goToCheckout) router.push("/cart");
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-surface">
        {product.image && (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            unoptimized
          />
        )}
      </div>
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <StarRating rating={product.rating} />
        <p className="mt-4 text-3xl font-bold text-accent">
          ₹{product.price.toLocaleString()}
          <span className="text-lg text-zinc-400">/{product.unit}</span>
        </p>
        <p
          className={`mt-2 text-sm ${product.stock > 0 ? "text-green-400" : "text-red-400"}`}
        >
          {product.stock > 0 ? "In Stock" : "Out of Stock"}
        </p>
        <p className="mt-6 text-zinc-300">{product.description}</p>
        <h3 className="mt-6 font-semibold">Key Features</h3>
        <ul className="mt-2 list-inside list-disc text-zinc-400">
          {product.features?.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <div className="mt-6 flex items-center gap-4">
          <label htmlFor="product-qty" className="text-sm font-medium text-zinc-300">
            Quantity
          </label>
          <div className="flex items-center rounded-lg border border-zinc-700">
            <button
              type="button"
              className="px-4 py-2"
              onClick={() => setQty(Math.max(1, qty - 1))}
            >
              −
            </button>
            <span className="px-4">{qty}</span>
            <button
              type="button"
              className="px-4 py-2"
              onClick={() => setQty(qty + 1)}
            >
              +
            </button>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <Button onClick={() => handleAddToCart()}>Add to Cart</Button>
          <Button variant="outline" onClick={() => handleAddToCart(true)}>
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}
