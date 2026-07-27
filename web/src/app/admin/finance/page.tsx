"use client";

import { useState } from "react";
import clsx from "clsx";
import { CreditCard } from "lucide-react";
import { Badge } from "@/components/admin/Badge";
import { transactions } from "@/lib/admin-data";

const tabs = ["Gateways", "Transactions", "Tax", "Invoices"] as const;

const gateways = [
  { name: "Stripe", enabled: true, mode: "Live" },
  { name: "Razorpay", enabled: true, mode: "Live" },
  { name: "PayPal", enabled: false, mode: "Test" },
];

export default function AdminFinancePage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Gateways");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-3xl text-ink">Payments & Finance</h1>

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

      {tab === "Gateways" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {gateways.map((g) => (
            <div key={g.name} className="neu-raised rounded-3xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="neu-raised-sm w-9 h-9 rounded-full flex items-center justify-center text-cocoa">
                  <CreditCard size={16} />
                </div>
                <span className="font-semibold text-ink">{g.name}</span>
              </div>
              <Badge tone={g.enabled ? "positive" : "neutral"}>
                {g.enabled ? `Enabled — ${g.mode}` : "Disabled"}
              </Badge>
            </div>
          ))}
        </div>
      )}

      {tab === "Transactions" && (
        <div className="neu-raised rounded-3xl overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="text-left text-xs text-ink-soft border-b border-ink/5">
                <th className="p-4">Transaction</th>
                <th className="p-4">Order</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Method</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b border-ink/5 last:border-0">
                  <td className="p-4 font-mono text-ink-soft text-xs">{t.id}</td>
                  <td className="p-4 font-semibold text-cocoa">{t.orderId}</td>
                  <td className="p-4 font-semibold text-ink">${t.amount.toFixed(2)}</td>
                  <td className="p-4 text-ink-soft">{t.method}</td>
                  <td className="p-4 text-ink-soft">{t.date}</td>
                  <td className="p-4">
                    <Badge tone={t.status === "Success" ? "positive" : "negative"}>{t.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "Tax" && (
        <div className="neu-raised rounded-3xl p-6 max-w-lg flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-ink block mb-1.5">Standard tax rate (%)</label>
            <input defaultValue="5" className="neu-inset rounded-xl px-4 py-3 text-sm w-full outline-none" />
          </div>
          <div>
            <label className="text-xs font-bold text-ink block mb-1.5">Tax ID / GST Number</label>
            <input defaultValue="GSTIN-29ABCDE1234F1Z5" className="neu-inset rounded-xl px-4 py-3 text-sm w-full outline-none" />
          </div>
        </div>
      )}

      {tab === "Invoices" && (
        <div className="neu-raised rounded-3xl p-6 max-w-lg flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-ink block mb-1.5">Invoice number format</label>
            <input defaultValue="BS-INV-{YYYY}-{0000}" className="neu-inset rounded-xl px-4 py-3 text-sm w-full outline-none" />
          </div>
          <label className="flex items-center justify-between text-sm">
            <span className="text-ink">Auto-email invoice on delivery</span>
            <span className="w-10 h-5 rounded-full neu-inset relative">
              <span className="absolute top-0.5 left-5 w-4 h-4 rounded-full bg-cocoa" />
            </span>
          </label>
        </div>
      )}
    </div>
  );
}
