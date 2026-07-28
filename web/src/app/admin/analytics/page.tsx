"use client";

import { useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useOrderStore } from "@/store/order-store";
import { deriveCustomers } from "@/lib/derive-customers";

const reportTypes = ["Sales", "Products", "Customers", "Delivery", "Marketing"] as const;

export default function AdminAnalyticsPage() {
  const [report, setReport] = useState<(typeof reportTypes)[number]>("Sales");
  const { orders, fetchOrdersFromSupabase } = useOrderStore();

  useEffect(() => {
    fetchOrdersFromSupabase();
  }, [fetchOrdersFromSupabase]);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const completedOrders = orders.filter((o) => o.status !== "Cancelled").length;

  const topProducts = useMemo(() => {
    const sold: Record<string, { sold: number; revenue: number }> = {};
    orders.forEach((o) => {
      o.items.forEach((item) => {
        const entry = sold[item.name] ?? { sold: 0, revenue: 0 };
        entry.sold += item.quantity;
        entry.revenue += item.unitPrice * item.quantity;
        sold[item.name] = entry;
      });
    });
    return Object.entries(sold)
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.sold - a.sold);
  }, [orders]);

  const customers = useMemo(() => deriveCustomers(orders), [orders]);
  const repeatCustomers = customers.filter((c) => c.orders > 1).length;
  const repeatRate = customers.length > 0 ? Math.round((repeatCustomers / customers.length) * 100) : 0;

  const trend = useMemo(() => {
    const days: { label: string; value: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayTotal = orders
        .filter((o) => new Date(o.createdAt).toDateString() === d.toDateString())
        .reduce((sum, o) => sum + o.total, 0);
      days.push({ label: d.toLocaleDateString(undefined, { weekday: "short" }), value: dayTotal });
    }
    return days;
  }, [orders]);
  const maxTrend = Math.max(1, ...trend.map((d) => d.value));

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

        {(report === "Sales" || report === "Products") && (
          <div className="flex items-end gap-3 h-40 mb-6">
            {trend.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full neu-raised-sm rounded-t-lg"
                  style={{ height: `${Math.max(2, (d.value / maxTrend) * 100)}%`, background: "linear-gradient(180deg, #E7B6A4, #6B3A2F)" }}
                />
                <span className="text-[10px] text-ink-soft font-semibold">{d.label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="overflow-x-auto">
          {report === "Sales" && (
            <table className="w-full text-sm min-w-[400px]">
              <thead>
                <tr className="text-left text-xs text-ink-soft border-b border-ink/5">
                  <th className="p-3">Metric</th>
                  <th className="p-3">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-ink/5">
                  <td className="p-3 text-ink">Total Revenue</td>
                  <td className="p-3 font-semibold text-ink">₹{totalRevenue.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="p-3 text-ink">Orders Completed</td>
                  <td className="p-3 font-semibold text-ink">{completedOrders}</td>
                </tr>
              </tbody>
            </table>
          )}

          {report === "Products" && (
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="text-left text-xs text-ink-soft border-b border-ink/5">
                  <th className="p-3">Product</th>
                  <th className="p-3">Units Sold</th>
                  <th className="p-3">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p) => (
                  <tr key={p.name} className="border-b border-ink/5 last:border-0">
                    <td className="p-3 text-ink">{p.name}</td>
                    <td className="p-3 font-semibold text-ink">{p.sold} sold</td>
                    <td className="p-3 text-ink-soft">₹{p.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {report === "Products" && topProducts.length === 0 && (
            <p className="text-sm text-ink-soft py-4">No sales data yet.</p>
          )}

          {report === "Customers" && (
            <table className="w-full text-sm min-w-[400px]">
              <thead>
                <tr className="text-left text-xs text-ink-soft border-b border-ink/5">
                  <th className="p-3">Metric</th>
                  <th className="p-3">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-ink/5">
                  <td className="p-3 text-ink">Total Customers</td>
                  <td className="p-3 font-semibold text-ink">{customers.length}</td>
                </tr>
                <tr>
                  <td className="p-3 text-ink">Repeat Purchase Rate</td>
                  <td className="p-3 font-semibold text-ink">{repeatRate}%</td>
                </tr>
              </tbody>
            </table>
          )}

          {report === "Delivery" && (
            <p className="text-sm text-ink-soft py-4">
              Delivery timing analytics require dispatch/delivery timestamps, which aren&apos;t tracked yet.
            </p>
          )}

          {report === "Marketing" && (
            <p className="text-sm text-ink-soft py-4">
              Coupon and campaign attribution isn&apos;t tracked yet — this report will populate once that&apos;s wired up.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
