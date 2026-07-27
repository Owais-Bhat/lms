"use client";

import { create } from "zustand";
import { products as seedProducts, type Product } from "@/lib/data";
import { supabaseDb } from "@/lib/supabase";

function rowToProduct(row: Record<string, any>): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    description: row.description || "",
    flavor: row.flavor || "Vanilla",
    price: Number(row.price),
    rating: Number(row.rating ?? 5),
    reviewCount: Number(row.review_count ?? 1),
    eggless: Boolean(row.eggless),
    glutenFree: Boolean(row.gluten_free),
    weights: typeof row.weights === "string" ? JSON.parse(row.weights) : row.weights || [],
    illustration: row.illustration || "layer-drip",
    image: row.image || "/images/products/wedding-tiered-elegance.jpg",
  };
}

function productToRow(p: Product) {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    description: p.description,
    flavor: p.flavor,
    price: p.price,
    rating: p.rating,
    review_count: p.reviewCount,
    eggless: p.eggless,
    gluten_free: p.glutenFree,
    weights: p.weights,
    illustration: p.illustration,
    image: p.image,
  };
}

type ProductsState = {
  products: Product[];
  hiddenIds: Record<string, boolean>;
  loaded: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (p: Product) => Promise<void>;
  updateProduct: (id: string, patch: Partial<Product>) => Promise<void>;
  setActive: (id: string, active: boolean) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
};

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: seedProducts,
  hiddenIds: {},
  loaded: false,

  fetchProducts: async () => {
    const rows = await supabaseDb.select<Record<string, any>>("products", "*");
    if (rows && Array.isArray(rows) && rows.length > 0) {
      const byId = new Map(seedProducts.map((p) => [p.id, p]));
      const hiddenIds: Record<string, boolean> = {};
      rows.forEach((row) => {
        byId.set(row.id, rowToProduct(row));
        if (row.active === false) hiddenIds[row.id] = true;
      });
      set({ products: Array.from(byId.values()), hiddenIds, loaded: true });
    } else {
      set({ loaded: true });
    }
  },

  addProduct: async (p) => {
    await supabaseDb.insert("products", { ...productToRow(p), active: true });
    set((state) => ({ products: [p, ...state.products] }));
  },

  updateProduct: async (id, patch) => {
    const current = get().products.find((p) => p.id === id);
    if (!current) return;
    const updated = { ...current, ...patch };
    const isActive = !get().hiddenIds[id];
    // Upsert (not a plain UPDATE) because seed products don't have a
    // Supabase row yet until they're first edited from the admin panel.
    await supabaseDb.upsert("products", { ...productToRow(updated), active: isActive });
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? updated : p)),
    }));
  },

  setActive: async (id, activeVal) => {
    const current = get().products.find((p) => p.id === id);
    if (!current) return;
    await supabaseDb.upsert("products", { ...productToRow(current), active: activeVal });
    set((state) => ({ hiddenIds: { ...state.hiddenIds, [id]: !activeVal } }));
  },

  deleteProduct: async (id) => {
    await supabaseDb.delete("products", "id", id);
    set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
  },
}));
