"use client";

import { useEffect, useMemo } from "react";
import { ProductCard } from "@/components/ProductCard";
import { useProductsStore } from "@/store/products-store";

export function FeaturedProducts({ count = 4 }: { count?: number }) {
  const fetchProducts = useProductsStore((s) => s.fetchProducts);
  const products = useProductsStore((s) => s.products);
  const hiddenIds = useProductsStore((s) => s.hiddenIds);
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const visible = useMemo(() => products.filter((p) => !hiddenIds[p.id]), [products, hiddenIds]);
  const bestsellers = visible.slice(0, count);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {bestsellers.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
