"use client";

import { useState } from "react";
import { Building2, CalendarClock, Percent, Users } from "lucide-react";
import { IconBubble } from "@/components/ui/IconBubble";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/SectionHeading";

const benefits = [
  { icon: Percent, label: "Bulk Pricing" },
  { icon: Building2, label: "Custom Branding" },
  { icon: Users, label: "Dedicated Account Manager" },
  { icon: CalendarClock, label: "Recurring Orders" },
];

export default function CorporatePage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="px-4 md:px-8 py-10 max-w-5xl mx-auto">
      <h1 className="font-serif text-4xl md:text-5xl text-ink mb-4">
        Corporate & Bulk Orders
      </h1>
      <p className="text-ink-soft max-w-xl mb-10">
        From office celebrations to branded client gifts, we handle bulk orders with the same
        care as a single custom cake.
      </p>

      <SectionHeading eyebrow="Why Partner With Us" title="Built for Business" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {benefits.map((b) => (
          <div key={b.label} className="flex flex-col items-center text-center gap-3">
            <IconBubble icon={b.icon} size={64} />
            <div className="text-sm font-semibold text-ink">{b.label}</div>
          </div>
        ))}
      </div>

      <div className="neu-raised rounded-3xl p-6 max-w-xl">
        <div className="text-sm font-bold text-ink mb-4">Request a Quote</div>
        {sent ? (
          <div className="text-sm text-cocoa font-semibold py-6 text-center">
            Thanks! Our corporate team will reach out within one business day.
          </div>
        ) : (
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <input required placeholder="Company Name" className="neu-inset rounded-xl px-4 py-3 text-sm outline-none placeholder:text-ink-soft" />
            <input required placeholder="Contact Person" className="neu-inset rounded-xl px-4 py-3 text-sm outline-none placeholder:text-ink-soft" />
            <input placeholder="Event Type" className="neu-inset rounded-xl px-4 py-3 text-sm outline-none placeholder:text-ink-soft" />
            <input placeholder="Estimated Quantity" className="neu-inset rounded-xl px-4 py-3 text-sm outline-none placeholder:text-ink-soft" />
            <textarea placeholder="Message" rows={3} className="neu-inset rounded-xl px-4 py-3 text-sm outline-none placeholder:text-ink-soft resize-none" />
            <Button type="submit" className="self-start">
              Submit Inquiry
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
