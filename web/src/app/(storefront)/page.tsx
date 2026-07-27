import Link from "next/link";
import Image from "next/image";
import {
  Cake,
  CalendarCheck,
  ChefHat,
  Cookie,
  Gift,
  Heart,
  HeartHandshake,
  Leaf,
  Package,
  PaintBucket,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Wheat,
} from "lucide-react";
import { Button, LinkButton } from "@/components/ui/Button";
import { IconBubble } from "@/components/ui/IconBubble";
import { SectionHeading } from "@/components/SectionHeading";
import { ProductCard } from "@/components/ProductCard";
import { categories, products, testimonials } from "@/lib/data";
import { NewsletterForm } from "@/components/NewsletterForm";

const categoryIcons: Record<string, typeof Cake> = {
  cake: Cake,
  "heart-handshake": HeartHandshake,
  heart: Heart,
  cupcake: Cake,
  cookie: Cookie,
  paintbrush: PaintBucket,
  leaf: Leaf,
  "wheat-off": Wheat,
};

const bestsellers = products.slice(0, 4);

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="px-4 md:px-8 pt-10 pb-16 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_1fr_0.9fr] gap-10 items-center">
        <div>
          <h1 className="font-serif text-5xl md:text-6xl leading-[1.05] text-ink mb-4">
            Cakes Made With Love
          </h1>
          <p className="text-ink-soft mb-6 max-w-md">
            Delicious cakes crafted with the finest ingredients to make every moment
            unforgettable.
          </p>
          <LinkButton href="/shop" size="lg">
            View Menu
          </LinkButton>

          <div className="grid grid-cols-4 gap-3 mt-10 max-w-md">
            {[
              { icon: Sparkles, label: "Fresh Ingredients" },
              { icon: ChefHat, label: "Daily Baked" },
              { icon: PaintBucket, label: "Handcrafted" },
              { icon: Gift, label: "For Every Occasion" },
            ].map((f) => (
              <div key={f.label} className="flex flex-col items-center text-center gap-2">
                <IconBubble icon={f.icon} size={52} />
                <span className="text-[11px] text-ink-soft leading-tight">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Real Photo Hero Cake Graphics with Animation & Badges */}
        <div className="relative mx-auto flex items-center justify-center my-4 lg:my-0">
          {/* Animated Background Aura */}
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-rose/40 via-cocoa/15 to-rose-light/50 blur-2xl animate-pulse-glow" />

          {/* Main Circle Container with Real Photo */}
          <div
            className="rounded-full w-[320px] h-[320px] sm:w-[360px] sm:h-[360px] lg:w-[380px] lg:h-[380px] relative overflow-hidden shrink-0 animate-float"
            style={{
              boxShadow: "12px 12px 28px rgba(140,95,72,0.22), -12px -12px 28px rgba(255,255,255,0.9), 0 0 0 4px rgba(196,120,90,0.18)",
            }}
          >
            <Image
              src="/images/products/wedding-tiered-elegance.jpg"
              alt="Real Luxury Bakery Cake"
              fill
              sizes="380px"
              className="object-cover transition-transform duration-700 hover:scale-105"
              priority
            />
          </div>

          {/* Floating Interactive Badges */}
          <div className="absolute -top-1 -right-2 neu-raised rounded-full px-4 py-2 text-xs font-bold text-cocoa flex items-center gap-1.5 animate-float shadow-md z-10">
            <Star size={14} className="text-amber-500 fill-amber-500" /> 4.9 Rating
          </div>
          <div className="absolute -bottom-2 -left-2 neu-raised rounded-full px-4 py-2 text-xs font-bold text-cocoa flex items-center gap-1.5 animate-float-reverse shadow-md z-10">
            <Cake size={14} className="text-cocoa" /> Fresh Daily
          </div>
        </div>

        <div className="neu-raised rounded-3xl p-6">
          <div className="text-xs font-bold tracking-wider text-cocoa uppercase mb-1">Bakery Special</div>
          <h3 className="font-serif text-2xl text-ink mb-3">
            Handcrafted With Premium Ingredients
          </h3>
          <p className="text-sm text-ink-soft mb-5 leading-relaxed">
            From signature multi-tier celebration cakes to delicate morning pastries, every bite is baked fresh daily using pure Belgian chocolate and real vanilla beans.
          </p>
          <LinkButton href="/shop" variant="ghost" size="sm">
            Explore Menu
          </LinkButton>
        </div>
      </section>

      {/* Shop by category */}
      <section className="px-4 md:px-8 pb-16 max-w-7xl mx-auto">
        <SectionHeading eyebrow="Categories" title="Shop by Occasion" />
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 py-4 px-2">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.icon] ?? Cake;
            return (
              <Link
                key={cat.slug}
                href={`/shop?category=${cat.slug}`}
                className="neu-raised rounded-2xl px-4 py-5 flex flex-col items-center justify-center gap-3 w-full neu-pressable"
              >
                <IconBubble icon={Icon} size={44} />
                <span className="text-xs font-semibold text-ink text-center leading-tight">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Story */}
      <section className="px-4 md:px-8 pb-16 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <div className="text-xs font-bold tracking-[0.15em] uppercase text-cocoa mb-2">
            Our Story
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-ink mb-4">
            Baked with Passion Since Day One
          </h2>
          <p className="text-ink-soft mb-6 leading-relaxed">
            Bakestudio started in a small kitchen with one oven and a passion for crafting memorable moments. Every single cake is custom-designed, freshly frosted, and made with 100% natural ingredients.
          </p>
          <LinkButton href="/about" variant="ghost" size="md">
            Read Our Full Story
          </LinkButton>
        </div>

        {/* Real Photo Story Illustration */}
        <div className="relative mx-auto flex items-center justify-center">
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-cocoa/20 via-rose/30 to-rose-light/40 blur-xl animate-pulse-glow" />
          
          <div
            className="rounded-full w-[300px] h-[300px] lg:w-[360px] lg:h-[360px] relative overflow-hidden shrink-0 animate-float-reverse"
            style={{
              boxShadow: "10px 10px 25px rgba(140,95,72,0.22), -10px -10px 25px rgba(255,255,255,0.9), 0 0 0 4px rgba(196,120,90,0.18)",
            }}
          >
            <Image
              src="/images/products/special-of-the-day.jpg"
              alt="Real Bakery Creation"
              fill
              sizes="360px"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>

          <div className="absolute -bottom-2 -right-2 neu-raised rounded-full px-4 py-2 text-xs font-bold text-cocoa flex items-center gap-1.5 animate-float shadow-md z-10">
            <Heart size={14} className="text-rose-500 fill-rose-500" /> Made With Love
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="px-4 md:px-8 pb-16 max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="The Menu"
          title="Today's Favourites"
          action={
            <LinkButton href="/shop" variant="ghost" size="sm">
              View Full Menu
            </LinkButton>
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 md:px-8 pb-16 max-w-7xl mx-auto">
        <SectionHeading eyebrow="Process" title="How It Works" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: PaintBucket, label: "Choose Design" },
            { icon: ChefHat, label: "Customize" },
            { icon: Cake, label: "We Bake Fresh" },
            { icon: Truck, label: "Delivered to You" },
          ].map((s, i) => (
            <div key={s.label} className="flex flex-col items-center text-center gap-3">
              <IconBubble icon={s.icon} size={64} />
              <div className="text-xs font-bold text-cocoa">Step {i + 1}</div>
              <div className="text-sm font-semibold text-ink">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Occasion promo blocks */}
      <section className="px-4 md:px-8 pb-16 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: Truck,
            title: "Same-Day Delivery",
            copy: "Order before 2pm for delivery today across serviceable areas.",
          },
          {
            icon: Package,
            title: "Corporate Gifting",
            copy: "Bulk orders, custom branding, and dedicated account support.",
          },
          {
            icon: CalendarCheck,
            title: "Custom Photo Cakes",
            copy: "Turn any photo into an edible print topper in minutes.",
          },
        ].map((b) => (
          <div key={b.title} className="neu-raised rounded-3xl p-6">
            <IconBubble icon={b.icon} size={56} className="mb-4" />
            <h3 className="font-serif text-xl text-ink mb-2">{b.title}</h3>
            <p className="text-sm text-ink-soft">{b.copy}</p>
          </div>
        ))}
      </section>



      {/* Testimonials */}
      <section className="px-4 md:px-8 pb-16 max-w-7xl mx-auto">
        <SectionHeading eyebrow="Reviews" title="What Our Customers Say" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="neu-raised rounded-3xl p-5 flex flex-col gap-3">
              <div className="flex gap-0.5 text-cocoa">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill={i < t.rating ? "currentColor" : "none"} />
                ))}
              </div>
              <p className="text-sm text-ink-soft leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-auto">
                <div className="text-sm font-bold text-ink">{t.name}</div>
                <div className="text-xs text-ink-soft">Ordered: {t.product}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust badges */}
      <section className="px-4 md:px-8 pb-16 max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-4 justify-center">
          {[
            { icon: Sparkles, label: "Fresh Ingredients" },
            { icon: ShieldCheck, label: "Hygiene Certified" },
            { icon: Truck, label: "On-Time Delivery" },
            { icon: Leaf, label: "100% Eggless Option Available" },
          ].map((b) => (
            <div
              key={b.label}
              className="neu-raised-sm rounded-full px-5 py-2.5 flex items-center gap-2 text-xs font-semibold text-cocoa"
            >
              <b.icon size={16} />
              {b.label}
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="px-4 md:px-8 pb-16 max-w-3xl mx-auto text-center">
        <h2 className="font-serif text-3xl text-ink mb-2">Get 10% Off Your First Order</h2>
        <p className="text-ink-soft mb-6">Sign up for baking news, offers, and sweet surprises.</p>
        <NewsletterForm />
      </section>

      {/* Reservation CTA */}
      <section className="px-4 md:px-8 pb-8 max-w-7xl mx-auto">
        <div className="neu-raised rounded-3xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <div className="text-xs font-bold tracking-[0.15em] uppercase text-cocoa mb-2">
              Let&apos;s Talk
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-ink mb-2">
              Want to Reserve a Table?
            </h2>
            <p className="text-ink-soft">
              Visit our in-store café and taste before you order for your next big event.
            </p>
          </div>
          <div className="md:text-right">
            <LinkButton href="/contact" size="lg">
              Contact Now
            </LinkButton>
          </div>
        </div>
      </section>
    </div>
  );
}
