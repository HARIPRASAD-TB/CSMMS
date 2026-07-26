"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useAuth, getDashboardPath } from "@/context/AuthContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const redirectTo = searchParams.get("redirect");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginForm),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }
    await refreshUser();
    router.push(redirectTo || getDashboardPath(data.user.role));
    router.refresh();
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerForm),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Registration failed");
      return;
    }
    await refreshUser();
    router.push(getDashboardPath(data.user.role));
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {error && (
        <p className="mb-4 rounded-lg bg-red-500/10 p-3 text-center text-red-400">
          {error}
        </p>
      )}
      <div className="grid gap-8 rounded-2xl border border-zinc-800 bg-surface md:grid-cols-2">
        <div className="border-b border-zinc-800 p-8 md:border-b-0 md:border-r">
          <h2 className="mb-6 text-2xl font-bold">Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="mb-1 block text-sm text-zinc-400">
                Email <span className="text-accent">*</span>
              </label>
              <input
                id="login-email"
                type="email"
                required
                className="w-full rounded-lg px-4 py-2.5"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="login-password" className="mb-1 block text-sm text-zinc-400">
                Password <span className="text-accent">*</span>
              </label>
              <input
                id="login-password"
                type="password"
                required
                className="w-full rounded-lg px-4 py-2.5"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              Login
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-zinc-500">
            <Link href="/contact" className="text-accent hover:underline">
              Forgot your password?
            </Link>
          </p>
        </div>

        <div className="p-8">
          <h2 className="mb-6 text-2xl font-bold">Register</h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="reg-name" className="mb-1 block text-sm text-zinc-400">
                Full Name <span className="text-accent">*</span>
              </label>
              <input
                id="reg-name"
                required
                className="w-full rounded-lg px-4 py-2.5"
                value={registerForm.name}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, name: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="reg-email" className="mb-1 block text-sm text-zinc-400">
                Email <span className="text-accent">*</span>
              </label>
              <input
                id="reg-email"
                type="email"
                required
                className="w-full rounded-lg px-4 py-2.5"
                value={registerForm.email}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, email: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="reg-mobile" className="mb-1 block text-sm text-zinc-400">
                Mobile Number <span className="text-accent">*</span>
              </label>
              <input
                id="reg-mobile"
                required
                className="w-full rounded-lg px-4 py-2.5"
                value={registerForm.mobile}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, mobile: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="reg-role" className="mb-1 block text-sm text-zinc-400">
                Account Type <span className="text-accent">*</span>
              </label>
              <select
                id="reg-role"
                className="w-full rounded-lg px-4 py-2.5"
                value={registerForm.role}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, role: e.target.value })
                }
              >
                <option value="user">Customer</option>
                <option value="worker">Worker</option>
                <option value="contractor">Contractor</option>
                <option value="vendor">Material Vendor</option>
              </select>
            </div>
            <div>
              <label htmlFor="reg-password" className="mb-1 block text-sm text-zinc-400">
                Password <span className="text-accent">*</span>
              </label>
              <input
                id="reg-password"
                type="password"
                required
                className="w-full rounded-lg px-4 py-2.5"
                value={registerForm.password}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, password: e.target.value })
                }
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              Register
            </Button>
          </form>
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-zinc-500">
        <Link href="/" className="text-accent hover:underline">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="py-20 text-center text-zinc-500">Loading...</p>}>
      <LoginForm />
    </Suspense>
  );
}
