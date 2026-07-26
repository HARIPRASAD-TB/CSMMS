"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Calendar, Package, ShoppingBag } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";

interface OrderRow {
  _id: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  status: string;
  deliveryAddress?: string;
  paymentMethod?: string;
  createdAt?: string;
}

interface BookingRow {
  _id: string;
  serviceType: string;
  startDate: string;
  duration?: string;
  totalAmount: number;
  status: string;
  instructions?: string;
  createdAt?: string;
  providerId?: { title?: string; type?: string; workerType?: string };
}

type ActivityTab = "all" | "bookings" | "orders";

const bookingFilters = ["all", "upcoming", "in_progress", "completed", "cancelled"];

function MyActivityContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as ActivityTab) || "all";
  const [tab, setTab] = useState<ActivityTab>(
    ["all", "bookings", "orders"].includes(initialTab) ? initialTab : "all"
  );
  const [bookingFilter, setBookingFilter] = useState("all");
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = searchParams.get("tab") as ActivityTab;
    if (t && ["all", "bookings", "orders"].includes(t)) setTab(t);
  }, [searchParams]);

  useEffect(() => {
    fetch("/api/my-activity", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        setOrders(d.orders || []);
        setBookings(d.bookings || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredBookings = useMemo(() => {
    if (bookingFilter === "upcoming") {
      return bookings.filter((b) =>
        ["pending", "confirmed"].includes(b.status)
      );
    }
    if (bookingFilter === "all") return bookings;
    return bookings.filter((b) => b.status === bookingFilter);
  }, [bookings, bookingFilter]);

  const timeline = useMemo(() => {
    const items: Array<
      | { kind: "order"; date: string; data: OrderRow }
      | { kind: "booking"; date: string; data: BookingRow }
    > = [];

    for (const o of orders) {
      items.push({
        kind: "order",
        date: o.createdAt || "",
        data: o,
      });
    }
    for (const b of bookings) {
      items.push({
        kind: "booking",
        date: b.createdAt || b.startDate || "",
        data: b,
      });
    }

    return items.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [orders, bookings]);

  if (loading) {
    return (
      <p className="py-20 text-center text-zinc-500">Loading your activity...</p>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold">My Activity</h1>
      <p className="mt-1 text-sm text-zinc-400">
        Your material orders and service bookings in one place
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {(
          [
            { id: "all", label: "All", icon: ShoppingBag },
            { id: "bookings", label: "Bookings", icon: Calendar },
            { id: "orders", label: "Orders", icon: Package },
          ] as const
        ).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === id
                ? "bg-accent text-black"
                : "bg-surface text-zinc-400 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
            <span className="rounded-full bg-black/20 px-2 py-0.5 text-xs">
              {id === "orders"
                ? orders.length
                : id === "bookings"
                  ? bookings.length
                  : orders.length + bookings.length}
            </span>
          </button>
        ))}
      </div>

      {tab === "bookings" && (
        <div className="mt-4 flex flex-wrap gap-2">
          {bookingFilters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setBookingFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs capitalize ${
                bookingFilter === f
                  ? "bg-accent/20 text-accent"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {f.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 space-y-4">
        {tab === "all" &&
          timeline.map((item) =>
            item.kind === "order" ? (
              <OrderCard key={`order-${item.data._id}`} order={item.data} />
            ) : (
              <BookingCard
                key={`booking-${item.data._id}`}
                booking={item.data}
              />
            )
          )}

        {tab === "bookings" &&
          filteredBookings.map((b) => (
            <BookingCard key={b._id} booking={b} />
          ))}

        {tab === "orders" &&
          orders.map((o) => <OrderCard key={o._id} order={o} />)}

        {tab === "all" && !timeline.length && <EmptyState tab={tab} />}
        {tab === "bookings" && !filteredBookings.length && (
          <EmptyState tab={tab} />
        )}
        {tab === "orders" && !orders.length && <EmptyState tab={tab} />}
      </div>
    </div>
  );
}

function BookingCard({ booking }: { booking: BookingRow }) {
  const providerName =
    booking.providerId?.title ||
    booking.providerId?.workerType ||
    "Service Provider";

  return (
    <div className="rounded-xl border border-zinc-800 bg-surface p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded bg-blue-500/15 px-2 py-0.5 text-xs font-medium text-blue-400">
              Booking
            </span>
            <StatusBadge status={booking.status} />
          </div>
          <h3 className="font-semibold">{providerName}</h3>
          <p className="text-sm text-zinc-400">{booking.serviceType}</p>
          <p className="mt-2 text-sm text-zinc-500">
            Start: {new Date(booking.startDate).toLocaleDateString()}
            {booking.duration ? ` · ${booking.duration}` : ""}
          </p>
          {booking.instructions && (
            <p className="mt-2 text-sm text-zinc-500">
              Note: {booking.instructions}
            </p>
          )}
          <p className="mt-2 font-bold text-accent">
            ₹{booking.totalAmount?.toLocaleString()}
          </p>
        </div>
        {booking.createdAt && (
          <p className="text-xs text-zinc-500">
            Booked {new Date(booking.createdAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: OrderRow }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-surface p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">
              Order
            </span>
            <StatusBadge status={order.status} />
          </div>
          <h3 className="font-semibold">
            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
          </h3>
          <ul className="mt-2 space-y-1 text-sm text-zinc-400">
            {order.items.map((item, i) => (
              <li key={i}>
                {item.name} × {item.quantity} — ₹
                {(item.price * item.quantity).toLocaleString()}
              </li>
            ))}
          </ul>
          {order.deliveryAddress && (
            <p className="mt-2 text-sm text-zinc-500">
              Deliver to: {order.deliveryAddress}
            </p>
          )}
          <p className="mt-2 font-bold text-accent">
            Total: ₹{order.total?.toLocaleString()}
          </p>
        </div>
        {order.createdAt && (
          <p className="text-xs text-zinc-500">
            Ordered {new Date(order.createdAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}

function EmptyState({ tab }: { tab: ActivityTab }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-surface py-12 text-center">
      <p className="text-zinc-500">
        {tab === "orders"
          ? "No material orders yet."
          : tab === "bookings"
            ? "No service bookings yet."
            : "No activity yet."}
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {tab !== "orders" && (
          <Link href="/workers">
            <Button size="sm" variant="outline">
              Browse Services
            </Button>
          </Link>
        )}
        {tab !== "bookings" && (
          <Link href="/materials">
            <Button size="sm">Shop Materials</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default function MyActivityPage() {
  return (
    <Suspense
      fallback={
        <p className="py-20 text-center text-zinc-500">Loading your activity...</p>
      }
    >
      <MyActivityContent />
    </Suspense>
  );
}
