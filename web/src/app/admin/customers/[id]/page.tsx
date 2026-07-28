"use client";

import { use, useEffect, useMemo } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gift, MapPin } from "lucide-react";
import { useOrderStore } from "@/store/order-store";
import { deriveCustomers } from "@/lib/derive-customers";

export default function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { orders, fetchOrdersFromSupabase, loaded } = useOrderStore();

  useEffect(() => {
    fetchOrdersFromSupabase();
  }, [fetchOrdersFromSupabase]);

  const customers = useMemo(() => deriveCustomers(orders), [orders]);
  const customer = customers.find((c) => c.id === id);

  const customerOrders = useMemo(
    () =>
      orders.filter((o) => {
        const key = o.customer.email || o.customer.phone || o.customer.name;
        return encodeURIComponent(key) === id;
      }),
    [orders, id]
  );

  if (!customer) {
    if (!loaded) return null;
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <div className="text-xs text-ink-soft mb-1">
          <Link href="/admin/customers">Customers</Link> / {customer.name}
        </div>
        <h1 className="font-serif text-3xl text-ink">{customer.name}</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="neu-raised rounded-3xl p-5">
          <div className="text-2xl font-bold text-ink">{customer.orders}</div>
          <div className="text-xs text-ink-soft">Total Orders</div>
        </div>
        <div className="neu-raised rounded-3xl p-5">
          <div className="text-2xl font-bold text-ink">₹{customer.ltv.toFixed(2)}</div>
          <div className="text-xs text-ink-soft">Lifetime Value</div>
        </div>
        <div className="neu-raised rounded-3xl p-5">
          <div className="text-2xl font-bold text-ink">{new Date(customer.joined).toLocaleDateString()}</div>
          <div className="text-xs text-ink-soft flex items-center gap-1">
            <Gift size={12} /> First Order
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
        <div className="neu-raised rounded-3xl p-6">
          <div className="text-sm font-bold text-ink mb-4">Order History</div>
          <div className="flex flex-col gap-3">
            {customerOrders.length === 0 && <p className="text-sm text-ink-soft">No orders yet.</p>}
            {customerOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between text-sm border-b border-ink/5 pb-3 last:border-0">
                <Link href={`/admin/orders/${o.id}`} className="font-semibold text-cocoa">
                  {o.orderNumber}
                </Link>
                <span className="text-ink-soft">{new Date(o.createdAt).toLocaleDateString()}</span>
                <span className="font-semibold text-ink">₹{o.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="neu-raised rounded-3xl p-6">
            <div className="text-sm font-bold text-ink mb-3 flex items-center gap-2">
              <MapPin size={14} /> Addresses
            </div>
            {customer.addresses.length === 0 ? (
              <p className="text-sm text-ink-soft">No address on file.</p>
            ) : (
              customer.addresses.map((addr) => (
                <p key={addr} className="text-sm text-ink-soft">{addr}</p>
              ))
            )}
          </div>

          <div className="neu-raised rounded-3xl p-6">
            <div className="text-sm font-bold text-ink mb-3">Contact</div>
            <p className="text-sm text-ink-soft">{customer.email || "No email"}</p>
            <p className="text-sm text-ink-soft">{customer.phone || "No phone"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
