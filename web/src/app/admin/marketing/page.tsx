"use client";

import { useState } from "react";
import clsx from "clsx";
import { Plus, Tag, X, Check, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/admin/Badge";
import { banners, campaigns, coupons as initialCoupons } from "@/lib/admin-data";

const tabs = ["Coupons", "Banners", "Campaigns", "Loyalty", "Referrals"] as const;

export default function AdminMarketingPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Coupons");
  const [couponList, setCouponList] = useState(initialCoupons);

  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState("");
  const [value, setValue] = useState("15");
  const [type, setType] = useState<"Percent" | "Fixed">("Percent");

  function handleCreateCoupon(e: React.FormEvent) {
    e.preventDefault();
    const created = {
      code: code.toUpperCase().trim(),
      type,
      value: parseFloat(value) || 15,
      minOrder: 25,
      uses: 0,
      limit: 100,
      expiry: "2026-12-31",
      active: true,
    };
    setCouponList([created, ...couponList]);
    setShowModal(false);
    setCode("");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-xs font-bold tracking-widest text-cocoa uppercase mb-1 flex items-center gap-1.5">
            <Megaphone size={14} /> Marketing Engine
          </div>
          <h1 className="font-serif text-3xl text-ink">Promotions & Coupons</h1>
        </div>

        <Button size="sm" onClick={() => setShowModal(true)} className="gap-1.5">
          <Plus size={16} /> Create New Coupon
        </Button>
      </div>

      <div className="neu-inset rounded-full p-1 flex gap-1 flex-wrap w-fit">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx(
              "px-5 py-2.5 rounded-full text-xs font-bold transition-all",
              tab === t ? "neu-raised-sm text-cocoa font-extrabold" : "text-ink-soft hover:text-ink"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Coupons" && (
        <div className="neu-raised rounded-3xl overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="text-left text-xs text-ink-soft border-b border-ink/5">
                <th className="p-4 font-bold">Promo Code</th>
                <th className="p-4 font-bold">Discount Value</th>
                <th className="p-4 font-bold">Min Order</th>
                <th className="p-4 font-bold">Usage Count</th>
                <th className="p-4 font-bold">Expiry Date</th>
                <th className="p-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {couponList.map((c) => (
                <tr key={c.code} className="border-b border-ink/5 last:border-0 hover:bg-cocoa/5">
                  <td className="p-4 font-mono font-extrabold text-cocoa">{c.code}</td>
                  <td className="p-4 font-bold text-ink">{c.type === "Percent" ? `${c.value}% OFF` : `$${c.value} OFF`}</td>
                  <td className="p-4 text-ink-soft">${c.minOrder}</td>
                  <td className="p-4 text-ink-soft font-semibold">
                    {c.uses}/{c.limit}
                  </td>
                  <td className="p-4 text-ink-soft">{c.expiry}</td>
                  <td className="p-4">
                    <Badge tone={c.active ? "positive" : "negative"}>
                      {c.active ? "Active" : "Expired"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "Banners" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banners.map((b) => (
            <div key={b.id} className="neu-raised rounded-3xl p-5 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-ink">{b.title}</span>
                <Badge tone={b.active ? "positive" : "neutral"}>{b.active ? "Live" : "Draft"}</Badge>
              </div>
              <p className="text-xs text-ink-soft">{b.subtitle}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "Campaigns" && (
        <div className="neu-raised rounded-3xl p-6 space-y-4">
          <div className="font-bold text-ink text-base">Active Marketing Campaigns</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {campaigns.map((camp) => (
              <div key={camp.id} className="neu-raised-sm rounded-2xl p-4 space-y-2">
                <div className="flex justify-between items-center font-bold text-ink">
                  <span>{camp.name}</span>
                  <Badge tone="positive">{camp.status}</Badge>
                </div>
                <div className="text-xs text-ink-soft">Converted: {camp.conversions} orders</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setShowModal(false)} />

          <div className="relative w-full max-w-md neu-raised rounded-3xl p-6 md:p-8 shadow-2xl z-10 border border-cocoa/10">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 neu-raised-sm w-9 h-9 rounded-full flex items-center justify-center text-ink-soft hover:text-ink"
            >
              <X size={18} />
            </button>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <h2 className="font-serif text-2xl text-ink">Create Promo Coupon</h2>

              <div>
                <label className="block text-xs font-bold text-cocoa uppercase mb-1">Coupon Code</label>
                <div className="neu-inset rounded-2xl px-4 py-3 flex items-center gap-2">
                  <Tag size={16} className="text-cocoa" />
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. SWEET20"
                    className="bg-transparent outline-none text-xs font-mono font-bold text-ink uppercase w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-cocoa uppercase mb-1">Discount Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="neu-inset rounded-2xl p-3 text-xs text-ink outline-none w-full font-semibold bg-transparent"
                  >
                    <option value="Percent">Percentage (% OFF)</option>
                    <option value="Fixed">Fixed Amount ($ OFF)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-cocoa uppercase mb-1">Value</label>
                  <input
                    type="number"
                    required
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="neu-inset rounded-2xl p-3 text-xs text-ink outline-none w-full font-semibold"
                  />
                </div>
              </div>

              <Button type="submit" size="md" className="w-full justify-center gap-2">
                <Check size={16} /> Save Coupon Code
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
