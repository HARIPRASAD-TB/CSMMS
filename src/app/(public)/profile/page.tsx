"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, User as UserIcon, Calendar, Package } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getDashboardPath } from "@/context/AuthContext";
import type { UserRole } from "@/lib/auth";

export default function ProfilePage() {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    mobile: string;
    address?: string;
    role: string;
  } | null>(null);
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    address: "",
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          setUser(d.user);
          setForm({
            name: d.user.name,
            mobile: d.user.mobile,
            address: d.user.address || "",
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/users/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      setEditing(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center text-zinc-500">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="mb-4 text-zinc-400">Please login to view your profile</p>
        <Link href="/login">
          <Button>Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">My Profile</h1>

      <div className="mb-6 flex flex-col items-center gap-4 rounded-xl border border-zinc-800 bg-surface p-8 text-center sm:flex-row sm:text-left">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-accent/20 text-3xl font-bold text-accent">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="mt-1 capitalize text-sm text-accent">{user.role}</p>
          <p className="mt-2 flex items-center justify-center gap-2 text-zinc-400 sm:justify-start">
            <Mail className="h-4 w-4 shrink-0" />
            {user.email}
          </p>
          <p className="mt-1 flex items-center justify-center gap-2 text-zinc-400 sm:justify-start">
            <Phone className="h-4 w-4 shrink-0" />
            {user.mobile}
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setEditing(!editing)}
        >
          {editing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-surface p-6">
        <h2 className="mb-6 flex items-center gap-2 font-semibold">
          <UserIcon className="h-5 w-5 text-accent" />
          Personal Information
        </h2>

        {editing ? (
          <form onSubmit={saveProfile} className="space-y-4">
            <div>
              <label
                htmlFor="profile-name"
                className="mb-1 block text-sm text-zinc-400"
              >
                Full Name <span className="text-accent">*</span>
              </label>
              <input
                id="profile-name"
                required
                className="w-full rounded-lg px-4 py-2.5"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label
                htmlFor="profile-mobile"
                className="mb-1 block text-sm text-zinc-400"
              >
                Mobile Number <span className="text-accent">*</span>
              </label>
              <input
                id="profile-mobile"
                required
                className="w-full rounded-lg px-4 py-2.5"
                value={form.mobile}
                onChange={(e) =>
                  setForm({ ...form, mobile: e.target.value })
                }
              />
            </div>
            <div>
              <label
                htmlFor="profile-address"
                className="mb-1 block text-sm text-zinc-400"
              >
                Address
              </label>
              <textarea
                id="profile-address"
                className="w-full rounded-lg px-4 py-2.5"
                rows={2}
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
              />
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        ) : (
          <dl className="space-y-4">
            <div className="flex gap-3 border-b border-zinc-800 pb-4">
              <dt className="w-32 shrink-0 text-sm text-zinc-500">Full Name</dt>
              <dd>{user.name}</dd>
            </div>
            <div className="flex gap-3 border-b border-zinc-800 pb-4">
              <dt className="w-32 shrink-0 text-sm text-zinc-500">Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div className="flex gap-3 border-b border-zinc-800 pb-4">
              <dt className="w-32 shrink-0 text-sm text-zinc-500">Mobile</dt>
              <dd>{user.mobile}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-32 shrink-0 text-sm text-zinc-500">Address</dt>
              <dd className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
                {user.address || "Not added"}
              </dd>
            </div>
          </dl>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-zinc-800 bg-surface p-6">
        <h2 className="mb-4 font-semibold">My Activity</h2>
        <p className="mb-4 text-sm text-zinc-400">
          View your past service bookings and material orders
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/bookings?tab=bookings">
            <Button variant="outline" size="sm">
              <Calendar className="mr-1 h-4 w-4" />
              My Bookings
            </Button>
          </Link>
          <Link href="/bookings?tab=orders">
            <Button variant="outline" size="sm">
              <Package className="mr-1 h-4 w-4" />
              My Orders
            </Button>
          </Link>
          <Link href="/bookings">
            <Button size="sm">View All Activity</Button>
          </Link>
        </div>
      </div>

      {user.role !== "user" && (
        <div className="mt-6 rounded-xl border border-zinc-800 bg-surface p-6">
          <p className="mb-3 text-sm text-zinc-400">
            Manage your business from your dashboard
          </p>
          <Link href={getDashboardPath(user.role as UserRole)}>
            <Button variant="outline" size="sm">
              Go to Dashboard →
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
