"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { LinkButton } from "@/components/ui/Button";
import { useWishlistStore } from "@/store/cart-store";
import { useProductsStore } from "@/store/products-store";
import CakeIllustration from "@/components/CakeIllustration";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const ids = useWishlistStore((s) => s.ids);
  const fetchProducts = useProductsStore((s) => s.fetchProducts);
  const allProducts = useProductsStore((s) => s.products);
  const hiddenIds = useProductsStore((s) => s.hiddenIds);
  useEffect(() => {
    setMounted(true);
    fetchProducts();
  }, [fetchProducts]);

  const products = useMemo(
    () => allProducts.filter((p) => !hiddenIds[p.id]),
    [allProducts, hiddenIds]
  );

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
