"use client";

import { useState } from "react";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="px-4 md:px-8 py-10 max-w-5xl mx-auto">
      <h1 className="font-serif text-4xl text-ink mb-8">Contact Us</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <form
          className="neu-raised rounded-3xl p-6 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          {sent ? (
            <div className="text-sm text-cocoa font-semibold py-8 text-center">
              Thanks for reaching out — we&apos;ll reply within 24 hours!
            </div>
          ) : (
            <>
              <input required placeholder="Name" className="neu-inset rounded-xl px-4 py-3 text-sm outline-none placeholder:text-ink-soft" />
              <input required type="email" placeholder="Email" className="neu-inset rounded-xl px-4 py-3 text-sm outline-none placeholder:text-ink-soft" />
              <input placeholder="Subject" className="neu-inset rounded-xl px-4 py-3 text-sm outline-none placeholder:text-ink-soft" />
              <textarea required placeholder="Message" rows={4} className="neu-inset rounded-xl px-4 py-3 text-sm outline-none placeholder:text-ink-soft resize-none" />
              <Button type="submit" className="self-start">
                Send Message
              </Button>
            </>
          )}
        </form>

        <div className="neu-raised rounded-3xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 text-sm">
            <MapPin size={18} className="text-cocoa" /> 12 Confection Lane, Bakery District
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone size={18} className="text-cocoa" /> +1 (555) 010-2323
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Mail size={18} className="text-cocoa" /> hello@bakestudio.com
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MessageCircle size={18} className="text-cocoa" /> Chat with us on WhatsApp
          </div>
          <div className="neu-inset rounded-2xl h-48 flex items-center justify-center text-ink-soft text-sm mt-2">
            Map view
          </div>
        </div>
      </div>
    </div>
  );
}
