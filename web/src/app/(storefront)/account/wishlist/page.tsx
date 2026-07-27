"use client";

import { useEffect, useState } from "react";
import { products } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { LinkButton } from "@/components/ui/Button";
import { useWishlistStore } from "@/store/cart-store";
import CakeIllustration from "@/components/CakeIllustration";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const ids = useWishlistStore((s) => s.ids);
  useEffect(() => setMounted(true), []);

  const items = mounted ? products.filter((p) => ids.includes(p.id)) : [];

  if (mounted && items.length === 0) {
    return (
      <div className="neu-raised rounded-3xl p-16 text-center">
        <div className="neu-inset-lg rounded-full w-28 h-28 mx-auto p-4 mb-4">
          <CakeIllustration variant="hero" className="w-full h-full" />
        </div>
        <p className="text-ink-soft mb-4">Nothing saved yet — tap the heart on any cake to save it here.</p>
        <LinkButton href="/shop" size="sm">
          Browse Menu
        </LinkButton>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {items.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
