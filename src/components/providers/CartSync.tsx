"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCartStore } from "@/store/cart";

/** Loads the correct per-user cart when auth state changes. */
export function CartSync() {
  const { user, loading } = useAuth();
  const setUserId = useCartStore((s) => s.setUserId);

  useEffect(() => {
    if (!loading) {
      setUserId(user?._id ?? null);
    }
  }, [user?._id, loading, setUserId]);

  return null;
}
