"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

const faqs = [
  { q: "How far in advance should I order a custom cake?", a: "We recommend ordering at least 48 hours ahead for custom designs, and 24 hours for standard cakes." },
  { q: "Do you offer eggless or gluten-free options?", a: "Yes — most of our cakes have an eggless variant, and we offer a dedicated gluten-free almond cake line." },
  { q: "What if my cake arrives damaged?", a: "Contact support within 2 hours of delivery with a photo and we'll replace or refund your order." },
  { q: "Can I change my delivery slot after ordering?", a: "Yes, as long as the order hasn't entered the baking stage — reach out via chat or phone." },
  { q: "Do you deliver same-day?", a: "Same-day delivery is available for orders placed before 2pm in serviceable areas." },
];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="px-4 md:px-8 py-10 max-w-3xl mx-auto">
      <h1 className="font-serif text-4xl text-ink mb-8 text-center">Frequently Asked Questions</h1>
      <div className="flex flex-col gap-3">
        {faqs.map((faq, i) => (
          <div key={faq.q} className="neu-raised rounded-2xl overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold text-ink"
            >
              {faq.q}
              <ChevronDown size={16} className={clsx("transition-transform shrink-0 ml-2", open === i && "rotate-180")} />
            </button>
            {open === i && <div className="px-5 pb-4 text-sm text-ink-soft">{faq.a}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
