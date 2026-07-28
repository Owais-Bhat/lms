"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check, MapPin, Printer, RotateCcw } from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/admin/Badge";
import { useOrderStore, type OrderStatus } from "@/store/order-store";

const steps: OrderStatus[] = ["Pending", "Baking", "Out for Delivery", "Delivered"];

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { orders, fetchOrdersFromSupabase, updateStatus, loaded } = useOrderStore();
  const [rider, setRider] = useState("Unassigned");

  useEffect(() => {
    fetchOrdersFromSupabase();
  }, [fetchOrdersFromSupabase]);

  const order = orders.find((o) => o.id === id);

  if (!order) {
    if (!loaded) return null;
    notFound();
  }

  const status = order.status;
  const stepIdx = Math.max(0, steps.indexOf(status === "Cancelled" ? "Pending" : status));
  const isPickup = order.customer.address === "Store Pickup";
  const paymentStatus = status === "Cancelled" ? "Refunded" : "Paid";

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-xs text-ink-soft mb-1">
            <Link href="/admin/orders">Orders</Link> / {order.orderNumber}
          </div>
          <h1 className="font-serif text-3xl text-ink">{order.orderNumber}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Printer size={14} /> Invoice
          </Button>
          <Button variant="ghost" size="sm">
            <Printer size={14} /> Packing Slip
          </Button>
          {order.status !== "Cancelled" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateStatus(order.id, "Cancelled")}
            >
              Cancel Order
            </Button>
          )}
        </div>
      </div>

      {order.status !== "Cancelled" ? (
        <div className="neu-raised rounded-3xl p-6">
          <div className="text-sm font-bold text-ink mb-6">Order Status</div>
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={s} className="flex flex-col items-center flex-1 relative">
                {i > 0 && (
                  <div
                    className="absolute right-1/2 top-5 w-full h-0.5 -z-10"
                    style={{ backgroundColor: i <= stepIdx ? "#6B3A2F" : "#D8C9BA" }}
                  />
                )}
                <button
                  onClick={() => updateStatus(order.id, s)}
                  className={clsx(
                    "w-10 h-10 rounded-full flex items-center justify-center mb-2 neu-pressable",
                    i <= stepIdx ? "neu-inset text-cocoa" : "neu-raised-sm text-ink-soft"
                  )}
                >
                  {i < stepIdx ? <Check size={16} /> : <span className="text-xs font-bold">{i + 1}</span>}
                </button>
                <div className="text-xs text-center text-ink-soft">{s}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="neu-raised rounded-3xl p-6 text-center text-red-700 font-semibold">
          This order was cancelled.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
        <div className="flex flex-col gap-6">
          <div className="neu-raised rounded-3xl p-6">
            <div className="text-sm font-bold text-ink mb-4">Items</div>
            <div className="flex flex-col gap-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="neu-inset rounded-xl w-16 h-16 p-1 shrink-0 relative overflow-hidden">
                    <Image
                      src={item.image || "/images/products/wedding-tiered-elegance.jpg"}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-ink">
                      {item.quantity}× {item.name}
                    </div>
                    <div className="text-xs text-ink-soft mt-0.5">{item.weightLabel}</div>
                  </div>
                </div>
              ))}
            </div>
            {order.customer.notes && (
              <div className="text-xs text-ink-soft mt-3 pt-3 border-t border-ink/10">
                Note: {order.customer.notes}
              </div>
            )}
            <div className="border-t border-ink/10 mt-4 pt-4 flex justify-between font-bold text-ink">
              <span>Total</span>
              <span>₹{order.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="neu-raised rounded-3xl p-6">
            <div className="text-sm font-bold text-ink mb-4">Timeline</div>
            <div className="flex flex-col gap-3">
              <div className="flex gap-3 text-sm">
                <span className="text-ink-soft w-40 shrink-0">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
                <span className="text-ink">Order placed</span>
              </div>
              <div className="flex gap-3 text-sm">
                <span className="text-ink-soft w-40 shrink-0">Current status</span>
                <span className="text-ink">{order.status}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="neu-raised rounded-3xl p-6">
            <div className="text-sm font-bold text-ink mb-3">Customer</div>
            <div className="text-sm text-ink font-semibold">{order.customer.name}</div>
            <div className="text-xs text-ink-soft">{order.customer.email}</div>
            <div className="text-xs text-ink-soft">{order.customer.phone}</div>
          </div>

          <div className="neu-raised rounded-3xl p-6">
            <div className="text-sm font-bold text-ink mb-3">Delivery</div>
            <div className="flex items-start gap-2 text-sm text-ink-soft mb-3">
              <MapPin size={14} className="mt-0.5 shrink-0 text-cocoa" />
              {isPickup ? "Store Pickup" : order.customer.address}
            </div>
            <div className="text-xs text-ink-soft mb-1">Assigned Rider</div>
            <select
              value={rider}
              onChange={(e) => setRider(e.target.value)}
              className="neu-inset rounded-full px-4 py-2 text-sm w-full outline-none"
            >
              <option>Unassigned</option>
            </select>
          </div>

          <div className="neu-raised rounded-3xl p-6">
            <div className="text-sm font-bold text-ink mb-3">Payment</div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-ink-soft">Method</span>
              <span className="text-ink font-semibold">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span className="text-ink-soft">Status</span>
              <StatusBadge status={paymentStatus} />
            </div>
            <Button variant="ghost" size="sm" className="w-full">
              <RotateCcw size={14} /> Issue Refund
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
