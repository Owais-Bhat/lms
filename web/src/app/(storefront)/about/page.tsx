import Image from "next/image";
import { ChefHat, Heart, Leaf, ShieldCheck } from "lucide-react";
import { IconBubble } from "@/components/ui/IconBubble";
import { SectionHeading } from "@/components/SectionHeading";

const values = [
  { icon: Leaf, label: "Fresh" },
  { icon: ChefHat, label: "Handmade" },
  { icon: ShieldCheck, label: "Hygienic" },
  { icon: Heart, label: "Locally Sourced" },
];

export default function AboutPage() {
  return (
    <div className="px-4 md:px-8 py-10 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-16">
        <div>
          <h1 className="font-serif text-4xl md:text-5xl text-ink mb-4">Our Story</h1>
          <p className="text-ink-soft leading-relaxed mb-4">
            Bakestudio started in a small home kitchen with one oven and a stubborn belief that
            cakes should taste like they were made by someone who loves you. Years later, we bake
            hundreds of orders a week — but every cake still starts with the same recipe card.
          </p>
          <p className="text-ink-soft leading-relaxed">
            Our founder, a self-taught baker, built the studio around one rule: fresh ingredients,
            no shortcuts, and a little extra frosting on every slice.
          </p>
        </div>
        <div className="relative mx-auto flex items-center justify-center">
          {/* Animated background glow */}
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-rose/30 via-cocoa/20 to-rose-light/40 blur-xl animate-pulse-glow" />

          {/* Logo container with neumorphic ring */}
          <div className="rounded-full w-[280px] h-[280px] lg:w-[360px] lg:h-[360px] relative overflow-hidden shrink-0 animate-float" style={{boxShadow: '10px 10px 25px rgba(140,95,72,0.22), -10px -10px 25px rgba(255,255,255,0.9), 0 0 0 4px rgba(196,120,90,0.2)'}}>
            <Image
              src="/397933929_349910914162675_2573495290687325833_n.jpg"
              alt="Bakestudio Founder Logo"
              fill
              sizes="360px"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>

          {/* Floating animated badges */}
          <div className="absolute -top-2 -left-4 neu-raised rounded-full px-4 py-2 text-xs font-bold text-cocoa flex items-center gap-1.5 animate-float shadow-lg">
            <Heart size={14} className="text-rose-500 fill-rose-500 animate-pulse" /> Handcrafted
          </div>

          <div className="absolute -bottom-2 -right-4 neu-raised rounded-full px-4 py-2 text-xs font-bold text-cocoa flex items-center gap-1.5 animate-float-reverse shadow-lg">
            <ChefHat size={14} className="text-cocoa" /> Artisan Baker
          </div>
        </div>
      </div>

      <SectionHeading eyebrow="What We Stand For" title="Our Values" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {values.map((v) => (
          <div key={v.label} className="flex flex-col items-center text-center gap-3">
            <IconBubble icon={v.icon} size={64} />
            <div className="text-sm font-semibold text-ink">{v.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
