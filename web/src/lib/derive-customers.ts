import type { Order } from "@/store/order-store";

export type DerivedCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  ltv: number;
  joined: string;
  addresses: string[];
};

// Bakestudio has no separate customers table — every "customer" is derived
// live from the real orders placed through checkout, grouped by email (or
// phone if no email was given). This keeps the CRM real instead of showing
// disconnected demo records.
export function deriveCustomers(orders: Order[]): DerivedCustomer[] {
  const byKey = new Map<string, DerivedCustomer>();

  for (const order of orders) {
    const key = order.customer.email || order.customer.phone || order.customer.name;
    if (!key) continue;
    const existing = byKey.get(key);
    if (existing) {
      existing.orders += 1;
      existing.ltv += order.total;
      if (order.createdAt < existing.joined) existing.joined = order.createdAt;
      if (order.customer.address && !existing.addresses.includes(order.customer.address)) {
        existing.addresses.push(order.customer.address);
      }
    } else {
      byKey.set(key, {
        id: encodeURIComponent(key),
        name: order.customer.name || "Unknown",
        email: order.customer.email,
        phone: order.customer.phone,
        orders: 1,
        ltv: order.total,
        joined: order.createdAt,
        addresses: order.customer.address ? [order.customer.address] : [],
      });
    }
  }

  return Array.from(byKey.values()).sort((a, b) => b.ltv - a.ltv);
}
