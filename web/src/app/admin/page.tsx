import Link from "next/link";
import { AlertTriangle, DollarSign, ShoppingBag, TrendingUp, UserPlus } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/Badge";
import {
  adminOrders,
  dashboardStats,
  lowStock,
  orderStatusBreakdown,
  reviewsQueue,
  salesTrend,
  topProducts,
} from "@/lib/admin-data";

export default function AdminDashboardPage() {
  const recentOrders = adminOrders.slice(0, 6);
  const maxTrend = Math.max(...salesTrend);
  const totalStatus = orderStatusBreakdown.reduce((s, o) => s + o.value, 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl text-ink mb-1">Dashboard</h1>
        <p className="text-sm text-ink-soft">Here&apos;s how Bakestudio is performing today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          icon={DollarSign}
          label="Today's Revenue"
          value={`$${dashboardStats.revenueToday.toFixed(2)}`}
          changePct={dashboardStats.revenueChangePct}
        />
        <StatCard
          icon={ShoppingBag}
          label="Orders Today"
          value={String(dashboardStats.ordersToday)}
          changePct={dashboardStats.ordersChangePct}
        />
        <StatCard
          icon={TrendingUp}
          label="Avg Order Value"
          value={`$${dashboardStats.avgOrderValue.toFixed(2)}`}
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
                  className={i === 1 ? "neu-raised-sm rounded-full px-3 py-1 text-cocoa" : "px-3 py-1 text-ink-soft"}
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
                <span className="text-[10px] text-ink-soft">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="neu-raised rounded-3xl p-6">
          <div className="font-serif text-xl text-ink mb-6">Order Status</div>
          <div className="flex flex-col gap-3">
            {orderStatusBreakdown.map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ink-soft">{s.label}</span>
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
            <div className="font-serif text-xl text-ink">Recent Orders</div>
            <Link href="/admin/orders" className="text-xs font-semibold text-cocoa">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ink-soft">
                  <th className="pb-2">Order</th>
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Total</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-t border-ink/5">
                    <td className="py-2.5">
                      <Link href={`/admin/orders/${o.id}`} className="font-semibold text-cocoa">
                        {o.id}
                      </Link>
                    </td>
                    <td className="py-2.5 text-ink-soft">{o.customer}</td>
                    <td className="py-2.5 font-semibold text-ink">${o.total.toFixed(2)}</td>
                    <td className="py-2.5">
                      <StatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="neu-raised rounded-3xl p-6">
            <div className="font-serif text-lg text-ink mb-4">Top Selling</div>
            <div className="flex flex-col gap-3">
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="neu-raised-sm w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-cocoa shrink-0">
                      {i + 1}
                    </span>
                    <span className="truncate text-ink">{p.name}</span>
                  </div>
                  <span className="text-ink-soft shrink-0">{p.sold} sold</span>
                </div>
              ))}
            </div>
          </div>

          <div className="neu-raised rounded-3xl p-6">
            <div className="flex items-center gap-2 font-serif text-lg text-ink mb-4">
              <AlertTriangle size={16} className="text-cocoa" /> Low Stock
            </div>
            <div className="flex flex-col gap-2">
              {lowStock.map((s) => (
                <div key={s.name} className="flex justify-between text-xs">
                  <span className="text-ink-soft">{s.name}</span>
                  <span className="font-semibold text-red-700">
                    {s.remaining} {s.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="neu-raised rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="font-serif text-xl text-ink">Reviews Needing Moderation</div>
          <Link href="/admin/content" className="text-xs font-semibold text-cocoa">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {reviewsQueue
            .filter((r) => r.status === "Pending")
            .map((r) => (
              <div key={r.id} className="neu-raised-sm rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-ink">{r.customer}</span>
                  <span className="text-xs text-cocoa font-bold">{"★".repeat(r.rating)}</span>
                </div>
                <div className="text-xs text-ink-soft mb-1">{r.product}</div>
                <p className="text-sm text-ink-soft">&ldquo;{r.text}&rdquo;</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
