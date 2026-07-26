"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/cart";
import { cartItemTypeLabel, getCartItemKey } from "@/lib/cart-helpers";

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const [address, setAddress] = useState("Mumbai, Maharashtra");
  const [payment, setPayment] = useState("cod");
  const [startDate, setStartDate] = useState("");
  const [loading, setLoading] = useState(false);

  const products = items.filter((i) => i.itemType === "product");
  const services = items.filter((i) => i.itemType !== "product");

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const delivery = products.length ? 50 : 0;
  const discount = 0;
  const total = subtotal + delivery - discount;

  async function placeOrder() {
    if (!items.length) return;
    if (services.length && !startDate) {
      alert("Please select a preferred start date for service bookings.");
      return;
    }

    setLoading(true);

    try {
      if (products.length) {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: products.map((i) => ({
              productId: i.itemId,
              name: i.name,
              price: i.price,
              quantity: i.quantity,
              image: i.image,
            })),
            deliveryAddress: address,
            paymentMethod: payment,
            subtotal: products.reduce((s, i) => s + i.price * i.quantity, 0),
            delivery,
            discount,
            total:
              products.reduce((s, i) => s + i.price * i.quantity, 0) +
              delivery -
              discount,
          }),
        });
        if (!res.ok) {
          alert("Please login to place order");
          router.push("/login");
          return;
        }
      }

      for (const item of services) {
        const res = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            providerId: item.itemId,
            serviceType: item.serviceType || item.name,
            area: item.itemType === "contractor" ? item.quantity : undefined,
            startDate,
            duration:
              item.itemType === "worker"
                ? `${item.quantity} day(s)`
                : "As discussed",
            instructions: `Booked via cart — ${address}`,
            totalAmount: item.price * item.quantity,
          }),
        });
        if (!res.ok) {
          alert("Please login to complete service bookings");
          router.push("/login");
          return;
        }
      }

      clearCart();
      if (products.length && services.length) {
        router.push("/bookings");
      } else if (products.length) {
        router.push("/bookings?tab=orders");
      } else {
        router.push("/bookings");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Cart & Checkout</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => {
            const key = getCartItemKey(item);
            return (
              <div
                key={key}
                className="flex gap-4 rounded-xl border border-zinc-800 bg-surface p-4"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-light">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-accent/15 px-2 py-0.5 text-xs text-accent">
                      {cartItemTypeLabel(item.itemType)}
                    </span>
                    <h3 className="font-semibold">{item.name}</h3>
                  </div>
                  {item.serviceType && item.itemType !== "product" && (
                    <p className="text-sm text-zinc-400">{item.serviceType}</p>
                  )}
                  <p className="text-accent">
                    ₹{item.price.toLocaleString()}
                    {item.unit && `/${item.unit}`}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      className="rounded border border-zinc-600 px-2"
                      onClick={() =>
                        updateQuantity(key, Math.max(1, item.quantity - 1))
                      }
                    >
                      −
                    </button>
                    <span>
                      {item.quantity}
                      {item.unit ? ` ${item.unit}` : ""}
                    </span>
                    <button
                      type="button"
                      className="rounded border border-zinc-600 px-2"
                      onClick={() => updateQuantity(key, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="ml-auto text-sm text-red-400"
                      onClick={() => removeItem(key)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {!items.length && (
            <p className="text-zinc-500">Your cart is empty.</p>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-800 bg-surface p-6">
            <h3 className="mb-4 font-semibold">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              {products.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-zinc-400">Delivery</span>
                  <span>₹{delivery}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-zinc-400">Discount</span>
                <span>−₹{discount}</span>
              </div>
              <div className="flex justify-between border-t border-zinc-700 pt-2 text-lg font-bold">
                <span>Total</span>
                <span className="text-accent">₹{total.toLocaleString()}</span>
              </div>
            </div>
            <Button
              className="mt-4 w-full"
              disabled={!items.length || loading}
              onClick={placeOrder}
            >
              Proceed to Checkout
            </Button>
          </div>

          {services.length > 0 && (
            <div className="rounded-xl border border-zinc-800 bg-surface p-6">
              <label
                htmlFor="service-start-date"
                className="mb-3 block font-semibold"
              >
                Preferred Start Date{" "}
                <span className="text-sm font-normal text-accent">*</span>
              </label>
              <input
                id="service-start-date"
                type="date"
                required
                className="w-full rounded-lg px-3 py-2"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          )}

          <div className="rounded-xl border border-zinc-800 bg-surface p-6">
            <label
              htmlFor="delivery-address"
              className="mb-3 block font-semibold"
            >
              {products.length ? "Delivery Address" : "Service Location"}{" "}
              <span className="text-sm font-normal text-accent">*</span>
            </label>
            <textarea
              id="delivery-address"
              required
              className="w-full rounded-lg px-3 py-2"
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {products.length > 0 && (
            <div className="rounded-xl border border-zinc-800 bg-surface p-6">
              <span className="mb-3 block font-semibold">
                Payment Method{" "}
                <span className="text-sm font-normal text-accent">*</span>
              </span>
              {["online", "cod", "wallet"].map((m) => (
                <label key={m} className="mb-2 flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    value={m}
                    checked={payment === m}
                    onChange={() => setPayment(m)}
                  />
                  <span className="capitalize">
                    {m === "cod" ? "Cash on Delivery" : m}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
