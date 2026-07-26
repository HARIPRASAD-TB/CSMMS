"use client";

import { AuthProvider } from "@/context/AuthContext";
import { CartSync } from "@/components/providers/CartSync";
import { FetchInterceptor } from "@/components/providers/FetchInterceptor";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <FetchInterceptor>
      <AuthProvider>
        <CartSync />
        {children}
      </AuthProvider>
    </FetchInterceptor>
  );
}
