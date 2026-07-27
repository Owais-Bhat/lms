"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { categories, products } from "@/lib/data";

export default function AdminProductsPage() {
  const [tab, setTab] = useState<"products" | "categories">("products");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Record<string, boolean>>(
    Object.fromEntries(products.map((p) => [p.id, true]))
  );

  const filtered = products.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-serif text-3xl text-ink">Products & Categories</h1>
        <Button size="sm">
          <Plus size={14} /> Add Product
        </Button>
      </div>

      <div className="neu-inset rounded-full p-1 flex gap-1 w-fit">
        {(["products", "categories"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              t === tab
                ? "neu-raised-sm rounded-full px-5 py-2 text-sm font-semibold text-cocoa capitalize"
                : "px-5 py-2 text-sm font-semibold text-ink-soft capitalize"
            }
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "products" ? (
        <>
          <div className="neu-inset rounded-full flex items-center gap-2 px-4 py-2.5 max-w-sm">
            <Search size={14} className="text-cocoa shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="bg-transparent outline-none text-sm w-full placeholder:text-ink-soft"
            />
          </div>

          <div className="neu-raised rounded-3xl overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead>
                <tr className="text-left text-xs text-ink-soft border-b border-ink/5">
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Active</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-ink/5 last:border-0">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="neu-inset rounded-lg w-10 h-10 relative overflow-hidden shrink-0">
                          <Image src={p.image} alt={p.name} fill sizes="40px" className="object-cover" />
                        </div>
                        <span className="font-semibold text-ink">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-ink-soft capitalize">{p.category}</td>
                    <td className="p-4 font-semibold text-ink">${p.price.toFixed(2)}</td>
                    <td className="p-4 text-ink-soft">In Stock</td>
                    <td className="p-4">
                      <button
                        onClick={() => setActive((prev) => ({ ...prev, [p.id]: !prev[p.id] }))}
                        className={
                          active[p.id]
                            ? "w-10 h-5 rounded-full neu-inset relative"
                            : "w-10 h-5 rounded-full neu-raised-sm relative"
                        }
                      >
                        <span
                          className={
                            "absolute top-0.5 w-4 h-4 rounded-full bg-cocoa transition-all " +
                            (active[p.id] ? "left-5" : "left-0.5")
                          }
                        />
                      </button>
                    </td>
                    <td className="p-4">
                      <Link href={`/admin/products/${p.id}`} className="text-cocoa font-semibold text-xs">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="neu-raised rounded-3xl p-6">
          <div className="text-sm font-bold text-ink mb-4">Category Tree</div>
          <div className="flex flex-col gap-2">
            {categories.map((c) => (
              <div
                key={c.slug}
                className="neu-raised-sm rounded-2xl px-4 py-3 flex items-center justify-between"
              >
                <span className="text-sm font-semibold text-ink">{c.name}</span>
                <div className="flex gap-2">
                  <button className="text-xs font-semibold text-cocoa">Edit</button>
                  <button className="text-xs font-semibold text-red-700">Remove</button>
                </div>
              </div>
            ))}
            <button className="neu-flat rounded-2xl px-4 py-3 text-sm font-semibold text-cocoa text-left mt-2">
              + Add Category
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
