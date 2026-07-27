"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { topProducts } from "@/lib/admin-data";

const reportTypes = ["Sales", "Products", "Customers", "Delivery", "Marketing"] as const;

export default function AdminAnalyticsPage() {
  const [report, setReport] = useState<(typeof reportTypes)[number]>("Sales");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-serif text-3xl text-ink">Analytics & Reports</h1>
        <Button variant="ghost" size="sm">
          <Download size={14} /> Export
        </Button>
      </div>

      <div className="neu-raised rounded-3xl p-4 flex flex-wrap items-center gap-3">
        <div className="neu-inset rounded-full p-1 flex gap-1 flex-wrap">
          {reportTypes.map((r) => (
            <button
              key={r}
              onClick={() => setReport(r)}
              className={
                r === report
                  ? "neu-raised-sm rounded-full px-4 py-2 text-xs font-semibold text-cocoa"
                  : "px-4 py-2 text-xs font-semibold text-ink-soft"
              }
            >
              {r}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-2">
          <input type="date" className="neu-inset rounded-full px-4 py-2 text-xs outline-none" />
          <input type="date" className="neu-inset rounded-full px-4 py-2 text-xs outline-none" />
        </div>
      </div>

      <div className="neu-raised rounded-3xl p-6">
        <div className="font-serif text-xl text-ink mb-6">{report} Report</div>
        <div className="flex items-end gap-3 h-40 mb-6">
          {[62, 78, 45, 90, 71, 55, 84].map((v, i) => (
            <div key={i} className="flex-1 neu-raised-sm rounded-t-lg" style={{ height: `${v}%`, background: "linear-gradient(180deg, #E7B6A4, #6B3A2F)" }} />
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="text-left text-xs text-ink-soft border-b border-ink/5">
                <th className="p-3">Metric</th>
                <th className="p-3">This Period</th>
                <th className="p-3">Previous Period</th>
                <th className="p-3">Change</th>
              </tr>
            </thead>
            <tbody>
              {report === "Sales" && (
                <>
                  <tr className="border-b border-ink/5">
                    <td className="p-3 text-ink">Total Revenue</td>
                    <td className="p-3 font-semibold text-ink">$18,420</td>
                    <td className="p-3 text-ink-soft">$16,120</td>
                    <td className="p-3 text-cocoa font-semibold">+14.3%</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-ink">Orders Completed</td>
                    <td className="p-3 font-semibold text-ink">412</td>
                    <td className="p-3 text-ink-soft">378</td>
                    <td className="p-3 text-cocoa font-semibold">+9.0%</td>
                  </tr>
                </>
              )}
              {report === "Products" &&
                topProducts.map((p) => (
                  <tr key={p.name} className="border-b border-ink/5 last:border-0">
                    <td className="p-3 text-ink">{p.name}</td>
                    <td className="p-3 font-semibold text-ink">{p.sold} sold</td>
                    <td className="p-3 text-ink-soft">${p.revenue}</td>
                    <td className="p-3 text-cocoa font-semibold">—</td>
                  </tr>
                ))}
              {report === "Customers" && (
                <>
                  <tr className="border-b border-ink/5">
                    <td className="p-3 text-ink">Repeat Purchase Rate</td>
                    <td className="p-3 font-semibold text-ink">38%</td>
                    <td className="p-3 text-ink-soft">34%</td>
                    <td className="p-3 text-cocoa font-semibold">+4pp</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-ink">Cart Abandonment</td>
                    <td className="p-3 font-semibold text-ink">61%</td>
                    <td className="p-3 text-ink-soft">64%</td>
                    <td className="p-3 text-cocoa font-semibold">-3pp</td>
                  </tr>
                </>
              )}
              {report === "Delivery" && (
                <tr>
                  <td className="p-3 text-ink">On-Time Delivery Rate</td>
                  <td className="p-3 font-semibold text-ink">94%</td>
                  <td className="p-3 text-ink-soft">91%</td>
                  <td className="p-3 text-cocoa font-semibold">+3pp</td>
                </tr>
              )}
              {report === "Marketing" && (
                <tr>
                  <td className="p-3 text-ink">Coupon ROI</td>
                  <td className="p-3 font-semibold text-ink">4.2x</td>
                  <td className="p-3 text-ink-soft">3.7x</td>
                  <td className="p-3 text-cocoa font-semibold">+0.5x</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
