"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { Cake, Gift, Heart, PartyPopper, Palette, PenLine } from "lucide-react";
import { Button } from "@/components/ui/Button";
import CakeIllustration from "@/components/CakeIllustration";
import { useCartStore } from "@/store/cart-store";

const occasions = [
  { id: "birthday", label: "Birthday", icon: PartyPopper },
  { id: "wedding", label: "Wedding", icon: Heart },
  { id: "baby-shower", label: "Baby Shower", icon: Gift },
  { id: "corporate", label: "Corporate", icon: Cake },
];

const shapes = ["Round", "Square", "Heart", "Tiered"];
const sizes = [
  { label: "0.5kg (Serves 4-6)", price: 20 },
  { label: "1kg (Serves 8-10)", price: 32 },
  { label: "2kg (Serves 16-20)", price: 55 },
  { label: "3kg+ (Serves 25+)", price: 80 },
];
const flavors = ["Vanilla", "Chocolate", "Red Velvet", "Butterscotch", "Black Forest"];
const frostings = ["Buttercream", "Fondant", "Whipped Cream", "Naked (Semi-Frosted)"];
const themeColors = ["#E7B6A4", "#6B3A2F", "#8FAE8B", "#D9636B", "#E9B94B"];

const steps = ["Occasion", "Shape & Size", "Flavor & Frosting", "Theme & Message", "Review"];

