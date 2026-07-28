"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import clsx from "clsx";
import { categories } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/Button";
import { useProductsStore } from "@/store/products-store";

type SortKey = "popularity" | "price-asc" | "price-desc" | "rating";

export function ShopClient() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "";
  const initialQuery = searchParams.get("q") ?? "";

  const [category, setCategory] = useState(initialCategory);
  const [dietary, setDietary] = useState<{ eggless: boolean; glutenFree: boolean }>({
    eggless: false,
    glutenFree: false,
  });
  const [maxPrice, setMaxPrice] = useState(35);
  const [sort, setSort] = useState<SortKey>("popularity");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [query] = useState(initialQuery);

  const fetchProducts = useProductsStore((s) => s.fetchProducts);
  const allProducts = useProductsStore((s) => s.products);
  const hiddenIds = useProductsStore((s) => s.hiddenIds);
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const products = useMemo(
    () => allProducts.filter((p) => !hiddenIds[p.id]),
    [allProducts, hiddenIds]
  );

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.price <= maxPrice);
    if (category) list = list.filter((p) => p.category === category);
    if (dietary.eggless) list = list.filter((p) => p.eggless);
    if (dietary.glutenFree) list = list.filter((p) => p.glutenFree);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    switch (sort) {
      case "price-asc":
        return [...list].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...list].sort((a, b) => b.price - a.price);
      case "rating":
        return [...list].sort((a, b) => b.rating - a.rating);
      default:
        return [...list].sort((a, b) => b.reviewCount - a.reviewCount);
    }
  }, [products, category, dietary, maxPrice, sort, query]);

  const activeChips = [
    category && { key: "category", label: categories.find((c) => c.slug === category)?.name ?? category },
    dietary.eggless && { key: "eggless", label: "Eggless" },
    dietary.glutenFree && { key: "glutenFree", label: "Gluten-Free" },
  ].filter(Boolean) as { key: string; label: string }[];

  function clearChip(key: string) {
    if (key === "category") setCategory("");
    if (key === "eggless") setDietary((d) => ({ ...d, eggless: false }));
    if (key === "glutenFree") setDietary((d) => ({ ...d, glutenFree: false }));
  }

  function clearAll() {
    setCategory("");
    setDietary({ eggless: false, glutenFree: false });
    setMaxPrice(35);
  }

  const FilterPanel = (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-sm font-bold text-ink mb-3">Category</div>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setCategory("")}
            className={clsx(
              "text-left px-3 py-2 rounded-xl text-sm",
              category === "" ? "neu-inset text-cocoa font-semibold" : "text-ink-soft"
            )}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => setCategory(c.slug)}
              className={clsx(
                "text-left px-3 py-2 rounded-xl text-sm",
                category === c.slug ? "neu-inset text-cocoa font-semibold" : "text-ink-soft"
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-sm font-bold text-ink mb-3">Dietary</div>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-3 text-sm text-ink-soft cursor-pointer">
            <span
              className={clsx(
                "w-9 h-5 rounded-full relative transition-colors shrink-0",
                dietary.eggless ? "neu-inset bg-cocoa/20" : "neu-raised-sm"
              )}
              onClick={() => setDietary((d) => ({ ...d, eggless: !d.eggless }))}
            >
              <span
                className={clsx(
                  "absolute top-0.5 w-4 h-4 rounded-full bg-cocoa transition-all",
                  dietary.eggless ? "left-4" : "left-0.5"
                )}
              />
            </span>
            Eggless
          </label>
          <label className="flex items-center gap-3 text-sm text-ink-soft cursor-pointer">
            <span
              className={clsx(
                "w-9 h-5 rounded-full relative transition-colors shrink-0",
                dietary.glutenFree ? "neu-inset bg-cocoa/20" : "neu-raised-sm"
              )}
              onClick={() => setDietary((d) => ({ ...d, glutenFree: !d.glutenFree }))}
            >
              <span
                className={clsx(
                  "absolute top-0.5 w-4 h-4 rounded-full bg-cocoa transition-all",
                  dietary.glutenFree ? "left-4" : "left-0.5"
                )}
              />
            </span>
            Gluten-Free
          </label>
        </div>
      </div>

      <div>
        <div className="text-sm font-bold text-ink mb-3">
          Max Price: ₹{maxPrice.toFixed(0)}
        </div>
        <div className="neu-inset rounded-full p-3">
          <input
            type="range"
            min={2}
            max={35}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-[#6B3A2F]"
          />
        </div>
      </div>

      <Button variant="ghost" size="sm" onClick={clearAll}>
        Clear Filters
      </Button>
    </div>
  );

  return (
    <div className="px-4 md:px-8 py-10 max-w-7xl mx-auto">
      <div className="text-xs text-ink-soft mb-2">Home / Shop</div>
      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="font-serif text-4xl text-ink mb-1">Our Menu</h1>
          <div className="text-sm text-ink-soft">{filtered.length} cakes found</div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="neu-raised-sm rounded-full px-4 py-2.5 text-sm outline-none"
          >
            <option value="popularity">Popularity</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
          <div className="neu-inset rounded-full flex p-1">
            <button
              onClick={() => setView("grid")}
              className={clsx("p-2 rounded-full", view === "grid" && "neu-raised-sm text-cocoa")}
              aria-label="Grid view"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setView("list")}
              className={clsx("p-2 rounded-full", view === "list" && "neu-raised-sm text-cocoa")}
              aria-label="List view"
            >
              <List size={16} />
            </button>
          </div>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden neu-raised-sm rounded-full px-4 py-2.5 text-sm font-semibold text-cocoa flex items-center gap-2"
          >
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>
      </div>

      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              onClick={() => clearChip(chip.key)}
              className="neu-inset rounded-full px-3 py-1.5 text-xs font-semibold text-cocoa flex items-center gap-1.5"
            >
              {chip.label}
              <X size={12} />
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        <aside className="hidden lg:block neu-raised rounded-3xl p-6 h-fit sticky top-24">
          {FilterPanel}
        </aside>

        {filtered.length === 0 ? (
          <div className="neu-raised rounded-3xl p-16 text-center">
            <p className="text-ink-soft mb-4">No cakes match your filters.</p>
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Clear filters
            </Button>
          </div>
        ) : (
          <div
            className={clsx(
              "grid gap-6",
              view === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
            )}
          >
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex items-end lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative bg-base w-full max-h-[85vh] overflow-y-auto rounded-t-3xl p-6 neu-raised">
            <div className="flex items-center justify-between mb-4">
              <div className="font-serif text-xl text-ink">Filters</div>
              <button onClick={() => setMobileFiltersOpen(false)} className="neu-raised-sm w-9 h-9 rounded-full flex items-center justify-center">
                <X size={16} />
              </button>
            </div>
            {FilterPanel}
            <div className="sticky bottom-0 pt-4 bg-base flex gap-3">
              <Button className="flex-1" onClick={() => setMobileFiltersOpen(false)}>
                Apply ({filtered.length})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
