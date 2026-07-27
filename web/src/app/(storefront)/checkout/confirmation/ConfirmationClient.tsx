"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle2, Download, MapPin } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { IconBubble } from "@/components/ui/IconBubble";

export function ConfirmationClient() {
  const params = useSearchParams();
  const order = params.get("order") ?? "BS000000";

  return (
    <div className="px-4 md:px-8 py-16 max-w-xl mx-auto text-center">
      <IconBubble icon={CheckCircle2} size={80} className="mx-auto mb-6 text-cocoa" />
      <h1 className="font-serif text-3xl text-ink mb-2">Order Confirmed!</h1>
      <p className="text-ink-soft mb-6">
        Thank you — your order has been placed and our bakers are already getting to work.
      </p>

      <div className="neu-raised rounded-3xl p-6 text-left mb-8">
        <div className="flex justify-between text-sm mb-3">
          <span className="text-ink-soft">Order Number</span>
          <span className="font-bold text-ink">{order}</span>
        </div>
        <div className="flex justify-between text-sm mb-3">
          <span className="text-ink-soft">Estimated Delivery</span>
          <span className="font-bold text-ink">Today, 4:00 – 6:00 PM</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-ink-soft">
          <MapPin size={14} /> Delivering to your saved address
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <LinkButton href={`/track-order?order=${order}`} variant="ghost">
          Track Order
        </LinkButton>
        <LinkButton href="/shop">Continue Shopping</LinkButton>
      </div>

      <button className="flex items-center gap-2 text-sm text-cocoa font-semibold mx-auto mt-6">
        <Download size={14} /> Download Invoice
      </button>
    </div>
  );
}
