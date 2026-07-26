"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { BadgeCheck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { useAddToCart } from "@/lib/use-add-to-cart";
import { contractorToCartItem } from "@/lib/cart-helpers";

interface Contractor {
  _id: string;
  title: string;
  description: string;
  location: string;
  rating: number;
  experience: number;
  completedProjects: number;
  isVerified: boolean;
  portfolio: string[];
  services: { name: string; pricePerSqFt?: number; description?: string }[];
}

export default function ContractorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const addToCart = useAddToCart(`/contractors/${id}`);
  const [contractor, setContractor] = useState<Contractor | null>(null);
  const [tab, setTab] = useState("booking");
  const [serviceType, setServiceType] = useState("");
  const [form, setForm] = useState({
    area: "",
    startDate: "",
    duration: "",
    instructions: "",
  });

  useEffect(() => {
    fetch(`/api/contractors/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setContractor(d.contractor);
        if (d.contractor?.services?.[0]) {
          setServiceType(d.contractor.services[0].name);
        }
      });
  }, [id]);

  async function requestBooking(e: React.FormEvent) {
    e.preventDefault();
    const service = contractor?.services.find((s) => s.name === serviceType);
    const rate = service?.pricePerSqFt || 1000;
    const total = parseFloat(form.area) * rate;

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        providerId: id,
        serviceType,
        area: parseFloat(form.area),
        startDate: form.startDate,
        duration: form.duration,
        instructions: form.instructions,
        totalAmount: total,
      }),
    });
    if (res.ok) router.push("/bookings");
    else alert("Please login first to book");
  }

  if (!contractor) {
    return (
      <p className="py-20 text-center text-zinc-500">Loading contractor...</p>
    );
  }

  const tabs = ["overview", "projects", "reviews", "services", "booking"];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 rounded-xl border border-zinc-800 bg-surface p-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          {contractor.title}
          {contractor.isVerified && (
            <BadgeCheck className="h-6 w-6 text-accent" />
          )}
        </h1>
        <StarRating rating={contractor.rating} />
        <p className="mt-2 flex items-center gap-1 text-zinc-400">
          <MapPin className="h-4 w-4" />
          {contractor.location} · {contractor.experience} yrs ·{" "}
          {contractor.completedProjects} projects
        </p>
        <div className="mt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => addToCart(contractorToCartItem(contractor))}
          >
            Add to Cart
          </Button>
        </div>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto border-b border-zinc-800">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 capitalize ${
              tab === t
                ? "border-b-2 border-accent text-accent"
                : "text-zinc-400"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "booking" && (
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="font-semibold">Service Types</h3>
            {contractor.services?.map((s) => (
              <button
                key={s.name}
                type="button"
                onClick={() => setServiceType(s.name)}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  serviceType === s.name
                    ? "border-accent bg-accent/10"
                    : "border-zinc-700"
                }`}
              >
                <p className="font-semibold">{s.name}</p>
                <p className="text-sm text-zinc-400">{s.description}</p>
                <p className="mt-1 text-accent">₹{s.pricePerSqFt}/sq.ft</p>
              </button>
            ))}
          </div>
          <form onSubmit={requestBooking} className="space-y-4 rounded-xl border border-zinc-800 bg-surface p-6">
            <h3 className="font-semibold">Request Booking</h3>
            <div>
              <label htmlFor="booking-area" className="mb-1 block text-sm text-zinc-400">
                Area (sq.ft) <span className="text-accent">*</span>
              </label>
              <input
                id="booking-area"
                type="number"
                required
                min={1}
                className="w-full rounded-lg px-4 py-2.5"
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="booking-date" className="mb-1 block text-sm text-zinc-400">
                Start Date <span className="text-accent">*</span>
              </label>
              <input
                id="booking-date"
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
              <label htmlFor="booking-duration" className="mb-1 block text-sm text-zinc-400">
                Expected Duration
              </label>
              <input
                id="booking-duration"
                placeholder="e.g. 3 months"
                className="w-full rounded-lg px-4 py-2.5"
                value={form.duration}
                onChange={(e) =>
                  setForm({ ...form, duration: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="booking-instructions" className="mb-1 block text-sm text-zinc-400">
                Special Instructions
              </label>
              <textarea
                id="booking-instructions"
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
      )}

      {tab === "overview" && (
        <p className="text-zinc-300">{contractor.description}</p>
      )}
      {tab === "projects" && (
        <div className="grid gap-4 sm:grid-cols-2">
          {contractor.portfolio?.map((img, i) => (
            <div key={i} className="relative h-48 overflow-hidden rounded-xl">
              <Image src={img} alt="" fill className="object-cover" unoptimized />
            </div>
          ))}
        </div>
      )}
      {tab === "reviews" && (
        <p>
          <a href={`/reviews/${id}`} className="text-accent hover:underline">
            View all reviews →
          </a>
        </p>
      )}
    </div>
  );
}
