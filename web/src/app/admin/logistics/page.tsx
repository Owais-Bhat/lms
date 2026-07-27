"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { Truck, CheckCircle2, MapPin, Clock, ShieldCheck, UserCheck } from "lucide-react";
import { Badge } from "@/components/admin/Badge";
import { deliveryZones, ridersList, timeSlots } from "@/lib/admin-data";
import { useOrderStore } from "@/store/order-store";
import { Button } from "@/components/ui/Button";

const tabs = ["Active Dispatches", "Zones", "Riders", "Time Slots"] as const;

export default function AdminLogisticsPage() {
  const { orders, fetchOrdersFromSupabase, updateStatus } = useOrderStore();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Active Dispatches");

  useEffect(() => {
    fetchOrdersFromSupabase();
  }, [fetchOrdersFromSupabase]);

  const dispatchOrders = orders.filter((o) => o.status === "Out for Delivery");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-xs font-bold tracking-widest text-cocoa uppercase mb-1 flex items-center gap-1.5">
            <Truck size={14} /> Logistics & Rider Management
          </div>
          <h1 className="font-serif text-3xl text-ink">Delivery Operations</h1>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => fetchOrdersFromSupabase()} className="gap-1.5">
            <Truck size={14} /> Refresh Dispatches
          </Button>
        </div>
      </div>

      <div className="neu-inset rounded-full p-1 flex gap-1 flex-wrap w-fit">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx(
              "px-5 py-2 rounded-full text-xs font-bold transition-all",
              tab === t ? "neu-raised-sm text-cocoa font-extrabold" : "text-ink-soft hover:text-ink"
            )}
          >
            {t} {t === "Active Dispatches" && `(${dispatchOrders.length})`}
          </button>
        ))}
      </div>

      {tab === "Active Dispatches" && (
        <div className="space-y-4">
          {dispatchOrders.length === 0 ? (
            <div className="neu-raised rounded-3xl p-10 text-center flex flex-col items-center justify-center my-4">
              <div className="neu-raised-sm w-14 h-14 rounded-full flex items-center justify-center text-cocoa mb-3 bg-rose-light/40">
                <Truck size={28} />
              </div>
              <h3 className="font-serif text-xl text-ink mb-1">No Active Dispatches</h3>
              <p className="text-xs text-ink-soft max-w-sm">
                Orders marked as &ldquo;Out for Delivery&rdquo; in the Kitchen KDS will appear here for rider tracking.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dispatchOrders.map((order) => (
                <div key={order.id} className="neu-raised rounded-3xl p-5 flex flex-col justify-between border border-cocoa/10">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-ink/10 pb-3">
                      <div>
                        <span className="font-mono font-bold text-cocoa">{order.orderNumber}</span>
                        <div className="text-xs font-semibold text-ink">{order.customer.name}</div>
                      </div>
                      <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                        🚚 Out for Delivery
                      </span>
                    </div>

                    <div className="text-xs space-y-1">
                      <div className="flex items-start gap-1.5 text-ink-soft">
                        <MapPin size={14} className="shrink-0 mt-0.5 text-cocoa" />
                        <span>{order.customer.address}</span>
                      </div>
                      <div className="text-ink-soft font-semibold">Phone: {order.customer.phone}</div>
                    </div>

                    <div className="neu-inset p-3 rounded-2xl text-xs space-y-1">
                      <div className="font-bold text-ink mb-1">Order Items:</div>
                      {order.items.map((it, idx) => (
                        <div key={idx} className="text-ink-soft">
                          {it.quantity}× {it.name} ({it.weightLabel})
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-2">
                    <button
                      onClick={() => updateStatus(order.id, "Delivered")}
                      className="w-full py-3 rounded-2xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <CheckCircle2 size={16} /> Confirm Order Delivered to Customer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "Zones" && (
        <div className="neu-raised rounded-3xl overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="text-left text-xs text-ink-soft border-b border-ink/5">
                <th className="p-4 font-bold">Delivery Zone Name</th>
                <th className="p-4 font-bold">Standard Fee</th>
                <th className="p-4 font-bold">Daily Cutoff</th>
                <th className="p-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {deliveryZones.map((z) => (
                <tr key={z.id} className="border-b border-ink/5 last:border-0 hover:bg-cocoa/5">
                  <td className="p-4 font-bold text-ink">{z.name}</td>
                  <td className="p-4 text-cocoa font-bold">${z.fee.toFixed(2)}</td>
                  <td className="p-4 text-ink-soft">{z.cutoff}</td>
                  <td className="p-4">
                    <Badge tone={z.serviceable ? "positive" : "negative"}>
                      {z.serviceable ? "Active Service" : "Disabled"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "Riders" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {ridersList.map((r) => (
            <div key={r.id} className="neu-raised rounded-3xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-ink text-base">{r.name}</span>
                  <Badge tone={r.status === "Available" ? "positive" : "negative"}>{r.status}</Badge>
                </div>
                <div className="text-xs text-ink-soft mb-2">Vehicle: {r.vehicle}</div>
                <div className="text-xs text-cocoa font-bold">Phone: {r.phone}</div>
              </div>
              <div className="text-[11px] text-ink-soft border-t border-ink/10 pt-3 mt-3">
                Completed Today: <strong>{r.deliveriesToday} deliveries</strong>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "Time Slots" && (
        <div className="neu-raised rounded-3xl p-6 space-y-3">
          <div className="text-sm font-bold text-ink mb-3">Serviceable Delivery Windows</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {timeSlots.map((ts) => (
              <div key={ts.slot} className="neu-raised-sm rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <div className="font-bold text-sm text-ink">{ts.slot}</div>
                  <div className="text-xs text-ink-soft">Capacity: {ts.capacity} deliveries</div>
                </div>
                <Badge tone={ts.active ? "positive" : "neutral"}>{ts.active ? "Open Slot" : "Full"}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