export default function CustomCakeBuilderPage() {
  const router = useRouter();
  const addLine = useCartStore((s) => s.addLine);
  const [step, setStep] = useState(0);

  const [occasion, setOccasion] = useState(occasions[0].id);
  const [shape, setShape] = useState(shapes[0]);
  const [sizeIdx, setSizeIdx] = useState(1);
  const [flavor, setFlavor] = useState(flavors[0]);
  const [frosting, setFrosting] = useState(frostings[0]);
  const [color, setColor] = useState(themeColors[0]);
  const [message, setMessage] = useState("");
  const [added, setAdded] = useState(false);

  const size = sizes[sizeIdx];
  const price = useMemo(() => size.price, [size]);

  function next() {
    setStep((s) => Math.min(steps.length - 1, s + 1));
  }
  function back() {
    setStep((s) => Math.max(0, s - 1));
  }

  function addCustomCake() {
    addLine({
      productId: `custom-${Date.now()}`,
      slug: "custom-cake",
      name: `Custom ${shape} Cake — ${flavor}`,
      illustration: "tiered-wedding",
      weightLabel: size.label,
      unitPrice: price,
      quantity: 1,
      message: message || undefined,
      addOns: [],
    });
    setAdded(true);
    setTimeout(() => router.push("/cart"), 900);
  }

  return (
    <div className="px-4 md:px-8 py-10 max-w-4xl mx-auto">
      <h1 className="font-serif text-4xl text-ink mb-2 text-center">Custom Cake Builder</h1>
      <p className="text-ink-soft text-center mb-8">Design your dream cake, step by step.</p>

      <div className="flex items-center justify-between mb-10 max-w-xl mx-auto">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-col items-center gap-1 flex-1">
            <div
              className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                i <= step ? "neu-inset text-cocoa" : "neu-raised-sm text-ink-soft"
              )}
            >
              {i + 1}
            </div>
            <span className="text-[10px] text-ink-soft text-center hidden sm:block">{s}</span>
          </div>
        ))}
      </div>

      <div className="neu-raised rounded-3xl p-8 min-h-[320px]">
        {step === 0 && (
          <div>
            <div className="text-sm font-bold text-ink mb-4">What&apos;s the occasion?</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {occasions.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setOccasion(o.id)}
                  className={clsx(
                    "flex flex-col items-center gap-2 p-4 rounded-2xl",
                    occasion === o.id ? "neu-inset text-cocoa" : "neu-raised-sm text-ink-soft"
                  )}
                >
                  <o.icon size={24} />
                  <span className="text-xs font-semibold">{o.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-6">
            <div>
              <div className="text-sm font-bold text-ink mb-3">Shape</div>
              <div className="flex flex-wrap gap-2">
                {shapes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setShape(s)}
                    className={clsx(
                      "px-4 py-2 rounded-full text-sm font-semibold",
                      shape === s ? "neu-inset text-cocoa" : "neu-raised-sm text-ink-soft"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-ink mb-3">Size / Servings</div>
              <div className="flex flex-col gap-2">
                {sizes.map((s, i) => (
                  <button
                    key={s.label}
                    onClick={() => setSizeIdx(i)}
                    className={clsx(
                      "flex justify-between px-4 py-3 rounded-2xl text-sm",
                      i === sizeIdx ? "neu-inset text-cocoa font-semibold" : "neu-raised-sm text-ink-soft"
                    )}
                  >
                    <span>{s.label}</span>
                    <span>₹{s.price}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6">
            <div>
              <div className="text-sm font-bold text-ink mb-3">Flavor</div>
              <div className="flex flex-wrap gap-2">
                {flavors.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFlavor(f)}
                    className={clsx(
                      "px-4 py-2 rounded-full text-sm font-semibold",
                      flavor === f ? "neu-inset text-cocoa" : "neu-raised-sm text-ink-soft"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-ink mb-3 flex items-center gap-2">
                <Palette size={14} /> Frosting & Finish
              </div>
              <div className="flex flex-wrap gap-2">
                {frostings.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFrosting(f)}
                    className={clsx(
                      "px-4 py-2 rounded-full text-sm font-semibold",
                      frosting === f ? "neu-inset text-cocoa" : "neu-raised-sm text-ink-soft"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-6">
            <div>
              <div className="text-sm font-bold text-ink mb-3">Color Theme</div>
              <div className="flex gap-3">
                {themeColors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={clsx(
                      "w-10 h-10 rounded-full",
                      color === c ? "neu-inset" : "neu-raised-sm"
                    )}
                  >
                    <span className="block w-6 h-6 rounded-full mx-auto" style={{ background: c }} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-ink mb-3 flex items-center gap-2">
                <PenLine size={14} /> Message on Cake
              </div>
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 40))}
                placeholder="Happy Birthday!"
                className="neu-inset rounded-xl px-4 py-3 text-sm w-full outline-none placeholder:text-ink-soft"
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <div className="neu-inset rounded-2xl w-32 h-32 p-4 shrink-0">
              <CakeIllustration variant="tiered-wedding" className="w-full h-full" />
            </div>
            <div className="flex-1 text-sm text-ink-soft flex flex-col gap-1.5 w-full">
              <div className="flex justify-between"><span>Occasion</span><span className="font-semibold text-ink">{occasion}</span></div>
              <div className="flex justify-between"><span>Shape</span><span className="font-semibold text-ink">{shape}</span></div>
              <div className="flex justify-between"><span>Size</span><span className="font-semibold text-ink">{size.label}</span></div>
              <div className="flex justify-between"><span>Flavor</span><span className="font-semibold text-ink">{flavor}</span></div>
              <div className="flex justify-between"><span>Frosting</span><span className="font-semibold text-ink">{frosting}</span></div>
              {message && <div className="flex justify-between"><span>Message</span><span className="font-semibold text-ink">&ldquo;{message}&rdquo;</span></div>}
              <div className="flex justify-between text-lg font-bold text-ink border-t border-ink/10 pt-2 mt-1">
                <span>Total</span><span>₹{price.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="ghost" onClick={back} disabled={step === 0}>
          Back
        </Button>
        {step < steps.length - 1 ? (
          <Button onClick={next}>Next</Button>
        ) : (
          <Button onClick={addCustomCake}>{added ? "Added!" : "Add to Cart"}</Button>
        )}
      </div>
    </div>
  );
}
