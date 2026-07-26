"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function useBookService(redirectPath?: string) {
  const router = useRouter();
  const { user } = useAuth();

  return (bookPath: string) => {
    if (!user) {
      const redirect = redirectPath || window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
      return false;
    }
    router.push(bookPath);
    return true;
  };
}
