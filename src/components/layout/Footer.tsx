import Link from "next/link";
import { HardHat } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-800 bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2 font-bold">
              <HardHat className="h-6 w-6 text-accent" />
              BuildConnect
            </div>
            <p className="text-sm text-zinc-400">
              India&apos;s trusted marketplace for skilled labour, verified
              contractors, and quality construction materials — delivered with
              transparent pricing.
            </p>
          </div>
          <div>
            <h4 className="mb-3 font-semibold">Services</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="/workers" className="hover:text-accent">
                  Skilled Workers
                </Link>
              </li>
              <li>
                <Link href="/workers?tab=contractors" className="hover:text-accent">
                  Contractors
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold">Marketplace</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="/materials" className="hover:text-accent">
                  Materials
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold">Company</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="/about" className="hover:text-accent">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-8 border-t border-zinc-800 pt-8 text-center text-sm text-zinc-500">
          © {new Date().getFullYear()} BuildConnect Technologies Pvt. Ltd. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
}
