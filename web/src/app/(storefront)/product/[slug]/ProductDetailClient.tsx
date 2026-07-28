"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Heart, MapPin, Star, Truck } from "lucide-react";
import clsx from "clsx";
import type { Product } from "@/lib/data";
import { addOns as allAddOns, getRelatedProducts } from "@/lib/data";
import { ProductImage } from "@/components/ProductImage";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ProductCard";
import { useCartStore, useWishlistStore } from "@/store/cart-store";
import { useProductsStore } from "@/store/products-store";

const tabs = [
  "Description",
  "Ingredients & Allergens",
  "Nutritional Info",
  "Care & Storage",
  "Reviews",
  "Shipping & Returns",
] as const;

const timeSlots = [
  { id: "standard", label: "Standard (2-6pm)", surcharge: 0 },
  { id: "express", label: "Express (within 3 hrs)", surcharge: 3 },
  { id: "midnight", label: "Midnight Delivery", surcharge: 5 },
];

export function ProductDetailClient({ product: initialProduct }: { product: Product }) {
  const router = useRouter();
  const fetchProducts = useProductsStore((s) => s.fetchProducts);
  const liveProduct = useProductsStore((s) =>
    s.products.find((p) => p.slug === initialProduct.slug)
  );
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  const product = liveProduct ?? initialProduct;

  const addLine = useCartStore((s) => s.addLine);
  const wishlisted = useWishlistStore((s) => s.has(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);

  const [weightIdx, setWeightIdx] = useState(0);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [pincode, setPincode] = useState("");
  const [pincodeResult, setPincodeResult] = useState<null | "available" | "unavailable">(null);
  const [slot, setSlot] = useState(timeSlots[0].id);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Description");
  const [added, setAdded] = useState(false);

  const weight = product.weights[weightIdx];
  const unitPrice = product.price + weight.priceDelta;
  const addOnObjs = allAddOns.filter((a) => selectedAddOns.includes(a.id));
  const slotObj = timeSlots.find((s) => s.id === slot)!;
  const total = unitPrice + addOnObjs.reduce((s, a) => s + a.price, 0) + slotObj.surcharge;

  const related = useMemo(() => getRelatedProducts(product, 4), [product]);

  function toggleAddOn(id: string) {
    setSelectedAddOns((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function checkPincode() {
    if (!pincode.trim()) return;
    const digitsOnly = /^\d{4,6}$/.test(pincode.trim());
    setPincodeResult(digitsOnly ? "available" : "unavailable");
  }

  function handleAddToCart(buyNow: boolean) {
    addLine({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      illustration: product.illustration as never,
      image: product.image,
      weightLabel: weight.label,
      unitPrice,
      quantity: 1,
      message: message || undefined,
      addOns: addOnObjs,
    });
    if (buyNow) {
      router.push("/checkout");
    } else {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  }

  return (
    <div className="px-4 md:px-8 py-10 max-w-7xl mx-auto">
      <div className="text-xs text-ink-soft mb-6">
        <Link href="/shop">Shop</Link> / {product.name}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div>
          <div className="neu-inset-lg rounded-3xl aspect-square p-3 mb-4">
            <ProductImage
              image={product.image}
              illustration={product.illustration as never}
              alt={product.name}
              className="w-full h-full rounded-2xl"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="flex gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="neu-raised-sm rounded-xl w-16 h-16 p-1">
                <ProductImage
                  image={product.image}
                  illustration={product.illustration as never}
                  alt={product.name}
                  className="w-full h-full rounded-lg"
                  sizes="64px"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Buy box */}
        <div>
          {product.badge && (
            <span className="inline-block bg-rose text-cocoa text-[10px] font-bold px-2 py-1 rounded-full mb-2">
              {product.badge}
            </span>
          )}
          <h1 className="font-serif text-4xl text-ink mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex text-cocoa gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} fill={i < Math.round(product.rating) ? "currentColor" : "none"} />
              ))}
            </div>
            <span className="text-sm text-ink-soft">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>
          <p className="text-ink-soft mb-6">{product.description}</p>

          <div className="text-3xl font-bold text-cocoa mb-6">₹{total.toFixed(2)}</div>

          <div className="mb-6">
            <div className="text-sm font-bold text-ink mb-2">Weight / Size</div>
            <div className="flex flex-wrap gap-2">
              {product.weights.map((w, i) => (
                <button
                  key={w.label}
                  onClick={() => setWeightIdx(i)}
                  className={clsx(
                    "px-4 py-2 rounded-full text-sm font-semibold neu-pressable",
                    i === weightIdx ? "neu-inset text-cocoa" : "neu-raised-sm text-ink-soft"
                  )}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="text-sm font-bold text-ink mb-2">Flavor</div>
            <div className="neu-inset rounded-full px-4 py-2.5 text-sm inline-block text-ink">
              {product.flavor}
            </div>
          </div>

          <div className="neu-raised rounded-2xl p-5 mb-6">
            <div className="text-sm font-bold text-ink mb-3">Add-ons</div>
            <div className="flex flex-col gap-2">
              {allAddOns.map((a) => {
                const checked = selectedAddOns.includes(a.id);
                return (
                  <label
                    key={a.id}
                    className="flex items-center justify-between text-sm cursor-pointer"
                  >
                    <span className="flex items-center gap-3">
                      <span
                        onClick={() => toggleAddOn(a.id)}
                        className={clsx(
                          "w-5 h-5 rounded-md flex items-center justify-center",
                          checked ? "neu-inset text-cocoa" : "neu-raised-sm"
                        )}
                      >
                        {checked && <Check size={12} />}
                      </span>
                      {a.name}
                    </span>
                    <span className="text-ink-soft">+₹{a.price.toFixed(2)}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="mb-6">
            <div className="text-sm font-bold text-ink mb-2">Message on Cake</div>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 40))}
              placeholder="Happy Birthday Alex!"
              className="neu-inset rounded-xl px-4 py-3 text-sm w-full outline-none placeholder:text-ink-soft"
            />
            <div className="text-xs text-ink-soft text-right mt-1">{message.length}/40</div>
          </div>

          <div className="neu-raised rounded-2xl p-5 mb-6">
            <div className="text-sm font-bold text-ink mb-3">Check Delivery</div>
            <div className="flex gap-2 mb-3">
              <div className="neu-inset rounded-full px-4 py-2.5 flex items-center gap-2 flex-1">
                <MapPin size={16} className="text-cocoa shrink-0" />
                <input
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter pincode / area"
                  className="bg-transparent outline-none text-sm w-full placeholder:text-ink-soft"
                />
              </div>
              <Button size="sm" onClick={checkPincode}>
                Check
              </Button>
            </div>
            {pincodeResult === "available" && (
              <div className="text-xs text-cocoa font-semibold flex items-center gap-1">
                <Truck size={14} /> Deliverable — estimated 90 minutes
              </div>
            )}
            {pincodeResult === "unavailable" && (
              <div className="text-xs text-red-700 font-semibold">
                Sorry, we don&apos;t deliver there yet.
              </div>
            )}

            <div className="text-sm font-bold text-ink mt-4 mb-2">Delivery Slot</div>
            <div className="flex flex-col gap-2">
              {timeSlots.map((s) => (
                <label key={s.id} className="flex items-center justify-between text-sm cursor-pointer">
                  <span className="flex items-center gap-3">
                    <span
                      onClick={() => setSlot(s.id)}
                      className={clsx(
                        "w-4 h-4 rounded-full",
                        slot === s.id ? "neu-inset" : "neu-raised-sm"
                      )}
                    >
                      {slot === s.id && (
                        <span className="block w-2 h-2 m-auto rounded-full bg-cocoa" />
                      )}
                    </span>
                    {s.label}
                  </span>
                  {s.surcharge > 0 && (
                    <span className="text-ink-soft">+₹{s.surcharge.toFixed(2)}</span>
                  )}
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1" onClick={() => handleAddToCart(false)}>
              {added ? "Added!" : "Add to Cart"}
            </Button>
            <Button variant="ghost" className="flex-1" onClick={() => handleAddToCart(true)}>
              Buy Now
            </Button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className={clsx(
                "w-12 h-12 rounded-full flex items-center justify-center shrink-0 neu-pressable",
                wishlisted ? "neu-inset text-cocoa" : "neu-raised-sm text-ink-soft"
              )}
            >
              <Heart size={18} fill={wishlisted ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16">
        <div className="neu-inset rounded-full p-1 flex flex-wrap gap-1 mb-8 max-w-full overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={clsx(
                "px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap",
                activeTab === t ? "neu-raised-sm text-cocoa" : "text-ink-soft"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="neu-raised rounded-3xl p-8 text-sm text-ink-soft leading-relaxed">
          {activeTab === "Description" && (
            <p>
              {product.description} Made fresh in-house using {product.flavor.toLowerCase()}{" "}
              flavoring, this cake is a favourite for {product.category} celebrations.
            </p>
          )}
          {activeTab === "Ingredients & Allergens" && (
            <p>
              Wheat flour, sugar, butter, {product.eggless ? "egg replacer" : "eggs"}, cream,{" "}
              {product.flavor.toLowerCase()}. Contains: gluten
              {product.glutenFree ? " (gluten-free flour blend used)" : ""}, dairy
              {product.eggless ? "" : ", eggs"}. May contain traces of nuts.
            </p>
          )}
          {activeTab === "Nutritional Info" && (
            <p>Per 100g serving — Energy: 340 kcal, Fat: 16g, Carbs: 44g, Sugar: 30g, Protein: 4g.</p>
          )}
          {activeTab === "Care & Storage" && (
            <p>
              Refrigerate at 2–4°C. Best consumed within 24 hours of delivery. Bring to room
              temperature for 15 minutes before serving for the best texture.
            </p>
          )}
          {activeTab === "Reviews" && (
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl font-bold text-ink">{product.rating}</div>
                <div>
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-2 text-xs">
                      <span className="w-8">{star}★</span>
                      <span className="neu-inset rounded-full h-2 w-32 overflow-hidden">
                        <span
                          className="block h-full bg-cocoa rounded-full"
                          style={{ width: `${star === Math.round(product.rating) ? 70 : 20}%` }}
                        />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <p>{product.reviewCount} customers reviewed this product.</p>
            </div>
          )}
          {activeTab === "Shipping & Returns" && (
            <p>
              Delivered fresh within your chosen slot. Since cakes are perishable, we can&apos;t
              accept returns, but we&apos;ll happily replace or refund any order that arrives
              damaged or incorrect — just contact support within 2 hours of delivery.
            </p>
          )}
        </div>
      </div>

      {/* Cross-sell */}
      <div className="mt-16">
        <h2 className="font-serif text-2xl text-ink mb-6">Complete the Celebration</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
