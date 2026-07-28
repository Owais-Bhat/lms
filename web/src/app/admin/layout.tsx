"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";
import {
  Bell,
  ChefHat,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  MessageSquare,
  Package,
  Palette,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  Users,
  X,
} from "lucide-react";
import { LinkButton, Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/auth-store";

const navGroups = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/theme", label: "Theme & 3D Styling", icon: Palette },
    ],
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
    label: "Operations",
    items: [
      { href: "/admin/kitchen", label: "Kitchen Queue", icon: ChefHat },
      { href: "/admin/logistics", label: "Delivery & Logistics", icon: Truck },
    ],
  },
  {
    label: "System Settings",
    items: [
      { href: "/admin/analytics", label: "Analytics", icon: Sparkles },
      { href: "/admin/settings", label: "General Settings", icon: Settings },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout, adminUser } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auth Protection Guard
  useEffect(() => {
    if (!isAuthenticated && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [isAuthenticated, pathname, router]);

  // Bypass AdminLayout wrapper for the login page itself
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const activeLabel =
    navGroups.flatMap((g) => g.items).find((i) => i.href === pathname)?.label ?? "Dashboard";

  const Sidebar = (
    <nav className="flex flex-col gap-6 p-4 h-full overflow-y-auto">
      <Link href="/admin" className="flex items-center gap-3 px-2 mb-2">
        <div className="neu-raised-sm w-10 h-10 rounded-full flex items-center justify-center font-serif text-lg text-cocoa bg-rose-light/40">
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
                    "flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-semibold transition-all",
                    active
                      ? "neu-inset text-cocoa font-bold"
                      : "text-ink-soft hover:text-ink hover:bg-cocoa/5"
                  )}
                >
                  <item.icon size={16} className={active ? "text-cocoa" : "text-ink-soft"} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}

      <div className="mt-auto pt-4 border-t border-ink/10 flex flex-col gap-2">
        <Link href="/" target="_blank" className="text-xs text-ink-soft hover:text-cocoa flex items-center gap-2 px-3 py-2">
          <span>↗ View Live Storefront</span>
        </Link>
        <button
          onClick={() => {
            logout();
            router.push("/admin/login");
          }}
          className="flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-rose-700 hover:bg-rose-100/50 rounded-xl transition-all"
        >
          <LogOut size={15} />
          <span>Sign Out ({adminUser?.username ?? "admin"})</span>
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen flex bg-base-light">
      <aside className="hidden lg:block w-64 shrink-0 border-r border-ink/5 bg-base">{Sidebar}</aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-base neu-raised">{Sidebar}</div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 bg-base px-4 md:px-6 py-3 flex items-center justify-between gap-4 border-b border-ink/5 shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="lg:hidden neu-raised-sm w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={16} />
            </button>
            <div className="text-xs text-ink-soft truncate font-semibold">Admin / {activeLabel}</div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <LinkButton href="/admin/theme" size="sm" variant="ghost">
              <Palette size={14} /> Theme Builder
            </LinkButton>
            <LinkButton href="/admin/orders" size="sm">
              + Manage Orders
            </LinkButton>
            <div className="neu-raised-sm w-9 h-9 rounded-full flex items-center justify-center font-bold text-cocoa text-xs shrink-0 bg-rose-light/50">
              {adminUser?.username?.slice(0, 2).toUpperCase() ?? "AD"}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
