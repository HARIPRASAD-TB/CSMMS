import type { CartItem, CartItemType } from "@/store/cart";

export function getCartItemKey(item: Pick<CartItem, "itemType" | "itemId">) {
  return `${item.itemType}:${item.itemId}`;
}

export function migrateCartItem(raw: Record<string, unknown>): CartItem {
  if (raw.itemType && raw.itemId) {
    return raw as unknown as CartItem;
  }
  const productId = String(raw.productId ?? "");
  return {
    itemType: "product",
    itemId: productId,
    name: String(raw.name ?? ""),
    price: Number(raw.price ?? 0),
    quantity: Number(raw.quantity ?? 1),
    image: raw.image as string | undefined,
    unit: raw.unit as string | undefined,
  };
}

export function productToCartItem(
  p: {
    _id: string;
    name: string;
    price: number;
    image?: string;
    unit?: string;
  },
  quantity = 1
): CartItem {
  return {
    itemType: "product",
    itemId: p._id,
    name: p.name,
    price: p.price,
    quantity,
    image: p.image,
    unit: p.unit,
  };
}

export function workerToCartItem(w: {
  _id: string;
  title: string;
  workerType: string;
  pricePerDay: number;
  portfolio?: string[];
  user?: { name?: string };
}): CartItem {
  return {
    itemType: "worker",
    itemId: w._id,
    name: w.user?.name || w.title,
    price: w.pricePerDay,
    quantity: 1,
    unit: "day",
    image: w.portfolio?.[0],
    serviceType: w.workerType,
  };
}

export function contractorToCartItem(c: {
  _id: string;
  title: string;
  pricePerSqFt?: number;
  portfolio?: string[];
  services?: { name: string; pricePerSqFt?: number }[];
}): CartItem {
  const service = c.services?.[0];
  return {
    itemType: "contractor",
    itemId: c._id,
    name: c.title,
    price: service?.pricePerSqFt ?? c.pricePerSqFt ?? 1000,
    quantity: 100,
    unit: "sq.ft",
    image: c.portfolio?.[0],
    serviceType: service?.name ?? "General Construction",
  };
}

export function cartItemTypeLabel(type: CartItemType) {
  switch (type) {
    case "product":
      return "Material";
    case "worker":
      return "Worker";
    case "contractor":
      return "Contractor";
  }
}
