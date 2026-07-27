"use client";

import { useState } from "react";
import clsx from "clsx";
import { Badge } from "@/components/admin/Badge";
import { deliveryZones, ridersList, timeSlots } from "@/lib/admin-data";

const tabs = ["Zones", "Time Slots", "Riders", "Cutoffs"] as const;

export default function AdminLogisticsPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Zones");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-3xl text-ink">Delivery & Logistics</h1>

      <div className="neu-inset rounded-full p-1 flex gap-1 flex-wrap w-fit">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx(
              "px-4 py-2 rounded-full text-xs font-semibold",
              tab === t ? "neu-raised-sm text-cocoa" : "text-ink-soft"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Zones" && (
        <div className="neu-raised rounded-3xl overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="text-left text-xs text-ink-soft border-b border-ink/5">
                <th className="p-4">Zone</th>
                <th className="p-4">Delivery Fee</th>
                <th className="p-4">Order Cutoff</th>
                <th className="p-4">Serviceable</th>
              </tr>
            </thead>
            <tbody>
              {deliveryZones.map((z) => (
                <tr key={z.id} className="border-b border-ink/5 last:border-0">
                  <td className="p-4 font-semibold text-ink">{z.name}</td>
                  <td className="p-4 text-ink-soft">${z.fee.toFixed(2)}</td>
                  <td className="p-4 text-ink-soft">{z.cutoff}</td>
                  <td className="p-4">
                    <Badge tone={z.serviceable ? "positive" : "negative"}>
                      {z.serviceable ? "Active" : "Disabled"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "Time Slots" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {timeSlots.map((t) => (
            <div key={t.id} className="neu-raised rounded-3xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-ink">{t.label}</span>
                {t.surcharge > 0 && <span className="text-xs text-cocoa font-bold">+${t.surcharge}</span>}
              </div>
              <div className="text-xs text-ink-soft mb-2">
                Capacity: {t.booked}/{t.capacity} booked
              </div>
              <div className="neu-inset rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-cocoa rounded-full"
                  style={{ width: `${(t.booked / t.capacity) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "Riders" && (
        <div className="neu-raised rounded-3xl overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="text-left text-xs text-ink-soft border-b border-ink/5">
                <th className="p-4">Rider</th>
                <th className="p-4">Zone</th>
                <th className="p-4">Deliveries</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {ridersList.map((r) => (
                <tr key={r.id} className="border-b border-ink/5 last:border-0">
                  <td className="p-4 font-semibold text-ink">{r.name}</td>
                  <td className="p-4 text-ink-soft">{r.zone}</td>
                  <td className="p-4 text-ink-soft">{r.deliveries}</td>
                  <td className="p-4 text-cocoa font-semibold">★ {r.rating}</td>
                  <td className="p-4">
                    <Badge tone={r.status === "On Duty" ? "positive" : "neutral"}>{r.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "Cutoffs" && (
        <div className="neu-raised rounded-3xl p-6 max-w-lg flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-ink block mb-1.5">Same-day order cutoff</label>
            <input defaultValue="2:00 PM" className="neu-inset rounded-xl px-4 py-3 text-sm w-full outline-none" />
          </div>
          <div>
            <label className="text-xs font-bold text-ink block mb-1.5">Custom cake lead time</label>
            <input defaultValue="48 hours" className="neu-inset rounded-xl px-4 py-3 text-sm w-full outline-none" />
          </div>
          <div>
            <label className="text-xs font-bold text-ink block mb-1.5">Blackout dates</label>
            <input defaultValue="Dec 25, Jan 1" className="neu-inset rounded-xl px-4 py-3 text-sm w-full outline-none" />
          </div>
        </div>
      )}
    </div>
  );
}
