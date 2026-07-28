"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "./cart-store";
import { supabaseDb } from "@/lib/supabase";

export type OrderStatus = "Pending" | "Baking" | "Out for Delivery" | "Delivered" | "Cancelled";

export type Order = {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    notes?: string;
  };
  items: CartLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  status: OrderStatus;
};

type OrderState = {
  orders: Order[];
  loaded: boolean;
  fetchOrdersFromSupabase: () => Promise<void>;
  createOrder: (orderData: Omit<Order, "id" | "orderNumber" | "createdAt" | "status">) => Promise<Order>;
  updateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  clearOrders: () => void;
};

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      loaded: false,

      fetchOrdersFromSupabase: async () => {
        const fetched = await supabaseDb.select<any>("orders", "*");
        // `fetched` is null only when the request itself failed (e.g. table
        // missing, network error) — in that case keep whatever's already in
        // the store as a fallback. An empty array is a valid, real result
        // (zero orders) and must replace stale/cached local state, not be
        // ignored — otherwise deleted orders would appear to linger forever.
        if (fetched && Array.isArray(fetched)) {
          const formatted: Order[] = fetched.map((row) => ({
            id: row.id,
            orderNumber: row.order_number,
            createdAt: row.created_at,
            customer: typeof row.customer === "string" ? JSON.parse(row.customer) : row.customer,
            items: typeof row.items === "string" ? JSON.parse(row.items) : row.items,
            subtotal: Number(row.subtotal),
            deliveryFee: Number(row.delivery_fee),
            total: Number(row.total),
            paymentMethod: row.payment_method,
            status: row.status as OrderStatus,
          }));
          set({ orders: formatted, loaded: true });
        } else {
          set({ loaded: true });
        }
      },

      createOrder: async (data) => {
        const orderId = `ord-${Date.now()}`;
        const orderNumber = `#BS-${Math.floor(1000 + Math.random() * 9000)}`;
        const newOrder: Order = {
          ...data,
          id: orderId,
          orderNumber,
          createdAt: new Date().toISOString(),
          status: "Pending",
        };

        // Insert into Supabase Orders table
        await supabaseDb.insert("orders", {
          id: newOrder.id,
          order_number: newOrder.orderNumber,
          created_at: newOrder.createdAt,
          customer: newOrder.customer,
          items: newOrder.items,
          subtotal: newOrder.subtotal,
          delivery_fee: newOrder.deliveryFee,
          total: newOrder.total,
          payment_method: newOrder.paymentMethod,
          status: newOrder.status,
        });

        set((state) => ({ orders: [newOrder, ...state.orders] }));
        return newOrder;
      },

      updateStatus: async (orderId, status) => {
        // Update in Supabase
        await supabaseDb.update("orders", "id", orderId, { status });

        set((state) => ({
          orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
        }));
      },

      deleteOrder: async (orderId) => {
        // Delete from Supabase
        await supabaseDb.delete("orders", "id", orderId);

        set((state) => ({ orders: state.orders.filter((o) => o.id !== orderId) }));
      },

      clearOrders: () => set({ orders: [] }),
    }),
    { name: "bakestudio-orders-store" }
  )
);
