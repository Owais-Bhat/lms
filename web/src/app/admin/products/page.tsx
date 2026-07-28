"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Search, Trash2, X, Check, ImageUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { categories as initialCategories, type Product } from "@/lib/data";
import { useProductsStore } from "@/store/products-store";
import { supabaseStorage } from "@/lib/supabase";

const DEFAULT_IMAGE = "/images/products/wedding-tiered-elegance.jpg";

export default function AdminProductsPage() {
  const [tab, setTab] = useState<"products" | "categories">("products");
  const [query, setQuery] = useState("");
  const [categoryList, setCategoryList] = useState(initialCategories);

  const productList = useProductsStore((s) => s.products);
  const hiddenIds = useProductsStore((s) => s.hiddenIds);
  const fetchProducts = useProductsStore((s) => s.fetchProducts);
  const addProduct = useProductsStore((s) => s.addProduct);
  const updateProduct = useProductsStore((s) => s.updateProduct);
  const setActive = useProductsStore((s) => s.setActive);
  const deleteProduct = useProductsStore((s) => s.deleteProduct);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("birthday");
  const [newPrice, setNewPrice] = useState("32");
  const [newDesc, setNewDesc] = useState("");
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [rowUploadingId, setRowUploadingId] = useState<string | null>(null);
  const rowFileInputRef = useRef<HTMLInputElement | null>(null);
  const rowUploadTargetId = useRef<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filtered = productList.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()));

  function handleImageFileSelected(file: File | null) {
    setNewImageFile(file);
    setUploadError(null);
    if (file) {
      setNewImagePreview(URL.createObjectURL(file));
    } else {
      setNewImagePreview(null);
    }
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    setSyncing(true);
    setUploadError(null);

    let image = DEFAULT_IMAGE;
    if (newImageFile) {
      const uploadedUrl = await supabaseStorage.uploadProductImage(newImageFile);
      if (uploadedUrl) {
        image = uploadedUrl;
      } else {
        setUploadError("Image upload failed — check that the product-images storage bucket exists (see supabase_schema.sql). Product will be saved with a placeholder image.");
      }
    }

    const createdProduct: Product = {
      id: `p-${Date.now()}`,
      slug: newName.toLowerCase().replace(/\s+/g, "-"),
      name: newName,
      category: newCategory,
      description: newDesc || "Freshly baked artisan cake handcrafted with love.",
      flavor: "Vanilla & Chocolate",
      price: parseFloat(newPrice) || 29.99,
      rating: 5.0,
      reviewCount: 1,
      eggless: true,
      glutenFree: false,
      weights: [
        { label: "0.5kg", priceDelta: 0 },
        { label: "1.0kg", priceDelta: 12 },
      ],
      illustration: "tart",
      image,
    };

    await addProduct(createdProduct);

    setShowAddModal(false);
    setNewName("");
    setNewDesc("");
    setNewImageFile(null);
    setNewImagePreview(null);
    setSyncing(false);
  }

  async function handleDeleteProduct(id: string) {
    await deleteProduct(id);
  }

  function triggerRowImageUpload(productId: string) {
    rowUploadTargetId.current = productId;
    rowFileInputRef.current?.click();
  }

  async function handleRowFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const productId = rowUploadTargetId.current;
    e.target.value = "";
    if (!file || !productId) return;

    setRowUploadingId(productId);
    const uploadedUrl = await supabaseStorage.uploadProductImage(file);
    if (uploadedUrl) {
      await updateProduct(productId, { image: uploadedUrl });
    } else {
      setUploadError("Image upload failed — check that the product-images storage bucket exists (see supabase_schema.sql).");
    }
    setRowUploadingId(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <input
        ref={rowFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleRowFileChange}
      />

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-3xl text-ink mb-1">Products & Categories</h1>
          <p className="text-xs text-ink-soft">{productList.length} products available</p>
        </div>
        <Button size="sm" onClick={() => setShowAddModal(true)} className="gap-1.5">
          <Plus size={16} /> Add Product
        </Button>
      </div>

      {uploadError && (
        <div className="neu-inset rounded-2xl p-3 text-xs font-semibold text-rose-700 bg-rose-50/50">
          {uploadError}
        </div>
      )}

      <div className="neu-inset rounded-full p-1 flex gap-1 w-fit">
        {(["products", "categories"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              t === tab
                ? "neu-raised-sm rounded-full px-5 py-2 text-sm font-bold text-cocoa capitalize"
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
              placeholder="Search products by name..."
              className="bg-transparent outline-none text-sm w-full placeholder:text-ink-soft"
            />
          </div>

          <div className="neu-raised rounded-3xl overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead>
                <tr className="text-left text-xs text-ink-soft border-b border-ink/5">
                  <th className="p-4 font-bold">Product</th>
                  <th className="p-4 font-bold">Category</th>
                  <th className="p-4 font-bold">Price</th>
                  <th className="p-4 font-bold">Stock</th>
                  <th className="p-4 font-bold">Active</th>
                  <th className="p-4 font-bold text-right">Delete</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-ink/5 last:border-0 hover:bg-cocoa/5">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => triggerRowImageUpload(p.id)}
                          title="Change image"
                          className="group neu-inset rounded-xl w-10 h-10 relative overflow-hidden shrink-0"
                        >
                          <Image src={p.image} alt={p.name} fill sizes="40px" className="object-cover" />
                          <span className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-colors">
                            {rowUploadingId === p.id ? (
                              <Loader2 size={14} className="text-white animate-spin" />
                            ) : (
                              <ImageUp size={14} className="text-white opacity-0 group-hover:opacity-100" />
                            )}
                          </span>
                        </button>
                        <span className="font-semibold text-ink">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-ink-soft capitalize font-semibold">{p.category}</td>
                    <td className="p-4 font-extrabold text-cocoa">₹{p.price.toFixed(2)}</td>
                    <td className="p-4">
                      <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full">
                        In Stock
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => setActive(p.id, !!hiddenIds[p.id])}
                        className={
                          !hiddenIds[p.id]
                            ? "w-10 h-5 rounded-full neu-inset relative bg-cocoa/20"
                            : "w-10 h-5 rounded-full neu-raised-sm relative bg-gray-200"
                        }
                      >
                        <span
                          className={
                            "absolute top-0.5 w-4 h-4 rounded-full bg-cocoa transition-all " +
                            (!hiddenIds[p.id] ? "left-5" : "left-0.5")
                          }
                        />
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="text-rose-600 hover:text-rose-800 p-1 text-xs"
                      >
                        <Trash2 size={16} />
                      </button>
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
            {categoryList.map((c) => (
              <div
                key={c.slug}
                className="neu-raised-sm rounded-2xl px-4 py-3 flex items-center justify-between"
              >
                <span className="text-sm font-semibold text-ink">{c.name}</span>
                <span className="text-xs font-mono font-bold text-cocoa">slug: /{c.slug}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setShowAddModal(false)} />

          <div className="relative w-full max-w-md neu-raised rounded-3xl p-6 md:p-8 shadow-2xl z-10 border border-cocoa/10">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-6 right-6 neu-raised-sm w-9 h-9 rounded-full flex items-center justify-center text-ink-soft hover:text-ink"
            >
              <X size={18} />
            </button>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <h2 className="font-serif text-2xl text-ink">Add New Product</h2>

              <div>
                <label className="block text-xs font-bold text-cocoa uppercase mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Royal Raspberry Truffle Cake"
                  className="neu-inset rounded-2xl p-3 text-xs text-ink outline-none w-full font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-cocoa uppercase mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="neu-inset rounded-2xl p-3 text-xs text-ink outline-none w-full font-semibold bg-transparent"
                  >
                    {categoryList.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-cocoa uppercase mb-1">Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="neu-inset rounded-2xl p-3 text-xs text-ink outline-none w-full font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-cocoa uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Short enticing product description..."
                  className="neu-inset rounded-2xl p-3 text-xs text-ink outline-none w-full font-medium resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-cocoa uppercase mb-1">Product Image</label>
                <label className="neu-inset rounded-2xl p-3 flex items-center gap-3 cursor-pointer">
                  <div className="w-14 h-14 rounded-xl overflow-hidden relative shrink-0 neu-raised-sm">
                    {newImagePreview ? (
                      <Image src={newImagePreview} alt="Preview" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-ink-soft">
                        <ImageUp size={18} />
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-ink-soft flex-1">
                    {newImageFile ? newImageFile.name : "Click to upload a photo (optional)"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageFileSelected(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>

              <Button type="submit" size="md" className="w-full justify-center gap-2" disabled={syncing}>
                {syncing ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                {syncing ? "Saving..." : "Save & Publish Product"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
