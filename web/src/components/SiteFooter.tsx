"use client";

import Link from "next/link";
import { AtSign, Globe, Mail, MapPin, Phone, Share2, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useThemeStore } from "@/store/theme-store";

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Shop", href: "/shop" },
      { label: "Custom Cakes", href: "/custom-cake-builder" },
      { label: "About Us", href: "/about" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Delivery Info", href: "/store-locator" },
      { label: "FAQs", href: "/faq" },
      { label: "Contact Us", href: "/contact" },
      { label: "Track Order", href: "/track-order" },
    ],
  },
];

export function SiteFooter() {
  const { siteTagline, contactEmail, contactPhone, instagramUrl, facebookUrl } = useThemeStore();

  return (
    <footer className="bg-base px-4 md:px-8 pt-16 pb-8 mt-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full overflow-hidden neu-raised-sm shrink-0">
              <Image
                src="/397933929_349910914162675_2573495290687325833_n.jpg"
                alt="Bakestudio Logo"
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="font-serif text-xl text-ink">Bakestudio</div>
          </div>
          <p className="text-sm text-ink-soft leading-relaxed">
            {siteTagline || "Handcrafted cakes, baked fresh daily with the finest ingredients — for every celebration, big or small."}
          </p>
          <div className="flex gap-3 mt-4">
            <a href={instagramUrl || "https://instagram.com"} target="_blank" rel="noopener noreferrer" className="neu-raised-sm w-9 h-9 rounded-full flex items-center justify-center text-cocoa hover:bg-rose-light/50">
              <AtSign size={16} />
            </a>
            <a href={facebookUrl || "https://facebook.com"} target="_blank" rel="noopener noreferrer" className="neu-raised-sm w-9 h-9 rounded-full flex items-center justify-center text-cocoa hover:bg-rose-light/50">
              <Globe size={16} />
            </a>
            <Link href="/admin" className="neu-raised-sm w-9 h-9 rounded-full flex items-center justify-center text-cocoa hover:bg-rose-light/50" title="Admin Control">
              <ShieldCheck size={16} />
            </Link>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <div className="font-serif text-lg text-ink mb-3">{col.title}</div>
            <ul className="flex flex-col gap-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-ink-soft hover:text-cocoa transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <div className="font-serif text-lg text-ink mb-3">Visit & Contact</div>
          <ul className="flex flex-col gap-3 text-sm text-ink-soft">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-cocoa" />
              12 Confection Lane, Bakery District
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="shrink-0 text-cocoa" />
              {contactPhone || "+91 98765 43210"}
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="shrink-0 text-cocoa" />
              {contactEmail || "hello@bakestudio.com"}
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-ink/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-soft">
        <div>© {new Date().getFullYear()} Bakestudio. All rights reserved.</div>
        <div className="flex items-center gap-3">
          <Link href="/admin" className="font-bold text-cocoa hover:underline">
            Admin Panel & Theme Builder ↗
          </Link>
        </div>
      </div>
    </footer>
  );
}
