"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HardHat, ShoppingCart, User, LogOut, LayoutDashboard } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useAuth, getDashboardPath } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

const links = [
  { href: "/", label: "Home" },
  { href: "/workers", label: "Services" },
  { href: "/materials", label: "Materials" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const itemCount = useCartStore((s) =>
    s.items.reduce((n, i) => n + i.quantity, 0)
  );

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-background/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <HardHat className="h-8 w-8 text-accent" />
          <span>
            Build<span className="text-accent">Connect</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition hover:text-accent ${
                pathname === link.href ||
                (link.href === "/workers" &&
                  (pathname.startsWith("/workers") ||
                    pathname.startsWith("/contractors")))
                  ? "text-accent"
                  : "text-zinc-300"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {!loading && user && (
            <Link
              href="/bookings"
              className={`hidden rounded-lg px-3 py-2 text-sm sm:block ${
                pathname.startsWith("/bookings")
                  ? "text-accent"
                  : "text-zinc-300 hover:bg-surface hover:text-white"
              }`}
            >
              My Activity
            </Link>
          )}
          {!loading && user && (
            <Link
              href="/cart"
              className="relative rounded-lg p-2 text-zinc-300 hover:bg-surface hover:text-white"
              title="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-black">
                  {itemCount}
                </span>
              )}
            </Link>
          )}

          {!loading && user ? (
            <div className="flex items-center gap-2">
              <Link
                href={getDashboardPath(user.role)}
                className="hidden items-center gap-1 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-surface hover:text-white sm:flex"
                title="Dashboard"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="max-w-[100px] truncate">{user.name}</span>
              </Link>
              <Link
                href="/profile"
                className="rounded-lg p-2 text-zinc-300 hover:bg-surface hover:text-white"
                title="Profile"
              >
                <User className="h-5 w-5" />
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                className="rounded-lg p-2 text-zinc-300 hover:bg-surface hover:text-red-400"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : !loading ? (
            <Link href="/login">
              <Button size="sm" className="hidden sm:inline-flex">
                Login
              </Button>
            </Link>
          ) : null}
        </div>
      </nav>
    </header>
  );
}
