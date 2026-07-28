"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useOrderStore } from "@/store/order-store";
import { deriveCustomers } from "@/lib/derive-customers";

export default function AdminCustomersPage() {
  const [query, setQuery] = useState("");
  const { orders, fetchOrdersFromSupabase } = useOrderStore();

  useEffect(() => {
    fetchOrdersFromSupabase();
  }, [fetchOrdersFromSupabase]);

  const customers = useMemo(() => deriveCustomers(orders), [orders]);
  const filtered = customers.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl text-ink">Customers</h1>
        <p className="text-xs text-ink-soft mt-1">Derived live from real storefront orders.</p>
      </div>

      <div className="neu-inset rounded-full flex items-center gap-2 px-4 py-2.5 max-w-sm">
        <Search size={14} className="text-cocoa shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search customers..."
          className="bg-transparent outline-none text-sm w-full placeholder:text-ink-soft"
        />
      </div>

      <div className="neu-raised rounded-3xl overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="text-left text-xs text-ink-soft border-b border-ink/5">
              <th className="p-4">Customer</th>
              <th className="p-4">Orders</th>
              <th className="p-4">Lifetime Value</th>
              <th className="p-4">First Order</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-ink/5 last:border-0">
                <td className="p-4">
                  <Link href={`/admin/customers/${c.id}`} className="font-semibold text-cocoa">
                    {c.name}
                  </Link>
                  <div className="text-xs text-ink-soft">{c.email || c.phone}</div>
                </td>
                <td className="p-4 text-ink">{c.orders}</td>
                <td className="p-4 font-semibold text-ink">₹{c.ltv.toFixed(2)}</td>
                <td className="p-4 text-ink-soft">{new Date(c.joined).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-sm text-ink-soft p-6 text-center">
            {customers.length === 0 ? "No customers yet — they'll appear here after the first order." : "No customers match your search."}
          </p>
        )}
      </div>
    </div>
  );
}
