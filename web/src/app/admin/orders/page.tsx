"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Download, Printer, Search, RefreshCw, Trash2, Database } from "lucide-react";
import { StatusBadge } from "@/components/admin/Badge";
import { useOrderStore, type OrderStatus } from "@/store/order-store";
import { Button } from "@/components/ui/Button";

const statusOptions: (OrderStatus | "All")[] = [
  "All",
  "Pending",
  "Baking",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

export default function AdminOrdersPage() {
  const { orders, fetchOrdersFromSupabase, updateStatus, deleteOrder } = useOrderStore();
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrdersFromSupabase();
  }, [fetchOrdersFromSupabase]);

  async function handleRefresh() {
    setLoading(true);
    await fetchOrdersFromSupabase();
    setLoading(false);
  }

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== "All" && o.status !== statusFilter) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        if (
          !o.orderNumber.toLowerCase().includes(q) &&
          !o.customer.name.toLowerCase().includes(q) &&
          !o.customer.phone.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [orders, statusFilter, query]);

  function toggleAll() {
    setSelected(selected.length === filtered.length ? [] : filtered.map((o) => o.id));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-3xl text-ink mb-1">Live Storefront Orders</h1>
          <p className="text-sm text-ink-soft">{filtered.length} total orders recorded</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={loading} className="gap-1.5 text-cocoa">
            <Database size={14} /> {loading ? "Syncing..." : "Sync Supabase DB"}
          </Button>
          <Button variant="ghost" size="sm">
            <Download size={14} /> Export CSV
          </Button>
          <Button variant="ghost" size="sm">
            <Printer size={14} /> Print Receipts
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="neu-raised rounded-3xl p-4 flex flex-wrap gap-3 items-center">
        <div className="neu-inset rounded-full flex items-center gap-2 px-4 py-2 flex-1 min-w-[220px]">
          <Search size={14} className="text-cocoa shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Order #, customer name or phone..."
            className="bg-transparent outline-none text-sm w-full placeholder:text-ink-soft"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={
                s === statusFilter
                  ? "neu-inset rounded-full px-3 py-1.5 text-xs font-semibold text-cocoa"
                  : "neu-raised-sm rounded-full px-3 py-1.5 text-xs font-semibold text-ink-soft"
              }
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selected.length > 0 && (
        <div className="neu-inset rounded-2xl px-4 py-3 flex items-center justify-between text-sm">
          <span className="font-semibold text-cocoa">{selected.length} orders selected</span>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => selected.forEach((id) => deleteOrder(id))}>
              <Trash2 size={14} /> Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Orders Table */}
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
              <th className="p-4">Customer Details</th>
              <th className="p-4">Items & Notes</th>
              <th className="p-4">Total</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Status & Action</th>
              <th className="p-4 text-right">Remove</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-b border-ink/5 last:border-0 hover:bg-cocoa/5">
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
                  <span className="font-bold font-mono text-cocoa">{o.orderNumber}</span>
                  <div className="text-[10px] text-ink-soft">
                    {new Date(o.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-bold text-ink">{o.customer.name}</div>
                  <div className="text-xs text-ink-soft">{o.customer.phone}</div>
                  <div className="text-[11px] text-ink-soft/80 truncate max-w-[180px]">{o.customer.address}</div>
                </td>
                <td className="p-4 text-ink-soft">
                  <div className="space-y-1">
                    {o.items.map((it, idx) => (
                      <div key={idx} className="text-xs">
                        <span className="font-bold text-cocoa">{it.quantity}×</span> {it.name} ({it.weightLabel})
                      </div>
                    ))}
                    {o.customer.notes && (
                      <div className="text-[11px] font-semibold italic text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                        Note: &ldquo;{o.customer.notes}&rdquo;
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-4 font-extrabold text-ink">₹{o.total.toFixed(2)}</td>
                <td className="p-4">
                  <span className="neu-raised-sm rounded-full px-2.5 py-1 text-[11px] font-semibold text-cocoa">
                    {o.paymentMethod}
                  </span>
                </td>
                <td className="p-4">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value as OrderStatus)}
                    className="neu-inset rounded-xl px-2.5 py-1.5 text-xs font-bold text-cocoa outline-none bg-transparent cursor-pointer"
                  >
                    <option value="Pending">⏳ Pending</option>
                    <option value="Baking">👩‍🍳 Baking</option>
                    <option value="Out for Delivery">🚚 Out for Delivery</option>
                    <option value="Delivered">✅ Delivered</option>
                    <option value="Cancelled">❌ Cancelled</option>
                  </select>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => deleteOrder(o.id)}
                    className="text-rose-600 hover:text-rose-800 p-1 text-xs"
                    title="Delete order"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="p-10 text-center text-ink-soft">
                  No storefront orders match your query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
