"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Ban, Gift, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/admin/Badge";
import { adminCustomers, adminOrders } from "@/lib/admin-data";

export default function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const customer = adminCustomers.find((c) => c.id === id);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<string[]>(["Prefers eggless options. Called once about a late delivery."]);
  const [blocked, setBlocked] = useState(customer?.blocked ?? false);

  if (!customer) notFound();

  const orders = adminOrders.filter((o) => o.customer === customer.name);

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <div className="text-xs text-ink-soft mb-1">
          <Link href="/admin/customers">Customers</Link> / {customer.name}
        </div>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="font-serif text-3xl text-ink">{customer.name}</h1>
          <Button variant="ghost" size="sm" onClick={() => setBlocked((b) => !b)}>
            <Ban size={14} /> {blocked ? "Unblock Customer" : "Block Customer"}
          </Button>
        </div>
        {blocked && <Badge tone="negative">Blocked</Badge>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="neu-raised rounded-3xl p-5">
          <div className="text-2xl font-bold text-ink">{customer.orders}</div>
          <div className="text-xs text-ink-soft">Total Orders</div>
        </div>
        <div className="neu-raised rounded-3xl p-5">
          <div className="text-2xl font-bold text-ink">${customer.ltv.toFixed(2)}</div>
          <div className="text-xs text-ink-soft">Lifetime Value</div>
        </div>
        <div className="neu-raised rounded-3xl p-5">
          <div className="text-2xl font-bold text-ink">{customer.loyaltyPoints}</div>
          <div className="text-xs text-ink-soft flex items-center gap-1">
            <Gift size={12} /> Loyalty Points
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
        <div className="neu-raised rounded-3xl p-6">
          <div className="text-sm font-bold text-ink mb-4">Order History</div>
          <div className="flex flex-col gap-3">
            {orders.length === 0 && <p className="text-sm text-ink-soft">No orders yet.</p>}
            {orders.map((o) => (
              <div key={o.id} className="flex items-center justify-between text-sm border-b border-ink/5 pb-3 last:border-0">
                <Link href={`/admin/orders/${o.id}`} className="font-semibold text-cocoa">
                  {o.id}
                </Link>
                <span className="text-ink-soft">{o.deliveryDate}</span>
                <span className="font-semibold text-ink">${o.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="neu-raised rounded-3xl p-6">
            <div className="text-sm font-bold text-ink mb-3 flex items-center gap-2">
              <MapPin size={14} /> Address
            </div>
            <p className="text-sm text-ink-soft">{customer.addresses[0]}</p>
          </div>

          <div className="neu-raised rounded-3xl p-6">
            <div className="text-sm font-bold text-ink mb-3">Internal Notes</div>
            <div className="flex flex-col gap-2 mb-3">
              {notes.map((n, i) => (
                <div key={i} className="neu-inset rounded-xl p-3 text-xs text-ink-soft">
                  {n}
                </div>
              ))}
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note..."
              rows={2}
              className="neu-inset rounded-xl px-3 py-2 text-sm w-full outline-none resize-none mb-2"
            />
            <Button
              size="sm"
              onClick={() => {
                if (note.trim()) {
                  setNotes((n) => [...n, note.trim()]);
                  setNote("");
                }
              }}
            >
              Add Note
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
