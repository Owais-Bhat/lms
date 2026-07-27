"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Bike, Check, ChefHat, PackageCheck, Search } from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";

const steps = [
  { key: "confirmed", label: "Confirmed", icon: Check },
  { key: "baking", label: "Baking", icon: ChefHat },
  { key: "out", label: "Out for Delivery", icon: Bike },
  { key: "delivered", label: "Delivered", icon: PackageCheck },
];

function TrackOrderInner() {
  const params = useSearchParams();
  const [orderId, setOrderId] = useState(params.get("order") ?? "");
  const [tracked, setTracked] = useState(Boolean(params.get("order")));
  const currentStep = 1;

  return (
    <div className="px-4 md:px-8 py-16 max-w-xl mx-auto">
      <h1 className="font-serif text-4xl text-ink mb-2 text-center">Track My Order</h1>
      <p className="text-ink-soft text-center mb-8">
        Enter your order ID to see live delivery status.
      </p>

      <div className="neu-inset rounded-full flex items-center gap-2 px-4 py-3 mb-6">
        <Search size={16} className="text-cocoa shrink-0" />
        <input
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="e.g. BS482913"
          className="bg-transparent outline-none text-sm flex-1"
        />
        <Button size="sm" onClick={() => setTracked(Boolean(orderId.trim()))}>
          Track
        </Button>
      </div>

      {tracked && (
        <div className="neu-raised rounded-3xl p-8">
          <div className="text-sm text-ink-soft mb-6">
            Order <span className="font-bold text-ink">{orderId || "BS482913"}</span>
          </div>
          <div className="flex justify-between items-center">
            {steps.map((s, i) => (
              <div key={s.key} className="flex flex-col items-center flex-1 relative">
                {i > 0 && (
                  <div
                    className={clsx(
                      "absolute right-1/2 top-6 w-full h-0.5 -z-10",
                      i <= currentStep ? "bg-cocoa" : "bg-shadow-dark"
                    )}
                    style={{ backgroundColor: i <= currentStep ? "#6B3A2F" : "#D8C9BA" }}
                  />
                )}
                <div
                  className={clsx(
                    "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                    i <= currentStep ? "neu-inset text-cocoa" : "neu-raised-sm text-ink-soft"
                  )}
                >
                  <s.icon size={18} />
                </div>
                <div className="text-xs text-center text-ink-soft">{s.label}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-ink-soft text-center mt-8">
            Your rider will arrive between 4:00 – 6:00 PM today.
          </p>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={null}>
      <TrackOrderInner />
    </Suspense>
  );
}
