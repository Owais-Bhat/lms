"use client";

import { useState } from "react";
import { useCartStore, cartSubtotal } from "@/store/cart-store";
import { useOrderStore } from "@/store/order-store";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, CreditCard, Loader2, MapPin, Phone, User, X, Sparkles } from "lucide-react";

type CheckoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { lines, clear } = useCartStore();
  const { createOrder } = useOrderStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI / Online Payment");

  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartSubtotal(lines);
  const deliveryFee = subtotal > 50 ? 0 : 5;
  const total = subtotal + deliveryFee;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const created = await createOrder({
      customer: { name, email, phone, address, notes },
      items: [...lines],
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
    });

    clear();
    setSubmitting(false);
    setOrderSuccess(created.orderNumber);
  }

  function handleFinish() {
    setOrderSuccess(null);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-lg neu-raised rounded-3xl p-6 md:p-8 shadow-2xl z-10 border border-cocoa/10">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 neu-raised-sm w-9 h-9 rounded-full flex items-center justify-center text-ink-soft hover:text-ink"
        >
          <X size={18} />
        </button>

        {orderSuccess ? (
          <div className="py-8 flex flex-col items-center text-center space-y-4">
            <div className="neu-raised-sm w-16 h-16 rounded-full flex items-center justify-center text-emerald-600 bg-emerald-50">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="font-serif text-2xl text-ink">Order Placed Successfully!</h2>
            <div className="text-xs font-mono font-bold neu-inset px-4 py-2 rounded-full text-cocoa">
              Order ID: {orderSuccess}
            </div>
            <p className="text-xs text-ink-soft max-w-xs leading-relaxed">
              Thank you for ordering with Bakestudio! Your order has been dispatched to our kitchen and is visible in the Admin Orders panel.
            </p>
            <Button size="md" onClick={handleFinish} className="mt-4">
              Return to Store
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-cocoa mb-1">Checkout</div>
              <h2 className="font-serif text-2xl text-ink">Complete Your Order</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-cocoa uppercase mb-1">Full Name</label>
                <div className="neu-inset rounded-2xl px-4 py-2.5 flex items-center gap-2">
                  <User size={16} className="text-cocoa/70" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="bg-transparent outline-none text-xs text-ink w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-cocoa uppercase mb-1">Phone Number</label>
                  <div className="neu-inset rounded-2xl px-3.5 py-2.5 flex items-center gap-2">
                    <Phone size={14} className="text-cocoa/70" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765..."
                      className="bg-transparent outline-none text-xs text-ink w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-cocoa uppercase mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="neu-inset rounded-2xl px-3.5 py-2.5 text-xs text-ink outline-none w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-cocoa uppercase mb-1">Delivery Address</label>
                <div className="neu-inset rounded-2xl px-4 py-2.5 flex items-center gap-2">
                  <MapPin size={16} className="text-cocoa/70 shrink-0" />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House / Street address, City"
                    className="bg-transparent outline-none text-xs text-ink w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-cocoa uppercase mb-1">Custom Notes on Cake</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. 'Happy Birthday Alex!' or eggless preference"
                  className="neu-inset rounded-2xl px-4 py-2.5 text-xs text-ink outline-none w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-cocoa uppercase mb-1">Payment Option</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="neu-inset rounded-2xl px-4 py-2.5 text-xs text-ink outline-none w-full bg-transparent font-semibold"
                >
                  <option value="UPI / Online Payment">UPI / Card / NetBanking</option>
                  <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                </select>
              </div>
            </div>

            {/* Price Summary */}
            <div className="neu-flat rounded-2xl p-4 space-y-2 bg-cocoa/5 text-xs">
              <div className="flex justify-between text-ink-soft">
                <span>Subtotal ({lines.length} items)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm text-cocoa pt-2 border-t border-ink/10">
                <span>Total Amount</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full justify-center gap-2" disabled={submitting}>
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={18} />}
              {submitting ? "Placing Order..." : `Place Order (₹${total.toFixed(2)})`}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
