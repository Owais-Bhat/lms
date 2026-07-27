"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import {
  Bell,
  ChefHat,
  CreditCard,
  LayoutDashboard,
  Megaphone,
  Menu,
  MessageSquare,
  Package,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Users,
  X,
} from "lucide-react";
import { LinkButton } from "@/components/ui/Button";

const navGroups = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Sales",
    items: [
      { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
      { href: "/admin/customers", label: "Customers", icon: Users },
    ],
  },
  {
    label: "Catalog",
    items: [{ href: "/admin/products", label: "Products & Categories", icon: Package }],
  },
  {
    label: "Grow",
    items: [
      { href: "/admin/marketing", label: "Marketing", icon: Megaphone },
      { href: "/admin/content", label: "Reviews & Content", icon: MessageSquare },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/admin/logistics", label: "Delivery & Logistics", icon: Truck },
      { href: "/admin/kitchen", label: "Kitchen Queue", icon: ChefHat },
      { href: "/admin/finance", label: "Payments & Finance", icon: CreditCard },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/analytics", label: "Analytics", icon: LayoutDashboard },
      { href: "/admin/staff", label: "Staff & Roles", icon: ShieldCheck },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeLabel =
    navGroups.flatMap((g) => g.items).find((i) => i.href === pathname)?.label ?? "Dashboard";

  const Sidebar = (
    <nav className="flex flex-col gap-6 p-4 h-full overflow-y-auto">
      <Link href="/admin" className="flex items-center gap-3 px-2 mb-2">
        <div className="neu-raised-sm w-10 h-10 rounded-full flex items-center justify-center font-serif text-lg text-cocoa">
          B
        </div>
        <div>
          <div className="font-serif text-lg leading-none text-ink">Bakestudio</div>
          <div className="text-[10px] text-ink-soft tracking-wide">ADMIN PANEL</div>
        </div>
      </Link>

      {navGroups.map((group) => (
        <div key={group.label}>
          <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-ink-soft px-3 mb-2">
            {group.label}
          </div>
          <div className="flex flex-col gap-1">
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-semibold",
                    active ? "neu-inset text-cocoa" : "text-ink-soft hover:text-ink"
                  )}
                >
                  <item.icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen flex bg-base-light">
      <aside className="hidden lg:block w-64 shrink-0 border-r border-ink/5">{Sidebar}</aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-base neu-raised">{Sidebar}</div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 bg-base-light px-4 md:px-6 py-3 flex items-center justify-between gap-4 border-b border-ink/5">
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="lg:hidden neu-raised-sm w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={16} />
            </button>
            <div className="text-xs text-ink-soft truncate">Admin / {activeLabel}</div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden md:flex items-center gap-2 neu-inset rounded-full px-4 py-2 w-64">
              <Search size={14} className="text-cocoa shrink-0" />
              <input
                placeholder="Search orders, products, customers..."
                className="bg-transparent outline-none text-sm w-full placeholder:text-ink-soft"
              />
            </div>
            <button className="relative neu-raised-sm w-9 h-9 rounded-full flex items-center justify-center text-cocoa">
              <Bell size={16} />
              <span className="absolute -top-1 -right-1 bg-cocoa text-[#fff6ec] text-[9px] rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>
            <LinkButton href="/admin/orders" size="sm">
              + New Order
            </LinkButton>
            <div className="neu-raised-sm w-9 h-9 rounded-full flex items-center justify-center font-bold text-cocoa text-xs shrink-0">
              OB
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
