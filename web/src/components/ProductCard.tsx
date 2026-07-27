"use client";

import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import clsx from "clsx";
import type { Product } from "@/lib/data";
import { ProductImage } from "@/components/ProductImage";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/cart-store";

export function ProductCard({ product }: { product: Product }) {
  const addLine = useCartStore((s) => s.addLine);
  const wishlisted = useWishlistStore((s) => s.has(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);

  return (
    <div className="neu-raised rounded-3xl p-4 flex flex-col gap-3 group">
      <Link href={`/product/${product.slug}`} className="relative block">
        <div className="neu-inset rounded-2xl aspect-square p-2">
          <ProductImage
            image={product.image}
            illustration={product.illustration as never}
            alt={product.name}
            className="w-full h-full rounded-xl"
          />
        </div>
        <span className="absolute -top-2 -right-2 bg-cocoa text-[#fff6ec] text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
          ${product.price.toFixed(2)}
        </span>
        {product.badge && (
          <span className="absolute top-2 left-2 bg-rose text-cocoa text-[10px] font-bold px-2 py-1 rounded-full">
            {product.badge}
          </span>
        )}
      </Link>

      <div>
        <Link href={`/product/${product.slug}`}>
          <div className="font-serif text-lg text-ink leading-tight">{product.name}</div>
        </Link>
        <div className="text-xs text-ink-soft mt-1">{product.description}</div>
      </div>

      <div className="flex items-center justify-between mt-auto pt-2">
        <button
          onClick={() =>
            addLine({
              productId: product.id,
              slug: product.slug,
              name: product.name,
              illustration: product.illustration as never,
              image: product.image,
              weightLabel: product.weights[0].label,
              unitPrice: product.price,
              quantity: 1,
              addOns: [],
            })
          }
          className="neu-inset w-10 h-10 rounded-full flex items-center justify-center text-cocoa neu-pressable"
          aria-label="Add to cart"
        >
          <ShoppingCart size={16} />
        </button>
        <button
          onClick={() => toggleWishlist(product.id)}
          className={clsx(
            "w-10 h-10 rounded-full flex items-center justify-center neu-pressable",
            wishlisted ? "neu-inset text-cocoa" : "neu-raised-sm text-ink-soft"
          )}
          aria-label="Toggle wishlist"
        >
          <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
        </button>
      </div>
    </div>
  );
}
