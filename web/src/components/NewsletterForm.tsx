"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="neu-raised rounded-full px-6 py-4 text-sm font-semibold text-cocoa inline-block">
        Thanks! Check your inbox for your 10% off code.
      </div>
    );
  }

  return (
    <form
      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
      onSubmit={(e) => {
        e.preventDefault();
        if (email.trim()) setSubmitted(true);
      }}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="neu-inset rounded-full px-5 py-3 text-sm flex-1 outline-none placeholder:text-ink-soft"
      />
      <Button type="submit">Subscribe</Button>
    </form>
  );
}
