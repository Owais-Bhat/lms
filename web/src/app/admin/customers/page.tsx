"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Badge } from "@/components/admin/Badge";
import { adminCustomers } from "@/lib/admin-data";

export default function AdminCustomersPage() {
  const [query, setQuery] = useState("");
  const filtered = adminCustomers.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-3xl text-ink">Customers</h1>

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
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="text-left text-xs text-ink-soft border-b border-ink/5">
              <th className="p-4">Customer</th>
              <th className="p-4">Orders</th>
              <th className="p-4">Lifetime Value</th>
              <th className="p-4">Loyalty Points</th>
              <th className="p-4">Tags</th>
              <th className="p-4">Joined</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-ink/5 last:border-0">
                <td className="p-4">
                  <Link href={`/admin/customers/${c.id}`} className="font-semibold text-cocoa">
                    {c.name}
                  </Link>
                  <div className="text-xs text-ink-soft">{c.email}</div>
                </td>
                <td className="p-4 text-ink">{c.orders}</td>
                <td className="p-4 font-semibold text-ink">${c.ltv.toFixed(2)}</td>
                <td className="p-4 text-ink-soft">{c.loyaltyPoints}</td>
                <td className="p-4">
                  {c.blocked ? (
                    <Badge tone="negative">Blocked</Badge>
                  ) : c.tags.length ? (
                    <div className="flex gap-1">
                      {c.tags.map((t) => (
                        <Badge key={t} tone={t === "VIP" ? "positive" : "negative"}>
                          {t}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-ink-soft text-xs">—</span>
                  )}
                </td>
                <td className="p-4 text-ink-soft">{c.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
