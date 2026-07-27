"use client";

import { useState } from "react";
import clsx from "clsx";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/admin/Badge";
import { banners, campaigns, coupons } from "@/lib/admin-data";

const tabs = ["Coupons", "Banners", "Campaigns", "Loyalty", "Referrals"] as const;

export default function AdminMarketingPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Coupons");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-3xl text-ink">Marketing & Promotions</h1>

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

      {tab === "Coupons" && (
        <div className="neu-raised rounded-3xl overflow-x-auto">
          <div className="flex justify-end p-4">
            <Button size="sm">
              <Plus size={14} /> New Coupon
            </Button>
          </div>
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="text-left text-xs text-ink-soft border-b border-ink/5">
                <th className="p-4">Code</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Min Order</th>
                <th className="p-4">Usage</th>
                <th className="p-4">Expiry</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.code} className="border-b border-ink/5 last:border-0">
                  <td className="p-4 font-mono font-semibold text-cocoa">{c.code}</td>
                  <td className="p-4 text-ink">{c.type === "Percent" ? `${c.value}%` : `$${c.value}`}</td>
                  <td className="p-4 text-ink-soft">${c.minOrder}</td>
                  <td className="p-4 text-ink-soft">
                    {c.uses}/{c.limit}
                  </td>
                  <td className="p-4 text-ink-soft">{c.expiry}</td>
                  <td className="p-4">
                    <Badge tone={c.active ? "positive" : "negative"}>{c.active ? "Active" : "Expired"}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "Banners" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {banners.map((b) => (
            <div key={b.id} className="neu-raised rounded-3xl p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="font-serif text-lg text-ink">{b.title}</div>
                <Badge tone={b.live ? "positive" : "neutral"}>{b.live ? "Live" : "Scheduled"}</Badge>
              </div>
              <div className="text-xs text-ink-soft mb-1">Links to: {b.link}</div>
              <div className="text-xs text-ink-soft">
                {b.start} → {b.end}
              </div>
            </div>
          ))}
          <button className="neu-flat rounded-3xl p-5 text-sm font-semibold text-cocoa flex items-center justify-center gap-2">
            <Plus size={14} /> Add Banner
          </button>
        </div>
      )}

      {tab === "Campaigns" && (
        <div className="neu-raised rounded-3xl overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="text-left text-xs text-ink-soft border-b border-ink/5">
                <th className="p-4">Campaign</th>
                <th className="p-4">Channel</th>
                <th className="p-4">Audience</th>
                <th className="p-4">Sent / Opened / Clicked</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id} className="border-b border-ink/5 last:border-0">
                  <td className="p-4 font-semibold text-ink">{c.name}</td>
                  <td className="p-4 text-ink-soft">{c.channel}</td>
                  <td className="p-4 text-ink-soft">{c.audience}</td>
                  <td className="p-4 text-ink-soft">
                    {c.sent} / {c.opened} / {c.clicked}
                  </td>
                  <td className="p-4">
                    <Badge tone={c.status === "Active" ? "positive" : "neutral"}>{c.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "Loyalty" && (
        <div className="neu-raised rounded-3xl p-6 max-w-lg flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-ink block mb-1.5">Points per $1 spent</label>
            <input defaultValue="1" className="neu-inset rounded-xl px-4 py-3 text-sm w-full outline-none" />
          </div>
          <div>
            <label className="text-xs font-bold text-ink block mb-1.5">Redemption value (points → $)</label>
            <input defaultValue="100 pts = $1" className="neu-inset rounded-xl px-4 py-3 text-sm w-full outline-none" />
          </div>
          <div>
            <label className="text-xs font-bold text-ink block mb-1.5">Birthday bonus points</label>
            <input defaultValue="50" className="neu-inset rounded-xl px-4 py-3 text-sm w-full outline-none" />
          </div>
          <Button className="self-start" size="sm">
            Save Settings
          </Button>
        </div>
      )}

      {tab === "Referrals" && (
        <div className="neu-raised rounded-3xl p-6 max-w-lg flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-ink block mb-1.5">Reward for referrer</label>
            <input defaultValue="100 loyalty points" className="neu-inset rounded-xl px-4 py-3 text-sm w-full outline-none" />
          </div>
          <div>
            <label className="text-xs font-bold text-ink block mb-1.5">Reward for referred friend</label>
            <input defaultValue="15% off first order" className="neu-inset rounded-xl px-4 py-3 text-sm w-full outline-none" />
          </div>
          <Button className="self-start" size="sm">
            Save Settings
          </Button>
        </div>
      )}
    </div>
  );
}
