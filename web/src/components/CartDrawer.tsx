"use client";

import { useCartStore, cartCount, cartSubtotal, lineTotal } from "@/store/cart-store";
import { Button } from "@/components/ui/Button";
import { ShoppingBag, Trash2, X, Plus, Minus, ArrowRight, Cake } from "lucide-react";
import Image from "next/image";

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout: () => void;
};

export function CartDrawer({ isOpen, onClose, onOpenCheckout }: CartDrawerProps) {
  const { lines, setQuantity, removeLine, clear } = useCartStore();

  if (!isOpen) return null;

  const count = cartCount(lines);
  const subtotal = cartSubtotal(lines);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-base neu-raised shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-ink/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="neu-raised-sm w-10 h-10 rounded-full flex items-center justify-center text-cocoa">
                <ShoppingBag size={20} />
              </div>
              <div>
                <h2 className="font-serif text-xl text-ink">Your Cart</h2>
                <div className="text-xs text-ink-soft">{count} {count === 1 ? "item" : "items"} selected</div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="neu-raised-sm w-9 h-9 rounded-full flex items-center justify-center text-ink-soft hover:text-ink transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {/* Cart Lines */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {lines.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="neu-raised-sm w-16 h-16 rounded-full flex items-center justify-center text-ink-soft/60 mb-4">
                  <Cake size={32} />
                </div>
                <h3 className="font-serif text-lg text-ink mb-1">Your cart is empty</h3>
                <p className="text-xs text-ink-soft max-w-xs mb-6">
                  Add some delicious handcrafted cakes or pastries to get started!
                </p>
                <Button onClick={onClose} size="sm">
                  Browse Menu
                </Button>
              </div>
            ) : (
              lines.map((line) => (
                <div key={line.lineId} className="neu-raised rounded-2xl p-4 flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-xl overflow-hidden relative shrink-0 neu-inset">
                    {line.image ? (
                      <Image
                        src={line.image}
                        alt={line.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-rose-light/40 text-cocoa font-bold text-xs">
                        Cake
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-ink truncate">{line.name}</div>
                    <div className="text-xs text-ink-soft">{line.weightLabel}</div>
                    <div className="text-sm font-extrabold text-cocoa mt-1">
                      ₹{lineTotal(line).toFixed(2)}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeLine(line.lineId)}
                      className="text-rose-600 hover:text-rose-800 p-1 text-xs"
                      title="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>

                    <div className="flex items-center gap-2 neu-inset rounded-full px-2 py-1">
                      <button
                        onClick={() => setQuantity(line.lineId, line.quantity - 1)}
                        className="w-5 h-5 rounded-full flex items-center justify-center text-ink-soft hover:text-ink text-xs font-bold"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-xs font-bold text-ink w-4 text-center">{line.quantity}</span>
                      <button
                        onClick={() => setQuantity(line.lineId, line.quantity + 1)}
                        className="w-5 h-5 rounded-full flex items-center justify-center text-ink-soft hover:text-ink text-xs font-bold"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {lines.length > 0 && (
            <div className="p-6 border-t border-ink/10 space-y-4 bg-base-light">
              <div className="flex justify-between items-center text-sm font-bold text-ink">
                <span>Subtotal</span>
                <span className="text-base font-extrabold text-cocoa">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="text-[11px] text-ink-soft">Taxes & delivery calculated at checkout</div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button variant="ghost" size="md" onClick={() => clear()}>
                  Clear Cart
                </Button>
                <Button
                  size="md"
                  onClick={() => {
                    onClose();
                    onOpenCheckout();
                  }}
                  className="gap-2 justify-center"
                >
                  Checkout <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
