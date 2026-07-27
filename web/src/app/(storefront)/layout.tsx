"use client";

import { useState } from "react";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeApplier } from "@/components/ThemeApplier";
import { Background3D } from "@/components/Background3D";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen relative bg-base transition-colors duration-500">
      {/* Dynamic Theme Injector & 3D Interactive Background */}
      <ThemeApplier />
      <Background3D />

      {/* Main Layout Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <AnnouncementBar />
        <SiteHeader onOpenCart={() => setCartOpen(true)} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>

      {/* Slide-over Cart Drawer & Checkout Modal */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onOpenCheckout={() => setCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </div>
  );
}
