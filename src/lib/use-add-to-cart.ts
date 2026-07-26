"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCartStore, type CartItem } from "@/store/cart";

export function useAddToCart(redirectPath?: string) {
  const router = useRouter();
  const { user } = useAuth();
  const addItem = useCartStore((s) => s.addItem);

  return (item: CartItem) => {
    if (!user) {
      const redirect = redirectPath || window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
      return false;
    }
    addItem(item);
    return true;
  };
}
