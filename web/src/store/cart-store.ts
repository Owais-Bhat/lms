"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CakeVariant } from "@/components/CakeIllustration";

export type CartLine = {
  lineId: string;
  productId: string;
  slug: string;
  name: string;
  illustration: CakeVariant;
  image?: string;
  weightLabel: string;
  unitPrice: number;
  quantity: number;
  message?: string;
  addOns: { id: string; name: string; price: number }[];
};

type CartState = {
  lines: CartLine[];
  addLine: (line: Omit<CartLine, "lineId">) => void;
  removeLine: (lineId: string) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      addLine: (line) =>
        set((state) => ({
          lines: [...state.lines, { ...line, lineId: `${line.productId}-${Date.now()}` }],
        })),
      removeLine: (lineId) =>
        set((state) => ({ lines: state.lines.filter((l) => l.lineId !== lineId) })),
      setQuantity: (lineId, quantity) =>
        set((state) => ({
          lines: state.lines.map((l) =>
            l.lineId === lineId ? { ...l, quantity: Math.max(1, quantity) } : l
          ),
        })),
      clear: () => set({ lines: [] }),
    }),
    { name: "bakestudio-cart" }
  )
);

export function lineTotal(line: CartLine) {
  const addOnTotal = line.addOns.reduce((sum, a) => sum + a.price, 0);
  return (line.unitPrice + addOnTotal) * line.quantity;
}

export function cartCount(lines: CartLine[]) {
  return lines.reduce((sum, l) => sum + l.quantity, 0);
}

export function cartSubtotal(lines: CartLine[]) {
  return lines.reduce((sum, l) => sum + lineTotal(l), 0);
}

type WishlistState = {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((state) => ({
          ids: state.ids.includes(id)
            ? state.ids.filter((x) => x !== id)
            : [...state.ids, id],
        })),
      has: (id) => get().ids.includes(id),
    }),
    { name: "bakestudio-wishlist" }
  )
);
