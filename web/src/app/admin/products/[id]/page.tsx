"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Loader2, Plus, Trash2 } from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { addOns } from "@/lib/data";
import { useProductsStore } from "@/store/products-store";

const tabs = ["General", "Media", "Variants", "Add-ons", "Availability"] as const;

export default function AdminProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const allProducts = useProductsStore((s) => s.products);
  const fetchProducts = useProductsStore((s) => s.fetchProducts);
  const updateProduct = useProductsStore((s) => s.updateProduct);
  const loaded = useProductsStore((s) => s.loaded);
  const product = allProducts.find((p) => p.id === id) ?? allProducts.find((p) => p.slug === id);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const [tab, setTab] = useState<(typeof tabs)[number]>("General");
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price.toString() ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price.toString());
    }
  }, [product]);

  if (!product) {
    if (!loaded) return null;
    notFound();
  }

  async function handleSave() {
    if (!product) return;
    setSaving(true);
    await updateProduct(product.id, {
      name,
      description,
      price: parseFloat(price) || product.price,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <div className="text-xs text-ink-soft mb-1">
          <Link href="/admin/products">Products</Link> / {product.name}
        </div>
        <h1 className="font-serif text-3xl text-ink">Edit Product</h1>
      </div>

      <div className="neu-inset rounded-full p-1 flex gap-1 flex-wrap w-fit">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx(
              "px-4 py-2 rounded-full text-xs font-semibold",
              tab === t ? "neu-raised-sm text-cocoa" : "text-ink-soft"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="neu-raised rounded-3xl p-6">
        {tab === "General" && (
          <div className="flex flex-col gap-4 max-w-lg">
            <div>
              <label className="text-xs font-bold text-ink block mb-1.5">Product Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="neu-inset rounded-xl px-4 py-3 text-sm w-full outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-ink block mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="neu-inset rounded-xl px-4 py-3 text-sm w-full outline-none resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-ink block mb-1.5">Base Price (₹)</label>
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="neu-inset rounded-xl px-4 py-3 text-sm w-full outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-ink block mb-1.5">Category</label>
                <select defaultValue={product.category} className="neu-inset rounded-xl px-4 py-3 text-sm w-full outline-none capitalize">
                  <option value={product.category}>{product.category}</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-ink block mb-1.5">SEO Slug</label>
              <input
                defaultValue={product.slug}
                className="neu-inset rounded-xl px-4 py-3 text-sm w-full outline-none"
              />
            </div>
          </div>
        )}

        {tab === "Media" && (
          <div>
            <div className="text-xs font-bold text-ink mb-3">Product Images</div>
            <div className="flex gap-3 flex-wrap">
              <div className="neu-inset rounded-2xl w-32 h-32 relative overflow-hidden">
                <Image src={product.image} alt={product.name} fill sizes="128px" className="object-cover" />
              </div>
              <button className="neu-flat rounded-2xl w-32 h-32 flex flex-col items-center justify-center gap-2 text-cocoa text-xs font-semibold">
                <Plus size={20} />
                Upload
              </button>
            </div>
          </div>
        )}

        {tab === "Variants" && (
          <div>
            <div className="text-xs font-bold text-ink mb-3">Weight / Size Variants</div>
            <div className="flex flex-col gap-2">
              {product.weights.map((w) => (
                <div key={w.label} className="neu-raised-sm rounded-2xl px-4 py-3 flex items-center justify-between text-sm">
                  <span className="font-semibold text-ink">{w.label}</span>
                  <span className="text-ink-soft">+₹{w.priceDelta.toFixed(2)}</span>
                  <button className="text-red-700">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button className="neu-flat rounded-2xl px-4 py-3 text-sm font-semibold text-cocoa text-left">
                + Add Variant
              </button>
            </div>
          </div>
        )}

        {tab === "Add-ons" && (
          <div>
            <div className="text-xs font-bold text-ink mb-3">Linked Add-ons</div>
            <div className="flex flex-col gap-2">
              {addOns.map((a) => (
                <label key={a.id} className="flex items-center justify-between text-sm cursor-pointer">
                  <span className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-md neu-inset text-cocoa flex items-center justify-center">
                      <Check size={12} />
                    </span>
                    {a.name}
                  </span>
                  <span className="text-ink-soft">+₹{a.price.toFixed(2)}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {tab === "Availability" && (
          <div className="flex flex-col gap-4 max-w-md">
            <label className="flex items-center justify-between text-sm">
              <span className="text-ink">Active on storefront</span>
              <span className="w-10 h-5 rounded-full neu-inset relative">
                <span className="absolute top-0.5 left-5 w-4 h-4 rounded-full bg-cocoa" />
              </span>
            </label>
            <label className="flex items-center justify-between text-sm">
              <span className="text-ink">Available for pre-order</span>
              <span className="w-10 h-5 rounded-full neu-raised-sm relative">
                <span className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-cocoa" />
              </span>
            </label>
            <div>
              <label className="text-xs font-bold text-ink block mb-1.5">Seasonal Availability</label>
              <div className="flex gap-2">
                <input type="date" className="neu-inset rounded-xl px-4 py-3 text-sm w-full outline-none" />
                <input type="date" className="neu-inset rounded-xl px-4 py-3 text-sm w-full outline-none" />
              </div>
            </div>
          </div>
        )}
      </div>

      <Button className="self-start gap-2" onClick={handleSave} disabled={saving}>
        {saving && <Loader2 size={16} className="animate-spin" />}
        {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
      </Button>
    </div>
  );
}
