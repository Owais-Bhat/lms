"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Download, Printer, Search } from "lucide-react";
import { StatusBadge } from "@/components/admin/Badge";
import { adminOrders, type AdminOrder } from "@/lib/admin-data";
import { Button } from "@/components/ui/Button";

const statusOptions: (AdminOrder["status"] | "All")[] = [
  "All",
  "Pending",
  "Confirmed",
  "Baking",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

export default function AdminOrdersPage() {
  const [status, setStatus] = useState<(typeof statusOptions)[number]>("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return adminOrders.filter((o) => {
      if (status !== "All" && o.status !== status) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        if (!o.id.toLowerCase().includes(q) && !o.customer.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [status, query]);

  function toggleAll() {
    setSelected(selected.length === filtered.length ? [] : filtered.map((o) => o.id));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-3xl text-ink mb-1">Orders</h1>
          <p className="text-sm text-ink-soft">{filtered.length} orders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Download size={14} /> Export
          </Button>
          <Button variant="ghost" size="sm">
            <Printer size={14} /> Print Labels
          </Button>
        </div>
      </div>

      <div className="neu-raised rounded-3xl p-4 flex flex-wrap gap-3 items-center">
        <div className="neu-inset rounded-full flex items-center gap-2 px-4 py-2 flex-1 min-w-[220px]">
          <Search size={14} className="text-cocoa shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order ID or customer..."
            className="bg-transparent outline-none text-sm w-full placeholder:text-ink-soft"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={
                s === status
                  ? "neu-inset rounded-full px-3 py-1.5 text-xs font-semibold text-cocoa"
                  : "neu-raised-sm rounded-full px-3 py-1.5 text-xs font-semibold text-ink-soft"
              }
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {selected.length > 0 && (
        <div className="neu-inset rounded-2xl px-4 py-3 flex items-center justify-between text-sm">
          <span className="font-semibold text-cocoa">{selected.length} selected</span>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost">
              Export Selected
            </Button>
            <Button size="sm" variant="ghost">
              Print Labels
            </Button>
          </div>
        </div>
      )}

      <div className="neu-raised rounded-3xl overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="text-left text-xs text-ink-soft border-b border-ink/5">
              <th className="p-4">
                <input
                  type="checkbox"
                  checked={selected.length === filtered.length && filtered.length > 0}
                  onChange={toggleAll}
                  className="accent-[#6B3A2F]"
                />
              </th>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Items</th>
              <th className="p-4">Total</th>
              <th className="p-4">Delivery Date</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Rider</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-b border-ink/5 last:border-0">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selected.includes(o.id)}
                    onChange={() =>
                      setSelected((prev) =>
                        prev.includes(o.id) ? prev.filter((x) => x !== o.id) : [...prev, o.id]
                      )
                    }
                    className="accent-[#6B3A2F]"
                  />
                </td>
                <td className="p-4">
                  <Link href={`/admin/orders/${o.id}`} className="font-semibold text-cocoa">
                    {o.id}
                  </Link>
                </td>
                <td className="p-4 text-ink">{o.customer}</td>
                <td className="p-4 text-ink-soft">
                  {o.items.map((it) => `${it.qty}× ${it.name}`).join(", ")}
                </td>
                <td className="p-4 font-semibold text-ink">${o.total.toFixed(2)}</td>
                <td className="p-4 text-ink-soft">{o.deliveryDate}</td>
                <td className="p-4">
                  <StatusBadge status={o.paymentStatus} />
                </td>
                <td className="p-4 text-ink-soft">{o.rider ?? "—"}</td>
                <td className="p-4">
                  <StatusBadge status={o.status} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="p-10 text-center text-ink-soft">
                  No orders match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
