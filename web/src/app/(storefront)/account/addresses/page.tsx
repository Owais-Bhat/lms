"use client";

import { useState } from "react";
import { MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";

const initialAddresses = [
  { id: "a1", label: "Home", line: "221B Baker Street, Confection Lane", default: true },
  { id: "a2", label: "Office", line: "45 Frosting Avenue, Suite 4B", default: false },
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState(initialAddresses);

  function setDefault(id: string) {
    setAddresses((prev) => prev.map((a) => ({ ...a, default: a.id === id })));
  }

  function remove(id: string) {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="flex flex-col gap-4">
      {addresses.map((addr) => (
        <div key={addr.id} className="neu-raised rounded-3xl p-6 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-cocoa mt-1 shrink-0" />
            <div>
              <div className="flex items-center gap-2 font-bold text-ink">
                {addr.label}
                {addr.default && (
                  <span className="neu-inset rounded-full px-2 py-0.5 text-[10px] text-cocoa flex items-center gap-1">
                    <Star size={10} fill="currentColor" /> Default
                  </span>
                )}
              </div>
              <div className="text-sm text-ink-soft">{addr.line}</div>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            {!addr.default && (
              <Button variant="ghost" size="sm" onClick={() => setDefault(addr.id)}>
                Set Default
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => remove(addr.id)}>
              Remove
            </Button>
          </div>
        </div>
      ))}
      <button className="neu-flat rounded-3xl p-6 text-sm font-semibold text-cocoa text-left">
        + Add New Address
      </button>
    </div>
  );
}
