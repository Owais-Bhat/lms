"use client";

import { useState } from "react";
import { Clock, MapPin, Phone, Search, Truck } from "lucide-react";
import { Button } from "@/components/ui/Button";

const stores = [
  { name: "Bakestudio — Downtown", address: "12 Confection Lane, Bakery District", hours: "8am – 9pm", phone: "+1 555 010 2323" },
  { name: "Bakestudio — Riverside", address: "88 Sugarloaf Road, Riverside", hours: "9am – 8pm", phone: "+1 555 010 7788" },
];

export default function StoreLocatorPage() {
  const [pincode, setPincode] = useState("");
  const [result, setResult] = useState<null | "available" | "unavailable">(null);

  return (
    <div className="px-4 md:px-8 py-10 max-w-5xl mx-auto">
      <h1 className="font-serif text-4xl text-ink mb-8">Store Locator & Delivery Check</h1>

      <div className="neu-raised rounded-3xl p-6 mb-10">
        <div className="text-sm font-bold text-ink mb-3">Check Delivery to Your Area</div>
        <div className="flex gap-2 max-w-md">
          <div className="neu-inset rounded-full px-4 py-2.5 flex items-center gap-2 flex-1">
            <Search size={16} className="text-cocoa shrink-0" />
            <input
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="Enter pincode / area"
              className="bg-transparent outline-none text-sm w-full placeholder:text-ink-soft"
            />
          </div>
          <Button size="sm" onClick={() => setResult(/^\d{4,6}$/.test(pincode.trim()) ? "available" : "unavailable")}>
            Check
          </Button>
        </div>
        {result === "available" && (
          <div className="text-xs text-cocoa font-semibold flex items-center gap-1 mt-3">
            <Truck size={14} /> We deliver to your area — estimated 60-90 minutes.
          </div>
        )}
        {result === "unavailable" && (
          <div className="text-xs text-red-700 font-semibold mt-3">
            Sorry, we don&apos;t deliver there yet — try store pickup instead.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {stores.map((s) => (
          <div key={s.name} className="neu-raised rounded-3xl p-6">
            <div className="font-serif text-xl text-ink mb-3">{s.name}</div>
            <div className="flex items-start gap-2 text-sm text-ink-soft mb-2">
              <MapPin size={16} className="text-cocoa mt-0.5 shrink-0" /> {s.address}
            </div>
            <div className="flex items-center gap-2 text-sm text-ink-soft mb-2">
              <Clock size={16} className="text-cocoa shrink-0" /> {s.hours}
            </div>
            <div className="flex items-center gap-2 text-sm text-ink-soft">
              <Phone size={16} className="text-cocoa shrink-0" /> {s.phone}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
