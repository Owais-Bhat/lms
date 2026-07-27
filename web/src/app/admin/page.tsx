"use client";

import Link from "next/link";
import { AlertTriangle, DollarSign, Palette, ShoppingBag, Sparkles, TrendingUp, UserPlus } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/Badge";
import { useOrderStore } from "@/store/order-store";
import {
  dashboardStats,
  lowStock,
  orderStatusBreakdown,
  salesTrend,
  topProducts,
} from "@/lib/admin-data";

export default function AdminDashboardPage() {
  const { orders } = useOrderStore();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const recentOrders = orders.slice(0, 6);

  const maxTrend = Math.max(...salesTrend);
  const totalStatus = orderStatusBreakdown.reduce((s, o) => s + o.value, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-3xl text-ink mb-1">Dashboard</h1>
          <p className="text-sm text-ink-soft">Here&apos;s how Bakestudio is performing today.</p>
        </div>
        <Link
          href="/admin/theme"
          className="neu-raised-sm rounded-2xl px-5 py-2.5 text-xs font-bold text-cocoa bg-rose-light/40 flex items-center gap-2 hover:neu-inset transition-all"
        >
          <Palette size={16} /> Customize Website Theme & 3D BG ↗
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          changePct={dashboardStats.revenueChangePct}
        />
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={String(totalOrdersCount)}
          changePct={dashboardStats.ordersChangePct}
        />
        <StatCard
          icon={TrendingUp}
          label="Avg Order Value"
          value={`$${(totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 32).toFixed(2)}`}
          changePct={dashboardStats.avgOrderChangePct}
        />
        <StatCard
          icon={UserPlus}
          label="New Customers"
          value={String(dashboardStats.newCustomersToday)}
          changePct={dashboardStats.newCustomersChangePct}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
        <div className="neu-raised rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="font-serif text-xl text-ink">Sales Trend</div>
            <div className="neu-inset rounded-full p-1 flex gap-1 text-xs font-semibold">
              {["Today", "Week", "Month"].map((r, i) => (
                <span
                  key={r}
                  className={i === 1 ? "neu-raised-sm rounded-full px-3 py-1 text-cocoa font-bold" : "px-3 py-1 text-ink-soft"}
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-3 h-40">
            {salesTrend.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full neu-raised-sm rounded-t-lg"
                  style={{ height: `${(v / maxTrend) * 100}%`, background: "linear-gradient(180deg, #E7B6A4, #6B3A2F)" }}
                />
                <span className="text-[10px] text-ink-soft font-semibold">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="neu-raised rounded-3xl p-6">
          <div className="font-serif text-xl text-ink mb-6">Order Breakdown</div>
          <div className="flex flex-col gap-3">
            {orderStatusBreakdown.map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ink-soft font-semibold">{s.label}</span>
                  <span className="font-semibold text-ink">{s.value}%</span>
                </div>
                <div className="neu-inset rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(s.value / totalStatus) * 100}%`, background: s.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
        <div className="neu-raised rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="font-serif text-xl text-ink">Recent Customer Orders</div>
            <Link href="/admin/orders" className="text-xs font-bold text-cocoa hover:underline">
              View All Orders →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ink-soft border-b border-ink/5">
                  <th className="pb-3 font-bold">Order ID</th>
                  <th className="pb-3 font-bold">Customer</th>
                  <th className="pb-3 font-bold">Total</th>
                  <th className="pb-3 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-ink/5 last:border-0 hover:bg-cocoa/5">
                    <td className="py-3 font-bold font-mono text-cocoa">{o.orderNumber}</td>
                    <td className="py-3 text-ink font-semibold">{o.customer.name}</td>
                    <td className="py-3 font-extrabold text-ink">${o.total.toFixed(2)}</td>
                    <td className="py-3">
                      <span className="neu-raised-sm rounded-full px-2.5 py-1 text-[11px] font-bold text-cocoa">
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="neu-raised rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-rose-700 mb-2">
              <AlertTriangle size={18} />
              <div className="font-serif text-lg text-ink font-bold">Inventory Alerts</div>
            </div>
            <p className="text-xs text-ink-soft mb-4">Ingredients reaching re-order threshold</p>

            <div className="space-y-3">
              {lowStock.map((item) => (
                <div key={item.name} className="flex justify-between items-center neu-inset rounded-2xl p-3 text-xs">
                  <div>
                    <div className="font-bold text-ink">{item.name}</div>
                    <div className="text-[10px] text-ink-soft">Threshold: {item.threshold} {item.unit}</div>
                  </div>
                  <span className="text-rose-700 font-extrabold font-mono bg-rose-100 px-2 py-1 rounded-md">
                    {item.current} {item.unit} left
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/admin/products"
            className="neu-raised-sm rounded-2xl p-3 text-center text-xs font-bold text-cocoa mt-4 hover:neu-inset transition-all"
          >
            Manage Product Catalog →
          </Link>
        </div>
      </div>
    </div>
  );
}
