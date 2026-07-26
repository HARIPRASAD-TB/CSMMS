"use client";

import { create } from "zustand";
import { getCartItemKey, migrateCartItem } from "@/lib/cart-helpers";

export type CartItemType = "product" | "worker" | "contractor";

export interface CartItem {
  itemType: CartItemType;
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  unit?: string;
  serviceType?: string;
}

const CART_PREFIX = "buildconnect-cart-";

function loadCartFromStorage(userId: string): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${CART_PREFIX}${userId}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Record<string, unknown>[];
    return parsed.map(migrateCartItem);
  } catch {
    return [];
  }
}

function saveCartToStorage(userId: string, items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${CART_PREFIX}${userId}`, JSON.stringify(items));
}

interface CartState {
  userId: string | null;
  items: CartItem[];
  setUserId: (userId: string | null) => void;
  addItem: (item: CartItem) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
}

function persistItems(userId: string | null, items: CartItem[]) {
  if (userId) saveCartToStorage(userId, items);
}

export const useCartStore = create<CartState>((set, get) => ({
  userId: null,
  items: [],

  setUserId: (userId) => {
    if (!userId) {
      set({ userId: null, items: [] });
      return;
    }
    set({ userId, items: loadCartFromStorage(userId) });
  },

  addItem: (item) => {
    const { userId, items } = get();
    if (!userId) return;

    const key = getCartItemKey(item);
    const existing = items.find((i) => getCartItemKey(i) === key);
    const next = existing
      ? items.map((i) =>
          getCartItemKey(i) === key
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      : [...items, item];

    persistItems(userId, next);
    set({ items: next });
  },

  removeItem: (key) => {
    const { userId, items } = get();
    if (!userId) return;

    const next = items.filter((i) => getCartItemKey(i) !== key);
    persistItems(userId, next);
    set({ items: next });
  },

  updateQuantity: (key, quantity) => {
    const { userId, items } = get();
    if (!userId) return;

    const next = items.map((i) =>
      getCartItemKey(i) === key ? { ...i, quantity } : i
    );
    persistItems(userId, next);
    set({ items: next });
  },

  clearCart: () => {
    const { userId } = get();
    if (!userId) return;

    persistItems(userId, []);
    set({ items: [] });
  },
}));
