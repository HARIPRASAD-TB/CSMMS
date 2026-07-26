"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { BadgeCheck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { useAddToCart } from "@/lib/use-add-to-cart";
import { workerToCartItem } from "@/lib/cart-helpers";

interface Worker {
  _id: string;
  title: string;
  description: string;
  location: string;
  workerType: string;
  pricePerDay: number;
  rating: number;
  experience: number;
  isVerified: boolean;
  portfolio: string[];
  user?: { name?: string };
}

export default function WorkerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const addToCart = useAddToCart(`/workers/${id}`);
  const [worker, setWorker] = useState<Worker | null>(null);
  const [days, setDays] = useState(1);
  const [form, setForm] = useState({
    startDate: "",
    duration: "",
    instructions: "",
  });

  useEffect(() => {
    fetch(`/api/providers/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.provider?.type === "worker") {
          setWorker(d.provider);
        }
      });
  }, [id]);

  async function requestBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!worker) return;

    const total = worker.pricePerDay * days;

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        providerId: id,
        serviceType: worker.workerType,
        startDate: form.startDate,
        duration: form.duration || `${days} day(s)`,
        instructions: form.instructions,
        totalAmount: total,
      }),
    });
    if (res.ok) router.push("/bookings");
    else alert("Please login first to book");
  }

  if (!worker) {
    return <p className="py-20 text-center text-zinc-500">Loading worker...</p>;
  }

  const total = worker.pricePerDay * days;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 rounded-xl border border-zinc-800 bg-surface p-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          {worker.user?.name || worker.title}
          {worker.isVerified && (
            <BadgeCheck className="h-6 w-6 text-accent" />
          )}
        </h1>
        <p className="text-accent">{worker.workerType}</p>
        <StarRating rating={worker.rating} />
        <p className="mt-2 flex items-center gap-1 text-zinc-400">
          <MapPin className="h-4 w-4" />
          {worker.location} · {worker.experience} yrs experience
        </p>
        <p className="mt-2 text-2xl font-bold text-accent">
          ₹{worker.pricePerDay}/day
        </p>
        {worker.description && (
          <p className="mt-4 text-zinc-300">{worker.description}</p>
        )}
        <div className="mt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => addToCart(workerToCartItem(worker))}
          >
            Add to Cart
          </Button>
        </div>
      </div>

      {worker.portfolio?.length > 0 && (
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          {worker.portfolio.map((img, i) => (
            <div key={i} className="relative h-48 overflow-hidden rounded-xl">
              <Image src={img} alt="" fill className="object-cover" unoptimized />
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-surface p-6">
          <h3 className="mb-4 font-semibold">Booking Summary</h3>
          <p className="text-sm text-zinc-400">Service</p>
          <p className="font-medium">{worker.workerType}</p>
          <p className="mt-4 text-sm text-zinc-400">Rate</p>
          <p className="font-medium">₹{worker.pricePerDay}/day</p>
          <p className="mt-4 text-sm text-zinc-400">Days</p>
          <p className="font-medium">{days}</p>
          <p className="mt-4 border-t border-zinc-700 pt-4 text-lg font-bold text-accent">
            Total: ₹{total.toLocaleString()}
          </p>
        </div>

        <form
          onSubmit={requestBooking}
          className="space-y-4 rounded-xl border border-zinc-800 bg-surface p-6"
        >
          <h3 className="font-semibold">Request Booking</h3>
          <div>
            <label htmlFor="worker-days" className="mb-1 block text-sm text-zinc-400">
              Number of Days <span className="text-accent">*</span>
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded border border-zinc-600 px-3 py-1"
                onClick={() => setDays(Math.max(1, days - 1))}
              >
                −
              </button>
              <span className="min-w-[2rem] text-center">{days}</span>
              <button
                type="button"
                className="rounded border border-zinc-600 px-3 py-1"
                onClick={() => setDays(days + 1)}
              >
                +
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="worker-start-date" className="mb-1 block text-sm text-zinc-400">
              Start Date <span className="text-accent">*</span>
            </label>
            <input
              id="worker-start-date"
              type="date"
              required
              className="w-full rounded-lg px-4 py-2.5"
              value={form.startDate}
              onChange={(e) =>
                setForm({ ...form, startDate: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="worker-duration" className="mb-1 block text-sm text-zinc-400">
              Expected Duration
            </label>
            <input
              id="worker-duration"
              placeholder="e.g. 2 weeks"
              className="w-full rounded-lg px-4 py-2.5"
              value={form.duration}
              onChange={(e) =>
                setForm({ ...form, duration: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="worker-instructions" className="mb-1 block text-sm text-zinc-400">
              Special Instructions
            </label>
            <textarea
              id="worker-instructions"
              rows={3}
              className="w-full rounded-lg px-4 py-2.5"
              value={form.instructions}
              onChange={(e) =>
                setForm({ ...form, instructions: e.target.value })
              }
            />
          </div>
          <Button type="submit" className="w-full">
            Request Booking
          </Button>
        </form>
      </div>
    </div>
  );
}
