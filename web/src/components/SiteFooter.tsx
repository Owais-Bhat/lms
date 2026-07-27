import Link from "next/link";
import { AtSign, Globe, Mail, MapPin, Phone, Share2 } from "lucide-react";

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
  return (
    <footer className="bg-base px-4 md:px-8 pt-16 pb-8 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="neu-raised-sm w-12 h-12 rounded-full flex items-center justify-center font-serif text-xl text-cocoa">
              B
            </div>
            <div className="font-serif text-xl text-ink">Bakestudio</div>
          </div>
          <p className="text-sm text-ink-soft leading-relaxed">
            Handcrafted cakes, baked fresh daily with the finest ingredients — for every
            celebration, big or small.
          </p>
          <div className="flex gap-3 mt-4">
            {[AtSign, Globe, Share2].map((Icon, i) => (
              <div
                key={i}
                className="neu-raised-sm w-9 h-9 rounded-full flex items-center justify-center text-cocoa"
              >
                <Icon size={16} />
              </div>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <div className="font-serif text-lg text-ink mb-3">{col.title}</div>
            <ul className="flex flex-col gap-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-ink-soft hover:text-cocoa">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <div className="font-serif text-lg text-ink mb-3">Visit</div>
          <ul className="flex flex-col gap-3 text-sm text-ink-soft">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              12 Confection Lane, Bakery District
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="shrink-0" />
              +1 (555) 010-2323
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="shrink-0" />
              hello@bakestudio.com
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-ink/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-soft">
        <div>© {new Date().getFullYear()} Bakestudio. All rights reserved.</div>
        <div>Neumorphic design system</div>
      </div>
    </footer>
  );
}
