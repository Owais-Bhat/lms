"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import CakeIllustration from "@/components/CakeIllustration";
import { ProductImage } from "@/components/ProductImage";
import { LinkButton } from "@/components/ui/Button";
import { useCartStore, cartSubtotal, lineTotal } from "@/store/cart-store";

const DELIVERY_FEE = 3.5;
const TAX_RATE = 0.05;

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const lines = useCartStore((s) => s.lines);
  const removeLine = useCartStore((s) => s.removeLine);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  useEffect(() => setMounted(true), []);

  const subtotal = mounted ? cartSubtotal(lines) : 0;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const delivery = mounted && lines.length > 0 ? DELIVERY_FEE : 0;
  const tax = (subtotal - discount) * TAX_RATE;
  const total = subtotal - discount + delivery + tax;

  if (mounted && lines.length === 0) {
    return (
      <div className="px-4 md:px-8 py-20 max-w-2xl mx-auto text-center">
        <div className="neu-inset-lg rounded-full w-40 h-40 mx-auto p-6 mb-6">
          <CakeIllustration variant="hero" className="w-full h-full" />
        </div>
        <h1 className="font-serif text-3xl text-ink mb-2">Your cart is empty</h1>
        <p className="text-ink-soft mb-6">Looks like you haven&apos;t added any treats yet.</p>
        <LinkButton href="/shop">Browse Bestsellers</LinkButton>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 py-10 max-w-6xl mx-auto">
      <h1 className="font-serif text-4xl text-ink mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        <div className="flex flex-col gap-4">
          {lines.map((line) => (
            <div key={line.lineId} className="neu-raised rounded-2xl p-4 flex gap-4">
              <div className="neu-inset rounded-xl w-20 h-20 p-1 shrink-0">
                <ProductImage
                  image={line.image}
                  illustration={line.illustration}
                  alt={line.name}
                  className="w-full h-full rounded-lg"
                  sizes="80px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link href={`/product/${line.slug}`} className="font-serif text-lg text-ink">
                      {line.name}
                    </Link>
                    <div className="text-xs text-ink-soft mt-0.5">{line.weightLabel}</div>
                    {line.message && (
                      <div className="text-xs text-ink-soft mt-0.5 italic">
                        &ldquo;{line.message}&rdquo;
                      </div>
                    )}
                    {line.addOns.length > 0 && (
                      <div className="text-xs text-ink-soft mt-0.5">
                        + {line.addOns.map((a) => a.name).join(", ")}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeLine(line.lineId)}
                    className="neu-raised-sm w-8 h-8 rounded-full flex items-center justify-center text-ink-soft shrink-0"
                    aria-label="Remove"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="neu-inset rounded-full flex items-center gap-3 px-2 py-1">
                    <button
                      onClick={() => setQuantity(line.lineId, line.quantity - 1)}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-cocoa"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-semibold w-4 text-center">{line.quantity}</span>
                    <button
                      onClick={() => setQuantity(line.lineId, line.quantity + 1)}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-cocoa"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <div className="font-bold text-cocoa">₹{lineTotal(line).toFixed(2)}</div>
                </div>
              </div>
            </div>
          ))}
          <LinkButton href="/shop" variant="ghost" size="sm" className="self-start mt-2">
            Continue Shopping
          </LinkButton>
        </div>

        <div className="neu-raised rounded-3xl p-6 h-fit sticky top-24">
          <div className="text-sm font-bold text-ink mb-4">Order Summary</div>

          <div className="flex gap-2 mb-4">
            <input
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              placeholder="Promo code"
              className="neu-inset rounded-full px-4 py-2.5 text-sm flex-1 outline-none placeholder:text-ink-soft"
            />
            <button
              onClick={() => setPromoApplied(promo.trim().toUpperCase() === "SWEET10" || promo.trim().length > 0)}
              className="neu-raised-sm rounded-full px-4 py-2.5 text-xs font-bold text-cocoa"
            >
              Apply
            </button>
          </div>
          {promoApplied && (
            <div className="text-xs text-cocoa font-semibold mb-4">Promo code applied — 10% off</div>
          )}

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-soft">Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-cocoa">
                <span>Discount</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-ink-soft">Delivery Fee</span>
              <span>₹{delivery.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Taxes (5%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-ink/10 pt-2 mt-2 flex justify-between font-bold text-lg text-ink">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <LinkButton href="/checkout" className="w-full mt-6">
            Proceed to Checkout
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
