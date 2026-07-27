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
        <div className="neu-inset-lg rounded-full aspect-square max-w-xs mx-auto p-4 overflow-hidden relative">
          <Image
            src="/images/products/about.jpg"
            alt="Bakestudio kitchen"
            fill
            sizes="(max-width: 1024px) 60vw, 300px"
            className="object-cover rounded-full"
          />
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
