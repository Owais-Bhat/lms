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
  fetchOrdersFromSupabase: () => Promise<void>;
  createOrder: (orderData: Omit<Order, "id" | "orderNumber" | "createdAt" | "status">) => Promise<Order>;
  updateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  clearOrders: () => void;
};

const mockInitialOrders: Order[] = [
  {
    id: "ord-101",
    orderNumber: "#BS-8901",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    customer: {
      name: "Ayesha Malik",
      email: "ayesha@example.com",
      phone: "+91 98123 45678",
      address: "14 Rose Avenue, Sector 5, City",
      notes: "Please write 'Happy Birthday Sahil' on top",
    },
    items: [
      {
        lineId: "p1-1",
        productId: "p1",
        slug: "strawberry-delight",
        name: "Strawberry Delight Cake",
        illustration: "slice-berry",
        image: "/images/products/strawberry-delight.jpg",
        weightLabel: "1.0kg",
        unitPrice: 35,
        quantity: 1,
        addOns: [{ id: "a1", name: "Sparkler Candles", price: 3 }],
      },
    ],
    subtotal: 38,
    deliveryFee: 0,
    total: 38,
    paymentMethod: "UPI / Online",
    status: "Baking",
  },
];

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: mockInitialOrders,

      fetchOrdersFromSupabase: async () => {
        const fetched = await supabaseDb.select<any>("orders", "*");
        if (fetched && Array.isArray(fetched) && fetched.length > 0) {
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
          set({ orders: formatted });
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
