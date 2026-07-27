"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { kitchenQueue } from "@/lib/admin-data";

export default function AdminKitchenPage() {
  const [statuses, setStatuses] = useState<Record<string, string>>(
    Object.fromEntries(kitchenQueue.map((o) => [o.id, o.status]))
  );

  function advance(id: string) {
    setStatuses((prev) => {
      const current = prev[id];
      const next = current === "Not Started" ? "In Progress" : "Ready";
      return { ...prev, [id]: next };
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl text-ink mb-1">Kitchen Queue</h1>
        <p className="text-sm text-ink-soft">Today&apos;s orders sorted by delivery time.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {kitchenQueue.map((order) => {
          const status = statuses[order.id];
          return (
            <div key={order.id} className="neu-raised rounded-3xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-serif text-xl text-ink">{order.id}</span>
                <span className="text-xs font-bold text-cocoa">{order.time}</span>
              </div>

              <div className="flex flex-col gap-3 mb-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="neu-inset rounded-xl w-12 h-12 relative overflow-hidden shrink-0">
                      <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-ink truncate">
                        {item.qty}× {item.name}
                      </div>
                      {item.customization && (
                        <div className="text-xs text-ink-soft truncate">{item.customization}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => advance(order.id)}
                disabled={status === "Ready"}
                className={clsx(
                  "w-full py-4 rounded-2xl text-base font-bold neu-pressable disabled:opacity-60",
                  status === "Ready"
                    ? "neu-inset text-cocoa"
                    : status === "In Progress"
                    ? "bg-cocoa text-[#fff6ec] neu-raised-sm"
                    : "neu-raised-sm text-ink"
                )}
              >
                {status === "Not Started" && "Start Baking"}
                {status === "In Progress" && "Mark Ready"}
                {status === "Ready" && "✓ Ready for Pickup"}
              </button>
            </div>
          );
        })}
        {kitchenQueue.length === 0 && (
          <div className="col-span-full neu-raised rounded-3xl p-10 text-center text-ink-soft">
            No orders in the kitchen queue right now.
          </div>
        )}
      </div>
    </div>
  );
}
