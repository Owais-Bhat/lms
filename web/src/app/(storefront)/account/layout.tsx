"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Gift, Heart, LayoutDashboard, MapPin, Package, User } from "lucide-react";

const tabs = [
  { href: "/account", label: "Overview", icon: LayoutDashboard },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/rewards", label: "Rewards", icon: Gift },
  { href: "/account/profile", label: "Profile", icon: User },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="px-4 md:px-8 py-10 max-w-6xl mx-auto">
      <h1 className="font-serif text-4xl text-ink mb-8">My Account</h1>
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
        <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible neu-raised rounded-3xl p-3 h-fit">
          {tabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold whitespace-nowrap",
                  active ? "neu-inset text-cocoa" : "text-ink-soft"
                )}
              >
                <tab.icon size={16} />
                {tab.label}
              </Link>
            );
          })}
        </nav>
        <div>{children}</div>
      </div>
    </div>
  );
}
