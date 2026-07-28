"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { CreditCard, Home, Lock, MapPin, Store, User, Wallet } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCartStore, cartSubtotal } from "@/store/cart-store";
import { useOrderStore } from "@/store/order-store";

const savedAddresses = [
  { id: "a1", label: "Home", line: "221B Baker Street, Confection Lane" },
  { id: "a2", label: "Office", line: "45 Frosting Avenue, Suite 4B" },
];

const paymentMethods = [
  { id: "card", label: "Card", icon: CreditCard },
  { id: "upi", label: "UPI", icon: Wallet },
  { id: "cod", label: "Cash on Delivery", icon: Home },
];

const DELIVERY_FEE = 3.5;
const TAX_RATE = 0.05;

export default function CheckoutPage() {
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const clear = useCartStore((s) => s.clear);
  const createOrder = useOrderStore((s) => s.createOrder);
  const [mounted, setMounted] = useState(false);

  const [method, setMethod] = useState<"delivery" | "pickup">("delivery");
  const [addressId, setAddressId] = useState(savedAddresses[0].id);
  const [payment, setPayment] = useState("card");
  const [instructions, setInstructions] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => setMounted(true), []);

  const subtotal = mounted ? cartSubtotal(lines) : 0;
  const delivery = method === "delivery" ? DELIVERY_FEE : 0;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + delivery + tax;

  const canPlace = mounted && lines.length > 0 && agreed && name.trim() !== "" && phone.trim() !== "";

  async function placeOrder() {
    if (!canPlace) return;
    setPlacing(true);

    const selectedAddress = savedAddresses.find((a) => a.id === addressId);
    const paymentLabel = paymentMethods.find((p) => p.id === payment)?.label ?? "Card";

    const created = await createOrder({
      customer: {
        name,
        email,
        phone,
        address: method === "delivery" ? (selectedAddress?.line ?? "") : "Store Pickup",
        notes: instructions,
      },
      items: [...lines],
      subtotal,
      deliveryFee: delivery,
      total,
      paymentMethod: paymentLabel,
    });

    clear();
    router.push(`/checkout/confirmation?order=${encodeURIComponent(created.orderNumber)}`);
  }

  const items = useMemo(() => lines, [lines]);

  return (
    <div className="px-4 md:px-8 py-10 max-w-6xl mx-auto">
      <h1 className="font-serif text-4xl text-ink mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        <div className="flex flex-col gap-6">
          <div className="neu-raised rounded-3xl p-6">
            <div className="text-sm font-bold text-ink mb-4 flex items-center gap-2">
              <User size={14} /> Contact Details
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="neu-inset rounded-2xl px-4 py-3 text-sm outline-none placeholder:text-ink-soft"
              />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                className="neu-inset rounded-2xl px-4 py-3 text-sm outline-none placeholder:text-ink-soft"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email (optional)"
                className="neu-inset rounded-2xl px-4 py-3 text-sm outline-none placeholder:text-ink-soft sm:col-span-2"
              />
            </div>
          </div>

          <div className="neu-raised rounded-3xl p-6">
            <div className="text-sm font-bold text-ink mb-4">Delivery Method</div>
            <div className="neu-inset rounded-full p-1 flex gap-1 w-fit">
              <button
                onClick={() => setMethod("delivery")}
                className={clsx(
                  "px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2",
                  method === "delivery" ? "neu-raised-sm text-cocoa" : "text-ink-soft"
                )}
              >
                <Home size={16} /> Home Delivery
              </button>
              <button
                onClick={() => setMethod("pickup")}
                className={clsx(
                  "px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2",
                  method === "pickup" ? "neu-raised-sm text-cocoa" : "text-ink-soft"
                )}
              >
                <Store size={16} /> Store Pickup
              </button>
            </div>
          </div>

          {method === "delivery" && (
            <div className="neu-raised rounded-3xl p-6">
              <div className="text-sm font-bold text-ink mb-4">Delivery Address</div>
              <div className="flex flex-col gap-3">
                {savedAddresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={clsx(
                      "flex items-start gap-3 p-4 rounded-2xl cursor-pointer",
                      addressId === addr.id ? "neu-inset" : "neu-raised-sm"
                    )}
                    onClick={() => setAddressId(addr.id)}
                  >
                    <MapPin size={18} className="text-cocoa mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-ink">{addr.label}</div>
                      <div className="text-xs text-ink-soft">{addr.line}</div>
                    </div>
                  </label>
                ))}
                <button className="neu-flat rounded-2xl p-4 text-sm font-semibold text-cocoa text-left">
                  + Add New Address
                </button>
              </div>
            </div>
          )}

          <div className="neu-raised rounded-3xl p-6">
            <div className="text-sm font-bold text-ink mb-3">Gift & Special Instructions</div>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Add gift wrap, a note for the rider, or any special request…"
              rows={3}
              className="neu-inset rounded-2xl px-4 py-3 text-sm w-full outline-none placeholder:text-ink-soft resize-none"
            />
          </div>

          <div className="neu-raised rounded-3xl p-6">
            <div className="text-sm font-bold text-ink mb-4 flex items-center gap-2">
              <Lock size={14} /> Payment
            </div>
            <div className="flex flex-wrap gap-3">
              {paymentMethods.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPayment(p.id)}
                  className={clsx(
                    "flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold",
                    payment === p.id ? "neu-inset text-cocoa" : "neu-raised-sm text-ink-soft"
                  )}
                >
                  <p.icon size={16} />
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="neu-raised rounded-3xl p-6 h-fit sticky top-24">
          <div className="text-sm font-bold text-ink mb-4">Order Summary</div>
          <div className="flex flex-col gap-3 mb-4 max-h-56 overflow-y-auto">
            {items.map((line) => (
              <div key={line.lineId} className="flex justify-between text-sm">
                <span className="text-ink-soft">
                  {line.quantity}× {line.name} ({line.weightLabel})
                </span>
                <span className="font-semibold shrink-0 ml-2">
                  ₹{(line.unitPrice * line.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2 text-sm border-t border-ink/10 pt-4">
            <div className="flex justify-between">
              <span className="text-ink-soft">Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Delivery Fee</span>
              <span>₹{delivery.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Taxes</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-ink border-t border-ink/10 pt-2 mt-1">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <label className="flex items-start gap-2 text-xs text-ink-soft mt-4 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 accent-[#6B3A2F]"
            />
            I agree to the Terms of Service and Refund Policy.
          </label>

          <Button className="w-full mt-4" disabled={!canPlace || placing} onClick={placeOrder}>
            {placing ? "Placing Order…" : "Place Order"}
          </Button>
        </div>
      </div>
    </div>
  );
}
