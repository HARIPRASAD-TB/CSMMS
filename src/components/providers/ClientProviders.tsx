"use client";

import { AuthProvider } from "@/context/AuthContext";
import { CartSync } from "@/components/providers/CartSync";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartSync />
      {children}
    </AuthProvider>
  );
}
