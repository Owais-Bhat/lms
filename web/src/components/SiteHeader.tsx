"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Menu, Search, ShieldCheck, ShoppingBag, User, X } from "lucide-react";
import clsx from "clsx";
import Image from "next/image";
import { LinkButton } from "@/components/ui/Button";
import { useCartStore, cartCount } from "@/store/cart-store";
import { useWishlistStore } from "@/store/cart-store";
import { useThemeStore } from "@/store/theme-store";
import { products } from "@/lib/data";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/custom-cake-builder", label: "Custom Cakes" },
  { href: "/corporate", label: "Corporate" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact Us" },
];

type SiteHeaderProps = {
  onOpenCart?: () => void;
};

export function SiteHeader({ onOpenCart }: SiteHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const lines = useCartStore((s) => s.lines);
  const wishlistIds = useWishlistStore((s) => s.ids);
  const { siteTagline } = useThemeStore();

  useEffect(() => setMounted(true), []);

  const count = mounted ? cartCount(lines) : 0;
  const wishCount = mounted ? wishlistIds.length : 0;

  const suggestions =
    query.trim().length > 0
      ? products
          .filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))
          .slice(0, 5)
      : [];

  return (
    <header className="sticky top-0 z-40 bg-base px-4 md:px-8 py-4 flex items-center justify-between gap-4 flex-wrap shadow-[0_4px_12px_rgba(60,42,34,0.06)] transition-colors duration-300">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-14 h-14 rounded-full overflow-hidden neu-raised-sm shrink-0">
          <Image
            src="/397933929_349910914162675_2573495290687325833_n.jpg"
            alt="Bakestudio Logo"
            width={56}
            height={56}
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <div className="font-serif text-xl leading-none text-ink">Bakestudio</div>
          <div className="text-[11px] text-ink-soft">{siteTagline || "Treat yourself to something special"}</div>
        </div>
      </Link>

      <nav className="hidden lg:flex items-center gap-2">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "px-4 py-2 rounded-full text-sm font-semibold neu-pressable transition-all",
                active ? "neu-inset text-cocoa" : "text-ink-soft hover:text-ink"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden sm:block">
          <div
            className={clsx(
              "flex items-center gap-2 rounded-full transition-all overflow-hidden",
              searchOpen ? "neu-inset px-3 py-2 w-56" : "neu-raised-sm w-10 h-10 justify-center cursor-pointer"
            )}
            onClick={() => !searchOpen && setSearchOpen(true)}
          >
            <Search size={18} className="text-cocoa shrink-0" />
            {searchOpen && (
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && query.trim()) {
                    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
                    setSearchOpen(false);
                  }
                  if (e.key === "Escape") setSearchOpen(false);
                }}
                onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
                placeholder="Search cakes..."
                className="bg-transparent outline-none text-sm w-full placeholder:text-ink-soft"
              />
            )}
          </div>
          {searchOpen && suggestions.length > 0 && (
            <div className="absolute top-12 right-0 w-64 neu-raised rounded-2xl p-2 z-50">
              {suggestions.map((s) => (
                <Link
                  key={s.id}
                  href={`/product/${s.slug}`}
                  className="block px-3 py-2 rounded-xl text-sm hover:neu-inset"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Wishlist */}
        <Link href="/account/wishlist" className="relative">
          <div className="neu-raised-sm w-10 h-10 rounded-full flex items-center justify-center text-cocoa">
            <Heart size={18} />
          </div>
          {wishCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-cocoa text-[#fff6ec] text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
              {wishCount}
            </span>
          )}
        </Link>

        {/* Admin Quick Trigger */}
        <Link href="/admin" title="Admin Control Panel">
          <div className="neu-raised-sm w-10 h-10 rounded-full flex items-center justify-center text-cocoa hover:bg-rose-light/50 transition-all">
            <ShieldCheck size={18} />
          </div>
        </Link>

        {/* Shopping Cart Drawer Trigger */}
        <button
          onClick={onOpenCart ? onOpenCart : () => router.push("/cart")}
          className="relative neu-raised-sm w-10 h-10 rounded-full flex items-center justify-center text-cocoa"
          title="Open Cart"
        >
          <ShoppingBag size={18} />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 bg-cocoa text-[#fff6ec] text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
              {count}
            </span>
          )}
        </button>

        <div className="hidden md:block">
          <LinkButton href="/shop" size="sm">
            Order Now
          </LinkButton>
        </div>

        <button
          className="lg:hidden neu-raised-sm w-10 h-10 rounded-full flex items-center justify-center text-cocoa"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {menuOpen && (
        <div className="w-full lg:hidden neu-raised rounded-2xl p-3 flex flex-col gap-1 mt-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={clsx(
                "px-4 py-3 rounded-xl text-sm font-semibold",
                pathname === item.href ? "neu-inset text-cocoa" : "text-ink-soft"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/admin"
            onClick={() => setMenuOpen(false)}
            className="px-4 py-3 rounded-xl text-sm font-bold text-cocoa neu-raised-sm flex items-center gap-2 mt-1"
          >
            <ShieldCheck size={16} /> Admin Panel & Theme Builder
          </Link>
        </div>
      )}
    </header>
  );
}
