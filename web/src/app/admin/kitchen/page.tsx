"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { ChefHat, CheckCircle2, Clock, Sparkles, RefreshCw } from "lucide-react";
import { useOrderStore, type OrderStatus } from "@/store/order-store";
import { Button } from "@/components/ui/Button";

export default function AdminKitchenPage() {
  const { orders, fetchOrdersFromSupabase, updateStatus } = useOrderStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrdersFromSupabase();
  }, [fetchOrdersFromSupabase]);

  async function handleRefresh() {
    setLoading(true);
    await fetchOrdersFromSupabase();
    setLoading(false);
  }

  // Filter orders that are active in kitchen (Pending or Baking)
  const kitchenOrders = orders.filter((o) => o.status === "Pending" || o.status === "Baking");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-xs font-bold tracking-widest text-cocoa uppercase mb-1 flex items-center gap-1.5">
            <ChefHat size={14} /> Kitchen Display System (KDS)
          </div>
          <h1 className="font-serif text-3xl text-ink">Kitchen Queue & Live Baking</h1>
          <p className="text-sm text-ink-soft mt-1">
            Real-time orders queue for bakers. Advance orders from Pending → Baking → Out for Delivery.
          </p>
        </div>

        <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={loading} className="gap-2">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Sync Kitchen Queue
        </Button>
      </div>

      {kitchenOrders.length === 0 ? (
        <div className="neu-raised rounded-3xl p-12 text-center flex flex-col items-center justify-center my-8">
          <div className="neu-raised-sm w-16 h-16 rounded-full flex items-center justify-center text-cocoa mb-4 bg-rose-light/40">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="font-serif text-2xl text-ink mb-2">Kitchen Queue Clear!</h3>
          <p className="text-sm text-ink-soft max-w-md">
            All customer orders have been baked and dispatched. New storefront orders will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {kitchenOrders.map((order) => {
            const isBaking = order.status === "Baking";
            return (
              <div key={order.id} className="neu-raised rounded-3xl p-6 flex flex-col justify-between border border-cocoa/10">
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-ink/10 pb-3">
                    <div>
                      <span className="font-mono font-extrabold text-lg text-cocoa">{order.orderNumber}</span>
                      <div className="text-xs text-ink-soft font-semibold">{order.customer.name}</div>
                    </div>
                    <span
                      className={clsx(
                        "px-3 py-1 rounded-full text-xs font-extrabold shadow-xs",
                        isBaking ? "bg-amber-100 text-amber-800 animate-pulse" : "bg-rose-100 text-rose-800"
                      )}
                    >
                      {isBaking ? "👩‍🍳 Baking in Progress" : "⏳ Pending Prep"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 mb-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 neu-inset p-3 rounded-2xl">
                        <div className="neu-raised-sm rounded-xl w-12 h-12 relative overflow-hidden shrink-0">
                          <Image
                            src={item.image || "/images/products/wedding-tiered-elegance.jpg"}
                            alt={item.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-ink truncate">
                            {item.quantity}× {item.name}
                          </div>
                          <div className="text-xs text-cocoa font-semibold">{item.weightLabel}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.customer.notes && (
                    <div className="neu-flat rounded-2xl p-3 mb-4 text-xs bg-rose-50 text-rose-800 border border-rose-200">
                      <span className="font-bold">Baker Note:</span> &ldquo;{order.customer.notes}&rdquo;
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  {!isBaking ? (
                    <button
                      onClick={() => updateStatus(order.id, "Baking")}
                      className="w-full py-3.5 rounded-2xl text-sm font-bold bg-amber-500 text-white shadow-md hover:bg-amber-600 transition-all flex items-center justify-center gap-2"
                    >
                      <ChefHat size={18} /> Start Baking Now
                    </button>
                  ) : (
                    <button
                      onClick={() => updateStatus(order.id, "Out for Delivery")}
                      className="w-full py-3.5 rounded-2xl text-sm font-bold bg-emerald-600 text-white shadow-md hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={18} /> Mark Baked & Ready for Delivery
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
